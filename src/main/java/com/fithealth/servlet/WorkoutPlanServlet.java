package com.fithealth.servlet;

import com.fithealth.dao.WorkoutPlanDAO;
import com.fithealth.model.Exercise;
import com.fithealth.model.WorkoutExercise;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/workout-plans")
public class WorkoutPlanServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    private final WorkoutPlanDAO workoutPlanDAO =
        new WorkoutPlanDAO();


    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        Long userId =
            getAuthenticatedUserId(
                request
            );

        if (
            userId == null
        ) {

            writeUnauthorized(
                response
            );

            return;
        }

        try {

            List<Map<String, Object>> entries =
                new ArrayList<>();

            for (
                WorkoutExercise entry :
                workoutPlanDAO
                    .findEntriesByUserId(
                        userId
                    )
            ) {

                entries.add(
                    toDto(
                        entry
                    )
                );
            }

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                Map.of(
                    "success",
                    true,
                    "entries",
                    entries
                )
            );

        } catch (RuntimeException error) {

            error.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to load workout entries."
                )
            );
        }
    }


    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        Long userId =
            getAuthenticatedUserId(
                request
            );

        if (
            userId == null
        ) {

            writeUnauthorized(
                response
            );

            return;
        }

        WorkoutRequest body =
            readBody(
                request
            );

        if (
            body == null
        ) {

            writeBadRequest(
                response,
                "Invalid request body."
            );

            return;
        }

        try {

            LocalDate date =
                LocalDate.parse(
                    safe(
                        body.date
                    )
                );

            int sets =
                positiveInt(
                    body.sets,
                    1,
                    20
                );

            int reps =
                positiveInt(
                    body.reps,
                    1,
                    100
                );

            BigDecimal weight =
                validWeight(
                    body.weight
                );

            Long exerciseId =
                body.exerciseId;

            if (
                exerciseId == null
            ) {

                if (
                    isBlank(
                        body.exerciseName
                    )
                ) {

                    writeBadRequest(
                        response,
                        "Exercise is required."
                    );

                    return;
                }

                Exercise exercise =
                    workoutPlanDAO
                        .findExerciseByNameAndMuscle(
                            body.exerciseName.trim(),
                            safe(
                                body.muscleGroup
                            )
                        );

                if (
                    exercise == null
                ) {

                    writeBadRequest(
                        response,
                        "Exercise was not found in the database."
                    );

                    return;
                }

                exerciseId =
                    exercise.getId();
            }

            WorkoutExercise saved =
                workoutPlanDAO.createEntry(
                    userId,
                    date,
                    body.workoutName,
                    exerciseId,
                    sets,
                    reps,
                    weight
                );

            writeJson(
                response,
                HttpServletResponse.SC_CREATED,
                Map.of(
                    "success",
                    true,
                    "entry",
                    toDto(
                        saved
                    )
                )
            );

        } catch (
            DateTimeParseException
            |
            IllegalArgumentException error
        ) {

            writeBadRequest(
                response,
                error.getMessage() == null
                ?
                "Invalid workout data."
                :
                error.getMessage()
            );

        } catch (RuntimeException error) {

            error.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to save workout entry."
                )
            );
        }
    }


    @Override
    protected void doPut(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        Long userId =
            getAuthenticatedUserId(
                request
            );

        if (
            userId == null
        ) {

            writeUnauthorized(
                response
            );

            return;
        }

        WorkoutRequest body =
            readBody(
                request
            );

        if (
            body == null
            ||
            body.id == null
        ) {

            writeBadRequest(
                response,
                "Workout entry id is required."
            );

            return;
        }

        try {

            LocalDate date =
                LocalDate.parse(
                    safe(
                        body.date
                    )
                );

            int sets =
                positiveInt(
                    body.sets,
                    1,
                    20
                );

            int reps =
                positiveInt(
                    body.reps,
                    1,
                    100
                );

            BigDecimal weight =
                validWeight(
                    body.weight
                );

            WorkoutExercise updated =
                workoutPlanDAO.updateEntry(
                    userId,
                    body.id,
                    date,
                    sets,
                    reps,
                    weight,
                    Boolean.TRUE.equals(
                        body.completed
                    )
                );

            if (
                updated == null
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_NOT_FOUND,
                    Map.of(
                        "success",
                        false,
                        "message",
                        "Workout entry not found."
                    )
                );

                return;
            }

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                Map.of(
                    "success",
                    true,
                    "entry",
                    toDto(
                        updated
                    )
                )
            );

        } catch (
            DateTimeParseException
            |
            IllegalArgumentException error
        ) {

            writeBadRequest(
                response,
                error.getMessage() == null
                ?
                "Invalid workout data."
                :
                error.getMessage()
            );

        } catch (RuntimeException error) {

            error.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to update workout entry."
                )
            );
        }
    }


    @Override
    protected void doDelete(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        Long userId =
            getAuthenticatedUserId(
                request
            );

        if (
            userId == null
        ) {

            writeUnauthorized(
                response
            );

            return;
        }

        Long id =
            parseLong(
                request.getParameter(
                    "id"
                )
            );

        if (
            id == null
            ||
            id <= 0
        ) {

            writeBadRequest(
                response,
                "A valid workout entry id is required."
            );

            return;
        }

        try {

            boolean deleted =
                workoutPlanDAO.deleteEntry(
                    userId,
                    id
                );

            if (
                !deleted
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_NOT_FOUND,
                    Map.of(
                        "success",
                        false,
                        "message",
                        "Workout entry not found."
                    )
                );

                return;
            }

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                Map.of(
                    "success",
                    true
                )
            );

        } catch (RuntimeException error) {

            error.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to delete workout entry."
                )
            );
        }
    }


    private Map<String, Object> toDto(
        WorkoutExercise entry
    ) {

        Map<String, Object> dto =
            new LinkedHashMap<>();

        dto.put(
            "id",
            entry.getId()
        );

        dto.put(
            "workoutId",
            entry
                .getWorkoutPlan()
                .getId()
        );

        dto.put(
            "date",
            entry
                .getWorkoutPlan()
                .getWorkoutDate()
                .toString()
        );

        dto.put(
            "workoutName",
            entry
                .getWorkoutPlan()
                .getWorkoutName()
        );

        dto.put(
            "exerciseId",
            entry
                .getExercise()
                .getId()
        );

        dto.put(
            "exerciseName",
            entry
                .getExercise()
                .getName()
        );

        dto.put(
            "name",
            entry
                .getExercise()
                .getName()
        );

        dto.put(
            "primaryMuscle",
            entry
                .getExercise()
                .getMuscleGroup()
        );

        dto.put(
            "muscleGroup",
            entry
                .getExercise()
                .getMuscleGroup()
        );

        dto.put(
            "equipment",
            entry
                .getExercise()
                .getEquipment()
        );

        dto.put(
            "difficulty",
            entry
                .getExercise()
                .getDifficulty()
        );

        dto.put(
            "exerciseType",
            entry
                .getExercise()
                .getExerciseType()
        );

        dto.put(
            "sets",
            entry.getSets()
        );

        dto.put(
            "reps",
            entry.getReps()
        );

        dto.put(
            "weight",
            entry.getWeight()
        );

        dto.put(
            "completed",
            Boolean.TRUE.equals(
                entry.getCompleted()
            )
        );

        return dto;
    }


    private Long getAuthenticatedUserId(
        HttpServletRequest request
    ) {

        HttpSession session =
            request.getSession(
                false
            );

        if (
            session == null
        ) {

            return null;
        }

        Object value =
            session.getAttribute(
                "userId"
            );

        return value instanceof Number
            ?
            ((Number) value).longValue()
            :
            null;
    }


    private WorkoutRequest readBody(
        HttpServletRequest request
    ) {

        try (
            BufferedReader reader =
                request.getReader()
        ) {

            return gson.fromJson(
                reader,
                WorkoutRequest.class
            );

        } catch (
            RuntimeException
            |
            IOException error
        ) {

            return null;
        }
    }


    private int positiveInt(
        Integer value,
        int min,
        int max
    ) {

        if (
            value == null
            ||
            value < min
            ||
            value > max
        ) {

            throw new IllegalArgumentException(
                "Sets or reps are outside the allowed range."
            );
        }

        return value;
    }


    private BigDecimal validWeight(
        BigDecimal value
    ) {

        BigDecimal weight =
            value == null
            ?
            BigDecimal.ZERO
            :
            value;

        if (
            weight.compareTo(
                BigDecimal.ZERO
            ) < 0
            ||
            weight.compareTo(
                new BigDecimal(
                    "999999.99"
                )
            ) > 0
        ) {

            throw new IllegalArgumentException(
                "Weight must be zero or greater."
            );
        }

        return weight.setScale(
            2,
            RoundingMode.HALF_UP
        );
    }


    private Long parseLong(
        String value
    ) {

        try {

            return value == null
                ?
                null
                :
                Long.valueOf(
                    value
                );

        } catch (
            NumberFormatException error
        ) {

            return null;
        }
    }


    private String safe(
        String value
    ) {

        return value == null
            ?
            ""
            :
            value.trim();
    }


    private boolean isBlank(
        String value
    ) {

        return value == null
            ||
            value.isBlank();
    }


    private void writeUnauthorized(
        HttpServletResponse response
    ) throws IOException {

        writeJson(
            response,
            HttpServletResponse.SC_UNAUTHORIZED,
            Map.of(
                "success",
                false,
                "message",
                "Not authenticated."
            )
        );
    }


    private void writeBadRequest(
        HttpServletResponse response,
        String message
    ) throws IOException {

        writeJson(
            response,
            HttpServletResponse.SC_BAD_REQUEST,
            Map.of(
                "success",
                false,
                "message",
                message
            )
        );
    }


    private void writeJson(
        HttpServletResponse response,
        int status,
        Object body
    ) throws IOException {

        response.setStatus(
            status
        );

        response.setContentType(
            "application/json"
        );

        response.setCharacterEncoding(
            "UTF-8"
        );

        response
            .getWriter()
            .write(
                gson.toJson(
                    body
                )
            );
    }


    private static class WorkoutRequest {

        private Long id;

        private Long exerciseId;

        private String exerciseName;

        private String muscleGroup;

        private String date;

        private String workoutName;

        private Integer sets;

        private Integer reps;

        private BigDecimal weight;

        private Boolean completed;
    }
}
