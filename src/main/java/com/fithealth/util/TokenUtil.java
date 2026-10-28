package com.fithealth.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public final class TokenUtil {

    private static final SecureRandom RANDOM =
        new SecureRandom();

    private TokenUtil() {
    }

    public static String generateToken() {
        byte[] bytes =
            new byte[32];

        RANDOM.nextBytes(bytes);

        return Base64
            .getUrlEncoder()
            .withoutPadding()
            .encodeToString(bytes);
    }

    public static String sha256(
        String value
    ) {
        try {
            MessageDigest digest =
                MessageDigest.getInstance(
                    "SHA-256"
                );

            byte[] bytes =
                digest.digest(
                    value.getBytes(
                        StandardCharsets.UTF_8
                    )
                );

            StringBuilder hex =
                new StringBuilder(
                    bytes.length * 2
                );

            for (byte current : bytes) {
                hex.append(
                    String.format(
                        "%02x",
                        current
                    )
                );
            }

            return hex.toString();

        } catch (
            NoSuchAlgorithmException exception
        ) {
            throw new IllegalStateException(
                "SHA-256 is unavailable.",
                exception
            );
        }
    }
}
