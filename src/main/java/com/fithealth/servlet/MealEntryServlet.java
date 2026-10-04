package com.fithealth.servlet;

import com.fithealth.dao.FoodDAO;
import com.fithealth.dao.MealEntryDAO;
import com.fithealth.model.Food;
import com.fithealth.model.MealEntry;
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
import java.util.Set;

@WebServlet("/api/meal-entries")
public class MealEntryServlet extends HttpServlet {

    private static final Set<String> MEAL_TYPES =
        Set.of(
            "breakfast",
            "lunch",
            "afternoon",
            "dinner"
        );

    private static final Set<String> COOKING_METHODS =
        Set.of(
            "raw",
            "boiled",
            "steamed",
            "grilled",
            "baked",
            "airFried",
            "panFried",
            "stirFried",
            "deepFried"
        );

    private final Gson gson =
        new Gson();

    private final MealEntryDAO mealEntryDAO =
        new MealEntryDAO();

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

                writeUnauthorized(
                    response
                );

                return;
            }

            String dateText =
                request.getParameter(
                    "date"
                );

            if (
                dateText == null
                ||
                dateText.isBlank()
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success", false,
                        "message", "Date is required."
                    )
                );

                return;
            }

            LocalDate entryDate;

            try {

                entryDate =
                    LocalDate.parse(
                        dateText
                    );

            } catch (
                DateTimeParseException exception
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success", false,
                        "message", "Date must use YYYY-MM-DD format."
                    )
                );

                return;
            }

            List<MealEntry> entries =
                mealEntryDAO
                    .findByUserAndDate(
                        userId,
                        entryDate
                    );

            List<Map<String, Object>> responseEntries =
                new ArrayList<>();

            for (MealEntry entry : entries) {

                responseEntries.add(
                    createMealResponse(
                        entry
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
                responseEntries
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
                    "message", "Unable to load meal entries."
                )
            );
        }
    }

    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        saveMealEntry(
            request,
            response,
            false
        );
    }

    @Override
    protected void doPut(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        saveMealEntry(
            request,
            response,
            true
        );
    }

    @Override
    protected void doDelete(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        try {

            Long userId =
                getLoggedInUserId(
                    request
                );

            if (userId == null) {

                writeUnauthorized(
                    response
                );

                return;
            }

            Long id =
                parseLong(
                    request.getParameter(
                        "id"
                    )
                );

            if (id == null) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success", false,
                        "message", "A valid meal id is required."
                    )
                );

                return;
            }

            boolean deleted =
                mealEntryDAO.delete(
                    id,
                    userId
                );

            if (!deleted) {

                writeJson(
                    response,
                    HttpServletResponse.SC_NOT_FOUND,
                    Map.of(
                        "success", false,
                        "message", "Meal entry not found."
                    )
                );

                return;
            }

            writeJson(
                response,
                HttpServletResponse.SC_OK,
                Map.of(
                    "success", true,
                    "message", "Meal entry deleted successfully."
                )
            );

        } catch (Exception exception) {

            exception.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success", false,
                    "message", "Unable to delete meal entry."
                )
            );
        }
    }

    private void saveMealEntry(
        HttpServletRequest request,
        HttpServletResponse response,
        boolean update
    ) throws IOException {

        try {

            Long userId =
                getLoggedInUserId(
                    request
                );

            if (userId == null) {

                writeUnauthorized(
                    response
                );

                return;
            }

            MealEntryRequest body =
                readRequestBody(
                    request
                );

            String validationMessage =
                validateRequest(
                    body,
                    update
                );

            if (
                validationMessage != null
            ) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success", false,
                        "message", validationMessage
                    )
                );

                return;
            }

            Food food =
                foodDAO.findById(
                    body.foodId
                );

            if (food == null) {

                writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    Map.of(
                        "success", false,
                        "message", "Selected food does not exist."
                    )
                );

                return;
            }

            MealEntry entry =
                buildMealEntry(
                    body,
                    food
                );

            MealEntry savedEntry;

            if (update) {

                savedEntry =
                    mealEntryDAO.update(
                        body.id,
                        userId,
                        food.getId(),
                        entry
                    );

                if (
                    savedEntry == null
                ) {

                    writeJson(
                        response,
                        HttpServletResponse.SC_NOT_FOUND,
                        Map.of(
                            "success", false,
                            "message", "Meal entry not found."
                        )
                    );

                    return;
                }

            } else {

                savedEntry =
                    mealEntryDAO.create(
                        userId,
                        food.getId(),
                        entry
                    );
            }

            Map<String, Object> result =
                new LinkedHashMap<>();

            result.put(
                "success",
                true
            );

            result.put(
                "message",
                update
                    ? "Meal updated successfully."
                    : "Meal added successfully."
            );

            result.put(
                "entry",
                createMealResponse(
                    savedEntry
                )
            );

            writeJson(
                response,
                update
                    ? HttpServletResponse.SC_OK
                    : HttpServletResponse.SC_CREATED,
                result
            );

        } catch (Exception exception) {

            exception.printStackTrace();

            writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                Map.of(
                    "success", false,
                    "message", "Unable to save meal entry."
                )
            );
        }
    }

    private MealEntry buildMealEntry(
        MealEntryRequest body,
        Food food
    ) {

        BigDecimal amount =
            decimal(
                body.amount,
                2
            );

        BigDecimal oilAmount =
            BigDecimal.ZERO.setScale(
                2,
                RoundingMode.HALF_UP
            );

        BigDecimal calories;
        BigDecimal protein;
        BigDecimal carbs;
        BigDecimal fat;
        String unit;

        if (
            "serving".equalsIgnoreCase(
                food.getNutritionType()
            )
        ) {

            calories =
                food.getCalories()
                    .multiply(amount);

            protein =
                food.getProtein()
                    .multiply(amount);

            carbs =
                food.getCarbs()
                    .multiply(amount);

            fat =
                food.getFat()
                    .multiply(amount);

            if (
                food.getServingUnit() == null
                ||
                food.getServingUnit().isBlank()
            ) {

                unit =
                    "serving";

            } else {

                unit =
                    food.getServingUnit();
            }

        } else {

            BigDecimal ratio =
                amount.divide(
                    BigDecimal.valueOf(100),
                    8,
                    RoundingMode.HALF_UP
                );

            if (
                food.isCookingRequired()
            ) {

                oilAmount =
                    decimal(
                        body.oilAmount == null
                            ? 0
                            : body.oilAmount,
                        2
                    );
            }

            calories =
                food.getCalories()
                    .multiply(ratio)
                    .add(
                        oilAmount.multiply(
                            BigDecimal.valueOf(9)
                        )
                    );

            protein =
                food.getProtein()
                    .multiply(ratio);

            carbs =
                food.getCarbs()
                    .multiply(ratio);

            fat =
                food.getFat()
                    .multiply(ratio)
                    .add(oilAmount);

            unit =
                "g";
        }

        MealEntry entry =
            new MealEntry();

        entry.setEntryDate(
            LocalDate.parse(
                body.entryDate
            )
        );

        entry.setMealType(
            body.mealType
        );

        entry.setFoodName(
            food.getName()
        );

        entry.setAmount(
            amount
        );

        entry.setUnit(
            unit
        );

        if (
            food.isCookingRequired()
        ) {

            entry.setCookingMethod(
                body.cookingMethod
            );

        } else {

            entry.setCookingMethod(
                null
            );
        }

        if (
            food.isSupplement()
        ) {

            entry.setPreparation(
                body.preparation
            );

        } else {

            entry.setPreparation(
                null
            );
        }

        entry.setOilAmount(
            oilAmount
        );

        entry.setCalories(
            nutritionValue(
                calories
            )
        );

        entry.setProtein(
            nutritionValue(
                protein
            )
        );

        entry.setCarbs(
            nutritionValue(
                carbs
            )
        );

        entry.setFat(
            nutritionValue(
                fat
            )
        );

        return entry;
    }

    private String validateRequest(
        MealEntryRequest body,
        boolean update
    ) {

        if (body == null) {

            return
                "Request body is required.";
        }

        if (
            update
            &&
            body.id == null
        ) {

            return
                "Meal id is required for update.";
        }

        if (
            body.foodId == null
        ) {

            return
                "Food is required.";
        }

        if (
            body.entryDate == null
            ||
            body.entryDate.isBlank()
        ) {

            return
                "Date is required.";
        }

        try {

            LocalDate.parse(
                body.entryDate
            );

        } catch (
            DateTimeParseException exception
        ) {

            return
                "Date must use YYYY-MM-DD format.";
        }

        if (
            body.mealType == null
            ||
            !MEAL_TYPES.contains(
                body.mealType
            )
        ) {

            return
                "Meal type is invalid.";
        }

        if (
            body.amount == null
            ||
            body.amount <= 0
        ) {

            return
                "Amount must be greater than 0.";
        }

        if (
            body.oilAmount != null
            &&
            body.oilAmount < 0
        ) {

            return
                "Oil amount cannot be negative.";
        }

        if (
            body.cookingMethod != null
            &&
            !body.cookingMethod.isBlank()
            &&
            !COOKING_METHODS.contains(
                body.cookingMethod
            )
        ) {

            return
                "Cooking method is invalid.";
        }

        if (
            body.preparation != null
            &&
            body.preparation.length() > 100
        ) {

            return
                "Preparation must be 100 characters or fewer.";
        }

        return null;
    }

    private MealEntryRequest readRequestBody(
        HttpServletRequest request
    ) throws IOException {

        try (
            BufferedReader reader =
                request.getReader()
        ) {

            return gson.fromJson(
                reader,
                MealEntryRequest.class
            );
        }
    }

    private Map<String, Object> createMealResponse(
        MealEntry entry
    ) {

        Map<String, Object> result =
            new LinkedHashMap<>();

        result.put(
            "id",
            entry.getId()
        );

        result.put(
            "date",
            entry.getEntryDate() == null
                ? null
                : entry.getEntryDate().toString()
        );

        result.put(
            "mealType",
            entry.getMealType()
        );

        Food food =
            entry.getFood();

        result.put(
            "foodId",
            food == null
                ? null
                : food.getId()
        );

        result.put(
            "foodName",
            entry.getFoodName()
        );

        result.put(
            "amount",
            number(
                entry.getAmount()
            )
        );

        result.put(
            "unit",
            entry.getUnit()
        );

        result.put(
            "cookingMethod",
            entry.getCookingMethod()
        );

        result.put(
            "preparation",
            entry.getPreparation()
        );

        result.put(
            "oilAmount",
            number(
                entry.getOilAmount()
            )
        );

        result.put(
            "calories",
            number(
                entry.getCalories()
            )
        );

        result.put(
            "protein",
            number(
                entry.getProtein()
            )
        );

        result.put(
            "carbs",
            number(
                entry.getCarbs()
            )
        );

        result.put(
            "fat",
            number(
                entry.getFat()
            )
        );

        result.put(
            "createdAt",
            entry.getCreatedAt() == null
                ? null
                : entry.getCreatedAt().toString()
        );

        return result;
    }

    private BigDecimal nutritionValue(
        BigDecimal value
    ) {

        return value.setScale(
            2,
            RoundingMode.HALF_UP
        );
    }

    private BigDecimal decimal(
        double value,
        int scale
    ) {

        return BigDecimal
            .valueOf(value)
            .setScale(
                scale,
                RoundingMode.HALF_UP
            );
    }

    private Double number(
        BigDecimal value
    ) {

        if (value == null) {
            return null;
        }

        return value.doubleValue();
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
            NumberFormatException exception
        ) {

            return null;
        }
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
            session.getAttribute(
                "userId"
            );

        if (
            userId instanceof Number
        ) {

            return ((Number) userId)
                .longValue();
        }

        return null;
    }

    private void writeUnauthorized(
        HttpServletResponse response
    ) throws IOException {

        writeJson(
            response,
            HttpServletResponse.SC_UNAUTHORIZED,
            Map.of(
                "success", false,
                "message", "Not authenticated."
            )
        );
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

    private static class MealEntryRequest {

        private Long id;
        private Long foodId;
        private String entryDate;
        private String mealType;
        private Double amount;
        private String cookingMethod;
        private String preparation;
        private Double oilAmount;
    }
}
