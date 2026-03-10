# ============================================================
# STAGE 1 — BUILD
# Usa Maven + JDK para compilar el código y generar el JAR
# Esta etapa es temporal: solo existe para construir el artefacto
# ============================================================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar pom.xml primero y descargar dependencias (cacheado por Docker)
# Si el pom.xml no cambia, Docker reutiliza esta capa en el próximo build
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copiar el código fuente y compilar
COPY src ./src
RUN mvn package -DskipTests -q

# ============================================================
# STAGE 2 — RUN
# Solo copia el JAR generado, descarta todo lo demás (Maven, sources, etc.)
# Imagen final mucho más liviana
# ============================================================
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copiar únicamente el JAR desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]