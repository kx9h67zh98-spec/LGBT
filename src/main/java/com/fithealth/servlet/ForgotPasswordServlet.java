package com.fithealth.servlet;

import com.fithealth.dao.AccountTokenDAO;
import com.fithealth.dao.UserDAO;
import com.fithealth.model.AccountToken;
import com.fithealth.model.User;
import com.fithealth.util.MailService;
import com.fithealth.util.TokenUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;

@WebServlet("/api/auth/password/forgot")
public class ForgotPasswordServlet extends HttpServlet {

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

        String genericMessage =
            "If an account exists for that email, a password reset link will be sent.";

        try {
            EmailRequest data =
                gson.fromJson(
                    request.getReader(),
                    EmailRequest.class
                );

            String email =
                clean(
                    data == null
                        ?
                        null
                        :
                        data.email
                )
                .toLowerCase();

            if (!email.isEmpty()) {
                User user =
                    userDAO.findByEmail(
                        email
                    );

                if (user != null) {
                    String rawToken =
                        TokenUtil.generateToken();

                    accountTokenDAO.create(
                        user.getId(),
                        AccountToken.PURPOSE_PASSWORD_RESET,
                        TokenUtil.sha256(
                            rawToken
                        ),
                        LocalDateTime.now()
                            .plusMinutes(30)
                    );

                    mailService.sendPasswordResetEmail(
                        user,
                        rawToken
                    );
                }
            }

            sendSuccess(
                response,
                genericMessage
            );

        } catch (Exception exception) {
            exception.printStackTrace();

            sendSuccess(
                response,
                genericMessage
            );
        }
    }

    private void sendSuccess(
        HttpServletResponse response,
        String message
    ) throws IOException {

        response.setStatus(
            HttpServletResponse.SC_OK
        );

        JsonObject json =
            new JsonObject();

        json.addProperty(
            "success",
            true
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

    private static class EmailRequest {
        String email;
    }
}
