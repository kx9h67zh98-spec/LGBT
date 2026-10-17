package com.fithealth.dao;

import com.fithealth.model.User;
import com.fithealth.model.WaterLog;
import com.fithealth.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

public class WaterLogDAO {

    public List<WaterLog> findByUserAndDate(
        Long userId,
        LocalDate date
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager
                .createQuery(
                    "SELECT w " +
                    "FROM WaterLog w " +
                    "WHERE w.user.id = :userId " +
                    "AND w.logDate = :date " +
                    "ORDER BY w.id",
                    WaterLog.class
                )
                .setParameter(
                    "userId",
                    userId
                )
                .setParameter(
                    "date",
                    date
                )
                .getResultList();

        } finally {

            entityManager.close();

        }
    }


    public List<WaterLog> findRecentByUser(
        Long userId,
        int limit
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            List<WaterLog> result =
                entityManager
                    .createQuery(
                        "SELECT w " +
                        "FROM WaterLog w " +
                        "WHERE w.user.id = :userId " +
                        "ORDER BY w.logDate DESC, w.id DESC",
                        WaterLog.class
                    )
                    .setParameter(
                        "userId",
                        userId
                    )
                    .setMaxResults(
                        limit
                    )
                    .getResultList();

            Collections.reverse(
                result
            );

            return result;

        } finally {

            entityManager.close();

        }
    }


    public WaterLog saveOrUpdate(
        Long userId,
        LocalDate date,
        int amountMl,
        boolean add
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            List<WaterLog> matches =
                entityManager
                    .createQuery(
                        "SELECT w " +
                        "FROM WaterLog w " +
                        "WHERE w.user.id = :userId " +
                        "AND w.logDate = :date",
                        WaterLog.class
                    )
                    .setParameter(
                        "userId",
                        userId
                    )
                    .setParameter(
                        "date",
                        date
                    )
                    .setMaxResults(
                        1
                    )
                    .getResultList();

            WaterLog log;

            if (
                matches.isEmpty()
            ) {

                log =
                    new WaterLog();

                log.setUser(
                    entityManager.getReference(
                        User.class,
                        userId
                    )
                );

                log.setLogDate(
                    date
                );

                log.setAmountMl(
                    amountMl
                );

                entityManager.persist(
                    log
                );

            } else {

                log =
                    matches.get(0);

                int nextAmount =
                    add
                    ?
                    log.getAmountMl()
                    +
                    amountMl
                    :
                    amountMl;

                if (
                    nextAmount < 0
                    ||
                    nextAmount > 10000
                ) {

                    throw new IllegalArgumentException(
                        "Daily water intake must be between 0 and 10000 ml."
                    );

                }

                log.setAmountMl(
                    nextAmount
                );

            }

            entityManager.flush();
            entityManager.refresh(
                log
            );

            transaction.commit();

            return log;

        } catch (
            RuntimeException error
        ) {

            if (
                transaction.isActive()
            ) {

                transaction.rollback();

            }

            throw error;

        } finally {

            entityManager.close();

        }
    }
}
