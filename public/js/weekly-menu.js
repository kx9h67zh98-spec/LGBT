(function () {
    "use strict";

    const basePath =
        window.location.pathname.substring(
            0,
            window.location.pathname.lastIndexOf("/") + 1
        );

    const mealApi =
        basePath + "api/meal-entries";

    const DAYS = 7;

    const MEAL_CONFIG = [
        {
            type: "breakfast",
            label: "Breakfast",
            calorieShare: 0.25,
            slots: [
                { pool: "carbs", share: 0.55 },
                { pool: "breakfastProtein", share: 0.45 }
            ]
        },
        {
            type: "lunch",
            label: "Lunch",
            calorieShare: 0.35,
            slots: [
                { pool: "protein", share: 0.45 },
                { pool: "carbs", share: 0.40 },
                { pool: "vegetable", share: 0.15 }
            ]
        },
        {
            type: "afternoon",
            label: "Afternoon Snack",
            calorieShare: 0.15,
            slots: [
                { pool: "fruit", share: 0.55 },
                { pool: "dairy", share: 0.45 }
            ]
        },
        {
            type: "dinner",
            label: "Dinner",
            calorieShare: 0.25,
            slots: [
                { pool: "protein", share: 0.45 },
                { pool: "carbs", share: 0.35 },
                { pool: "vegetable", share: 0.20 }
            ]
        }
    ];

    let weeklyPlan = [];
    let saving = false;

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            injectPlanner();
            setDefaultWeek();
            bindPlanner();
        }
    );

    function injectPlanner() {
        const nutritionTab =
            document.getElementById("nutritionTab");

        if (
            !nutritionTab
            ||
            document.getElementById("weeklyMenuPanel")
        ) {
            return;
        }

        nutritionTab.insertAdjacentHTML(
            "beforeend",
            `
            <section class="weekly-menu-section mt-4" id="weeklyMenuPanel">
                <div class="weekly-menu-heading">
                    <div>
                        <p class="text-success fw-bold mb-1">7-DAY MEAL PLANNER</p>
                        <h2 class="fw-bold mb-1">Weekly Food Menu</h2>
                        <p class="text-body-secondary mb-0">
                            Generate a 7-day menu from your calorie target and FitHealth food database.
                        </p>
                    </div>
                    <div class="weekly-menu-heading-icon" aria-hidden="true">
                        <i class="bi bi-calendar2-week"></i>
                    </div>
                </div>

                <div class="weekly-menu-controls mt-4">
                    <div class="weekly-menu-field">
                        <label for="weeklyMenuStart" class="form-label fw-semibold">
                            Week starting
                        </label>
                        <input
                            type="date"
                            class="form-control"
                            id="weeklyMenuStart"
                        >
                        <small class="text-body-secondary">
                            FitHealth will use the Monday of the selected week.
                        </small>
                    </div>

                    <div class="weekly-menu-actions">
                        <button
                            type="button"
                            class="btn btn-success"
                            id="generateWeeklyMenu"
                        >
                            <i class="bi bi-stars me-2"></i>
                            Generate 7-Day Menu
                        </button>

                        <button
                            type="button"
                            class="btn btn-outline-success"
                            id="saveWeeklyMenu"
                            disabled
                        >
                            <i class="bi bi-database-check me-2"></i>
                            Save Week to Meals
                        </button>
                    </div>
                </div>

                <div
                    class="alert d-none mt-3 mb-0"
                    id="weeklyMenuMessage"
                    role="alert"
                    aria-live="polite"
                    aria-atomic="true"
                ></div>

                <div
                    class="weekly-menu-summary mt-4 d-none"
                    id="weeklyMenuSummary"
                ></div>

                <div
                    class="weekly-menu-days mt-3"
                    id="weeklyMenuDays"
                ></div>

                <p class="small text-body-secondary mt-3 mb-0">
                    The generated menu is a planning aid based on the foods currently stored in FitHealth.
                    It is not medical advice. You can edit or delete saved items later in Food Tracker.
                </p>
            </section>
            `
        );
    }

    function bindPlanner() {
        const generateButton =
            document.getElementById("generateWeeklyMenu");

        const saveButton =
            document.getElementById("saveWeeklyMenu");

        const startInput =
            document.getElementById("weeklyMenuStart");

        if (generateButton) {
            generateButton.addEventListener(
                "click",
                generateWeeklyMenu
            );
        }

        if (saveButton) {
            saveButton.addEventListener(
                "click",
                saveWeeklyMenu
            );
        }

        if (startInput) {
            startInput.addEventListener(
                "change",
                function () {
                    const selected =
                        parseDate(startInput.value);

                    if (!selected) {
                        return;
                    }

                    startInput.value =
                        dateString(
                            getMonday(selected)
                        );

                    weeklyPlan = [];
                    renderPlan();
                }
            );
        }
    }

    function setDefaultWeek() {
        const input =
            document.getElementById("weeklyMenuStart");

        if (!input) {
            return;
        }

        input.value =
            dateString(
                getMonday(new Date())
            );
    }

    function generateWeeklyMenu() {
        const bridge =
            window.FitHealthNutrition;

        if (!bridge) {
            showMessage(
                "Nutrition data is still loading. Please try again.",
                "warning"
            );
            return;
        }

        const profile =
            bridge.getProfile();

        const foods =
            (bridge.getFoods() || [])
                .filter(
                    function (food) {
                        return (
                            food
                            &&
                            Number(food.id) > 0
                            &&
                            Number(food.calories) > 0
                        );
                    }
                );

        if (!profile) {
            showMessage(
                "Complete and save your Health Profile before generating a weekly menu.",
                "warning"
            );
            return;
        }

        if (!foods.length) {
            showMessage(
                "The FitHealth food database is empty or still loading.",
                "warning"
            );
            return;
        }

        const targetCalories =
            Number(profile.targetCalories);

        if (
            !Number.isFinite(targetCalories)
            ||
            targetCalories <= 0
        ) {
            showMessage(
                "Your Health Profile does not contain a valid calorie target.",
                "warning"
            );
            return;
        }

        const input =
            document.getElementById("weeklyMenuStart");

        const selected =
            parseDate(
                input ? input.value : ""
            )
            ||
            new Date();

        const monday =
            getMonday(selected);

        if (input) {
            input.value =
                dateString(monday);
        }

        const pools =
            buildFoodPools(foods);

        weeklyPlan = [];

        for (
            let dayIndex = 0;
            dayIndex < DAYS;
            dayIndex += 1
        ) {
            const date =
                addDays(monday, dayIndex);

            const day =
                buildDayPlan(
                    date,
                    dayIndex,
                    targetCalories,
                    pools,
                    foods
                );

            weeklyPlan.push(day);
        }

        renderPlan();

        showMessage(
            "Weekly menu generated. Review the meals, then save the week when ready.",
            "success"
        );
    }

    function buildDayPlan(
        date,
        dayIndex,
        targetCalories,
        pools,
        allFoods
    ) {
        const usedFoodIds =
            new Set();

        const meals =
            MEAL_CONFIG.map(
                function (meal, mealIndex) {
                    const mealTarget =
                        targetCalories
                        *
                        meal.calorieShare;

                    const items =
                        meal.slots.map(
                            function (slot, slotIndex) {
                                const pool =
                                    pools[slot.pool]
                                    &&
                                    pools[slot.pool].length
                                        ?
                                        pools[slot.pool]
                                        :
                                        allFoods;

                                const food =
                                    pickFood(
                                        pool,
                                        dayIndex,
                                        mealIndex,
                                        slotIndex,
                                        usedFoodIds
                                    );

                                if (!food) {
                                    return null;
                                }

                                usedFoodIds.add(
                                    Number(food.id)
                                );

                                const desiredCalories =
                                    mealTarget
                                    *
                                    slot.share;

                                return buildPlannedItem(
                                    food,
                                    desiredCalories,
                                    meal.type
                                );
                            }
                        )
                        .filter(Boolean);

                    return {
                        type: meal.type,
                        label: meal.label,
                        targetCalories: mealTarget,
                        items: items
                    };
                }
            );

        const totals =
            totalPlanItems(
                meals.flatMap(
                    function (meal) {
                        return meal.items;
                    }
                )
            );

        return {
            date: dateString(date),
            label: formatDayLabel(date),
            meals: meals,
            totals: totals,
            targetCalories: targetCalories
        };
    }

    function buildFoodPools(foods) {
        const pools = {
            protein: [],
            carbs: [],
            fruit: [],
            vegetable: [],
            dairy: [],
            supplement: [],
            breakfastProtein: []
        };

        foods.forEach(
            function (food) {
                const category =
                    String(
                        food.category || ""
                    ).toLowerCase();

                if (category.includes("protein")) {
                    pools.protein.push(food);
                }

                if (
                    category.includes("carbo")
                    ||
                    category.includes("grain")
                ) {
                    pools.carbs.push(food);
                }

                if (category.includes("fruit")) {
                    pools.fruit.push(food);
                }

                if (
                    category.includes("vegetable")
                    ||
                    category.includes("veggie")
                ) {
                    pools.vegetable.push(food);
                }

                if (category.includes("dairy")) {
                    pools.dairy.push(food);
                }

                if (
                    category.includes("supplement")
                    ||
                    Boolean(food.supplement)
                ) {
                    pools.supplement.push(food);
                }
            }
        );

        pools.breakfastProtein =
            pools.dairy.concat(
                pools.protein
            );

        fillPool(
            pools.protein,
            foods.filter(
                function (food) {
                    return Number(food.protein) >= 10;
                }
            )
        );

        fillPool(
            pools.carbs,
            foods.filter(
                function (food) {
                    return Number(food.carbs) >= 15;
                }
            )
        );

        fillPool(
            pools.fruit,
            foods
        );

        fillPool(
            pools.vegetable,
            foods
        );

        fillPool(
            pools.dairy,
            pools.protein.length
                ? pools.protein
                : foods
        );

        fillPool(
            pools.breakfastProtein,
            pools.protein.length
                ? pools.protein
                : foods
        );

        return pools;
    }

    function fillPool(target, fallback) {
        if (
            target.length
            ||
            !fallback
            ||
            !fallback.length
        ) {
            return;
        }

        fallback.forEach(
            function (food) {
                target.push(food);
            }
        );
    }

    function pickFood(
        pool,
        dayIndex,
        mealIndex,
        slotIndex,
        usedFoodIds
    ) {
        if (!pool || !pool.length) {
            return null;
        }

        const start =
            (
                dayIndex * 3
                +
                mealIndex * 2
                +
                slotIndex
            )
            %
            pool.length;

        for (
            let offset = 0;
            offset < pool.length;
            offset += 1
        ) {
            const candidate =
                pool[
                    (start + offset)
                    %
                    pool.length
                ];

            if (
                candidate
                &&
                !usedFoodIds.has(
                    Number(candidate.id)
                )
            ) {
                return candidate;
            }
        }

        return pool[start];
    }

    function buildPlannedItem(
        food,
        desiredCalories,
        mealType
    ) {
        const amount =
            calculateAmount(
                food,
                desiredCalories
            );

        const nutrition =
            calculateNutrition(
                food,
                amount
            );

        return {
            foodId: Number(food.id),
            foodName: food.name,
            category: food.category || "",
            nutritionType: food.nutritionType || "per100g",
            servingUnit: food.servingUnit || "serving",
            cookingRequired: Boolean(food.cookingRequired),
            supplement: Boolean(food.supplement),
            mealType: mealType,
            amount: amount,
            cookingMethod:
                food.cookingRequired
                    ? "grilled"
                    : null,
            preparation:
                food.supplement
                    ? "water"
                    : null,
            oilAmount: 0,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat
        };
    }

    function calculateAmount(
        food,
        desiredCalories
    ) {
        const calories =
            Math.max(
                Number(food.calories) || 0,
                1
            );

        if (
            String(food.nutritionType).toLowerCase()
            ===
            "serving"
        ) {
            const servings =
                desiredCalories
                /
                calories;

            return clamp(
                Math.round(servings * 2) / 2,
                0.5,
                3
            );
        }

        const grams =
            desiredCalories
            /
            calories
            *
            100;

        return Math.round(
            clamp(
                grams,
                40,
                350
            )
        );
    }

    function calculateNutrition(
        food,
        amount
    ) {
        const ratio =
            String(food.nutritionType).toLowerCase()
            ===
            "serving"
                ?
                amount
                :
                amount / 100;

        return {
            calories:
                (Number(food.calories) || 0)
                *
                ratio,
            protein:
                (Number(food.protein) || 0)
                *
                ratio,
            carbs:
                (Number(food.carbs) || 0)
                *
                ratio,
            fat:
                (Number(food.fat) || 0)
                *
                ratio
        };
    }

    function renderPlan() {
        const container =
            document.getElementById("weeklyMenuDays");

        const summary =
            document.getElementById("weeklyMenuSummary");

        const saveButton =
            document.getElementById("saveWeeklyMenu");

        if (!container || !summary) {
            return;
        }

        if (!weeklyPlan.length) {
            container.innerHTML = "";
            summary.innerHTML = "";
            summary.classList.add("d-none");

            if (saveButton) {
                saveButton.disabled = true;
            }

            return;
        }

        const averageCalories =
            average(
                weeklyPlan.map(
                    function (day) {
                        return day.totals.calories;
                    }
                )
            );

        const averageProtein =
            average(
                weeklyPlan.map(
                    function (day) {
                        return day.totals.protein;
                    }
                )
            );

        const targetCalories =
            weeklyPlan[0].targetCalories;

        summary.classList.remove("d-none");
        summary.innerHTML =
            `
            <div>
                <span>Week</span>
                <strong>
                    ${escapeHtml(weeklyPlan[0].date)}
                    –
                    ${escapeHtml(weeklyPlan[weeklyPlan.length - 1].date)}
                </strong>
            </div>
            <div>
                <span>Daily calorie target</span>
                <strong>${Math.round(targetCalories)} kcal</strong>
            </div>
            <div>
                <span>Planned daily average</span>
                <strong>${Math.round(averageCalories)} kcal</strong>
            </div>
            <div>
                <span>Average protein</span>
                <strong>${oneDecimal(averageProtein)} g</strong>
            </div>
            `;

        container.innerHTML =
            weeklyPlan.map(
                renderDay
            ).join("");

        if (saveButton) {
            saveButton.disabled = false;
        }
    }

    function renderDay(day) {
        const calorieCoverage =
            day.targetCalories > 0
                ?
                Math.round(
                    day.totals.calories
                    /
                    day.targetCalories
                    *
                    100
                )
                :
                0;

        return `
            <article class="weekly-menu-day">
                <div class="weekly-menu-day-header">
                    <div>
                        <span class="weekly-menu-date">${escapeHtml(day.date)}</span>
                        <h3>${escapeHtml(day.label)}</h3>
                    </div>
                    <div class="weekly-menu-day-total">
                        <strong>${Math.round(day.totals.calories)} kcal</strong>
                        <span>${calorieCoverage}% of target</span>
                    </div>
                </div>

                <div class="weekly-menu-macros">
                    ${macroPill("Protein", day.totals.protein, "g")}
                    ${macroPill("Carbs", day.totals.carbs, "g")}
                    ${macroPill("Fat", day.totals.fat, "g")}
                </div>

                <div class="weekly-menu-meals">
                    ${day.meals.map(renderMeal).join("")}
                </div>
            </article>
        `;
    }

    function renderMeal(meal) {
        return `
            <div class="weekly-menu-meal">
                <div class="weekly-menu-meal-title">
                    <strong>${escapeHtml(meal.label)}</strong>
                    <span>
                        ${Math.round(
                            totalPlanItems(meal.items).calories
                        )} kcal
                    </span>
                </div>

                <div class="weekly-menu-food-list">
                    ${meal.items.map(renderFoodItem).join("")}
                </div>
            </div>
        `;
    }

    function renderFoodItem(item) {
        const unit =
            item.nutritionType === "serving"
                ?
                item.servingUnit
                :
                "g";

        const amountText =
            item.nutritionType === "serving"
                ?
                `${oneDecimal(item.amount)} ${unit}`
                :
                `${Math.round(item.amount)} ${unit}`;

        return `
            <div class="weekly-menu-food">
                <div>
                    <strong>${escapeHtml(item.foodName)}</strong>
                    <span>${escapeHtml(amountText)}</span>
                </div>
                <small>
                    ${Math.round(item.calories)} kcal
                    ·
                    ${oneDecimal(item.protein)}P
                    ·
                    ${oneDecimal(item.carbs)}C
                    ·
                    ${oneDecimal(item.fat)}F
                </small>
            </div>
        `;
    }

    async function saveWeeklyMenu() {
        if (
            saving
            ||
            !weeklyPlan.length
        ) {
            return;
        }

        saving = true;
        setSavingState(true);

        let created = 0;
        let skipped = 0;
        let failed = 0;

        try {
            for (
                let dayIndex = 0;
                dayIndex < weeklyPlan.length;
                dayIndex += 1
            ) {
                const day =
                    weeklyPlan[dayIndex];

                showMessage(
                    `Saving ${day.label} (${dayIndex + 1}/${weeklyPlan.length})...`,
                    "info"
                );

                const existing =
                    await loadExistingMeals(
                        day.date
                    );

                const existingKeys =
                    new Set(
                        existing.map(
                            duplicateKeyFromExisting
                        )
                    );

                const items =
                    day.meals.flatMap(
                        function (meal) {
                            return meal.items;
                        }
                    );

                const results =
                    await Promise.all(
                        items.map(
                            async function (item) {
                                const key =
                                    duplicateKey(
                                        item.mealType,
                                        item.foodId,
                                        item.amount
                                    );

                                if (existingKeys.has(key)) {
                                    return "skipped";
                                }

                                try {
                                    await saveItem(
                                        day.date,
                                        item
                                    );

                                    return "created";
                                } catch (error) {
                                    console.error(
                                        "Weekly menu item save error:",
                                        error
                                    );

                                    return "failed";
                                }
                            }
                        )
                    );

                results.forEach(
                    function (result) {
                        if (result === "created") {
                            created += 1;
                        } else if (result === "skipped") {
                            skipped += 1;
                        } else {
                            failed += 1;
                        }
                    }
                );
            }

            const messageParts = [
                `${created} meal item${created === 1 ? "" : "s"} saved`
            ];

            if (skipped) {
                messageParts.push(
                    `${skipped} duplicate${skipped === 1 ? "" : "s"} skipped`
                );
            }

            if (failed) {
                messageParts.push(
                    `${failed} failed`
                );
            }

            showMessage(
                messageParts.join(" · "),
                failed ? "warning" : "success"
            );

            refreshCurrentMealDate();

            if (
                window.FitHealthInsights
                &&
                typeof window.FitHealthInsights.refresh
                    ===
                    "function"
            ) {
                window.FitHealthInsights.refresh();
            }
        } catch (error) {
            console.error(
                "Weekly menu save error:",
                error
            );

            showMessage(
                error.message
                ||
                "Unable to save the weekly menu.",
                "danger"
            );
        } finally {
            saving = false;
            setSavingState(false);
        }
    }

    async function loadExistingMeals(date) {
        const response =
            await fetch(
                `${mealApi}?date=${encodeURIComponent(date)}`,
                {
                    credentials: "same-origin",
                    cache: "no-store"
                }
            );

        if (response.status === 401) {
            window.location.href =
                "login.html";

            throw new Error(
                "Authentication required."
            );
        }

        const data =
            await readJson(response);

        if (
            !response.ok
            ||
            !data.success
        ) {
            throw new Error(
                data.message
                ||
                "Unable to check existing meals."
            );
        }

        return data.entries || [];
    }

    async function saveItem(
        date,
        item
    ) {
        const body = {
            foodId: item.foodId,
            entryDate: date,
            mealType: item.mealType,
            amount: Number(
                Number(item.amount).toFixed(2)
            ),
            cookingMethod:
                item.cookingMethod,
            preparation:
                item.preparation,
            oilAmount:
                Number(item.oilAmount) || 0
        };

        const response =
            await fetch(
                mealApi,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    credentials:
                        "same-origin",
                    cache:
                        "no-store",
                    body:
                        JSON.stringify(body)
                }
            );

        if (response.status === 401) {
            window.location.href =
                "login.html";

            throw new Error(
                "Authentication required."
            );
        }

        const data =
            await readJson(response);

        if (
            !response.ok
            ||
            !data.success
        ) {
            throw new Error(
                data.message
                ||
                "Unable to save a planned meal."
            );
        }

        return data.entry;
    }

    function refreshCurrentMealDate() {
        const mealDate =
            document.getElementById("mealDate");

        if (!mealDate) {
            return;
        }

        mealDate.dispatchEvent(
            new Event("change")
        );
    }

    function setSavingState(isSaving) {
        const generateButton =
            document.getElementById("generateWeeklyMenu");

        const saveButton =
            document.getElementById("saveWeeklyMenu");

        const startInput =
            document.getElementById("weeklyMenuStart");

        if (generateButton) {
            generateButton.disabled =
                isSaving;
        }

        if (startInput) {
            startInput.disabled =
                isSaving;
        }

        if (saveButton) {
            saveButton.disabled =
                isSaving
                ||
                !weeklyPlan.length;

            saveButton.innerHTML =
                isSaving
                    ?
                    '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Saving Week...'
                    :
                    '<i class="bi bi-database-check me-2"></i>Save Week to Meals';
        }
    }

    function duplicateKeyFromExisting(entry) {
        return duplicateKey(
            entry.mealType,
            Number(entry.foodId),
            Number(entry.amount)
        );
    }

    function duplicateKey(
        mealType,
        foodId,
        amount
    ) {
        return [
            mealType || "",
            Number(foodId) || 0,
            Number(amount || 0).toFixed(2)
        ].join("|");
    }

    function totalPlanItems(items) {
        return (items || []).reduce(
            function (total, item) {
                total.calories +=
                    Number(item.calories) || 0;

                total.protein +=
                    Number(item.protein) || 0;

                total.carbs +=
                    Number(item.carbs) || 0;

                total.fat +=
                    Number(item.fat) || 0;

                return total;
            },
            {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        );
    }

    function macroPill(
        label,
        value,
        unit
    ) {
        return `
            <span>
                <strong>${escapeHtml(label)}</strong>
                ${oneDecimal(value)} ${escapeHtml(unit)}
            </span>
        `;
    }

    function showMessage(
        message,
        type
    ) {
        const box =
            document.getElementById("weeklyMenuMessage");

        if (!box) {
            return;
        }

        box.className =
            `alert alert-${type || "info"} mt-3 mb-0`;

        box.textContent =
            message || "";

        box.classList.toggle(
            "d-none",
            !message
        );
    }

    async function readJson(response) {
        try {
            return await response.json();
        } catch (error) {
            return {
                success: false,
                message:
                    "The server returned an invalid response."
            };
        }
    }

    function getMonday(date) {
        const result =
            new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );

        const day =
            result.getDay();

        const difference =
            day === 0
                ?
                -6
                :
                1 - day;

        result.setDate(
            result.getDate()
            +
            difference
        );

        return result;
    }

    function addDays(
        date,
        days
    ) {
        const result =
            new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );

        result.setDate(
            result.getDate()
            +
            days
        );

        return result;
    }

    function parseDate(value) {
        if (!value) {
            return null;
        }

        const parts =
            String(value)
                .split("-")
                .map(Number);

        if (
            parts.length !== 3
            ||
            parts.some(
                function (part) {
                    return !Number.isFinite(part);
                }
            )
        ) {
            return null;
        }

        return new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );
    }

    function dateString(date) {
        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function formatDayLabel(date) {
        return new Intl.DateTimeFormat(
            "en",
            {
                weekday: "long",
                month: "short",
                day: "numeric"
            }
        ).format(date);
    }

    function average(values) {
        if (!values || !values.length) {
            return 0;
        }

        return (
            values.reduce(
                function (total, value) {
                    return total
                        +
                        (Number(value) || 0);
                },
                0
            )
            /
            values.length
        );
    }

    function oneDecimal(value) {
        return (
            Number(value) || 0
        ).toFixed(1);
    }

    function clamp(
        value,
        minimum,
        maximum
    ) {
        return Math.min(
            Math.max(value, minimum),
            maximum
        );
    }

    function escapeHtml(value) {
        return String(
            value === null
            ||
            value === undefined
                ?
                ""
                :
                value
        )
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
})();