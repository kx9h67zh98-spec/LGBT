package com.fithealth.dao;

import com.fithealth.model.Exercise;
import com.fithealth.util.JPAUtil;
import jakarta.persistence.EntityManager;

import java.util.List;

public class ExerciseDAO {

    public List<Exercise> findAll() {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager
                .createQuery(
                    "SELECT e FROM Exercise e " +
                    "ORDER BY e.muscleGroup, e.name",
                    Exercise.class
                )
                .getResultList();

        } finally {

            entityManager.close();

        }
    }


    public Exercise findById(
        Long id
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager.find(
                Exercise.class,
                id
            );

        } finally {

            entityManager.close();

        }
    }
}
