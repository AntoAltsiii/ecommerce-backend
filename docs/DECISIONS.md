# Decisiones Técnicas — ProyectoRopa

Este documento describe las principales decisiones de diseño tomadas durante el desarrollo del sistema, tanto en el backend como en el frontend, junto con los patrones de arquitectura y el razonamiento detrás de cada elección.

---

## 1. Decisiones de Backend

### 1.1 Arquitectura de Microservicios

Se optó por separar el dominio en dos microservicios independientes:

- **`producto-service` (puerto 8081):** gestiona el catálogo (prendas, categorías). Es el único responsable de los datos de catálogo y puede escalar o desplegarse de forma independiente.
- **`compra-service` (puerto 8083):** gestiona compras, ítems, envíos, pagos, stock, usuarios y recomendaciones. Consume el servicio de producto cuando necesita datos de prendas.

Esta separación refleja los dos bounded contexts del negocio: **catálogo** y **operaciones comerciales**. Si en el futuro se quisiera reemplazar el motor de catálogo (por ejemplo, con Elasticsearch), se haría sin tocar la lógica de compras.

### 1.2 Spring Cloud Gateway como único punto de entrada

Todo el tráfico del cliente pasa por el Gateway (`gateway-service`). Sus responsabilidades son:

- **Enrutamiento** hacia los microservicios internos (inaccesibles desde afuera).
- **Autenticación y autorización centralizadas:** valida el JWT y aplica reglas de acceso por rol antes de que la petición llegue a los servicios. Esto evita duplicar lógica de seguridad en cada microservicio.
- **CORS:** el Gateway es el único que necesita configurar los orígenes permitidos.
- **OAuth2 Login flow:** inicia el flujo Authorization Code + PKCE con Keycloak.

Usar el Gateway como única puerta reduce la superficie de ataque: los servicios internos no necesitan ser accesibles desde Internet.

### 1.3 Autenticación externalizada con Keycloak

Se delegó toda la gestión de identidad (usuarios, contraseñas, roles, tokens) a **Keycloak 23**, un servidor de identidad estándar OIDC/OAuth2. Las razones principales:

- No reinventar la rueda: gestión de sesiones, refresh tokens, políticas de contraseña y soporte MFA son problemas resueltos.
- Los microservicios no almacenan contraseñas; solo validan JWTs firmados.
- El realm `app-realm` se importa automáticamente al levantar el stack (`--import-realm`), por lo que la configuración de clientes y roles está en control de versiones (`keycloak/app-realm.json`).

### 1.4 Triple validación de JWT (defensa en profundidad)

El token JWT se valida en tres capas:

1. **Gateway:** valida firma y expiración; aplica reglas de autorización por rol antes de rutear.
2. **`producto-service`:** configurado como OAuth2 Resource Server; valida el token de forma independiente.
3. **`compra-service`:** ídem.

Esto garantiza que, aunque el Gateway sea bypasseado (acceso interno no autorizado dentro del cluster), cada microservicio rechaza peticiones sin token válido.

### 1.5 Comunicación inter-servicio: RestClient síncrono

`compra-service` necesita datos de productos al construir ítems de compra y al hacer recomendaciones. Se usa **RestClient**, cliente HTTP síncrono moderno. La elección fue:

- Las consultas a `producto-service` son necesarias para completar la respuesta → bloquear el hilo hasta obtener el dato es aceptable.
- RestClient es más simple y directo que WebClient para llamadas síncronas en el contexto de Spring MVC.

### 1.6 OpenMeteo como API externa: WebClient asíncrono

La consulta al clima (`WeatherClient`) usa **WebClient** (WebFlux reactivo) con `.block()`. Esto se explica porque:

- La dependencia `spring-boot-starter-webflux` ya está en el classpath (requerida por el Gateway internamente).
- WebClient es el cliente HTTP recomendado por Spring para integraciones externas en proyectos modernos.
- El `.block()` es explícito e intencional: se necesita el resultado antes de armar la recomendación.

La API utilizada es **Open-Meteo** (libre, sin API key), que provee temperatura actual, humedad y pronóstico diario por coordenadas geográficas.

### 1.7 Dos instancias de PostgreSQL separadas

Cada microservicio tiene su propia base de datos:

- `producto_db` para prendas y categorías.
- `compra_db` para todo lo operacional (compras, usuarios, stock, etc.).

Esto respeta el principio de **database per service** en microservicios: un servicio no puede acceder directamente a los datos de otro. La consistencia entre `id_prenda` (en `compra_db`) y el catálogo real (en `producto_db`) es *eventual* y se gestiona a nivel de aplicación.

### 1.8 Schema management con `ddl-auto: update`

Hibernate gestiona el schema de las tablas automáticamente al iniciar los servicios. Se eligió `update` (en lugar de `validate` o migraciones con Flyway) para agilizar el desarrollo: los servicios crean y modifican tablas sin necesidad de scripts adicionales.

> Para un entorno de producción real, se recomendaría migrar a Flyway o Liquibase para control preciso del schema.

### 1.9 Transaccionalidad en la creación de compra

`CompraService.createCompra()` está anotado con `@Transactional`. Esto garantiza que el descuento de stock (`StockService.descontarStock()`) y la persistencia de la compra ocurran en la misma unidad de trabajo: si el stock es insuficiente o cualquier entidad falla al guardarse, toda la operación se revierte.

### 1.10 Llave foránea lógica entre dominios

`ItemEntity.prendaId` y `StockEntity.prendaId` almacenan el ID de la prenda sin una foreign key real en la base de datos (porque la prenda vive en otro servicio). Esta es la práctica estándar en microservicios: **referencias por ID** en lugar de joins entre esquemas.

---

## 2. Decisiones de Frontend

### 2.1 React 19 con Vite

Se eligió **React 19** como librería de UI por su ecosistema maduro, y **Vite 7** como bundler y servidor de desarrollo por:

- HMR (Hot Module Replacement) extremadamente rápido comparado con Create React App.
- Build optimizado para producción con mínima configuración.
- Soporte nativo para variables de entorno con prefijo `VITE_`.

El output de producción es un set de archivos estáticos servidos por Nginx dentro del contenedor Docker.

### 2.2 Context API para estado global

Se usa **Context API** de React en lugar de Redux u otras soluciones de estado global, mediante dos contextos:

- **`AuthContext`:** estado de autenticación (usuario, roles, `authenticated`, `loading`). Lo necesita prácticamente toda la app (Navbar, PrivateRoute, páginas).
- **`CartContext`:** estado del carrito (ítems, totales, funciones de modificación). Lo consumen el Navbar (badge de cantidad) y las páginas de compra.

Gracias al uso de Context API, evitamos prop drilling y mantenemos el estado global de forma sencilla sin la complejidad de Redux (acciones, reducers, middleware).

### 2.3 Keycloak como singleton, inicializado una sola vez

`keycloak.js` exporta una **única instancia** de `Keycloak`. Esto es crítico porque Keycloak no está diseñado para ser inicializado múltiples veces en la misma sesión. El `AuthProvider` usa un `useRef` (`initialized`) para garantizar que `keycloak.init()` se llame una sola vez, incluso bajo **React StrictMode** (que monta/desmonta cada componente dos veces en desarrollo).

### 2.4 Estrategia `check-sso` en lugar de `login-required`

Al inicializar Keycloak se usa `onLoad: 'check-sso'`. Esto significa:

- Si el usuario ya tiene sesión en Keycloak, se autentica automáticamente (SSO).
- Si no tiene sesión, la app carga igual como visitante anónimo.

Esta decisión permite que el catálogo de productos sea accesible sin login, lo que es deseable para un e-commerce donde los visitantes pueden navegar antes de registrarse.

### 2.5 Refresh automático de token

Cada 60 segundos se ejecuta `keycloak.updateToken(60)`. Si el access token vence en menos de 60 segundos, se renueva usando el refresh token silenciosamente. Si el refresh token también expiró, se hace logout automático. Esto evita que el usuario reciba un 401 en medio de una operación.

### 2.6 Axios con interceptores centralizados

`api.js` define una instancia de Axios con:

- **Request interceptor:** adjunta el `Authorization: Bearer <token>` en cada petición si el usuario está autenticado. Centraliza esta lógica en un solo lugar.
- **Response interceptor:** ante un 401, intenta renovar el token; si falla, hace logout. Esto maneja tokens expirados sin que cada servicio individual lo tenga que contemplar.

### 2.7 PrivateRoute con verificación de roles

El componente `PrivateRoute` recibe un array de `roles` permitidos y, usando `useAuth()`, verifica:

1. Si la autenticación todavía está cargando → muestra un estado de espera.
2. Si no está autenticado → redirige a `/` con un mensaje.
3. Si no tiene el rol requerido → redirige a `/` con un mensaje de acceso denegado.
4. Si pasa ambas comprobaciones → renderiza `<Outlet />`.

Esto permite proteger rutas de forma declarativa en `AppRouter.jsx`, agrupando rutas por rol requerido.

### 2.8 Layout compartido con React Router `<Outlet />`

Todas las rutas están anidadas bajo un `<Route element={<Layout />}>`. `Layout` renderiza el `Navbar`, un `<Outlet />` (donde se inyecta la página activa) y el footer. Esto garantiza que el Navbar esté siempre presente sin repetirlo en cada página.

### 2.9 Carrito en memoria (no persistido)

El carrito vive en el estado local del `CartProvider` y se pierde al recargar la página. Esta decisión fue intencional para simplificar:

- No hay backend de carrito ni localStorage.
- El carrito es por sesión: cuando el usuario cierra la pestaña o hace logout, el carrito se vacía.
- Si se quisiera persistencia, la alternativa más simple sería `localStorage` en el `CartProvider :)` .

### 2.10 Estilos con CSS variables + inline styles

No se usa ningún framework CSS (Tailwind, Bootstrap, Material UI). El diseño se construye con:

- **CSS custom properties** definidas en `index.css` (paleta de colores, radios, sombras, tipografía).
- **Inline styles** en cada componente que referencian esas variables.

Esto da control total sobre el diseño sin depender de clases utilitarias externas, y mantiene la paleta de colores centralizada y fácil de cambiar.

---

## 3. Patrones de Diseño y Arquitectura

### 3.1 API Gateway Pattern

El Gateway es el único punto de entrada al sistema. Concentra enrutamiento, autenticación, autorización y CORS. Los servicios internos no necesitan ser expuestos al exterior ni conocer la identidad del cliente final.

### 3.2 Repository Pattern (Spring Data JPA)

Cada entidad tiene su propia interfaz de repositorio que extiende `JpaRepository`. Los servicios usan estas interfaces sin conocer los detalles de la consulta SQL subyacente. La separación repository/service mantiene la lógica de negocio desacoplada del acceso a datos.

### 3.3 DTO Pattern (Data Transfer Object)

Se usan DTOs (`PrendaDTO`, `RecommendationDTO`, `WeatherDTO`, `UserLocationDTO`) para transferir datos entre:

- El `compra-service` y el `producto-service` (via HTTP).
- El backend y el frontend (respuestas de la API REST).

Los DTOs desacoplan la representación interna de las entidades JPA del contrato público de la API.

### 3.4 Provider Pattern (React Context)

`AuthProvider` y `CartProvider` encapsulan estado y comportamiento, exponiéndolo a sus hijos a través de contextos. Cualquier componente descendiente puede consumir ese estado sin que los intermediarios lo necesiten pasar como prop (evita "prop drilling").

### 3.5 Singleton (instancia de Keycloak)

`keycloak.js` exporta una única instancia compartida por toda la aplicación frontend. Garantiza que no haya múltiples instancias del cliente Keycloak en conflicto.

### 3.6 Interceptor Pattern

Los interceptores de Axios implementan lógica transversal (autenticación, renovación de token, manejo de 401) que aplica a todas las peticiones HTTP sin modificar cada llamada individual. Es análogo al patrón de filtros/middleware en el backend.

### 3.7 Facade Pattern (capa de servicios)

Tanto en el backend (clases `*Service`) como en el frontend (archivos `*Service.js`), la capa de servicios actúa como fachada: expone operaciones de alto nivel (ej. `createCompra`, `getPrendas`) ocultando los detalles de acceso a datos o llamadas HTTP.

### 3.8 Strategy Pattern (clasificación climática en recomendaciones)

`RecommendationService` implementa una clasificación por rangos de temperatura que determina qué lista de categorías utilizar para buscar prendas:

- `temp < 15` → estrategia "frío" → array de categorías de abrigo.
- `15 ≤ temp ≤ 25` → estrategia "templado" → array de categorías livianas.
- `temp > 25` → estrategia "calor" → array de categorías de verano.

Cada rama tiene su propio set de categorías a probar en orden (tolerancia a categorías no existentes en la BD).

### 3.9 Chain of Responsibility (fallback de categorías)

Dentro de `obtenerPrendasPorTemperatura()`, el servicio itera sobre un array de nombres de categoría posibles y retorna el primer resultado no vacío. Si la categoría "abrigos" no existe en la BD, prueba "abrigo", luego "camperas", etc. Esto hace al sistema resiliente ante distintas convenciones de nombres en el catálogo.
