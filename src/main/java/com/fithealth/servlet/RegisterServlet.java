package com.fithealth.servlet;

import com.fithealth.dao.AccountTokenDAO;
import com.fithealth.dao.UserDAO;
import com.fithealth.model.AccountToken;
import com.fithealth.model.User;
import com.fithealth.util.AppConfig;
import com.fithealth.util.MailService;
import com.fithealth.util.PasswordPolicy;
import com.fithealth.util.TokenUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.mindrot.jbcrypt.BCrypt;

import java.io.IOException;
import java.time.LocalDateTime;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    private final UserDAO userDAO =
        new UserDAO();

    private final AccountTokenDAO accountTokenDAO =
        new AccountTokenDAO();

    private final MailService mailService =
        new MailService();

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

        response.setHeader(
            "Cache-Control",
            "no-store"
        );

        try {

            RegisterRequest data =
                gson.fromJson(
                    request.getReader(),
                    RegisterRequest.class
                );

            if (data == null) {

                sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid request."
                );

                return;
            }

            String firstName =
                clean(data.firstName);

            String lastName =
                clean(data.lastName);

            String email =
                clean(data.email)
                    .toLowerCase();

            String password =
                data.password == null
                    ? ""
                    : data.password;

            /* Validation */
            if (
                firstName.isEmpty()
                ||
                lastName.isEmpty()
                ||
                email.isEmpty()
                ||
                password.isEmpty()
            ) {

                sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Please fill in all required fields."
                );

                return;
            }

            if (
                firstName.length() > 100
                ||
                lastName.length() > 100
            ) {

                sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Name is too long."
                );

                return;
            }

            if (
                !email.matches(
                    "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
                )
            ) {

                sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid email address."
                );

                return;
            }

            if (email.length() > 255) {

                sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Email is too long."
                );

                return;
            }

            String passwordError =
                PasswordPolicy.validate(
                    password
                );

            if (passwordError != null) {
                sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    passwordError
                );

                return;
            }


            /* Duplicate Email */
            if (
                userDAO.existsByEmail(
                    email
                )
            ) {

                sendError(
                    response,
                    HttpServletResponse.SC_CONFLICT,
                    "Email is already registered."
                );

                return;
            }

            /* BCrypt */
            String passwordHash =
                BCrypt.hashpw(
                    password,
                    BCrypt.gensalt(12)
                );

            /* Create User */
            User user =
                new User(
                    firstName,
                    lastName,
                    email,
                    passwordHash
                );

            /* Save with JPA */
            userDAO.save(user);

            String rawVerificationToken =
                TokenUtil.generateToken();

            accountTokenDAO.create(
                user.getId(),
                AccountToken.PURPOSE_EMAIL_VERIFY,
                TokenUtil.sha256(
                    rawVerificationToken
                ),
                LocalDateTime.now()
                    .plusHours(24)
            );

            boolean verificationEmailSent =
                mailService.sendVerificationEmail(
                    user,
                    rawVerificationToken
                );

            boolean verificationRequired =
                AppConfig.isEmailVerificationRequired();

            JsonObject json =
                new JsonObject();

            json.addProperty(
                "success",
                true
            );

            json.addProperty(
                "message",
                verificationRequired
                    ?
                    (
                        verificationEmailSent
                            ?
                            "Account created. Check your email to verify your account."
                            :
                            "Account created. Email verification is required, but SMTP is not configured to deliver the verification link."
                    )
                    :
                    "Account created successfully. Email verification is available but not currently required."
            );

            json.addProperty(
                "emailVerificationRequired",
                verificationRequired
            );

            json.addProperty(
                "verificationEmailSent",
                verificationEmailSent
            );

            json.addProperty(
                "userId",
                user.getId()
            );

            response.setStatus(
                HttpServletResponse.SC_CREATED
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
                "Unable to create account."
            );
        }
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

        response.setStatus(status);

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

    private static class RegisterRequest {

        String firstName;
        String lastName;
        String email;
        String password;
    }
}