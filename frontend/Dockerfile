# ============================================================
# STAGE 1 — BUILD
# Usa Node.js para instalar dependencias y compilar con Vite
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json primero para aprovechar el caché de capas Docker:
# si package.json no cambia, "npm ci" no se re-ejecuta en builds siguientes
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del código fuente
# (incluye .env.production que Vite leerá automáticamente en "npm run build")
COPY . .

# Compilar la app React → genera carpeta /app/dist con el bundle estático
RUN npm run build

# ============================================================
# STAGE 2 — SERVE
# Imagen final liviana: solo nginx + los archivos estáticos generados
# NO incluye node_modules, código fuente, ni herramientas de build
# ============================================================
FROM nginx:1.27-alpine

# Copiar los archivos estáticos del build al directorio que nginx sirve
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar nuestra configuración personalizada de nginx (SPA fallback, caché, gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto 80 — nginx escucha aquí por defecto
EXPOSE 80

# nginx corre en primer plano (sin daemonize) para que Docker lo controle
CMD ["nginx", "-g", "daemon off;"]
