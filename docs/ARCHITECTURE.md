# 🏗️ Arquitectura del Sistema

## Diagrama de Componentes

```
┌───────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                       │
│                                                            
           │             │              │             │
           └─────────────┴──────────────┴─────────────┘
                              │
                              │ HTTPS/HTTP
                              ▼
┌───────────────────────────────────────────────────────────────┐
│                     CAPA DE API GATEWAY                        │
│                                                                 │
│                   ┌────────────────────────┐                   │
│                   │   Spring Cloud Gateway │                   │
│                   │   (WebFlux Reactive)   │                   │
│                   ├────────────────────────┤                   │
│                   │  • OAuth2 Login        │                   │
│                   │  • JWT Validation      │                   │
│                   │  • Rate Limiting       │                   │
│                   │  • CORS                │                   │
│                   │  • Routing             │                   │
│                   └───────────┬────────────┘                   │
│                               │                                 │
└───────────────────────────────┼─────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
┌─────────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│   MICROSERVICIO     │ │ MICROSERVICIO   │ │   KEYCLOAK       │
│     PRODUCTO        │ │    COMPRA       │ │   (Auth Server)  │
│                     │ │                 │ │                  │
│ ┌─────────────────┐ │ │ ┌─────────────┐ │ │ ┌──────────────┐ │
│ │   Controllers   │ │ │ │ Controllers │ │ │ │ Realm: app   │ │
│ └─────────────────┘ │ │ └─────────────┘ │ │ │              │ │
│ ┌─────────────────┐ │ │ ┌─────────────┐ │ │ │ • Users      │ │
│ │    Services     │ │ │ │  Services   │ │ │ │ • Roles      │ │
│ └─────────────────┘ │ │ └─────────────┘ │ │ │ • Clients    │ │
│ ┌─────────────────┐ │ │ ┌─────────────┐ │ │ │ • JWT Issue  │ │
│ │  Repositories   │ │ │ │Repositories │ │ │ └──────────────┘ │
│ └─────────────────┘ │ │ └─────────────┘ │ │                  │
│ ┌─────────────────┐ │ │ ┌─────────────┐ │ └──────────────────┘
│ │    Entities     │ │ │ │  Entities   │ │
│ └─────────────────┘ │ │ └─────────────┘ │
│ ┌─────────────────┐ │ │ ┌─────────────┐ │
│ │ Security Config │ │ │ │ REST Clients│ │
│ │ (Resource Srv)  │ │ │ │ • Producto  │ │
│ └─────────────────┘ │ │ │ • OpenMeteo │ │
│                     │ │ └─────────────┘ │
└──────────┬──────────┘ └────────┬────────┘
           │                     │
           ▼                     ▼
┌─────────────────────┐ ┌─────────────────┐
│   PostgreSQL        │ │  PostgreSQL     │
│   producto_db       │ │   compra_db     │
│                     │ │                 │
│ • prendas           │ │ • compras       │
│ • categorias        │ │ • items         │
│ • stock             │ │ • usuarios      │
│                     │ │ • envios        │
│                     │ │ • pagos         │
└─────────────────────┘ └─────────────────┘
```

## Flujo de Request Completo

### 1. Request sin autenticación (Catálogo Público)

```
Cliente → Gateway
  |
  ├─> Verifica seguridad: GET /api/prendas → ✅ Público
  |
  └─> Enruta → Producto Service :8081
                |
                ├─> Controller recibe
                ├─> Service procesa
                ├─> Repository → DB
                ├─> DB → Repository
                └─> JSON Response → Gateway → Cliente
```

### 2. Request con autenticación (Crear Compra)

```
Cliente → Gateway
  |
  ├─> Verifica JWT en header
  |   ├─> Extrae: Authorization: Bearer <token>
  |   ├─> Valida firma con JWK Set de Keycloak
  |   ├─> Verifica expiración
  |   └─> Extrae roles: [ROLE_CLIENTE]
  |
  ├─> Evalúa permisos: .hasRole("CLIENTE") → ✅
  |
  └─> Enruta → Compra Service :8083
                |
                ├─> Valida JWT nuevamente (Resource Server)
                ├─> Controller recibe
                ├─> Service procesa
                ├─> REST call → Producto Service (validar stock)
                ├─> Repository → DB
                └─> JSON Response → Gateway → Cliente
```

## Patrones de Diseño Utilizados

### 1. API Gateway Pattern
- **Problema**: Clientes necesitan acceder a múltiples microservicios
- **Solución**: Un único punto de entrada que enruta requests
- **Implementación**: Spring Cloud Gateway

### 2. Service Registry (Implícito con Docker DNS)
- **Problema**: Microservicios necesitan descubrirse entre sí
- **Solución**: Docker DNS resuelve nombres de contenedores
- **Ejemplo**: `http://producto-service:8081`


### 3. Database per Service
- **Problema**: Acoplamiento de datos entre servicios
- **Solución**: Cada microservicio tiene su propia BD
- **Implementación**: 
  - producto_db
  - compra_db

### 4. Centralized Authentication (OAuth2 + PKCE)
- **Problema**: Cada servicio no debe manejar autenticación
- **Solución**: Keycloak como Identity Provider
- **Flujo**: Authorization Code + PKCE


## Decisiones Arquitectónicas

### ¿Por qué Spring Cloud Gateway y no Zuul?
- ✅ Reactivo (WebFlux) → mejor performance
- ✅ Mejor integración con Spring Boot 3.x
- ✅ Soporte activo de Spring

### ¿Por qué Keycloak y no JWT custom?
- ✅ No reinventar la rueda de seguridad
- ✅ Estándar OAuth2/OIDC
- ✅ Gestión de usuarios desde UI
- ✅ PKCE out-of-the-box

### ¿Por qué PostgreSQL y no MongoDB?
- ✅ Datos relacionales (compras → items → prendas)
- ✅ ACID transactions
- ✅ Mejor para este dominio

### ¿Por qué REST y no GraphQL?
- ✅ Simplicidad
- ✅ Caching HTTP estándar
- ✅ Mejor para microservicios pequeños

## Seguridad en Capas

```
┌─────────────────────────────────────────┐
│ CAPA 1: Gateway                         │
│ • Valida JWT                            │
│ • Verifica roles                        │
│ • Rate limiting                         │
│ • CORS                                  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│ CAPA 2: Microservicio (Resource Server)│
│ • Valida JWT nuevamente                 │
│ • Extrae claims                         │
│ • Verifica firma                        │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│ CAPA 3: Base de Datos                   │
│ • Credenciales en variables de entorno  │
│ • Red interna de Docker                 │
│ • Sin exposición de puertos             │
└─────────────────────────────────────────┘
```

## Escalabilidad Futura

### Caching (Pendiente)
- Redis para catálogo de productos
- Cache de JWK Set

### Message Queue (Pendiente)
- RabbitMQ / Kafka para eventos
- Ejemplo: Compra creada → Enviar email

### Monitoring (Pendiente)
- Prometheus + Grafana
- Spring Boot Actuator
- Distributed Tracing (Zipkin)
