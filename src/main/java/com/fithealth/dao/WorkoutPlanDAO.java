package com.fithealth.dao;

import com.fithealth.model.Exercise;
import com.fithealth.model.User;
import com.fithealth.model.WorkoutExercise;
import com.fithealth.model.WorkoutPlan;
import com.fithealth.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class WorkoutPlanDAO {

    public List<WorkoutExercise> findEntriesByUserId(
        Long userId
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            return entityManager
                .createQuery(
                    "SELECT we " +
                    "FROM WorkoutExercise we " +
                    "JOIN FETCH we.workoutPlan wp " +
                    "JOIN FETCH we.exercise e " +
                    "WHERE wp.user.id = :userId " +
                    "ORDER BY wp.workoutDate ASC, we.id ASC",
                    WorkoutExercise.class
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


    public WorkoutExercise createEntry(
        Long userId,
        LocalDate workoutDate,
        String workoutName,
        Long exerciseId,
        int sets,
        int reps,
        BigDecimal weight
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            WorkoutPlan plan =
                findOrCreatePlan(
                    entityManager,
                    userId,
                    workoutDate,
                    workoutName
                );

            Exercise exercise =
                entityManager.find(
                    Exercise.class,
                    exerciseId
                );

            if (
                exercise == null
            ) {

                throw new IllegalArgumentException(
                    "Exercise not found."
                );

            }

            WorkoutExercise entry =
                new WorkoutExercise();

            entry.setWorkoutPlan(
                plan
            );

            entry.setExercise(
                exercise
            );

            entry.setSets(
                sets
            );

            entry.setReps(
                reps
            );

            entry.setWeight(
                weight
            );

            entry.setCompleted(
                false
            );

            entityManager.persist(
                entry
            );

            entityManager.flush();

            transaction.commit();

            return entry;

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


    public WorkoutExercise updateEntry(
        Long userId,
        Long entryId,
        LocalDate workoutDate,
        int sets,
        int reps,
        BigDecimal weight,
        boolean completed
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            List<WorkoutExercise> matches =
                entityManager
                    .createQuery(
                        "SELECT we " +
                        "FROM WorkoutExercise we " +
                        "JOIN FETCH we.workoutPlan wp " +
                        "JOIN FETCH we.exercise e " +
                        "WHERE we.id = :entryId " +
                        "AND wp.user.id = :userId",
                        WorkoutExercise.class
                    )
                    .setParameter(
                        "entryId",
                        entryId
                    )
                    .setParameter(
                        "userId",
                        userId
                    )
                    .getResultList();

            if (
                matches.isEmpty()
            ) {

                transaction.rollback();
                return null;

            }

            WorkoutExercise entry =
                matches.get(0);

            WorkoutPlan oldPlan =
                entry.getWorkoutPlan();

            if (
                !oldPlan
                    .getWorkoutDate()
                    .equals(
                        workoutDate
                    )
            ) {

                WorkoutPlan newPlan =
                    findOrCreatePlan(
                        entityManager,
                        userId,
                        workoutDate,
                        "Training"
                    );

                entry.setWorkoutPlan(
                    newPlan
                );

            }

            entry.setSets(
                sets
            );

            entry.setReps(
                reps
            );

            entry.setWeight(
                weight
            );

            entry.setCompleted(
                completed
            );

            entityManager.flush();

            refreshPlanCompleted(
                entityManager,
                entry.getWorkoutPlan()
            );

            if (
                oldPlan.getId() != null
                &&
                !oldPlan
                    .getId()
                    .equals(
                        entry
                            .getWorkoutPlan()
                            .getId()
                    )
            ) {

                removePlanIfEmpty(
                    entityManager,
                    oldPlan
                );

            }

            transaction.commit();

            return entry;

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


    public boolean deleteEntry(
        Long userId,
        Long entryId
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        EntityTransaction transaction =
            entityManager.getTransaction();

        try {

            transaction.begin();

            List<WorkoutExercise> matches =
                entityManager
                    .createQuery(
                        "SELECT we " +
                        "FROM WorkoutExercise we " +
                        "JOIN FETCH we.workoutPlan wp " +
                        "WHERE we.id = :entryId " +
                        "AND wp.user.id = :userId",
                        WorkoutExercise.class
                    )
                    .setParameter(
                        "entryId",
                        entryId
                    )
                    .setParameter(
                        "userId",
                        userId
                    )
                    .getResultList();

            if (
                matches.isEmpty()
            ) {

                transaction.rollback();
                return false;

            }

            WorkoutExercise entry =
                matches.get(0);

            WorkoutPlan plan =
                entry.getWorkoutPlan();

            entityManager.remove(
                entry
            );

            entityManager.flush();

            removePlanIfEmpty(
                entityManager,
                plan
            );

            transaction.commit();

            return true;

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


    public Exercise findExerciseByNameAndMuscle(
        String name,
        String muscleGroup
    ) {

        EntityManager entityManager =
            JPAUtil.getEntityManager();

        try {

            List<Exercise> result =
                entityManager
                    .createQuery(
                        "SELECT e " +
                        "FROM Exercise e " +
                        "WHERE LOWER(e.name) = LOWER(:name) " +
                        "AND LOWER(e.muscleGroup) = LOWER(:muscleGroup) " +
                        "ORDER BY e.id",
                        Exercise.class
                    )
                    .setParameter(
                        "name",
                        name
                    )
                    .setParameter(
                        "muscleGroup",
                        muscleGroup
                    )
                    .setMaxResults(
                        1
                    )
                    .getResultList();

            if (
                !result.isEmpty()
            ) {

                return result.get(0);

            }

            List<Exercise> fallback =
                entityManager
                    .createQuery(
                        "SELECT e " +
                        "FROM Exercise e " +
                        "WHERE LOWER(e.name) = LOWER(:name) " +
                        "ORDER BY e.id",
                        Exercise.class
                    )
                    .setParameter(
                        "name",
                        name
                    )
                    .setMaxResults(
                        1
                    )
                    .getResultList();

            return fallback.isEmpty()
                ?
                null
                :
                fallback.get(0);

        } finally {

            entityManager.close();

        }
    }


    private WorkoutPlan findOrCreatePlan(
        EntityManager entityManager,
        Long userId,
        LocalDate workoutDate,
        String workoutName
    ) {

        List<WorkoutPlan> plans =
            entityManager
                .createQuery(
                    "SELECT wp " +
                    "FROM WorkoutPlan wp " +
                    "WHERE wp.user.id = :userId " +
                    "AND wp.workoutDate = :workoutDate " +
                    "ORDER BY wp.id",
                    WorkoutPlan.class
                )
                .setParameter(
                    "userId",
                    userId
                )
                .setParameter(
                    "workoutDate",
                    workoutDate
                )
                .setMaxResults(
                    1
                )
                .getResultList();

        if (
            !plans.isEmpty()
        ) {

            return plans.get(0);

        }

        User user =
            entityManager.getReference(
                User.class,
                userId
            );

        WorkoutPlan plan =
            new WorkoutPlan();

        plan.setUser(
            user
        );

        plan.setWorkoutDate(
            workoutDate
        );

        plan.setWorkoutName(
            workoutName == null
            ||
            workoutName.isBlank()
            ?
            "Training"
            :
            workoutName.trim()
        );

        plan.setCompleted(
            false
        );

        entityManager.persist(
            plan
        );

        entityManager.flush();

        return plan;
    }


    private void refreshPlanCompleted(
        EntityManager entityManager,
        WorkoutPlan plan
    ) {

        Long total =
            entityManager
                .createQuery(
                    "SELECT COUNT(we) " +
                    "FROM WorkoutExercise we " +
                    "WHERE we.workoutPlan.id = :planId",
                    Long.class
                )
                .setParameter(
                    "planId",
                    plan.getId()
                )
                .getSingleResult();

        Long completed =
            entityManager
                .createQuery(
                    "SELECT COUNT(we) " +
                    "FROM WorkoutExercise we " +
                    "WHERE we.workoutPlan.id = :planId " +
                    "AND we.completed = true",
                    Long.class
                )
                .setParameter(
                    "planId",
                    plan.getId()
                )
                .getSingleResult();

        plan.setCompleted(
            total > 0
            &&
            total.equals(
                completed
            )
        );
    }


    private void removePlanIfEmpty(
        EntityManager entityManager,
        WorkoutPlan plan
    ) {

        Long count =
            entityManager
                .createQuery(
                    "SELECT COUNT(we) " +
                    "FROM WorkoutExercise we " +
                    "WHERE we.workoutPlan.id = :planId",
                    Long.class
                )
                .setParameter(
                    "planId",
                    plan.getId()
                )
                .getSingleResult();

        if (
            count == 0
        ) {

            WorkoutPlan managed =
                entityManager.find(
                    WorkoutPlan.class,
                    plan.getId()
                );

            if (
                managed != null
            ) {

                entityManager.remove(
                    managed
                );

            }

        } else {

            refreshPlanCompleted(
                entityManager,
                plan
            );

        }
    }
}
