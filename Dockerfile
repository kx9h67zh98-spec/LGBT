# =========================================================
# Stage 1: Build FitHealth with Maven + Java 17
# =========================================================

FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn -B -DskipTests dependency:go-offline

COPY src ./src
COPY public ./public

RUN mvn -B clean package -DskipTests


# =========================================================
# Stage 2: Run FitHealth with Tomcat 11 + Java 17
# =========================================================

FROM tomcat:11.0-jdk17-temurin

RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=build \
    /app/target/FitHealth.war \
    /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
