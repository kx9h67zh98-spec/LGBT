package com.fithealth.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

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

        /*
         * Railway MySQL variables
         */
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


        /*
         * If cloud/database environment variables exist,
         * override persistence.xml.
         */
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
                "&serverTimezone=UTC";


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


            System.out.println(
                "FitHealth database mode: environment configuration."
            );


            return Persistence
                .createEntityManagerFactory(
                    PERSISTENCE_UNIT,
                    properties
                );

        }


        /*
         * Local fallback.
         * Uses persistence.xml when cloud variables
         * are not available.
         */
        System.out.println(
            "FitHealth database mode: persistence.xml."
        );


        return Persistence
            .createEntityManagerFactory(
                PERSISTENCE_UNIT
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
