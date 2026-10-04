package com.fithealth.servlet;

import com.fithealth.dao.HealthProfileDAO;
import com.fithealth.model.HealthProfile;
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
import java.util.LinkedHashMap;
import java.util.Map;


@WebServlet("/api/health-profile")
public class HealthProfileServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    private final HealthProfileDAO healthProfileDAO =
        new HealthProfileDAO();


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


            HealthProfile profile =
                healthProfileDAO
                    .findByUserId(
                        userId
                    );


            Map<String, Object> result =
                new LinkedHashMap<>();


            result.put(
                "success",
                true
            );


            if (
                profile == null
            ) {

                result.put(
                    "profile",
                    null
                );

            } else {

                result.put(
                    "profile",
                    createProfileResponse(
                        profile
                    )
                );

            }


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
                    "Unable to load health profile."
                )
            );

        }

    }


    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        saveHealthProfile(
            request,
            response
        );

    }


    @Override
    protected void doPut(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        saveHealthProfile(
            request,
            response
        );

    }


    private void saveHealthProfile(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

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


            HealthProfileRequest body =
                readRequestBody(
                    request
                );


            String validationMessage =
                validateRequest(
                    body
                );


            if (
                validationMessage != null
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success",
                        false,
                        "message",
                        validationMessage
                    )
                );

                return;

            }


            HealthProfile calculatedProfile =
                calculateHealthProfile(
                    body
                );


            HealthProfile savedProfile =
                healthProfileDAO
                    .saveOrUpdate(
                        userId,
                        calculatedProfile
                    );


            Map<String, Object> result =
                new LinkedHashMap<>();


            result.put(
                "success",
                true
            );

            result.put(
                "message",
                "Health profile saved successfully."
            );

            result.put(
                "profile",
                createProfileResponse(
                    savedProfile
                )
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
                    "Unable to save health profile."
                )
            );

        }

    }


    private HealthProfileRequest readRequestBody(
        HttpServletRequest request
    ) throws IOException {

        try (
            BufferedReader reader =
                request.getReader()
        ) {

            HealthProfileRequest body =
                gson.fromJson(
                    reader,
                    HealthProfileRequest.class
                );


            if (
                body == null
            ) {

                throw new IllegalArgumentException(
                    "Request body is empty."
                );

            }


            return body;

        }

    }


    private String validateRequest(
        HealthProfileRequest body
    ) {

        if (
            body.age == null
            ||
            body.age < 14
            ||
            body.age > 100
        ) {

            return
                "Age must be between 14 and 100.";

        }


        if (
            body.gender == null
            ||
            (
                !body.gender.equals(
                    "male"
                )
                &&
                !body.gender.equals(
                    "female"
                )
            )
        ) {

            return
                "Gender must be male or female.";

        }


        if (
            body.height == null
            ||
            body.height < 100
            ||
            body.height > 250
        ) {

            return
                "Height must be between 100 and 250 cm.";

        }


        if (
            body.weight == null
            ||
            body.weight < 30
            ||
            body.weight > 300
        ) {

            return
                "Weight must be between 30 and 300 kg.";

        }


        if (
            body.activityLevel == null
            ||
            body.activityLevel <= 0
        ) {

            return
                "Activity level is invalid.";

        }


        if (
            body.goal == null
            ||
            (
                !body.goal.equals(
                    "lose"
                )
                &&
                !body.goal.equals(
                    "maintain"
                )
                &&
                !body.goal.equals(
                    "gain"
                )
            )
        ) {

            return
                "Fitness goal is invalid.";

        }


        return null;

    }


    private HealthProfile calculateHealthProfile(
        HealthProfileRequest body
    ) {

        double heightMeters =
            body.height
            /
            100.0;


        double bmi =
            body.weight
            /
            (
                heightMeters
                *
                heightMeters
            );


        double bmrBase =
            (
                10
                *
                body.weight
            )
            +
            (
                6.25
                *
                body.height
            )
            -
            (
                5
                *
                body.age
            );


        double bmr;


        if (
            body.gender.equals(
                "male"
            )
        ) {

            bmr =
                bmrBase
                +
                5;

        } else {

            bmr =
                bmrBase
                -
                161;

        }


        double tdee =
            bmr
            *
            body.activityLevel;


        double targetCalories;


        switch (
            body.goal
        ) {

            case "lose":

                targetCalories =
                    Math.max(
                        tdee - 500,
                        1200
                    );

                break;


            case "gain":

                targetCalories =
                    tdee
                    +
                    300;

                break;


            default:

                targetCalories =
                    tdee;

                break;

        }


        double protein =
            Math.round(
                body.weight
                *
                2
            );


        double fatCalories =
            targetCalories
            *
            0.25;


        double fat =
            Math.round(
                fatCalories
                /
                9
            );


        double proteinCalories =
            protein
            *
            4;


        double remainingCalories =
            Math.max(
                targetCalories
                -
                proteinCalories
                -
                fatCalories,
                0
            );


        double carbs =
            Math.round(
                remainingCalories
                /
                4
            );


        HealthProfile profile =
            new HealthProfile();


        profile.setAge(
            body.age
        );

        profile.setGender(
            body.gender
        );

        profile.setHeight(
            decimal(
                body.height,
                2
            )
        );

        profile.setWeight(
            decimal(
                body.weight,
                2
            )
        );

        profile.setActivityLevel(
            decimal(
                body.activityLevel,
                3
            )
        );

        profile.setGoal(
            body.goal
        );

        profile.setBmi(
            decimal(
                bmi,
                2
            )
        );

        profile.setBmr(
            decimal(
                bmr,
                2
            )
        );

        profile.setTdee(
            decimal(
                tdee,
                2
            )
        );

        profile.setTargetCalories(
            decimal(
                targetCalories,
                2
            )
        );

        profile.setProteinTarget(
            decimal(
                protein,
                2
            )
        );

        profile.setCarbsTarget(
            decimal(
                carbs,
                2
            )
        );

        profile.setFatTarget(
            decimal(
                fat,
                2
            )
        );


        return profile;

    }


    private Map<String, Object> createProfileResponse(
        HealthProfile profile
    ) {

        Map<String, Object> result =
            new LinkedHashMap<>();


        result.put(
            "id",
            profile.getId()
        );

        result.put(
            "age",
            profile.getAge()
        );

        result.put(
            "gender",
            profile.getGender()
        );

        result.put(
            "height",
            number(
                profile.getHeight()
            )
        );

        result.put(
            "weight",
            number(
                profile.getWeight()
            )
        );

        result.put(
            "activityLevel",
            number(
                profile.getActivityLevel()
            )
        );

        result.put(
            "goal",
            profile.getGoal()
        );

        result.put(
            "bmi",
            number(
                profile.getBmi()
            )
        );

        result.put(
            "bmr",
            number(
                profile.getBmr()
            )
        );

        result.put(
            "tdee",
            number(
                profile.getTdee()
            )
        );

        result.put(
            "targetCalories",
            number(
                profile.getTargetCalories()
            )
        );

        result.put(
            "proteinTarget",
            number(
                profile.getProteinTarget()
            )
        );

        result.put(
            "carbsTarget",
            number(
                profile.getCarbsTarget()
            )
        );

        result.put(
            "fatTarget",
            number(
                profile.getFatTarget()
            )
        );


        /*
         * IMPORTANT:
         * Do not give Gson LocalDateTime directly.
         */
        result.put(
            "updatedAt",
            profile.getUpdatedAt() == null
                ?
                null
                :
                profile
                    .getUpdatedAt()
                    .toString()
        );


        return result;

    }


    private Double number(
        BigDecimal value
    ) {

        if (
            value == null
        ) {

            return null;

        }


        return value.doubleValue();

    }


    private BigDecimal decimal(
        double value,
        int scale
    ) {

        return BigDecimal
            .valueOf(
                value
            )
            .setScale(
                scale,
                RoundingMode.HALF_UP
            );

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


    private static class HealthProfileRequest {

        private Integer age;

        private String gender;

        private Double height;

        private Double weight;

        private Double activityLevel;

        private String goal;

    }

}