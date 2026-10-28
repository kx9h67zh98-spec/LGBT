package com.fithealth.servlet;

import com.fithealth.dao.HealthProfileDAO;
import com.fithealth.model.HealthProfile;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;

@WebServlet("/api/clinical-recommendations")
public class ClinicalRecommendationServlet extends HttpServlet {

    private final HealthProfileDAO healthProfileDAO =
        new HealthProfileDAO();

    private final Gson gson =
        new Gson();

    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        response.setContentType(
            "application/json"
        );

        response.setCharacterEncoding(
            "UTF-8"
        );

        response.setHeader(
            "Cache-Control",
            "no-store"
        );

        HttpSession session =
            request.getSession(
                false
            );

        if (
            session == null
            ||
            session.getAttribute(
                "userId"
            )
            ==
            null
        ) {
            sendError(
                response,
                HttpServletResponse.SC_UNAUTHORIZED,
                "Authentication required."
            );

            return;
        }

        Long userId =
            (Long)
            session.getAttribute(
                "userId"
            );

        try {
            HealthProfile profile =
                healthProfileDAO.findByUserId(
                    userId
                );

            JsonObject json =
                new JsonObject();

            json.addProperty(
                "success",
                true
            );

            json.addProperty(
                "title",
                "Clinical Wellness Guidance"
            );

            json.addProperty(
                "disclaimer",
                "This feature provides general screening and wellness guidance only. It does not diagnose disease, prescribe treatment, or replace a qualified healthcare professional."
            );

            JsonArray recommendations =
                new JsonArray();

            if (profile == null) {
                recommendations.add(
                    recommendation(
                        "info",
                        "Complete your Health Profile",
                        "Add your age, height, weight, activity level and goal so FitHealth can provide personalized wellness guidance."
                    )
                );

            } else {
                addBmiGuidance(
                    profile,
                    recommendations
                );

                addActivityGuidance(
                    profile,
                    recommendations
                );

                addGoalGuidance(
                    profile,
                    recommendations
                );

                recommendations.add(
                    recommendation(
                        "info",
                        "Nutrition targets are estimates",
                        "FitHealth calorie and macro targets are planning estimates. Pregnancy, kidney disease, diabetes, eating disorders, medication use and other medical conditions can require individualized nutrition advice from a clinician or registered dietitian."
                    )
                );
            }

            JsonArray sources =
                new JsonArray();

            sources.add(
                source(
                    "CDC - Adult BMI Categories",
                    "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html"
                )
            );

            sources.add(
                source(
                    "WHO - Physical Activity",
                    "https://www.who.int/europe/news-room/fact-sheets/item/physical-activity"
                )
            );

            json.add(
                "recommendations",
                recommendations
            );

            json.add(
                "sources",
                sources
            );

            response.setStatus(
                HttpServletResponse.SC_OK
            );

            response
                .getWriter()
                .write(
                    gson.toJson(
                        json
                    )
                );

        } catch (Exception exception) {
            exception.printStackTrace();

            sendError(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                "Unable to generate wellness guidance."
            );
        }
    }

    private void addBmiGuidance(
        HealthProfile profile,
        JsonArray recommendations
    ) {
        Integer age =
            profile.getAge();

        BigDecimal bmiValue =
            profile.getBmi();

        if (
            age == null
            ||
            bmiValue == null
        ) {
            return;
        }

        double bmi =
            bmiValue.doubleValue();

        if (age < 20) {
            recommendations.add(
                recommendation(
                    "warning",
                    "Adult BMI categories do not apply",
                    "CDC adult BMI categories are intended for adults age 20 and older. For younger users, use age-appropriate growth assessment with a qualified healthcare professional."
                )
            );

            return;
        }

        if (bmi < 18.5) {
            recommendations.add(
                recommendation(
                    "warning",
                    "BMI screening: below the adult reference range",
                    "Your BMI is below 18.5. Avoid aggressive calorie restriction and consider discussing your weight, nutrition and any unintentional weight change with a healthcare professional."
                )
            );

        } else if (bmi < 25.0) {
            recommendations.add(
                recommendation(
                    "success",
                    "BMI screening: healthy-weight reference range",
                    "Your BMI is within the CDC adult healthy-weight reference range of 18.5 to less than 25. BMI is only a screening measure and should be interpreted with other health information."
                )
            );

        } else if (bmi < 30.0) {
            recommendations.add(
                recommendation(
                    "info",
                    "BMI screening: overweight reference range",
                    "Your BMI is within the CDC adult overweight reference range. If weight change is a goal, focus on gradual, sustainable habits and discuss individual risk factors with a healthcare professional when appropriate."
                )
            );

        } else {
            recommendations.add(
                recommendation(
                    "warning",
                    "BMI screening: obesity reference range",
                    "Your BMI is 30 or higher. BMI does not diagnose disease, but it can be one factor in health risk assessment. Consider discussing blood pressure, glucose, lipids and an individualized weight-management plan with a healthcare professional."
                )
            );
        }
    }

    private void addActivityGuidance(
        HealthProfile profile,
        JsonArray recommendations
    ) {
        BigDecimal activity =
            profile.getActivityLevel();

        if (activity == null) {
            return;
        }

        if (
            activity.doubleValue()
            <=
            1.375
        ) {
            recommendations.add(
                recommendation(
                    "info",
                    "Build regular physical activity gradually",
                    "WHO guidance for adults recommends 150–300 minutes of moderate aerobic activity per week, or 75–150 minutes of vigorous activity, plus muscle-strengthening activities on 2 or more days per week. Increase activity progressively based on your current fitness and health."
                )
            );

        } else {
            recommendations.add(
                recommendation(
                    "success",
                    "Maintain a balanced activity routine",
                    "Keep combining aerobic activity with muscle-strengthening work and recovery. WHO recommends regular activity across the week rather than relying on a single long session."
                )
            );
        }
    }

    private void addGoalGuidance(
        HealthProfile profile,
        JsonArray recommendations
    ) {
        String goal =
            profile.getGoal();

        if (goal == null) {
            return;
        }

        if (
            "lose".equalsIgnoreCase(
                goal
            )
        ) {
            recommendations.add(
                recommendation(
                    "info",
                    "Weight-loss goal",
                    "Treat the FitHealth calorie target as an estimate, not a prescription. Prefer gradual, sustainable changes and reassess if you experience persistent fatigue, dizziness, weakness or other concerning symptoms."
                )
            );

        } else if (
            "gain".equalsIgnoreCase(
                goal
            )
        ) {
            recommendations.add(
                recommendation(
                    "info",
                    "Weight-gain goal",
                    "Use progressive resistance training, adequate recovery and a balanced diet. Rapid or unexplained weight change should be discussed with a healthcare professional."
                )
            );
        }
    }

    private JsonObject recommendation(
        String level,
        String title,
        String message
    ) {
        JsonObject item =
            new JsonObject();

        item.addProperty(
            "level",
            level
        );

        item.addProperty(
            "title",
            title
        );

        item.addProperty(
            "message",
            message
        );

        return item;
    }

    private JsonObject source(
        String label,
        String url
    ) {
        JsonObject item =
            new JsonObject();

        item.addProperty(
            "label",
            label
        );

        item.addProperty(
            "url",
            url
        );

        return item;
    }

    private void sendError(
        HttpServletResponse response,
        int status,
        String message
    ) throws IOException {

        response.setStatus(
            status
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
                gson.toJson(
                    json
                )
            );
    }
}
