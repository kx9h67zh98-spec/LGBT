package com.fithealth.util;

import com.fithealth.model.User;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;

public class MailService {

    private final String host;
    private final int port;
    private final String username;
    private final String password;
    private final String from;
    private final boolean startTls;
    private final String appBaseUrl;

    public MailService() {
        this.host =
            clean(
                System.getenv(
                    "SMTP_HOST"
                )
            );

        this.port =
            parsePort(
                System.getenv(
                    "SMTP_PORT"
                )
            );

        this.username =
            clean(
                System.getenv(
                    "SMTP_USERNAME"
                )
            );

        this.password =
            clean(
                System.getenv(
                    "SMTP_PASSWORD"
                )
            );

        String configuredFrom =
            clean(
                System.getenv(
                    "SMTP_FROM"
                )
            );

        this.from =
            configuredFrom != null
                ?
                configuredFrom
                :
                username;

        this.startTls =
            !"false".equalsIgnoreCase(
                clean(
                    System.getenv(
                        "SMTP_STARTTLS"
                    )
                )
            );

        String configuredBaseUrl =
            clean(
                System.getenv(
                    "APP_BASE_URL"
                )
            );

        this.appBaseUrl =
            configuredBaseUrl != null
                ?
                stripTrailingSlash(
                    configuredBaseUrl
                )
                :
                "http://localhost:8080/FitHealth";
    }

    public boolean isConfigured() {
        return (
            host != null
            &&
            username != null
            &&
            password != null
            &&
            from != null
        );
    }

    public boolean sendVerificationEmail(
        User user,
        String rawToken
    ) {
        String url =
            appBaseUrl
            +
            "/verify-email.html?token="
            +
            rawToken;

        String subject =
            "Verify your FitHealth email";

        String text =
            "Hello "
            +
            safeName(user)
            +
            ",\n\n"
            +
            "Verify your FitHealth email by opening this link:\n"
            +
            url
            +
            "\n\nThis link expires in 24 hours and can only be used once.\n"
            +
            "If you did not create this account, you can ignore this email.";

        return send(
            user.getEmail(),
            subject,
            text
        );
    }

    public boolean sendPasswordResetEmail(
        User user,
        String rawToken
    ) {
        String url =
            appBaseUrl
            +
            "/reset-password.html?token="
            +
            rawToken;

        String subject =
            "Reset your FitHealth password";

        String text =
            "Hello "
            +
            safeName(user)
            +
            ",\n\n"
            +
            "A password reset was requested for your FitHealth account.\n"
            +
            "Open this link to choose a new password:\n"
            +
            url
            +
            "\n\nThis link expires in 30 minutes and can only be used once.\n"
            +
            "If you did not request this reset, you can ignore this email.";

        return send(
            user.getEmail(),
            subject,
            text
        );
    }

    public boolean sendPasswordChangedEmail(
        User user
    ) {
        String subject =
            "Your FitHealth password was changed";

        String text =
            "Hello "
            +
            safeName(user)
            +
            ",\n\n"
            +
            "Your FitHealth password was changed successfully.\n"
            +
            "If you did not make this change, contact your administrator and secure your email account.";

        return send(
            user.getEmail(),
            subject,
            text
        );
    }

    private boolean send(
        String recipient,
        String subject,
        String text
    ) {
        if (!isConfigured()) {
            return false;
        }

        try {
            Properties properties =
                new Properties();

            properties.put(
                "mail.smtp.auth",
                "true"
            );

            properties.put(
                "mail.smtp.starttls.enable",
                String.valueOf(
                    startTls
                )
            );

            properties.put(
                "mail.smtp.host",
                host
            );

            properties.put(
                "mail.smtp.port",
                String.valueOf(
                    port
                )
            );

            properties.put(
                "mail.smtp.connectiontimeout",
                "10000"
            );

            properties.put(
                "mail.smtp.timeout",
                "10000"
            );

            Session session =
                Session.getInstance(
                    properties,
                    new Authenticator() {
                        @Override
                        protected PasswordAuthentication
                            getPasswordAuthentication() {

                            return new PasswordAuthentication(
                                username,
                                password
                            );
                        }
                    }
                );

            MimeMessage message =
                new MimeMessage(
                    session
                );

            message.setFrom(
                new InternetAddress(
                    from
                )
            );

            message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(
                    recipient,
                    false
                )
            );

            message.setSubject(
                subject,
                "UTF-8"
            );

            message.setText(
                text,
                "UTF-8"
            );

            Transport.send(
                message
            );

            return true;

        } catch (Exception exception) {
            System.err.println(
                "FitHealth email delivery failed: "
                +
                exception.getClass().getSimpleName()
            );

            return false;
        }
    }

    private String safeName(
        User user
    ) {
        String name =
            user.getFirstName();

        return name == null
            ||
            name.isBlank()
                ?
                "FitHealth user"
                :
                name.trim();
    }

    private int parsePort(
        String value
    ) {
        if (
            value == null
            ||
            value.isBlank()
        ) {
            return 587;
        }

        try {
            return Integer.parseInt(
                value.trim()
            );
        } catch (
            NumberFormatException exception
        ) {
            return 587;
        }
    }

    private String clean(
        String value
    ) {
        if (
            value == null
            ||
            value.isBlank()
        ) {
            return null;
        }

        return value.trim();
    }

    private String stripTrailingSlash(
        String value
    ) {
        String result =
            value;

        while (
            result.endsWith("/")
        ) {
            result =
                result.substring(
                    0,
                    result.length() - 1
                );
        }

        return result;
    }
}
