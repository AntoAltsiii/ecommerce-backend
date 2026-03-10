# Guía de Instalación y Uso — ProyectoRopa

Esta guía explica cómo poner en marcha el proyecto desde cero en una máquina nueva, sin experiencia previa con el repositorio.

---

## Requisitos previos

Antes de comenzar, asegurate de tener instalado:

| Herramienta | Versión mínima | Para qué se usa |
|---|---|---|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 4.x | Levanta todos los servicios en contenedores |
| [Git](https://git-scm.com/) | 2.x | Clonar el repositorio |
| (Opcional) Java 17 + Maven 3.9 | Java 17, Maven 3.9 | Solo si querés compilar los servicios localmente |
| (Opcional) Node.js 20+ | 20.x | Solo si querés correr el frontend fuera de Docker |

> Con Docker Desktop instalado es suficiente para ejecutar el proyecto completo. Java y Node.js son opcionales para desarrollo local.

---

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd ProyectoRopa
```

---

## 2. Configurar variables de entorno

El proyecto usa un archivo `.env` en la raíz para configurar credenciales. Ya existe un archivo de ejemplo:

```bash
# Copiar la plantilla
cp .env.example .env
```

Editá el `.env` y reemplazá los valores de ejemplo por los que prefieras:

```env
# PostgreSQL (servicios de negocio)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_segura
POSTGRES_DB=postgres

# Administrador de Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=tu_password_segura

# PostgreSQL (base de datos de Keycloak)
POSTGRES_KEYCLOAK_DB=keycloak
POSTGRES_KEYCLOAK_USER=keycloak
POSTGRES_KEYCLOAK_PASSWORD=keycloak

# Credenciales para los microservicios
DB_USER=postgres
DB_PASSWORD=tu_password_segura
DB_HOST=postgres
DB_PORT=5432
```

> El `POSTGRES_PASSWORD` y `DB_PASSWORD` deben ser iguales.

### Variables del frontend

El frontend ya tiene sus propias variables preconfiguradas en `frontend/.env.example`. Siempre que uses el stack completo de Docker, **no es necesario modificarlas**:

```env
VITE_API_URL=http://localhost:8090
VITE_KEYCLOAK_URL=http://localhost:8888
VITE_KEYCLOAK_REALM=app-realm
VITE_KEYCLOAK_CLIENT_ID=gateway-client
```

Si querés correr el frontend fuera de Docker (modo desarrollo), copiá ese archivo:

```bash
cd frontend
cp .env.example .env
```

---

## 3. Levantar el stack con Docker

Desde la raíz del proyecto (donde está `docker-compose.yml`):

```bash
docker compose up --build
```

La primera vez, Docker va a:
1. Descargar las imágenes base (PostgreSQL, Keycloak, Nginx).
2. Compilar los tres servicios Java (Producto, Compra, Gateway) con Maven.
3. Compilar el frontend con Vite y empaquetarlo en Nginx.
4. Inicializar PostgreSQL y crear las bases de datos `compra_db` y `producto_db`.
5. Iniciar Keycloak e importar automáticamente el realm `app-realm` con sus roles y cliente.

**Esperar entre 2 y 4 minutos** (dependiendo de la máquina y la velocidad de descarga). El stack está listo cuando ves en los logs:

```
keycloak-auth  | ... Keycloak 23.0 on JVM started in ...
gateway-service| ... Started GatewayApplication in ...
```

Para correr sin ver los logs:

```bash
docker compose up --build -d
```

Para detener todos los servicios:

```bash
docker compose down
```

Para detener Y borrar todos los volúmenes (útil para empezar desde cero):

```bash
docker compose down -v
```

---

## 4. URLs de acceso

Una vez que el stack esté corriendo:

| Servicio | URL |
|---|---|
| Frontend (app web) | http://localhost:3000 |
| API Gateway | http://localhost:8090 |
| Keycloak (administración) | http://localhost:8888 |
| Keycloak Admin Console | http://localhost:8888/admin |

> Los microservicios internos (8081, 8083) no están expuestos fuera de Docker. Todo el tráfico pasa por el Gateway en el 8090.

---

## 5. Configurar Keycloak: crear usuarios

El realm `app-realm` y sus roles (ADMIN, CLIENTE, REPARTIDOR) se importan automáticamente al iniciar. Solo necesitás crear los usuarios manualmente.

### 5.1 Crear un usuario cliente (rol predeterminado)

1. Acceder a http://localhost:8888/admin
2. Ingresar con las credenciales del `.env` (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`)
3. En el selector de realm (arriba a la izquierda), elegir **app-realm**
4. Ir a **Users → Add user**
5. Completar los campos:
   - **Username:** el nombre de usuario (ej. `usuario1`)
   - **Email:** dirección de email
   - **First name / Last name:** nombre y apellido
   - **Email verified:** ON (para evitar el paso de verificación)
6. Guardar el usuario
7. Ir a la pestaña **Credentials → Set password**, ingresar la contraseña y apagar "Temporary"
8. **Roles:** ir a la pestaña **Role mapping** y verificar que el rol **CLIENTE** ya esté asignado

> El rol **CLIENTE** es el rol predeterminado del realm y se asigna automáticamente a cada nuevo usuario. No hace falta asignarlo manualmente.

### 5.2 Crear un usuario administrador

Repetir los pasos anteriores y en el paso 8 asignar el rol **ADMIN** (además de CLIENTE si se desea).

### 5.3 Crear un usuario repartidor

Repetir los pasos y asignar el rol **REPARTIDOR**.

### Resumen de accesos por rol

| Rol | Accede a |
|---|---|
| Anónimo (sin login) | Catálogo público de prendas (`/productos`) |
| CLIENTE | Carrito, Checkout, Mis Compras, Recomendación |
| REPARTIDOR | Gestión de Envíos |
| ADMIN | Todo lo anterior + panel de administración (prendas, stock, categorías, compras) |

### Registro desde la app

Los usuarios también pueden registrarse directamente desde la pantalla de login de Keycloak (el registro está habilitado en el realm). Los nuevos usuarios registrados reciben el rol **CLIENTE** automáticamente.

---

## 6. (Opcional) Cargar datos iniciales en la base de datos

El proyecto incluye un script de seed con categorías, prendas de ejemplo, sucursales y stock. Se debe ejecutar **después** de que los servicios de Spring Boot hayan iniciado (Hibernate crea las tablas al arrancar).

**Esperar al menos 90 segundos** desde que levantaste el stack antes de ejecutar:

```powershell
# Windows PowerShell
docker exec -i postgres-db psql -U postgres < database/seed.sql
```

```bash
# Linux / macOS
docker exec -i postgres-db psql -U postgres < database/seed.sql
```

El script es idempotente para categorías y prendas (usa `ON CONFLICT DO NOTHING`), por lo que puede ejecutarse múltiples veces sin duplicar datos.

### Qué carga el seed

**`producto_db`:**
- Categorías: `Camisas`, `Pantalones`, `Vestidos`, `Abrigos`, `Accesorios`
- 10 prendas de ejemplo con imágenes de Unsplash

**`compra_db`:**
- 3 sucursales (Sucursal Central, Palermo, Belgrano)
- Stock inicial para la Sucursal Central (10–20 unidades por prenda)

### Cargar prendas manualmente

Si preferís cargar el catálogo vos mismo a través de la interfaz:

1. Inicia sesión con un usuario **ADMIN**
2. Ir a **Admin → Gestión de Categorías** y crear las categorías deseadas
3. Ir a **Admin → Gestión de Prendas** y crear prendas asignándoles una categoría, precio e imagen

---

## 7. Consideraciones importantes

### Sistema de recomendaciones por clima

El módulo de recomendación (`/recomendacion`) requiere que:

1. El usuario haya ingresado su ubicación (se pide automáticamente vía navegador al entrar a la página).
2. Existan categorías en la BD con nombres que coincidan con los que busca el sistema (case-insensitive):

| Clima | Categorías reconocidas |
|---|---|
| Frío (< 15°C) | `abrigos`, `camperas`, `buzos`, `bufandas`, `pantalones`, `gorros`, `botas`, `guantes`, `medias` |
| Templado (15–25°C) | `remeras`, `camisas`, `poleras` |
| Calor (> 25°C) | `musculosas`, `shorts`, `polleras`, `bermudas`, `tops`, `bikinis` |

Las categorías del seed (`Abrigos`, `Camisas`, `Pantalones`) ya están reconocidas.

### Sesión por defecto: CLIENTE

Cualquier usuario nuevo que se registre en la app recibe el rol **CLIENTE** automáticamente. Este rol permite:
- Navegar el catálogo
- Agregar productos al carrito
- Completar compras (checkout)
- Ver su historial de compras
- Ver recomendaciones personalizadas por clima

### Checkout y sucursales

El checkout requiere que exista al menos **una sucursal** en la base de datos (la página usa el ID de sucursal 1 por defecto). El seed crea esta sucursal automáticamente. Si no ejecutás el seed, creala manualmente:

```sql
docker exec -i postgres-db psql -U postgres -d compra_db -c "
INSERT INTO tb_sucursales (nombre_sucursal, direccion_sucursal, telefono_sucursal)
VALUES ('Sucursal Central', 'Av. Corrientes 1234, CABA', '011-4444-1234');
"
```

### Registro de usuario en `compra_db`

Cuando un usuario hace login por primera vez y navega a una sección que requiere datos de usuario (como carrito o recomendaciones), el frontend consulta y crea automáticamente el registro del usuario en `tb_usuarios` de `compra_db` usando el email del token JWT.

---

## 8. Reiniciar datos de compras (para pruebas)

Si querés limpiar compras, envíos e ítems sin tocar el catálogo:

```powershell
docker exec -i postgres-db psql -U postgres -d compra_db -c "
TRUNCATE tb_pagos, tb_envios, tb_items, tb_compras RESTART IDENTITY CASCADE;
"
```

Para limpiar también el stock y volver a ejecutar el seed:

```powershell
docker exec -i postgres-db psql -U postgres -d compra_db -c "
TRUNCATE tb_stock RESTART IDENTITY CASCADE;
"
# Luego volver a ejecutar el seed:
docker exec -i postgres-db psql -U postgres < database/seed.sql
```

---

## 9. Estructura del proyecto

```
ProyectoRopa/
├── docker-compose.yml          # Orquestación de todos los servicios
├── .env.example                # Plantilla de variables de entorno
├── database/
│   ├── init.sql                # Crea las dos bases de datos al iniciar PostgreSQL
│   └── seed.sql                # Datos de ejemplo (categorías, prendas, sucursales, stock)
├── keycloak/
│   └── app-realm.json          # Configuración del realm (roles, cliente, registro)
├── Gateway/                    # Microservicio: API Gateway (Spring Cloud Gateway)
├── Producto/                   # Microservicio: Catálogo (prendas y categorías)
├── Compra/                     # Microservicio: Compras, envíos, stock, recomendaciones
├── frontend/                   # App React (Vite) → servida por Nginx en Docker
├── postman/
│   └── ProyectoRopa.postman_collection.json  # Colección para probar la API
└── docs/
    ├── DECISIONS.md            # Decisiones técnicas de diseño
    ├── ARCHITECTURE.md         # Diagrama de arquitectura
    └── DIAGRAM.txt             # Vista textual del sistema
```

---

## 10. Probar la API con Postman

El repositorio incluye una colección de Postman en `postman/ProyectoRopa.postman_collection.json`.

Para importarla:
1. Abrir Postman → **Import** → seleccionar el archivo.
2. La colección incluye un flujo OAuth2 para autenticarse contra Keycloak y llamar a los endpoints protegidos.

---

## Solución de problemas comunes

| Problema | Solución |
|---|---|
| `docker compose up` falla en Gateway | El Gateway depende de que Keycloak esté healthy. Esperar y reintentar con `docker compose restart gateway-service` |
| Error `relation does not exist` en el seed | Las tablas aún no fueron creadas. Esperar ~90 segundos y reintentar el seed |
| El checkout da error 500 | La sucursal con ID 1 no existe. Ejecutar el seed o insertar la sucursal manualmente |
| Recomendaciones muestran "sin prendas" | Verificar que existan categorías con nombres reconocidos (ver sección 7) |
| Keycloak no arranca | Verificar que `postgres-keycloak` esté healthy antes que Keycloak: `docker ps` |
| Puerto 8888 o 3000 ya en uso | Cambiar el puerto en `docker-compose.yml` y las variables de entorno del frontend |
