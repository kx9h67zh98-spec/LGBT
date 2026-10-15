package com.fithealth.servlet;

import com.fithealth.dao.WaterLogDAO;
import com.fithealth.model.WaterLog;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/water-logs")
public class WaterLogServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    private final WaterLogDAO waterLogDAO =
        new WaterLogDAO();


    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

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

        try {

            String dateValue =
                request.getParameter(
                    "date"
                );

            List<WaterLog> logs;

            if (
                dateValue != null
                &&
                !dateValue.isBlank()
            ) {

                LocalDate date =
                    LocalDate.parse(
                        dateValue
                    );

                logs =
                    waterLogDAO
                        .findByUserAndDate(
                            userId,
                            date
                        );

            } else {

                int days =
                    parseDays(
                        request.getParameter(
                            "days"
                        )
                    );

                logs =
                    waterLogDAO
                        .findRecentByUser(
                            userId,
                            days
                        );

            }

            List<Map<String, Object>> entries =
                new ArrayList<>();

            for (
                WaterLog log :
                logs
            ) {

                entries.add(
                    toDto(
                        log
                    )
                );

            }

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                Map.of(
                    "success",
                    true,
                    "entries",
                    entries
                )
            );

        } catch (
            DateTimeParseException error
        ) {

            writeJson(
                response,
                HttpServletResponse.SC_BAD_REQUEST,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Date must use YYYY-MM-DD."
                )
            );

        } catch (
            RuntimeException error
        ) {

            error.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to load water intake."
                )
            );

        }
    }


    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

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

        WaterRequest body =
            readBody(
                request
            );

        if (
            body == null
            ||
            body.amountMl == null
        ) {

            writeJson(
                response,
                HttpServletResponse.SC_BAD_REQUEST,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Water amount is required."
                )
            );

            return;

        }

        try {

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

            String mode =
                body.mode == null
                ?
                "add"
                :
                body.mode.trim().toLowerCase();

            boolean add =
                !"set".equals(
                    mode
                );

            int maxAmount =
                add
                ?
                5000
                :
                10000;

            if (
                body.amountMl < 0
                ||
                body.amountMl > maxAmount
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success",
                        false,
                        "message",
                        "Water amount is outside the allowed range."
                    )
                );

                return;

            }

            WaterLog saved =
                waterLogDAO
                    .saveOrUpdate(
                        userId,
                        date,
                        body.amountMl,
                        add
                    );

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                Map.of(
                    "success",
                    true,
                    "message",
                    "Water intake saved successfully.",
                    "entry",
                    toDto(
                        saved
                    )
                )
            );

        } catch (
            DateTimeParseException error
        ) {

            writeJson(
                response,
                HttpServletResponse.SC_BAD_REQUEST,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Date must use YYYY-MM-DD."
                )
            );

        } catch (
            IllegalArgumentException error
        ) {

            writeJson(
                response,
                HttpServletResponse.SC_BAD_REQUEST,
                Map.of(
                    "success",
                    false,
                    "message",
                    error.getMessage()
                )
            );

        } catch (
            RuntimeException error
        ) {

            error.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to save water intake."
                )
            );

        }
    }


    private Map<String, Object> toDto(
        WaterLog log
    ) {

        Map<String, Object> dto =
            new LinkedHashMap<>();

        dto.put(
            "id",
            log.getId()
        );

        dto.put(
            "date",
            log.getLogDate() == null
                ?
                null
                :
                log.getLogDate().toString()
        );

        dto.put(
            "amountMl",
            log.getAmountMl()
        );

        dto.put(
            "createdAt",
            log.getCreatedAt() == null
                ?
                null
                :
                log.getCreatedAt().toString()
        );

        dto.put(
            "updatedAt",
            log.getUpdatedAt() == null
                ?
                null
                :
                log.getUpdatedAt().toString()
        );

        return dto;

    }


    private WaterRequest readBody(
        HttpServletRequest request
    ) {

        try (
            BufferedReader reader =
                request.getReader()
        ) {

            return gson.fromJson(
                reader,
                WaterRequest.class
            );

        } catch (
            RuntimeException
            |
            IOException error
        ) {

            return null;

        }
    }


    private int parseDays(
        String value
    ) {

        if (
            value == null
            ||
            value.isBlank()
        ) {

            return 7;

        }

        try {

            int days =
                Integer.parseInt(
                    value
                );

            return Math.max(
                1,
                Math.min(
                    days,
                    30
                )
            );

        } catch (
            NumberFormatException error
        ) {

            return 7;

        }
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

        return userId instanceof Number
            ?
            ((Number) userId).longValue()
            :
            null;

    }


    private void writeJson(
        HttpServletResponse response,
        int status,
        Object body
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
                    body
                )
            );

    }


    private static class WaterRequest {

        private String date;

        private Integer amountMl;

        private String mode;

    }
}
