package com.fithealth.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import org.flywaydb.core.Flyway;

import java.util.HashMap;
import java.util.Map;

public class JPAUtil {

    private static final String
        PERSISTENCE_UNIT =
            "FitHealthPU";

    private static final EntityManagerFactory
        entityManagerFactory =
            createEntityManagerFactory();

    private JPAUtil() {
    }

    private static EntityManagerFactory
        createEntityManagerFactory() {

        String host =
            getFirstNonBlank(
                System.getenv("MYSQLHOST"),
                System.getenv("DB_HOST")
            );

        String port =
            getFirstNonBlank(
                System.getenv("MYSQLPORT"),
                System.getenv("DB_PORT")
            );

        String database =
            getFirstNonBlank(
                System.getenv("MYSQLDATABASE"),
                System.getenv("DB_NAME")
            );

        String user =
            getFirstNonBlank(
                System.getenv("MYSQLUSER"),
                System.getenv("DB_USER")
            );

        String password =
            getFirstNonBlank(
                System.getenv("MYSQLPASSWORD"),
                System.getenv("DB_PASSWORD")
            );

        if (
            host != null
            &&
            database != null
            &&
            user != null
            &&
            password != null
        ) {
            if (
                port == null
                ||
                port.isBlank()
            ) {
                port =
                    "3306";
            }

            String jdbcUrl =
                "jdbc:mysql://"
                +
                host
                +
                ":"
                +
                port
                +
                "/"
                +
                database
                +
                "?useSSL=false"
                +
                "&allowPublicKeyRetrieval=true"
                +
                "&serverTimezone=UTC"
                +
                "&tcpKeepAlive=true";

            migrateDatabase(
                jdbcUrl,
                user,
                password
            );

            Map<String, Object> properties =
                new HashMap<>();

            properties.put(
                "jakarta.persistence.jdbc.driver",
                "com.mysql.cj.jdbc.Driver"
            );

            properties.put(
                "jakarta.persistence.jdbc.url",
                jdbcUrl
            );

            properties.put(
                "jakarta.persistence.jdbc.user",
                user
            );

            properties.put(
                "jakarta.persistence.jdbc.password",
                password
            );

            properties.put(
                "hibernate.connection.provider_class",
                "org.hibernate.hikaricp.internal.HikariCPConnectionProvider"
            );

            properties.put(
                "hibernate.hikari.jdbcUrl",
                jdbcUrl
            );

            properties.put(
                "hibernate.hikari.username",
                user
            );

            properties.put(
                "hibernate.hikari.password",
                password
            );

            properties.put(
                "hibernate.hikari.driverClassName",
                "com.mysql.cj.jdbc.Driver"
            );

            properties.put(
                "hibernate.hikari.maximumPoolSize",
                envOrDefault(
                    "DB_POOL_MAX",
                    "10"
                )
            );

            properties.put(
                "hibernate.hikari.minimumIdle",
                envOrDefault(
                    "DB_POOL_MIN_IDLE",
                    "2"
                )
            );

            properties.put(
                "hibernate.hikari.connectionTimeout",
                envOrDefault(
                    "DB_POOL_CONNECTION_TIMEOUT_MS",
                    "10000"
                )
            );

            properties.put(
                "hibernate.hikari.idleTimeout",
                envOrDefault(
                    "DB_POOL_IDLE_TIMEOUT_MS",
                    "600000"
                )
            );

            properties.put(
                "hibernate.hikari.maxLifetime",
                envOrDefault(
                    "DB_POOL_MAX_LIFETIME_MS",
                    "1500000"
                )
            );

            properties.put(
                "hibernate.hikari.keepaliveTime",
                envOrDefault(
                    "DB_POOL_KEEPALIVE_MS",
                    "300000"
                )
            );

            properties.put(
                "hibernate.hikari.poolName",
                "FitHealthPool"
            );

            properties.put(
                "hibernate.show_sql",
                envOrDefault(
                    "HIBERNATE_SHOW_SQL",
                    "false"
                )
            );

            properties.put(
                "hibernate.format_sql",
                "false"
            );

            System.out.println(
                "FitHealth database mode: environment configuration with Flyway + HikariCP."
            );

            return Persistence
                .createEntityManagerFactory(
                    PERSISTENCE_UNIT,
                    properties
                );
        }

        System.out.println(
            "FitHealth database mode: persistence.xml."
        );

        return Persistence
            .createEntityManagerFactory(
                PERSISTENCE_UNIT
            );
    }

    private static void migrateDatabase(
        String jdbcUrl,
        String user,
        String password
    ) {
        Flyway flyway =
            Flyway
                .configure()
                .dataSource(
                    jdbcUrl,
                    user,
                    password
                )
                .baselineOnMigrate(
                    true
                )
                .baselineVersion(
                    "0"
                )
                .load();

        flyway.migrate();

        System.out.println(
            "FitHealth database migrations: up to date."
        );
    }

    private static String
        getFirstNonBlank(
            String... values
        ) {

        if (
            values == null
        ) {
            return null;
        }

        for (
            String value
            :
            values
        ) {
            if (
                value != null
                &&
                !value.isBlank()
            ) {
                return value.trim();
            }
        }

        return null;
    }

    private static String envOrDefault(
        String name,
        String defaultValue
    ) {
        String value =
            System.getenv(
                name
            );

        if (
            value == null
            ||
            value.isBlank()
        ) {
            return defaultValue;
        }

        return value.trim();
    }

    public static EntityManager
        getEntityManager() {

        return entityManagerFactory
            .createEntityManager();
    }

    public static void shutdown() {

        if (
            entityManagerFactory != null
            &&
            entityManagerFactory.isOpen()
        ) {
            entityManagerFactory.close();
        }
    }
}
