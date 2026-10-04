package com.fithealth.servlet;

import com.fithealth.dao.FoodDAO;
import com.fithealth.model.Food;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/foods")
public class FoodServlet extends HttpServlet {

    private final Gson gson =
        new Gson();

    private final FoodDAO foodDAO =
        new FoodDAO();

    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        try {

            Long userId =
                getLoggedInUserId(
                    request
                );

            if (userId == null) {

                writeJson(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    Map.of(
                        "success", false,
                        "message", "Not authenticated."
                    )
                );

                return;
            }

            List<Food> foods =
                foodDAO.findAll();

            List<Map<String, Object>> responseFoods =
                new ArrayList<>();

            for (Food food : foods) {

                responseFoods.add(
                    createFoodResponse(food)
                );
            }

            Map<String, Object> result =
                new LinkedHashMap<>();

            result.put(
                "success",
                true
            );

            result.put(
                "foods",
                responseFoods
            );

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                result
            );

        } catch (Exception exception) {

            exception.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success", false,
                    "message", "Unable to load foods."
                )
            );
        }
    }

    private Map<String, Object> createFoodResponse(
        Food food
    ) {

        Map<String, Object> result =
            new LinkedHashMap<>();

        result.put("id", food.getId());
        result.put("name", food.getName());
        result.put("category", food.getCategory());
        result.put("nutritionType", food.getNutritionType());
        result.put("servingUnit", food.getServingUnit());
        result.put("servingSize", number(food.getServingSize()));
        result.put("calories", number(food.getCalories()));
        result.put("protein", number(food.getProtein()));
        result.put("carbs", number(food.getCarbs()));
        result.put("fat", number(food.getFat()));
        result.put("cookingRequired", food.isCookingRequired());
        result.put("supplement", food.isSupplement());

        return result;
    }

    private Double number(
        BigDecimal value
    ) {

        if (value == null) {
            return null;
        }

        return value.doubleValue();
    }

    private Long getLoggedInUserId(
        HttpServletRequest request
    ) {

        HttpSession session =
            request.getSession(false);

        if (session == null) {
            return null;
        }

        Object userId =
            session.getAttribute("userId");

        if (userId instanceof Number) {

            return ((Number) userId)
                .longValue();
        }

        return null;
    }

    private void writeJson(
        HttpServletResponse response,
        int status,
        Object body
    ) throws IOException {

        response.setStatus(status);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setHeader(
            "Cache-Control",
            "no-store"
        );

        response
            .getWriter()
            .write(
                gson.toJson(body)
            );
    }
}
