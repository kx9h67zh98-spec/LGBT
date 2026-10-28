package com.fithealth.util;

import jakarta.servlet.http.HttpSession;

public final class CsrfUtil {

    public static final String SESSION_KEY =
        "csrfToken";

    private CsrfUtil() {
    }

    public static String ensureToken(
        HttpSession session
    ) {
        Object existing =
            session.getAttribute(
                SESSION_KEY
            );

        if (
            existing instanceof String token
            &&
            !token.isBlank()
        ) {
            return token;
        }

        String token =
            TokenUtil.generateToken();

        session.setAttribute(
            SESSION_KEY,
            token
        );

        return token;
    }
}
