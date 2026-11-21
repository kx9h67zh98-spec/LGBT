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

        String explicitJdbcUrl =
            getFirstNonBlank(
                System.getenv("DB_JDBC_URL"),
                System.getenv("JDBC_DATABASE_URL")
            );

        String tidbHost =
            getFirstNonBlank(
                System.getenv("TIDB_HOST")
            );

        String host =
            getFirstNonBlank(
                tidbHost,
                System.getenv("DB_HOST"),
                System.getenv("MYSQLHOST")
            );

        String port =
            getFirstNonBlank(
                System.getenv("TIDB_PORT"),
                System.getenv("DB_PORT"),
                System.getenv("MYSQLPORT")
            );

        String database =
            getFirstNonBlank(
                System.getenv("TIDB_DATABASE"),
                System.getenv("TIDB_DB_NAME"),
                System.getenv("DB_NAME"),
                System.getenv("MYSQLDATABASE")
            );

        String user =
            getFirstNonBlank(
                System.getenv("TIDB_USER"),
                System.getenv("DB_USER"),
                System.getenv("MYSQLUSER")
            );

        String password =
            getFirstNonBlank(
                System.getenv("TIDB_PASSWORD"),
                System.getenv("DB_PASSWORD"),
                System.getenv("MYSQLPASSWORD")
            );

        String jdbcUrl =
            explicitJdbcUrl;

        if (
            jdbcUrl == null
            &&
            host != null
            &&
            database != null
        ) {
            boolean tidbMode =
                tidbHost != null;

            if (
                port == null
                ||
                port.isBlank()
            ) {
                port =
                    tidbMode
                        ?
                        "4000"
                        :
                        "3306";
            }

            jdbcUrl =
                buildJdbcUrl(
                    host,
                    port,
                    database,
                    tidbMode
                );
        }

        if (
            jdbcUrl != null
            &&
            user != null
            &&
            password != null
        ) {
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
                "FitHealth database mode: cloud/environment JDBC with Flyway + HikariCP."
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

    private static String buildJdbcUrl(
        String host,
        String port,
        String database,
        boolean tidbMode
    ) {
        StringBuilder jdbc =
            new StringBuilder();

        jdbc
            .append("jdbc:mysql://")
            .append(host)
            .append(":")
            .append(port)
            .append("/")
            .append(database)
            .append("?serverTimezone=UTC")
            .append("&tcpKeepAlive=true");

        if (tidbMode) {
            jdbc
                .append("&sslMode=VERIFY_IDENTITY")
                .append("&enabledTLSProtocols=TLSv1.2,TLSv1.3");
        } else {
            String sslMode =
                getFirstNonBlank(
                    System.getenv("DB_SSL_MODE")
                );

            if (sslMode != null) {
                jdbc
                    .append("&sslMode=")
                    .append(sslMode);
            } else {
                jdbc
                    .append("&useSSL=false")
                    .append("&allowPublicKeyRetrieval=true");
            }
        }

        return jdbc.toString();
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
