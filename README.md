# 🛍️ ProyectoRopa - Backend E-commerce con Microservicios

Sistema de e-commerce de ropa con **arquitectura de microservicios**, **autenticación OAuth2 + PKCE**, recomendaciones personalizadas según clima y gestión completa de compras.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Configuración](#-configuración)
- [API Endpoints](#-api-endpoints)
- [Autenticación](#-autenticación)
- [Testing con Postman](#-testing-con-postman)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🚀 Tecnologías

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.2.0** - Framework principal
- **Spring Cloud Gateway** - API Gateway con enrutamiento reactivo
- **Spring Security** - Seguridad y validación JWT
- **Spring WebFlux** - Programación reactiva para el Gateway
- **Spring Data JPA** - Persistencia de datos
- **Hibernate** - ORM

### Seguridad
- **Keycloak 23.0** - Servidor de autenticación OAuth2/OpenID Connect
- **OAuth2 + PKCE** - Flujo de autenticación para clientes públicos
- **JWT** - Tokens de acceso validados en 3 capas

### Base de Datos
- **PostgreSQL 15** - Base de datos relacional
- 2 instancias separadas: datos de negocio + Keycloak

### DevOps
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de servicios
- **Maven** - Gestión de dependencias y build

### Integraciones Externas
- **Open-Meteo API** - Pronóstico meteorológico en tiempo real
- **WebClient** - Cliente HTTP reactivo

---

## 🏗️ Arquitectura

### Diagrama de Microservicios

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTE                              │
│              (Navegador / Postman / App Móvil)              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             ▼
                   ┌──────────────────┐
                   │   API GATEWAY    │ :8090
                   │  (Spring Cloud)  │
                   │  + OAuth2 Login  │
                   └────────┬─────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
      ┌─────────────┐ ┌──────────┐ ┌──────────┐
      │  Producto   │ │  Compra  │ │ Keycloak │ :8888
      │  Service    │ │ Service  │ │  (Auth)  │
      │   :8081     │ │  :8083   │ └────┬─────┘
      └──────┬──────┘ └────┬─────┘      │
             │             │            │
             │             │            │
             ▼             ▼            ▼
      ┌──────────┐  ┌──────────┐ ┌──────────┐
      │PostgreSQL│  │PostgreSQL│ │PostgreSQL│
      │producto  │  │ compra   │ │ keycloak │
      │   :5432  │  │  :5432   │ │  :5432   │
      └──────────┘  └──────────┘ └──────────┘
                          │
                          │ WebClient
                          ▼
                  ┌──────────────┐
                  │  Open-Meteo  │
                  │      API     │
                  └──────────────┘
```

### Flujo de Autenticación (OAuth2 + PKCE)

```
1. Usuario → Gateway: GET /api/compras
2. Gateway: No autenticado → Redirect a Keycloak
3. Keycloak: Login exitoso → Genera Authorization Code
4. Gateway ← Keycloak: code=ABC123
5. Gateway → Keycloak: Intercambio code + code_verifier (PKCE)
6. Gateway ← Keycloak: access_token (JWT)
7. Gateway guarda token en sesión
8. Usuario → Gateway: Request con Authorization: Bearer <JWT>
9. Gateway valida JWT (firma, expiración, roles)
10. Gateway → Microservicio: Enruta request con JWT
11. Microservicio valida JWT nuevamente (Resource Server)
12. Microservicio → Usuario: Respuesta JSON
```

---

## ✨ Características

### Gestión de Productos
- ✅ CRUD completo de prendas y categorías
- ✅ Búsqueda por categoría
- ✅ Catálogo público (lectura)
- ✅ Gestión exclusiva para ADMIN (escritura)

### Sistema de Compras
- ✅ Carrito de compras por usuario
- ✅ Gestión de ítems
- ✅ Procesamiento de pagos
- ✅ Control de stock en tiempo real
- ✅ Gestión de envíos y sucursales

### Recomendaciones Inteligentes
- ✅ Integración con API de clima (Open-Meteo)
- ✅ Recomendaciones de ropa según temperatura y condiciones
- ✅ Almacenamiento de ubicación del usuario
- ✅ Pronóstico extendido (7 días)

### Seguridad Multicapa
- ✅ Autenticación centralizada con Keycloak
- ✅ OAuth2 con PKCE (sin client_secret hardcodeado)
- ✅ Validación de JWT en Gateway + Microservicios
- ✅ Control de acceso basado en roles (RBAC)
- ✅ 3 roles: ADMIN, CLIENTE, REPARTIDOR

---

## 📦 Requisitos Previos

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Java JDK 17+** (solo para desarrollo)
- **Maven 3.8+** (solo para desarrollo)
- **Git**

---

## 🚀 Instalación y Ejecución

### Requisitos

- **Docker Desktop** instalado y corriendo
- No se necesita Java, Node, ni Maven: Docker lo maneja todo

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/ProyectoRopa.git
cd ProyectoRopa
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

El archivo `.env` ya tiene valores por defecto para desarrollo local. Podés cambiarlos si querés usar contraseñas más seguras.

Para el frontend, las variables también están listas:
```bash
# frontend/.env ya existe con los valores correctos para local
# Si por algún motivo no existe:
cp frontend/.env.example frontend/.env
```

### 3. Levantar todo con Docker Compose

```bash
# Desde la raíz del proyecto (donde está docker-compose.yml)
docker compose up --build
```

> `--build` compila todos los servicios (Java + React). Solo es necesario la primera vez o cuando cambiás código. Las veces siguientes podés usar solo `docker compose up`.

Esto levanta **7 servicios**:
- `postgres-db` — Base de datos para Producto + Compra
- `postgres-keycloak` — Base de datos para Keycloak  
- `keycloak-auth` — Servidor de autenticación
- `producto-service` — Microservicio de prendas y categorías
- `compra-service` — Microservicio de compras, stock y envíos
- `gateway-service` — API Gateway (punto de entrada del backend)
- `frontend` — App React servida con nginx

### 4. Esperar que los servicios estén listos

Los servicios JVM (Gateway, Producto, Compra) tardan ~60-90 segundos en arrancar. Podés ver los logs con:

```bash
docker compose logs -f
```

Cuando veas `Started GatewayApplication` en los logs, todo está listo.

### 5. Acceder a la aplicación

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **🌐 Frontend (App React)** | http://localhost:3000 | Interfaz de usuario |
| **🔌 API Gateway** | http://localhost:8090 | Entrada del backend |
| **🔐 Keycloak Admin** | http://localhost:8888 | Panel de administración de auth |

**Keycloak Admin:** usuario `admin` / contraseña `admin`

### 6. Crear un usuario para probar

1. Ir a http://localhost:8888
2. Login como admin
3. Seleccionar realm **app-realm**
4. Ir a **Users → Add user**
5. Completar nombre de usuario y email
6. En pestaña **Credentials** → asignar contraseña (desmarcar "Temporary")
7. En pestaña **Role mapping** → asignar rol **CLIENTE** y/o **ADMIN**

### 7. Cargar datos de ejemplo (opcional)

```bash
# Esperar ~90 segundos después de "docker compose up" para que
# Spring Boot cree las tablas, luego ejecutar:
docker exec -i postgres-db psql -U postgres < database/seed.sql
```

Esto carga: 5 categorías, 10 prendas con imágenes, 3 sucursales y stock inicial.

---

### Detener los servicios

```bash
docker compose down
```

Los datos persisten en los volúmenes Docker (`postgres-data`, `postgres-keycloak-data`).

Para también **borrar todos los datos** (empezar de cero):

```bash
docker compose down -v
```

> ⚠️ `-v` borra los volúmenes y **todos los datos** (usuarios de Keycloak, prendas, compras). Usalo solo si querés reiniciar completamente.

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=postgres

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=tu_password_seguro

# Microservicios
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
DB_HOST=postgres
DB_PORT=5432
```

### Configurar Keycloak (Primera vez)

1. Ir a http://localhost:8888
2. Login con `admin` / `admin`
3. El realm `app-realm` ya está importado automáticamente
4. Crear usuarios de prueba:
   - **Realm**: `app-realm`
   - **Users** → Add user
   - Asignar rol: CLIENTE / ADMIN / REPARTIDOR

---

## 📡 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Página de inicio | Público |
| GET | `/home` | Perfil + access token | Autenticado |
| GET | `/me` | Información del usuario | Autenticado |

### Productos

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/prendas` | Listar todas las prendas | Público |
| GET | `/api/prendas/{id}` | Obtener prenda por ID | Público |
| GET | `/api/prendas/categoria/{cat}` | Prendas por categoría | Público |
| POST | `/api/prendas` | Crear prenda | ADMIN |
| PUT | `/api/prendas/{id}` | Actualizar prenda | ADMIN |
| DELETE | `/api/prendas/{id}` | Eliminar prenda | ADMIN |

### Categorías

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/categorias` | Listar categorías | Público |
| POST | `/api/categorias` | Crear categoría | ADMIN |

### Compras

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/compras/usuario/{userId}` | Compras de un usuario | CLIENTE, ADMIN |
| POST | `/api/compras` | Crear compra | CLIENTE, ADMIN |
| PUT | `/api/compras/{id}/estado` | Actualizar estado | ADMIN |

### Clima y Recomendaciones

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| PUT | `/api/clima/ubicacion/{userId}` | Actualizar ubicación | CLIENTE, ADMIN |
| GET | `/api/clima/usuario/{userId}` | Obtener clima actual | CLIENTE, ADMIN |
| GET | `/api/clima/recomendacion/{userId}` | Recomendaciones de ropa | CLIENTE, ADMIN |

### Usuarios

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/usuarios` | Listar usuarios | ADMIN |
| POST | `/api/usuarios` | Crear usuario | ADMIN |

### Stock

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/stock/sucursal/{id}` | Stock por sucursal | ADMIN |
| PUT | `/api/stock/{id}` | Actualizar stock | ADMIN |

---

## 🔐 Autenticación

### Obtener Access Token (Navegador)

1. Ir a http://localhost:8090
2. Serás redirigido a Keycloak
3. Login con credenciales
4. Serás redirigido a `/home`
5. Copiar el `access_token` mostrado

### Usar Token en Postman/Thunder Client

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Obtener Token (Postman OAuth2)

1. En Postman → Authorization → OAuth 2.0
2. **Grant Type**: Authorization Code (With PKCE)
3. **Callback URL**: `https://oauth.pstmn.io/v1/callback`
4. **Auth URL**: `http://localhost:8888/realms/app-realm/protocol/openid-connect/auth`
5. **Access Token URL**: `http://localhost:8888/realms/app-realm/protocol/openid-connect/token`
6. **Client ID**: `gateway-client`
7. **Scope**: `openid profile email`
8. **Code Challenge Method**: SHA-256
9. Clic en "Get New Access Token"

---

## 🧪 Testing con Postman

1. Importar colección: `postman/ProyectoRopa.postman_collection.json`
2. Configurar token OAuth2 (ver sección anterior)
3. Ejecutar requests en este orden:
   - `GET /api/prendas` (público)
   - `POST /api/usuarios` (crear usuario)
   - `PUT /api/clima/ubicacion/1` (configurar ubicación)
   - `GET /api/clima/recomendacion/1` (obtener recomendaciones)

---

## 📁 Estructura del Proyecto

```
ProyectoRopa/
│
├── Gateway/                    # API Gateway (Spring Cloud Gateway)
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/proyecto/Gateway/
│   │       │       ├── config/
│   │       │       │   ├── SecurityConfig.java          # OAuth2 + Resource Server
│   │       │       │   └── ReactiveJwtAuthenticationConverter.java
│   │       │       └── controller/
│   │       │           └── HomeController.java
│   │       └── resources/
│   │           └── application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── Producto/                   # Microservicio de Productos
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/proyecto/Producto/
│   │       │       ├── config/
│   │       │       │   ├── SecurityConfig.java
│   │       │       │   └── JwtAuthenticationConverter.java
│   │       │       ├── controller/
│   │       │       │   ├── PrendasController.java
│   │       │       │   └── CategoriasController.java
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       └── entity/
│   │       └── resources/
│   │           └── application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── Compra/                     # Microservicio de Compras
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/proyecto/Compra/
│   │       │       ├── client/
│   │       │       │   ├── ProductoClient.java         # REST client a Producto
│   │       │       │   └── WeatherClient.java          # Cliente API Open-Meteo
│   │       │       ├── controller/
│   │       │       │   ├── CompraController.java
│   │       │       │   └── WeatherController.java
│   │       │       ├── service/
│   │       │       │   ├── WeatherService.java
│   │       │       │   └── RecommendationService.java
│   │       │       └── dto/
│   │       │           ├── WeatherDTO.java
│   │       │           └── RecommendationDTO.java
│   │       └── resources/
│   │           └── application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── keycloak/
│   └── app-realm.json          # Configuración de Keycloak (roles, clients)
│
├── database/
│   └── init.sql                # Script inicial de PostgreSQL
│
├── postman/
│   └── ProyectoRopa.postman_collection.json
│
├── docs/
│   └── architecture.png
│
├── docker-compose.yml          # Orquestación de todos los servicios
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
└── README.md
```

---

## 🛠️ Comandos Útiles

### Ver logs de un servicio específico

```bash
docker-compose logs -f gateway-service
docker-compose logs -f producto-service
docker-compose logs -f keycloak
```

### Reiniciar un servicio

```bash
docker-compose restart gateway-service
```

### Detener todos los servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ borra datos)

```bash
docker-compose down -v
```

### Recompilar y reiniciar un servicio

```bash
# Ejemplo: Gateway
cd Gateway
mvn clean package -DskipTests
cd ..
docker-compose up -d --build gateway-service
```

---

## 🐛 Troubleshooting

### ❌ Error: "Keycloak no está disponible"

**Solución:**
```bash
docker-compose logs keycloak
# Esperar a que muestre: "Keycloak 23.0 started"
```

### ❌ Error: "Connection refused" en microservicios

**Solución:**
```bash
# Verificar healthcheck de PostgreSQL
docker-compose ps
# Debería mostrar "healthy"

# Si no, reiniciar
docker-compose restart postgres
```

### ❌ Error: "JWT validation failed"

**Posibles causas:**
1. Token expirado (duran 5 minutos)
2. Keycloak no está corriendo
3. JWK Set no accesible

**Solución:**
```bash
# Verificar Keycloak
curl http://localhost:8888/realms/app-realm/protocol/openid-connect/certs

# Obtener nuevo token
# Ir a http://localhost:8090/home
```
