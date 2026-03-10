# ============================================================
# STAGE 1 — BUILD
# Usa Maven + JDK para compilar el código y generar el JAR
# ============================================================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar pom.xml y descargar dependencias (cacheado)
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Compilar
COPY src ./src
RUN mvn package -DskipTests -q

# ============================================================
# STAGE 2 — RUN
# Solo el JAR, imagen final liviana
# ============================================================
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]