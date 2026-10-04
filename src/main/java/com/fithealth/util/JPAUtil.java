package com.fithealth.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JPAUtil {

    private static final EntityManagerFactory
        entityManagerFactory =
            Persistence.createEntityManagerFactory(
                "FitHealthPU"
            );

    private JPAUtil() {
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