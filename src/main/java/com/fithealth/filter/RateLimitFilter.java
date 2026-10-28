package com.fithealth.filter;

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

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@WebFilter("/*")
public class RateLimitFilter implements Filter {

    private static final Map<String, Bucket>
        BUCKETS =
            new ConcurrentHashMap<>();

    private static final AtomicLong
        REQUEST_COUNTER =
            new AtomicLong();

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

        Limit limit =
            resolveLimit(
                httpRequest
                    .getServletPath()
            );

        if (limit == null) {
            chain.doFilter(
                request,
                response
            );

            return;
        }

        String clientIp =
            clientIp(
                httpRequest
            );

        long now =
            System.currentTimeMillis();

        String key =
            limit.name
            +
            ":"
            +
            clientIp;

        Bucket bucket =
            BUCKETS.computeIfAbsent(
                key,
                ignored ->
                    new Bucket(
                        now
                    )
            );

        if (
            !bucket.tryAcquire(
                now,
                limit.windowMillis,
                limit.maxRequests
            )
        ) {
            long retryAfterSeconds =
                Math.max(
                    1,
                    bucket.retryAfterSeconds(
                        now,
                        limit.windowMillis
                    )
                );

            httpResponse.setStatus(
                429
            );

            httpResponse.setContentType(
                "application/json"
            );

            httpResponse.setCharacterEncoding(
                "UTF-8"
            );

            httpResponse.setHeader(
                "Retry-After",
                String.valueOf(
                    retryAfterSeconds
                )
            );

            JsonObject json =
                new JsonObject();

            json.addProperty(
                "success",
                false
            );

            json.addProperty(
                "message",
                "Too many requests. Please try again shortly."
            );

            httpResponse
                .getWriter()
                .write(
                    GSON.toJson(
                        json
                    )
                );

            return;
        }

        cleanupOccasionally(
            now
        );

        chain.doFilter(
            request,
            response
        );
    }

    private Limit resolveLimit(
        String path
    ) {
        if (path == null) {
            return null;
        }

        if (
            path.equals(
                "/api/auth/password/forgot"
            )
            ||
            path.equals(
                "/api/auth/email/resend"
            )
        ) {
            return new Limit(
                "email-sensitive",
                5,
                15 * 60_000L
            );
        }

        if (
            path.equals(
                "/api/auth/password/reset"
            )
            ||
            path.equals(
                "/api/auth/email/verify"
            )
        ) {
            return new Limit(
                "token-sensitive",
                15,
                15 * 60_000L
            );
        }

        if (
            path.equals("/login")
            ||
            path.equals("/register")
        ) {
            return new Limit(
                "authentication",
                20,
                5 * 60_000L
            );
        }

        if (
            path.startsWith(
                "/api/"
            )
        ) {
            return new Limit(
                "api",
                300,
                60_000L
            );
        }

        return null;
    }

    private String clientIp(
        HttpServletRequest request
    ) {
        String forwarded =
            request.getHeader(
                "X-Forwarded-For"
            );

        if (
            forwarded != null
            &&
            !forwarded.isBlank()
        ) {
            String first =
                forwarded
                    .split(",")[0]
                    .trim();

            if (!first.isBlank()) {
                return truncate(
                    first,
                    64
                );
            }
        }

        String remote =
            request.getRemoteAddr();

        return truncate(
            remote == null
                ?
                "unknown"
                :
                remote,
            64
        );
    }

    private String truncate(
        String value,
        int maxLength
    ) {
        return value.length()
            <=
            maxLength
                ?
                value
                :
                value.substring(
                    0,
                    maxLength
                );
    }

    private void cleanupOccasionally(
        long now
    ) {
        if (
            REQUEST_COUNTER
                .incrementAndGet()
                %
                1000
            !=
            0
        ) {
            return;
        }

        long oldest =
            now
            -
            60 * 60_000L;

        BUCKETS.entrySet()
            .removeIf(
                entry ->
                    entry
                        .getValue()
                        .lastSeen
                    <
                    oldest
            );
    }

    private static final class Limit {

        private final String name;
        private final int maxRequests;
        private final long windowMillis;

        private Limit(
            String name,
            int maxRequests,
            long windowMillis
        ) {
            this.name =
                name;

            this.maxRequests =
                maxRequests;

            this.windowMillis =
                windowMillis;
        }
    }

    private static final class Bucket {

        private long windowStart;
        private int count;
        private volatile long lastSeen;

        private Bucket(
            long now
        ) {
            this.windowStart =
                now;

            this.lastSeen =
                now;
        }

        private synchronized boolean
            tryAcquire(
                long now,
                long windowMillis,
                int limit
            ) {

            lastSeen =
                now;

            if (
                now - windowStart
                >=
                windowMillis
            ) {
                windowStart =
                    now;

                count =
                    0;
            }

            if (
                count
                >=
                limit
            ) {
                return false;
            }

            count +=
                1;

            return true;
        }

        private synchronized long
            retryAfterSeconds(
                long now,
                long windowMillis
            ) {

            long remaining =
                windowMillis
                -
                (
                    now
                    -
                    windowStart
                );

            return (
                remaining
                +
                999
            )
            /
            1000;
        }
    }
}
