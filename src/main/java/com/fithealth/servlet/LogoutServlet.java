package com.fithealth.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    @Override
    protected void doPost(
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

        if (session != null) {
            session.invalidate();
        }

        JsonObject json =
            new JsonObject();

        json.addProperty(
            "success",
            true
        );

        json.addProperty(
            "message",
            "Logout successful."
        );

        response.getWriter().write(
            gson.toJson(json)
        );
    }
}