package com.fithealth.dao;

import com.fithealth.model.AccountToken;
import com.fithealth.model.User;
import com.fithealth.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;

import java.time.LocalDateTime;

public class AccountTokenDAO {

    public AccountToken create(
        Long userId,
        String purpose,
        String tokenHash,
        LocalDateTime expiresAt
    ) {
        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {
            transaction.begin();

            LocalDateTime now =
                LocalDateTime.now();

            entityManager
                .createQuery(
                    """
                    UPDATE AccountToken token
                    SET token.usedAt = :now
                    WHERE token.user.id = :userId
                      AND token.purpose = :purpose
                      AND token.usedAt IS NULL
                    """
                )
                .setParameter("now", now)
                .setParameter("userId", userId)
                .setParameter("purpose", purpose)
                .executeUpdate();

            User user =
                entityManager.getReference(
                    User.class,
                    userId
                );

            AccountToken token =
                new AccountToken(
                    user,
                    tokenHash,
                    purpose,
                    expiresAt
                );

            entityManager.persist(token);
            transaction.commit();

            return token;

        } catch (RuntimeException exception) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw exception;
        } finally {
            entityManager.close();
        }
    }

    public AccountToken findValid(
        String tokenHash,
        String purpose
    ) {
        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {
            return entityManager
                .createQuery(
                    """
                    SELECT token
                    FROM AccountToken token
                    JOIN FETCH token.user
                    WHERE token.tokenHash = :tokenHash
                      AND token.purpose = :purpose
                      AND token.usedAt IS NULL
                      AND token.expiresAt > :now
                    """,
                    AccountToken.class
                )
                .setParameter(
                    "tokenHash",
                    tokenHash
                )
                .setParameter(
                    "purpose",
                    purpose
                )
                .setParameter(
                    "now",
                    LocalDateTime.now()
                )
                .getSingleResult();

        } catch (NoResultException exception) {
            return null;
        } finally {
            entityManager.close();
        }
    }

    public void markUsed(
        Long tokenId
    ) {
        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {
            transaction.begin();

            entityManager
                .createQuery(
                    """
                    UPDATE AccountToken token
                    SET token.usedAt = :now
                    WHERE token.id = :tokenId
                      AND token.usedAt IS NULL
                    """
                )
                .setParameter(
                    "now",
                    LocalDateTime.now()
                )
                .setParameter(
                    "tokenId",
                    tokenId
                )
                .executeUpdate();

            transaction.commit();

        } catch (RuntimeException exception) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw exception;
        } finally {
            entityManager.close();
        }
    }

    public void invalidateForUser(
        Long userId,
        String purpose
    ) {
        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {
            transaction.begin();

            entityManager
                .createQuery(
                    """
                    UPDATE AccountToken token
                    SET token.usedAt = :now
                    WHERE token.user.id = :userId
                      AND token.purpose = :purpose
                      AND token.usedAt IS NULL
                    """
                )
                .setParameter(
                    "now",
                    LocalDateTime.now()
                )
                .setParameter(
                    "userId",
                    userId
                )
                .setParameter(
                    "purpose",
                    purpose
                )
                .executeUpdate();

            transaction.commit();

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
