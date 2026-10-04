package com.fithealth.dao;

import com.fithealth.model.Food;
import com.fithealth.model.MealEntry;
import com.fithealth.model.User;
import com.fithealth.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;

import java.time.LocalDate;
import java.util.List;

public class MealEntryDAO {

    public List<MealEntry> findByUserAndDate(
        Long userId,
        LocalDate entryDate
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager
                .createQuery(
                    "SELECT m " +
                    "FROM MealEntry m " +
                    "LEFT JOIN FETCH m.food " +
                    "WHERE m.user.id = :userId " +
                    "AND m.entryDate = :entryDate " +
                    "ORDER BY m.createdAt, m.id",
                    MealEntry.class
                )
                .setParameter(
                    "userId",
                    userId
                )
                .setParameter(
                    "entryDate",
                    entryDate
                )
                .getResultList();

        } finally {

            entityManager.close();
        }
    }

    public MealEntry create(
        Long userId,
        Long foodId,
        MealEntry entry
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            entry.setUser(
                entityManager.getReference(
                    User.class,
                    userId
                )
            );

            entry.setFood(
                entityManager.getReference(
                    Food.class,
                    foodId
                )
            );

            entityManager.persist(entry);
            entityManager.flush();
            entityManager.refresh(entry);

            transaction.commit();

            return entry;

        } catch (RuntimeException exception) {

            if (transaction.isActive()) {
                transaction.rollback();
            }

            throw exception;

        } finally {

            entityManager.close();
        }
    }

    public MealEntry update(
        Long id,
        Long userId,
        Long foodId,
        MealEntry data
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            MealEntry existing;

            try {

                existing =
                    entityManager
                        .createQuery(
                            "SELECT m FROM MealEntry m " +
                            "WHERE m.id = :id " +
                            "AND m.user.id = :userId",
                            MealEntry.class
                        )
                        .setParameter("id", id)
                        .setParameter("userId", userId)
                        .getSingleResult();

            } catch (NoResultException exception) {

                transaction.rollback();
                return null;
            }

            existing.setFood(
                entityManager.getReference(
                    Food.class,
                    foodId
                )
            );

            existing.setEntryDate(
                data.getEntryDate()
            );

            existing.setMealType(
                data.getMealType()
            );

            existing.setFoodName(
                data.getFoodName()
            );

            existing.setAmount(
                data.getAmount()
            );

            existing.setUnit(
                data.getUnit()
            );

            existing.setCookingMethod(
                data.getCookingMethod()
            );

            existing.setPreparation(
                data.getPreparation()
            );

            existing.setOilAmount(
                data.getOilAmount()
            );

            existing.setCalories(
                data.getCalories()
            );

            existing.setProtein(
                data.getProtein()
            );

            existing.setCarbs(
                data.getCarbs()
            );

            existing.setFat(
                data.getFat()
            );

            entityManager.flush();

            transaction.commit();

            return existing;

        } catch (RuntimeException exception) {

            if (transaction.isActive()) {
                transaction.rollback();
            }

            throw exception;

        } finally {

            entityManager.close();
        }
    }

    public boolean delete(
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
                        "DELETE FROM MealEntry m " +
                        "WHERE m.id = :id " +
                        "AND m.user.id = :userId"
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
