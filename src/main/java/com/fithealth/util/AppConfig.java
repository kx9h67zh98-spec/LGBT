package com.fithealth.util;

public final class AppConfig {

    private AppConfig() {
    }

    public static boolean
        isEmailVerificationRequired() {

        String value =
            System.getenv(
                "EMAIL_VERIFICATION_REQUIRED"
            );

        if (
            value == null
            ||
            value.isBlank()
        ) {
            return false;
        }

        return value
            .trim()
            .equalsIgnoreCase(
                "true"
            );
    }
}
