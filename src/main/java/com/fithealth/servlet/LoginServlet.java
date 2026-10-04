package com.fithealth.servlet;

import com.fithealth.dao.UserDAO;
import com.fithealth.model.User;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.mindrot.jbcrypt.BCrypt;

import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private final UserDAO userDAO =
        new UserDAO();

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

        try {

            LoginRequest data =
                readRequest(request);

            if (data == null) {

                sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid request."
                );

                return;
            }

            String email =
                clean(data.email)
                    .toLowerCase();

            String password =
                data.password == null
                    ? ""
                    : data.password;

            if (
                email.isEmpty()
                ||
                password.isEmpty()
            ) {

                sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Email and password are required."
                );

                return;
            }

            User user =
                userDAO.findByEmail(
                    email
                );

            if (
                user == null
                ||
                !BCrypt.checkpw(
                    password,
                    user.getPasswordHash()
                )
            ) {

                sendError(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid email or password."
                );

                return;
            }

            /* Create Session */
            HttpSession oldSession =
                request.getSession(false);

            if (oldSession != null) {
                oldSession.invalidate();
            }

            HttpSession session = 
                request.getSession(true);

            session.setAttribute(
                "userId",
                user.getId()
            );

            session.setAttribute(
                "userEmail",
                user.getEmail()
            );

            session.setAttribute(
                "firstName",
                user.getFirstName()
            );

            session.setAttribute(
                "lastName",
                user.getLastName()
            );

            session.setMaxInactiveInterval(
                30 * 60
            );

            /* JSON Response */
            JsonObject userJson =
                new JsonObject();

            userJson.addProperty(
                "id",
                user.getId()
            );

            userJson.addProperty(
                "firstName",
                user.getFirstName()
            );

            userJson.addProperty(
                "lastName",
                user.getLastName()
            );

            userJson.addProperty(
                "email",
                user.getEmail()
            );

            JsonObject json =
                new JsonObject();

            json.addProperty(
                "success",
                true
            );

            json.addProperty(
                "message",
                "Login successful."
            );

            json.add(
                "user",
                userJson
            );

            response.setStatus(
                HttpServletResponse.SC_OK
            );

            response
                .getWriter()
                .write(
                    gson.toJson(json)
                );

        } catch (Exception exception) {

            exception.printStackTrace();

            sendError(
                response,
                HttpServletResponse
                    .SC_INTERNAL_SERVER_ERROR,
                "Unable to login."
            );
        }
    }

    private LoginRequest readRequest(
        HttpServletRequest request
    ) throws IOException {

        String contentType =
            request.getContentType();

        if (
            contentType != null
            &&
            contentType.contains(
                "application/json"
            )
        ) {

            return gson.fromJson(
                request.getReader(),
                LoginRequest.class
            );
        }

        LoginRequest data =
            new LoginRequest();

        data.email =
            request.getParameter(
                "email"
            );

        data.password =
            request.getParameter(
                "password"
            );

        return data;
    }

    private String clean(
        String value
    ) {

        if (value == null) {
            return "";
        }

        return value.trim();
    }

    private void sendError(
        HttpServletResponse response,
        int status,
        String message
    ) throws IOException {

        response.setStatus(
            status
        );

        JsonObject json =
            new JsonObject();

        json.addProperty(
            "success",
            false
        );

        json.addProperty(
            "message",
            message
        );

        response
            .getWriter()
            .write(
                gson.toJson(json)
            );
    }

    private static class LoginRequest {

        String email;
        String password;
    }
}