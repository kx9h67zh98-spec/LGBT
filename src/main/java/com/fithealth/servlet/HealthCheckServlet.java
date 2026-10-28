package com.fithealth.servlet;

import com.fithealth.util.JPAUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.persistence.EntityManager;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/health")
public class HealthCheckServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        response.setContentType(
            "application/json"
        );

        response.setCharacterEncoding(
            "UTF-8"
        );

        response.setHeader(
            "Cache-Control",
            "no-store"
        );

        EntityManager entityManager =
            null;

        try {
            entityManager =
                JPAUtil.getEntityManager();

            entityManager
                .createNativeQuery(
                    "SELECT 1"
                )
                .getSingleResult();

            JsonObject json =
                new JsonObject();

            json.addProperty(
                "status",
                "ok"
            );

            response.setStatus(
                HttpServletResponse.SC_OK
            );

            response
                .getWriter()
                .write(
                    gson.toJson(
                        json
                    )
                );

        } catch (Exception exception) {
            JsonObject json =
                new JsonObject();

            json.addProperty(
                "status",
                "unhealthy"
            );

            response.setStatus(
                HttpServletResponse.SC_SERVICE_UNAVAILABLE
            );

            response
                .getWriter()
                .write(
                    gson.toJson(
                        json
                    )
                );

        } finally {
            if (
                entityManager != null
                &&
                entityManager.isOpen()
            ) {
                entityManager.close();
            }
        }
    }
}
