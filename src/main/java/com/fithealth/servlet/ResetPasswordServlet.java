package com.fithealth.servlet;

import com.fithealth.dao.AccountTokenDAO;
import com.fithealth.dao.UserDAO;
import com.fithealth.model.AccountToken;
import com.fithealth.model.User;
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

@WebServlet("/api/auth/password/reset")
public class ResetPasswordServlet extends HttpServlet {

    private final AccountTokenDAO accountTokenDAO =
        new AccountTokenDAO();

    private final UserDAO userDAO =
        new UserDAO();

    private final MailService mailService =
        new MailService();

    private final Gson gson =
        new Gson();

    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        prepareResponse(
            response
        );

        try {
            ResetRequest data =
                gson.fromJson(
                    request.getReader(),
                    ResetRequest.class
                );

            String rawToken =
                clean(
                    data == null
                        ?
                        null
                        :
                        data.token
                );

            String password =
                data == null
                ||
                data.password == null
                    ?
                    ""
                    :
                    data.password;

            if (rawToken.isEmpty()) {
                send(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    false,
                    "Password reset token is required."
                );

                return;
            }

            String passwordError =
                PasswordPolicy.validate(
                    password
                );

            if (passwordError != null) {
                send(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    false,
                    passwordError
                );

                return;
            }

            AccountToken token =
                accountTokenDAO.findValid(
                    TokenUtil.sha256(
                        rawToken
                    ),
                    AccountToken.PURPOSE_PASSWORD_RESET
                );

            if (token == null) {
                send(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    false,
                    "This password reset link is invalid or has expired."
                );

                return;
            }

            User user =
                token.getUser();

            String passwordHash =
                BCrypt.hashpw(
                    password,
                    BCrypt.gensalt(12)
                );

            userDAO.updatePasswordHash(
                user.getId(),
                passwordHash
            );

            accountTokenDAO.invalidateForUser(
                user.getId(),
                AccountToken.PURPOSE_PASSWORD_RESET
            );

            mailService.sendPasswordChangedEmail(
                user
            );

            send(
                response,
                HttpServletResponse.SC_OK,
                true,
                "Password changed successfully. Sign in with your new password."
            );

        } catch (Exception exception) {
            exception.printStackTrace();

            send(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                false,
                "Unable to reset password."
            );
        }
    }

    private void prepareResponse(
        HttpServletResponse response
    ) {
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
    }

    private void send(
        HttpServletResponse response,
        int status,
        boolean success,
        String message
    ) throws IOException {

        response.setStatus(
            status
        );

        JsonObject json =
            new JsonObject();

        json.addProperty(
            "success",
            success
        );

        json.addProperty(
            "message",
            message
        );

        response
            .getWriter()
            .write(
                gson.toJson(
                    json
                )
            );
    }

    private String clean(
        String value
    ) {
        return value == null
            ?
            ""
            :
            value.trim();
    }

    private static class ResetRequest {
        String token;
        String password;
    }
}
