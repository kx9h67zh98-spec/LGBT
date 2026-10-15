package com.fithealth.dao;

import com.fithealth.model.User;
import com.fithealth.model.WeightLog;
import com.fithealth.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

public class WeightLogDAO {

    public List<WeightLog> findRecentByUser(
        Long userId,
        int limit
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            List<WeightLog> logs =
                entityManager
                    .createQuery(
                        "SELECT w " +
                        "FROM WeightLog w " +
                        "WHERE w.user.id = :userId " +
                        "ORDER BY w.logDate DESC, w.id DESC",
                        WeightLog.class
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
                logs
            );

            return logs;

        } finally {

            entityManager.close();
        }
    }

    public WeightLog saveOrUpdate(
        Long userId,
        LocalDate logDate,
        BigDecimal weight
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            WeightLog log;

            try {

                log =
                    entityManager
                        .createQuery(
                            "SELECT w " +
                            "FROM WeightLog w " +
                            "WHERE w.user.id = :userId " +
                            "AND w.logDate = :logDate",
                            WeightLog.class
                        )
                        .setParameter(
                            "userId",
                            userId
                        )
                        .setParameter(
                            "logDate",
                            logDate
                        )
                        .getSingleResult();

                log.setWeight(
                    weight
                );

            } catch (
                NoResultException exception
            ) {

                log =
                    new WeightLog();

                log.setUser(
                    entityManager.getReference(
                        User.class,
                        userId
                    )
                );

                log.setLogDate(
                    logDate
                );

                log.setWeight(
                    weight
                );

                entityManager.persist(
                    log
                );
            }

            entityManager.flush();

            transaction.commit();

            return log;

        } catch (
            RuntimeException exception
        ) {

            if (
                transaction.isActive()
            ) {

                transaction.rollback();
            }

            throw exception;

        } finally {

            entityManager.close();
        }
    }
}
