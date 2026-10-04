package com.fithealth.servlet;

import com.fithealth.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/database-test")
public class DatabaseTestServlet
        extends HttpServlet {

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

        EntityManager entityManager = null;

        try {

            entityManager =
                JPAUtil.getEntityManager();

            Long userCount =
                entityManager
                    .createQuery(
                        "SELECT COUNT(u) FROM User u",
                        Long.class
                    )
                    .getSingleResult();

            response.getWriter().write(
                "{"
                + "\"success\":true,"
                + "\"database\":\"fithealth\","
                + "\"users\":"
                + userCount
                + "}"
            );

        } catch (Exception exception) {

            exception.printStackTrace();

            response.setStatus(
                HttpServletResponse
                    .SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(
                "{"
                + "\"success\":false,"
                + "\"message\":\"Database connection failed\""
                + "}"
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