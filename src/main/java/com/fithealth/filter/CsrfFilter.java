package com.fithealth.filter;

import com.fithealth.util.CsrfUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@WebFilter("/*")
public class CsrfFilter implements Filter {

    private static final Gson GSON =
        new Gson();

    @Override
    public void doFilter(
        ServletRequest request,
        ServletResponse response,
        FilterChain chain
    ) throws IOException, ServletException {

        if (
            !(request instanceof HttpServletRequest httpRequest)
            ||
            !(response instanceof HttpServletResponse httpResponse)
        ) {
            chain.doFilter(
                request,
                response
            );

            return;
        }

        String method =
            httpRequest
                .getMethod()
                .toUpperCase();

        if (
            method.equals("GET")
            ||
            method.equals("HEAD")
            ||
            method.equals("OPTIONS")
        ) {
            chain.doFilter(
                request,
                response
            );

            return;
        }

        String origin =
            httpRequest.getHeader(
                "Origin"
            );

        if (
            origin != null
            &&
            !origin.isBlank()
            &&
            !isExpectedOrigin(
                origin,
                httpRequest
            )
        ) {
            reject(
                httpResponse,
                "Cross-site request blocked."
            );

            return;
        }

        HttpSession session =
            httpRequest.getSession(
                false
            );

        if (
            session != null
            &&
            session.getAttribute(
                "userId"
            )
            !=
            null
        ) {
            String expected =
                CsrfUtil.ensureToken(
                    session
                );

            String supplied =
                httpRequest.getHeader(
                    "X-CSRF-Token"
                );

            if (
                supplied == null
                ||
                !constantTimeEquals(
                    expected,
                    supplied
                )
            ) {
                reject(
                    httpResponse,
                    "Invalid CSRF token."
                );

                return;
            }
        }

        chain.doFilter(
            request,
            response
        );
    }

    private boolean isExpectedOrigin(
        String origin,
        HttpServletRequest request
    ) {
        try {
            URI actual =
                URI.create(
                    origin
                );

            URI expected =
                URI.create(
                    expectedBaseUrl(
                        request
                    )
                );

            return (
                equalsIgnoreCase(
                    actual.getScheme(),
                    expected.getScheme()
                )
                &&
                equalsIgnoreCase(
                    actual.getHost(),
                    expected.getHost()
                )
                &&
                normalizedPort(
                    actual
                )
                ==
                normalizedPort(
                    expected
                )
            );

        } catch (
            IllegalArgumentException exception
        ) {
            return false;
        }
    }

    private String expectedBaseUrl(
        HttpServletRequest request
    ) {
        String configured =
            System.getenv(
                "APP_BASE_URL"
            );

        if (
            configured != null
            &&
            !configured.isBlank()
        ) {
            return configured.trim();
        }

        String forwardedProto =
            request.getHeader(
                "X-Forwarded-Proto"
            );

        String scheme =
            forwardedProto != null
            &&
            !forwardedProto.isBlank()
                ?
                forwardedProto
                    .split(",")[0]
                    .trim()
                :
                request.getScheme();

        String host =
            request.getHeader(
                "Host"
            );

        if (
            host == null
            ||
            host.isBlank()
        ) {
            host =
                request.getServerName()
                +
                ":"
                +
                request.getServerPort();
        }

        return scheme
            +
            "://"
            +
            host;
    }

    private int normalizedPort(
        URI uri
    ) {
        if (
            uri.getPort()
            >=
            0
        ) {
            return uri.getPort();
        }

        return "https".equalsIgnoreCase(
            uri.getScheme()
        )
            ?
            443
            :
            80;
    }

    private boolean equalsIgnoreCase(
        String left,
        String right
    ) {
        if (
            left == null
            ||
            right == null
        ) {
            return left == right;
        }

        return left.equalsIgnoreCase(
            right
        );
    }

    private boolean constantTimeEquals(
        String expected,
        String supplied
    ) {
        return MessageDigest.isEqual(
            expected.getBytes(
                StandardCharsets.UTF_8
            ),
            supplied.getBytes(
                StandardCharsets.UTF_8
            )
        );
    }

    private void reject(
        HttpServletResponse response,
        String message
    ) throws IOException {

        response.setStatus(
            HttpServletResponse.SC_FORBIDDEN
        );

        response.setContentType(
            "application/json"
        );

        response.setCharacterEncoding(
            "UTF-8"
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
                GSON.toJson(
                    json
                )
            );
    }
}
