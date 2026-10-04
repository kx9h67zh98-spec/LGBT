package com.fithealth.dao;

import com.fithealth.model.User;
import com.fithealth.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;

public class UserDAO {

    public User findByEmail(String email) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager
                .createQuery(
                    """
                    SELECT u
                    FROM User u
                    WHERE LOWER(u.email) = LOWER(:email)
                    """,
                    User.class
                )
                .setParameter("email", email)
                .getSingleResult();

        } catch (NoResultException exception) {

            return null;

        } finally {

            entityManager.close();
        }
    }

    public boolean existsByEmail(String email) {

        return findByEmail(email) != null;
    }

    public User save(User user) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            entityManager.persist(user);

            transaction.commit();

            return user;

        } catch (RuntimeException exception) {

            if (transaction.isActive()) {
                transaction.rollback();
            }

            throw exception;

        } finally {

            entityManager.close();
        }
    }
}