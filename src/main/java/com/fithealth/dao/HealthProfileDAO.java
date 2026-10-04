package com.fithealth.dao;

import com.fithealth.model.HealthProfile;
import com.fithealth.model.User;
import com.fithealth.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;

public class HealthProfileDAO {

    public HealthProfile findByUserId(
        Long userId
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager
                .createQuery(
                    """
                    SELECT hp
                    FROM HealthProfile hp
                    WHERE hp.user.id = :userId
                    """,
                    HealthProfile.class
                )
                .setParameter(
                    "userId",
                    userId
                )
                .getSingleResult();

        } catch (
            NoResultException exception
        ) {

            return null;

        } finally {

            entityManager.close();

        }
    }


    public HealthProfile saveOrUpdate(
        Long userId,
        HealthProfile data
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();


            HealthProfile profile;

            try {

                profile =
                    entityManager
                        .createQuery(
                            """
                            SELECT hp
                            FROM HealthProfile hp
                            WHERE hp.user.id = :userId
                            """,
                            HealthProfile.class
                        )
                        .setParameter(
                            "userId",
                            userId
                        )
                        .getSingleResult();

            } catch (
                NoResultException exception
            ) {

                profile =
                    new HealthProfile();

                User user =
                    entityManager.getReference(
                        User.class,
                        userId
                    );

                profile.setUser(
                    user
                );

            }


            profile.setAge(
                data.getAge()
            );

            profile.setGender(
                data.getGender()
            );

            profile.setHeight(
                data.getHeight()
            );

            profile.setWeight(
                data.getWeight()
            );

            profile.setActivityLevel(
                data.getActivityLevel()
            );

            profile.setGoal(
                data.getGoal()
            );

            profile.setBmi(
                data.getBmi()
            );

            profile.setBmr(
                data.getBmr()
            );

            profile.setTdee(
                data.getTdee()
            );

            profile.setTargetCalories(
                data.getTargetCalories()
            );

            profile.setProteinTarget(
                data.getProteinTarget()
            );

            profile.setCarbsTarget(
                data.getCarbsTarget()
            );

            profile.setFatTarget(
                data.getFatTarget()
            );


            if (
                profile.getId() == null
            ) {

                entityManager.persist(
                    profile
                );

            }


            transaction.commit();

            return profile;

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