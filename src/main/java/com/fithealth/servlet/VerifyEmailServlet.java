package com.fithealth.servlet;

import com.fithealth.dao.AccountTokenDAO;
import com.fithealth.dao.UserDAO;
import com.fithealth.model.AccountToken;
import com.fithealth.util.TokenUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/auth/email/verify")
public class VerifyEmailServlet extends HttpServlet {

    private final AccountTokenDAO accountTokenDAO =
        new AccountTokenDAO();

    private final UserDAO userDAO =
        new UserDAO();

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
            TokenRequest data =
                gson.fromJson(
                    request.getReader(),
                    TokenRequest.class
                );

            String rawToken =
                clean(
                    data == null
                        ?
                        null
                        :
                        data.token
                );

            if (rawToken.isEmpty()) {
                send(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    false,
                    "Verification token is required."
                );

                return;
            }

            AccountToken token =
                accountTokenDAO.findValid(
                    TokenUtil.sha256(
                        rawToken
                    ),
                    AccountToken.PURPOSE_EMAIL_VERIFY
                );

            if (token == null) {
                send(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    false,
                    "This verification link is invalid or has expired."
                );

                return;
            }

            userDAO.markEmailVerified(
                token
                    .getUser()
                    .getId()
            );

            accountTokenDAO.markUsed(
                token.getId()
            );

            send(
                response,
                HttpServletResponse.SC_OK,
                true,
                "Email verified successfully. You can now sign in."
            );

        } catch (Exception exception) {
            exception.printStackTrace();

            send(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                false,
                "Unable to verify email."
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

    private static class TokenRequest {
        String token;
    }
}
