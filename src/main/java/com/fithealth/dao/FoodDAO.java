package com.fithealth.dao;

import com.fithealth.model.Food;
import com.fithealth.util.JPAUtil;
import jakarta.persistence.EntityManager;

import java.util.List;

public class FoodDAO {

    public List<Food> findAll() {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager
                .createQuery(
                    "SELECT f FROM Food f ORDER BY f.category, f.name",
                    Food.class
                )
                .getResultList();

        } finally {

            entityManager.close();
        }
    }

    public Food findById(Long id) {

        if (id == null) {
            return null;
        }

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager.find(
                Food.class,
                id
            );

        } finally {

            entityManager.close();
        }
    }
}
