package com.fithealth.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/api/auth/me")
public class AuthMeServlet extends HttpServlet {

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

        HttpSession session =
            request.getSession(false);

        if (
            session == null
            ||
            session.getAttribute("userId") == null
        ) {

            response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
            );

            JsonObject json =
                new JsonObject();

            json.addProperty(
                "success",
                false
            );

            json.addProperty(
                "authenticated",
                false
            );

            json.addProperty(
                "message",
                "Not authenticated."
            );

            response.getWriter().write(
                gson.toJson(json)
            );

            return;
        }

        JsonObject user =
            new JsonObject();

        user.addProperty(
            "id",
            (Long) session.getAttribute(
                "userId"
            )
        );

        user.addProperty(
            "email",
            (String) session.getAttribute(
                "userEmail"
            )
        );

        user.addProperty(
            "firstName",
            (String) session.getAttribute(
                "firstName"
            )
        );

        user.addProperty(
            "lastName",
            (String) session.getAttribute(
                "lastName"
            )
        );

        JsonObject json =
            new JsonObject();

        json.addProperty(
            "success",
            true
        );

        json.addProperty(
            "authenticated",
            true
        );

        json.add(
            "user",
            user
        );

        response.getWriter().write(
            gson.toJson(json)
        );
    }
}