package com.fithealth.servlet;

import com.fithealth.dao.ExerciseDAO;
import com.fithealth.model.Exercise;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/exercises")
public class ExerciseServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    private final ExerciseDAO exerciseDAO =
        new ExerciseDAO();


    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        if (
            getAuthenticatedUserId(
                request
            ) == null
        ) {

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

            return;
        }

        try {

            List<Map<String, Object>> entries =
                new ArrayList<>();

            for (
                Exercise exercise :
                exerciseDAO.findAll()
            ) {

                Map<String, Object> item =
                    new LinkedHashMap<>();

                item.put(
                    "id",
                    exercise.getId()
                );

                item.put(
                    "name",
                    exercise.getName()
                );

                item.put(
                    "muscleGroup",
                    exercise.getMuscleGroup()
                );

                item.put(
                    "equipment",
                    exercise.getEquipment()
                );

                item.put(
                    "difficulty",
                    exercise.getDifficulty()
                );

                item.put(
                    "exerciseType",
                    exercise.getExerciseType()
                );

                item.put(
                    "videoUrl",
                    exercise.getVideoUrl()
                );

                entries.add(
                    item
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
                    "Unable to load exercises."
                )
            );
        }
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
}
