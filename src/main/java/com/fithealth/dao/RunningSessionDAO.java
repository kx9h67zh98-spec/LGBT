package com.fithealth.dao;

import com.fithealth.model.RunningSession;
import com.fithealth.model.User;
import com.fithealth.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;

import java.util.List;

public class RunningSessionDAO {

    public List<RunningSession> findByUserId(
        Long userId
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager
                .createQuery(
                    "SELECT r " +
                    "FROM RunningSession r " +
                    "WHERE r.user.id = :userId " +
                    "ORDER BY r.runDate DESC, " +
                    "r.createdAt DESC, r.id DESC",
                    RunningSession.class
                )
                .setParameter(
                    "userId",
                    userId
                )
                .getResultList();

        } finally {

            entityManager.close();

        }
    }


    public RunningSession create(
        Long userId,
        RunningSession runningSession
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            User user =
                entityManager.getReference(
                    User.class,
                    userId
                );

            runningSession.setUser(
                user
            );

            entityManager.persist(
                runningSession
            );

            entityManager.flush();

            entityManager.refresh(
                runningSession
            );

            transaction.commit();

            return runningSession;

        } catch (RuntimeException error) {

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


    public boolean deleteByIdAndUserId(
        Long id,
        Long userId
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            int deleted =
                entityManager
                    .createQuery(
                        "DELETE FROM RunningSession r " +
                        "WHERE r.id = :id " +
                        "AND r.user.id = :userId"
                    )
                    .setParameter(
                        "id",
                        id
                    )
                    .setParameter(
                        "userId",
                        userId
                    )
                    .executeUpdate();

            transaction.commit();

            return deleted > 0;

        } catch (RuntimeException error) {

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
