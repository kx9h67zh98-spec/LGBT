package com.fithealth.servlet;

import com.fithealth.dao.WeightLogDAO;
import com.fithealth.model.WeightLog;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/weight-logs")
public class WeightLogServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    private final WeightLogDAO weightLogDAO =
        new WeightLogDAO();

    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        try {

            Long userId =
                getLoggedInUserId(
                    request
                );

            if (
                userId == null
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    Map.of(
                        "success",
                        false,
                        "message",
                        "Not authenticated."
                    )
                );

                return;
            }

            int limit =
                parseLimit(
                    request.getParameter(
                        "limit"
                    )
                );

            List<WeightLog> logs =
                weightLogDAO
                    .findRecentByUser(
                        userId,
                        limit
                    );

            List<Map<String, Object>> entries =
                new ArrayList<>();

            for (
                WeightLog log : logs
            ) {

                entries.add(
                    createResponse(
                        log
                    )
                );
            }

            Map<String, Object> result =
                new LinkedHashMap<>();

            result.put(
                "success",
                true
            );

            result.put(
                "entries",
                entries
            );

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                result
            );

        } catch (
            Exception exception
        ) {

            exception.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to load weight history."
                )
            );
        }
    }

    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        try {

            Long userId =
                getLoggedInUserId(
                    request
                );

            if (
                userId == null
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    Map.of(
                        "success",
                        false,
                        "message",
                        "Not authenticated."
                    )
                );

                return;
            }

            WeightLogRequest body =
                readBody(
                    request
                );

            String validation =
                validate(
                    body
                );

            if (
                validation != null
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success",
                        false,
                        "message",
                        validation
                    )
                );

                return;
            }

            LocalDate date =
                body.date == null
                ||
                body.date.isBlank()
                    ?
                    LocalDate.now()
                    :
                    LocalDate.parse(
                        body.date
                    );

            BigDecimal weight =
                body.weight
                    .setScale(
                        2,
                        RoundingMode.HALF_UP
                    );

            WeightLog saved =
                weightLogDAO
                    .saveOrUpdate(
                        userId,
                        date,
                        weight
                    );

            Map<String, Object> result =
                new LinkedHashMap<>();

            result.put(
                "success",
                true
            );

            result.put(
                "message",
                "Weight history saved successfully."
            );

            result.put(
                "entry",
                createResponse(
                    saved
                )
            );

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                result
            );

        } catch (
            DateTimeParseException exception
        ) {

            writeJson(
                response,
                HttpServletResponse.SC_BAD_REQUEST,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Date must use YYYY-MM-DD format."
                )
            );

        } catch (
            Exception exception
        ) {

            exception.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to save weight history."
                )
            );
        }
    }

    private WeightLogRequest readBody(
        HttpServletRequest request
    ) throws IOException {

        try (
            BufferedReader reader =
                request.getReader()
        ) {

            return gson.fromJson(
                reader,
                WeightLogRequest.class
            );
        }
    }

    private String validate(
        WeightLogRequest body
    ) {

        if (
            body == null
        ) {

            return "Request body is empty.";
        }

        if (
            body.weight == null
            ||
            body.weight.compareTo(
                BigDecimal.valueOf(
                    30
                )
            ) < 0
            ||
            body.weight.compareTo(
                BigDecimal.valueOf(
                    300
                )
            ) > 0
        ) {

            return "Weight must be between 30 and 300 kg.";
        }

        return null;
    }

    private int parseLimit(
        String value
    ) {

        int defaultLimit =
            30;

        if (
            value == null
            ||
            value.isBlank()
        ) {

            return defaultLimit;
        }

        try {

            int parsed =
                Integer.parseInt(
                    value
                );

            return Math.max(
                1,
                Math.min(
                    parsed,
                    365
                )
            );

        } catch (
            NumberFormatException exception
        ) {

            return defaultLimit;
        }
    }

    private Map<String, Object> createResponse(
        WeightLog log
    ) {

        Map<String, Object> result =
            new LinkedHashMap<>();

        result.put(
            "id",
            log.getId()
        );

        result.put(
            "date",
            log.getLogDate() == null
                ?
                null
                :
                log.getLogDate().toString()
        );

        result.put(
            "weight",
            log.getWeight() == null
                ?
                null
                :
                log.getWeight().doubleValue()
        );

        result.put(
            "createdAt",
            log.getCreatedAt() == null
                ?
                null
                :
                log.getCreatedAt().toString()
        );

        return result;
    }

    private Long getLoggedInUserId(
        HttpServletRequest request
    ) {

        HttpSession session =
            request.getSession(
                false
            );

        if (
            session == null
        ) {

            return null;
        }

        Object userId =
            session.getAttribute(
                "userId"
            );

        if (
            userId instanceof Number
        ) {

            return (
                (Number) userId
            ).longValue();
        }

        return null;
    }

    private void writeJson(
        HttpServletResponse response,
        int status,
        Object data
    ) throws IOException {

        response.setStatus(
            status
        );

        response.setCharacterEncoding(
            "UTF-8"
        );

        response.setContentType(
            "application/json"
        );

        response.setHeader(
            "Cache-Control",
            "no-store"
        );

        response
            .getWriter()
            .write(
                gson.toJson(
                    data
                )
            );
    }

    private static class WeightLogRequest {
        private String date;
        private BigDecimal weight;
    }
}
