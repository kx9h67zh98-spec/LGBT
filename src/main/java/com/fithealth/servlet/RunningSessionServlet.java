package com.fithealth.servlet;

import com.fithealth.dao.HealthProfileDAO;
import com.fithealth.dao.RunningSessionDAO;
import com.fithealth.model.HealthProfile;
import com.fithealth.model.RunningSession;
import com.google.gson.Gson;
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

@WebServlet("/api/running-sessions")
public class RunningSessionServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    private final RunningSessionDAO
        runningSessionDAO =
            new RunningSessionDAO();

    private final HealthProfileDAO
        healthProfileDAO =
            new HealthProfileDAO();


    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        Long userId =
            getAuthenticatedUserId(
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

            List<RunningSession> sessions =
                runningSessionDAO
                    .findByUserId(
                        userId
                    );

            List<Map<String, Object>> entries =
                new ArrayList<>();

            for (
                RunningSession session :
                sessions
            ) {

                entries.add(
                    toDto(
                        session,
                        null
                    )
                );

            }


            Map<String, Object> body =
                new LinkedHashMap<>();

            body.put(
                "success",
                true
            );

            body.put(
                "entries",
                entries
            );

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                body
            );

        } catch (RuntimeException error) {

            error.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Unable to load running sessions."
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
            getAuthenticatedUserId(
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


        RunningRequest body =
            readBody(
                request
            );

        if (
            body == null
        ) {

            writeJson(
                response,
                HttpServletResponse.SC_BAD_REQUEST,
                Map.of(
                    "success",
                    false,
                    "message",
                    "Invalid request body."
                )
            );

            return;
        }


        try {

            LocalDate runDate =
                LocalDate.parse(
                    safeString(
                        body.date
                    )
                );

            BigDecimal distance =
                decimal(
                    body.distance
                );

            Integer duration =
                body.duration;


            if (
                distance == null
                ||
                distance.compareTo(
                    BigDecimal.ZERO
                ) <= 0
                ||
                distance.compareTo(
                    new BigDecimal(
                        "1000"
                    )
                ) > 0
                ||
                duration == null
                ||
                duration <= 0
                ||
                duration > 604800
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success",
                        false,
                        "message",
                        "Distance and duration must be valid positive values."
                    )
                );

                return;
            }


            BigDecimal normalizedDistance =
                distance.setScale(
                    2,
                    RoundingMode.HALF_UP
                );

            BigDecimal durationDecimal =
                BigDecimal.valueOf(
                    duration
                );

            BigDecimal averageSpeed =
                normalizedDistance
                    .multiply(
                        new BigDecimal(
                            "3600"
                        )
                    )
                    .divide(
                        durationDecimal,
                        2,
                        RoundingMode.HALF_UP
                    );

            BigDecimal averagePace =
                durationDecimal
                    .divide(
                        new BigDecimal(
                            "60"
                        ),
                        8,
                        RoundingMode.HALF_UP
                    )
                    .divide(
                        normalizedDistance,
                        2,
                        RoundingMode.HALF_UP
                    );


            BigDecimal calories =
                decimal(
                    body.calories
                );

            if (
                calories == null
                ||
                calories.compareTo(
                    BigDecimal.ZERO
                ) < 0
            ) {

                calories =
                    BigDecimal.ZERO;

            }


            if (
                calories.compareTo(
                    BigDecimal.ZERO
                ) == 0
            ) {

                HealthProfile profile =
                    healthProfileDAO
                        .findByUserId(
                            userId
                        );

                if (
                    profile != null
                    &&
                    profile.getWeight() != null
                ) {

                    calories =
                        profile
                            .getWeight()
                            .multiply(
                                normalizedDistance
                            )
                            .multiply(
                                new BigDecimal(
                                    "1.036"
                                )
                            );

                }

            }


            calories =
                calories.setScale(
                    2,
                    RoundingMode.HALF_UP
                );


            RunningSession session =
                new RunningSession();

            session.setRunDate(
                runDate
            );

            session.setDistance(
                normalizedDistance
            );

            session.setDuration(
                duration
            );

            session.setAverageSpeed(
                averageSpeed
            );

            session.setAveragePace(
                averagePace
            );

            session.setCalories(
                calories
            );


            RunningSession saved =
                runningSessionDAO.create(
                    userId,
                    session
                );


            Map<String, Object> responseBody =
                new LinkedHashMap<>();

            responseBody.put(
                "success",
                true
            );

            responseBody.put(
                "entry",
                toDto(
                    saved,
                    normalizeSource(
                        body.source
                    )
                )
            );

            writeJson(
                response,
                HttpServletResponse.SC_CREATED,
                responseBody
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
                    "Run date must use YYYY-MM-DD."
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
                    "Unable to save running session."
                )
            );

        }
    }


    @Override
    protected void doDelete(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        Long userId =
            getAuthenticatedUserId(
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


        Long id =
            parseLong(
                request.getParameter(
                    "id"
                )
            );

        if (
            id == null
            ||
            id <= 0
        ) {

            writeJson(
                response,
                HttpServletResponse.SC_BAD_REQUEST,
                Map.of(
                    "success",
                    false,
                    "message",
                    "A valid running session id is required."
                )
            );

            return;
        }


        try {

            boolean deleted =
                runningSessionDAO
                    .deleteByIdAndUserId(
                        id,
                        userId
                    );

            if (
                !deleted
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_NOT_FOUND,
                    Map.of(
                        "success",
                        false,
                        "message",
                        "Running session not found."
                    )
                );

                return;
            }


            writeJson(
                response,
                HttpServletResponse.SC_OK,
                Map.of(
                    "success",
                    true
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
                    "Unable to delete running session."
                )
            );

        }
    }


    private Map<String, Object> toDto(
        RunningSession session,
        String source
    ) {

        Map<String, Object> dto =
            new LinkedHashMap<>();

        dto.put(
            "id",
            session.getId()
        );

        dto.put(
            "date",
            session.getRunDate() != null
            ?
            session.getRunDate().toString()
            :
            null
        );

        dto.put(
            "distance",
            session.getDistance()
        );

        dto.put(
            "duration",
            session.getDuration()
        );

        dto.put(
            "averageSpeed",
            session.getAverageSpeed()
        );

        dto.put(
            "averagePace",
            session.getAveragePace()
        );

        dto.put(
            "calories",
            session.getCalories()
        );

        dto.put(
            "source",
            source != null
            ?
            source
            :
            "saved"
        );

        dto.put(
            "route",
            List.of()
        );

        dto.put(
            "createdAt",
            session.getCreatedAt() != null
            ?
            session.getCreatedAt().toString()
            :
            null
        );

        return dto;
    }


    private Long getAuthenticatedUserId(
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
            userId instanceof Long
        ) {

            return (Long) userId;

        }

        if (
            userId instanceof Number
        ) {

            return (
                (Number) userId
            ).longValue();

        }

        return null;
    }


    private RunningRequest readBody(
        HttpServletRequest request
    ) {

        try (
            BufferedReader reader =
                request.getReader()
        ) {

            return gson.fromJson(
                reader,
                RunningRequest.class
            );

        } catch (
            RuntimeException
            |
            IOException error
        ) {

            return null;

        }
    }


    private void writeJson(
        HttpServletResponse response,
        int status,
        Object body
    ) throws IOException {

        response.setStatus(
            status
        );

        response.setContentType(
            "application/json"
        );

        response.setCharacterEncoding(
            "UTF-8"
        );

        response
            .getWriter()
            .write(
                gson.toJson(
                    body
                )
            );
    }


    private BigDecimal decimal(
        Object value
    ) {

        if (
            value == null
        ) {

            return null;

        }

        try {

            return new BigDecimal(
                String.valueOf(
                    value
                )
            );

        } catch (
            NumberFormatException error
        ) {

            return null;

        }
    }


    private Long parseLong(
        String value
    ) {

        if (
            value == null
            ||
            value.isBlank()
        ) {

            return null;

        }

        try {

            return Long.valueOf(
                value
            );

        } catch (
            NumberFormatException error
        ) {

            return null;

        }
    }


    private String safeString(
        String value
    ) {

        return value == null
            ?
            ""
            :
            value.trim();
    }


    private String normalizeSource(
        String source
    ) {

        if (
            "gps".equalsIgnoreCase(
                source
            )
        ) {

            return "gps";

        }

        if (
            "manual".equalsIgnoreCase(
                source
            )
        ) {

            return "manual";

        }

        return "saved";
    }


    private static class RunningRequest {

        private String date;

        private BigDecimal distance;

        private Integer duration;

        private BigDecimal calories;

        private String source;
    }
}
