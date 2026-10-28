package com.fithealth.util;

import java.nio.charset.StandardCharsets;

public final class PasswordPolicy {

    private PasswordPolicy() {
    }

    public static String validate(
        String password
    ) {
        if (
            password == null
            ||
            password.isEmpty()
        ) {
            return "Password is required.";
        }

        if (password.length() < 8) {
            return "Password must contain at least 8 characters.";
        }

        if (
            password
                .getBytes(
                    StandardCharsets.UTF_8
                )
                .length > 72
        ) {
            return "Password must be 72 UTF-8 bytes or fewer.";
        }

        if (
            !password.matches(
                ".*[A-Za-z].*"
            )
            ||
            !password.matches(
                ".*\\d.*"
            )
        ) {
            return "Password must contain at least one letter and one number.";
        }

        return null;
    }
}
