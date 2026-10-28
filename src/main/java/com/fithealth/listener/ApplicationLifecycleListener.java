package com.fithealth.listener;

import com.fithealth.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class ApplicationLifecycleListener
    implements ServletContextListener {

    @Override
    public void contextInitialized(
        ServletContextEvent event
    ) {
        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {
            entityManager
                .createNativeQuery(
                    "SELECT 1"
                )
                .getSingleResult();

            event
                .getServletContext()
                .log(
                    "FitHealth database startup check passed."
                );

        } finally {
            entityManager.close();
        }
    }

    @Override
    public void contextDestroyed(
        ServletContextEvent event
    ) {
        JPAUtil.shutdown();
    }
}
