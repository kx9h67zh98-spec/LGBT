/* Food Database */

const foods = [

    {
        id: 1,
        name: "Chicken Breast",
        category: "Protein",
        nutritionType: "per100g",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        cookingRequired: true
    },

    {
        id: 2,
        name: "Chicken Thigh",
        category: "Protein",
        nutritionType: "per100g",
        calories: 209,
        protein: 26,
        carbs: 0,
        fat: 11,
        cookingRequired: true
    },

    {
        id: 3,
        name: "Beef",
        category: "Protein",
        nutritionType: "per100g",
        calories: 250,
        protein: 26,
        carbs: 0,
        fat: 15,
        cookingRequired: true
    },

    {
        id: 4,
        name: "Salmon",
        category: "Protein",
        nutritionType: "per100g",
        calories: 208,
        protein: 20,
        carbs: 0,
        fat: 13,
        cookingRequired: true
    },

    {
        id: 5,
        name: "Egg",
        category: "Protein",
        nutritionType: "per100g",
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fat: 11,
        cookingRequired: true
    },

    {
        id: 6,
        name: "White Rice",
        category: "Carbohydrates",
        nutritionType: "per100g",
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        cookingRequired: false
    },

    {
        id: 7,
        name: "Brown Rice",
        category: "Carbohydrates",
        nutritionType: "per100g",
        calories: 123,
        protein: 2.7,
        carbs: 25.6,
        fat: 1,
        cookingRequired: false
    },

    {
        id: 8,
        name: "Sweet Potato",
        category: "Carbohydrates",
        nutritionType: "per100g",
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fat: 0.1,
        cookingRequired: true
    },

    {
        id: 9,
        name: "Oats",
        category: "Carbohydrates",
        nutritionType: "per100g",
        calories: 389,
        protein: 16.9,
        carbs: 66.3,
        fat: 6.9,
        cookingRequired: false
    },

    {
        id: 10,
        name: "Pasta",
        category: "Carbohydrates",
        nutritionType: "per100g",
        calories: 131,
        protein: 5,
        carbs: 25,
        fat: 1.1,
        cookingRequired: false
    },

    {
        id: 11,
        name: "Banana",
        category: "Fruit",
        nutritionType: "per100g",
        calories: 89,
        protein: 1.1,
        carbs: 22.8,
        fat: 0.3,
        cookingRequired: false
    },

    {
        id: 12,
        name: "Apple",
        category: "Fruit",
        nutritionType: "per100g",
        calories: 52,
        protein: 0.3,
        carbs: 13.8,
        fat: 0.2,
        cookingRequired: false
    },

    {
        id: 13,
        name: "Avocado",
        category: "Fruit",
        nutritionType: "per100g",
        calories: 160,
        protein: 2,
        carbs: 8.5,
        fat: 14.7,
        cookingRequired: false
    },

    {
        id: 14,
        name: "Broccoli",
        category: "Vegetable",
        nutritionType: "per100g",
        calories: 35,
        protein: 2.4,
        carbs: 7.2,
        fat: 0.4,
        cookingRequired: true
    },

    {
        id: 15,
        name: "Greek Yogurt",
        category: "Dairy",
        nutritionType: "per100g",
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        cookingRequired: false
    },

    {
        id: 16,
        name: "Milk",
        category: "Dairy",
        nutritionType: "per100g",
        calories: 61,
        protein: 3.2,
        carbs: 4.8,
        fat: 3.3,
        cookingRequired: false
    },

    {
        id: 17,
        name: "NutraBio Whey Protein",
        category: "Supplements",
        nutritionType: "serving",
        servingUnit: "scoop",
        servingSize: 32,
        calories: 120,
        protein: 25,
        carbs: 2,
        fat: 1,
        cookingRequired: false,
        supplement: true
    }

];


/* Cooking */

const cookingMethods = {
    raw: 0,
    boiled: 0,
    steamed: 0,
    grilled: 0,
    baked: 0,
    airFried: 2,
    panFried: 5,
    stirFried: 6,
    deepFried: 12
};


/* State */

let editingMealId = null;


/* Elements */

const tabButtons =
    document.querySelectorAll(
        ".health-tab"
    );

const healthTab =
    document.getElementById(
        "healthTab"
    );

const nutritionTab =
    document.getElementById(
        "nutritionTab"
    );

const healthForm =
    document.getElementById(
        "healthForm"
    );

const nutritionForm =
    document.getElementById(
        "nutritionForm"
    );

const healthEmpty =
    document.getElementById(
        "healthEmpty"
    );

const healthResults =
    document.getElementById(
        "healthResults"
    );

const foodSelect =
    document.getElementById(
        "food"
    );

const foodAmount =
    document.getElementById(
        "foodAmount"
    );

const amountUnit =
    document.getElementById(
        "amountUnit"
    );

const servingInformation =
    document.getElementById(
        "servingInformation"
    );

const cookingSection =
    document.getElementById(
        "cookingSection"
    );

const oilSection =
    document.getElementById(
        "oilSection"
    );

const supplementSection =
    document.getElementById(
        "supplementSection"
    );

const cookingMethod =
    document.getElementById(
        "cookingMethod"
    );

const oilAmount =
    document.getElementById(
        "oilAmount"
    );

const mealDate =
    document.getElementById(
        "mealDate"
    );

const mealType =
    document.getElementById(
        "mealType"
    );

const cancelEditButton =
    document.getElementById(
        "cancelEditButton"
    );


/* Start */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupTabs();

        populateFoods();

        setupDate();

        loadHealthProfile();

        updateFoodInterface();

        displayMeals();

    }
);


/* Tabs */

function setupTabs() {

    tabButtons.forEach(

        function (button) {

            button.addEventListener(
                "click",
                function () {

                    tabButtons.forEach(
                        function (item) {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    button.classList.add(
                        "active"
                    );

                    if (
                        button.dataset.tab ===
                        "health"
                    ) {

                        healthTab.classList.remove(
                            "d-none"
                        );

                        nutritionTab.classList.add(
                            "d-none"
                        );

                    } else {

                        healthTab.classList.add(
                            "d-none"
                        );

                        nutritionTab.classList.remove(
                            "d-none"
                        );

                        displayMeals();

                    }

                }
            );

        }

    );

}


/* Messages */

function showMessage(
    elementId,
    message,
    type
) {

    const element =
        document.getElementById(
            elementId
        );


    element.className =
        `alert alert-${type}`;


    element.textContent =
        message;


    element.classList.remove(
        "d-none"
    );


    setTimeout(
        function () {

            element.classList.add(
                "d-none"
            );

        },
        3000
    );

}


/* Health */

healthForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (
            !healthForm.checkValidity()
        ) {

            healthForm.reportValidity();

            return;

        }


        const age =
            Number(
                document.getElementById(
                    "age"
                ).value
            );

        const gender =
            document.getElementById(
                "gender"
            ).value;

        const height =
            Number(
                document.getElementById(
                    "height"
                ).value
            );

        const weight =
            Number(
                document.getElementById(
                    "weight"
                ).value
            );

        const activityLevel =
            Number(
                document.getElementById(
                    "activityLevel"
                ).value
            );

        const goal =
            document.getElementById(
                "goal"
            ).value;


        const bmi =
            calculateBMI(
                weight,
                height
            );

        const bmr =
            calculateBMR(
                gender,
                weight,
                height,
                age
            );

        const tdee =
            bmr *
            activityLevel;

        const targetCalories =
            calculateTargetCalories(
                tdee,
                goal
            );

        const macros =
            calculateMacros(
                targetCalories,
                weight
            );


        const profile = {
            age,
            gender,
            height,
            weight,
            activityLevel,
            goal,
            bmi,
            bmr,
            tdee,
            targetCalories,
            proteinTarget:
                macros.protein,
            carbsTarget:
                macros.carbs,
            fatTarget:
                macros.fat
        };


        FitHealthData
            .saveHealthProfile(
                profile
            );


        displayHealthResults(
            profile
        );


        displayMeals();


        showMessage(
            "healthMessage",
            "Health profile saved successfully.",
            "success"
        );

    }
);


/* BMI */

function calculateBMI(
    weight,
    height
) {

    const meters =
        height / 100;


    return (
        weight /
        (meters * meters)
    );

}


/* BMR */

function calculateBMR(
    gender,
    weight,
    height,
    age
) {

    const base =
        (10 * weight)
        +
        (6.25 * height)
        -
        (5 * age);


    if (
        gender ===
        "male"
    ) {

        return base + 5;

    }


    return base - 161;

}


/* Target */

function calculateTargetCalories(
    tdee,
    goal
) {

    if (
        goal ===
        "lose"
    ) {

        return Math.max(
            tdee - 500,
            1200
        );

    }


    if (
        goal ===
        "gain"
    ) {

        return tdee + 300;

    }


    return tdee;

}


/* Macros */

function calculateMacros(
    calories,
    weight
) {

    const protein =
        weight * 2;

    const proteinCalories =
        protein * 4;

    const fatCalories =
        calories * 0.25;

    const fat =
        fatCalories / 9;

    const remaining =
        Math.max(
            calories
            -
            proteinCalories
            -
            fatCalories,
            0
        );

    const carbs =
        remaining / 4;


    return {
        protein:
            Math.round(protein),

        carbs:
            Math.round(carbs),

        fat:
            Math.round(fat)
    };

}


/* BMI Status */

function getBMIStatus(
    bmi
) {

    if (
        bmi < 18.5
    ) {

        return "Underweight";

    }


    if (
        bmi < 25
    ) {

        return "Normal";

    }


    if (
        bmi < 30
    ) {

        return "Overweight";

    }


    return "Obesity";

}


/* Health Result */

function displayHealthResults(
    profile
) {

    healthEmpty.classList.add(
        "d-none"
    );

    healthResults.classList.remove(
        "d-none"
    );


    document.getElementById(
        "bmiResult"
    ).textContent =
        profile.bmi.toFixed(1);


    document.getElementById(
        "bmiStatus"
    ).textContent =
        getBMIStatus(
            profile.bmi
        );


    document.getElementById(
        "bmrResult"
    ).textContent =
        Math.round(
            profile.bmr
        );


    document.getElementById(
        "tdeeResult"
    ).textContent =
        Math.round(
            profile.tdee
        );


    document.getElementById(
        "calorieResult"
    ).textContent =
        Math.round(
            profile.targetCalories
        );


    document.getElementById(
        "proteinResult"
    ).textContent =
        `${profile.proteinTarget} g`;


    document.getElementById(
        "carbsResult"
    ).textContent =
        `${profile.carbsTarget} g`;


    document.getElementById(
        "fatResult"
    ).textContent =
        `${profile.fatTarget} g`;

}


/* Load Profile */

function loadHealthProfile() {

    const profile =
        FitHealthData
            .getHealthProfile();


    if (!profile) {
        return;
    }


    document.getElementById(
        "age"
    ).value =
        profile.age;

    document.getElementById(
        "gender"
    ).value =
        profile.gender;

    document.getElementById(
        "height"
    ).value =
        profile.height;

    document.getElementById(
        "weight"
    ).value =
        profile.weight;

    document.getElementById(
        "activityLevel"
    ).value =
        profile.activityLevel;

    document.getElementById(
        "goal"
    ).value =
        profile.goal;


    displayHealthResults(
        profile
    );

}


/* Foods */

function populateFoods() {

    foodSelect.innerHTML =
        "";


    const categories =
        [
            ...new Set(
                foods.map(
                    function (food) {
                        return food.category;
                    }
                )
            )
        ];


    categories.forEach(

        function (category) {

            const group =
                document.createElement(
                    "optgroup"
                );

            group.label =
                category;


            foods
                .filter(
                    function (food) {
                        return (
                            food.category ===
                            category
                        );
                    }
                )
                .forEach(
                    function (food) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            food.id;

                        option.textContent =
                            food.name;

                        group.appendChild(
                            option
                        );

                    }
                );


            foodSelect.appendChild(
                group
            );

        }

    );

}


function getSelectedFood() {

    const id =
        Number(
            foodSelect.value
        );


    return foods.find(
        function (food) {
            return food.id === id;
        }
    );

}


/* Food UI */

function updateFoodInterface() {

    const food =
        getSelectedFood();


    if (!food) {
        return;
    }


    if (
        food.nutritionType ===
        "serving"
    ) {

        foodAmount.value =
            1;

        foodAmount.min =
            0.5;

        foodAmount.step =
            0.5;

        amountUnit.textContent =
            food.servingUnit;

        servingInformation.textContent =
            `1 ${food.servingUnit} = ${food.servingSize} g`;

        servingInformation.classList.remove(
            "d-none"
        );

        cookingSection.classList.add(
            "d-none"
        );

        oilSection.classList.add(
            "d-none"
        );

        supplementSection.classList.remove(
            "d-none"
        );

        oilAmount.value =
            0;

    } else {

        foodAmount.value =
            100;

        foodAmount.min =
            1;

        foodAmount.step =
            1;

        amountUnit.textContent =
            "g";

        servingInformation.classList.add(
            "d-none"
        );

        supplementSection.classList.add(
            "d-none"
        );


        if (
            food.cookingRequired
        ) {

            cookingSection.classList.remove(
                "d-none"
            );

            oilSection.classList.remove(
                "d-none"
            );

        } else {

            cookingSection.classList.add(
                "d-none"
            );

            oilSection.classList.add(
                "d-none"
            );

            oilAmount.value =
                0;

        }

    }


    updateEstimatedOil();

    updateNutritionPreview();

}


/* Events */

foodSelect.addEventListener(
    "change",
    updateFoodInterface
);


foodAmount.addEventListener(
    "input",
    function () {

        updateEstimatedOil();

        updateNutritionPreview();

    }
);


cookingMethod.addEventListener(
    "change",
    function () {

        updateEstimatedOil();

        updateNutritionPreview();

    }
);


oilAmount.addEventListener(
    "input",
    updateNutritionPreview
);


/* Date */

function setupDate() {

    mealDate.value =
        getTodayString();

}


function getTodayString() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


mealDate.addEventListener(
    "change",
    displayMeals
);


/* Oil */

function updateEstimatedOil() {

    const food =
        getSelectedFood();


    if (
        !food
        ||
        food.nutritionType ===
        "serving"
        ||
        !food.cookingRequired
    ) {

        oilAmount.value =
            0;

        return;

    }


    const amount =
        Number(
            foodAmount.value
        );


    const oilPer100 =
        cookingMethods[
            cookingMethod.value
        ]
        ||
        0;


    const oil =
        (
            amount /
            100
        )
        *
        oilPer100;


    oilAmount.value =
        oil.toFixed(1);

}


/* Calculate Food */

function calculateFoodNutrition() {

    const food =
        getSelectedFood();


    if (!food) {
        return null;
    }


    const amount =
        Number(
            foodAmount.value
        );


    if (
        amount <= 0
    ) {

        return null;

    }


    if (
        food.nutritionType ===
        "serving"
    ) {

        return {
            food,
            amount,
            unit:
                food.servingUnit,

            calories:
                food.calories *
                amount,

            protein:
                food.protein *
                amount,

            carbs:
                food.carbs *
                amount,

            fat:
                food.fat *
                amount,

            oil: 0
        };

    }


    const ratio =
        amount / 100;


    const oil =
        food.cookingRequired
            ?
            Number(
                oilAmount.value
            )
            ||
            0
            :
            0;


    return {
        food,
        amount,
        unit: "g",

        calories:
            (
                food.calories *
                ratio
            )
            +
            (
                oil * 9
            ),

        protein:
            food.protein *
            ratio,

        carbs:
            food.carbs *
            ratio,

        fat:
            (
                food.fat *
                ratio
            )
            +
            oil,

        oil
    };

}


/* Preview */

function updateNutritionPreview() {

    const result =
        calculateFoodNutrition();


    if (!result) {

        setNutritionPreview(
            0,
            0,
            0,
            0
        );

        return;

    }


    setNutritionPreview(
        result.calories,
        result.protein,
        result.carbs,
        result.fat
    );

}


function setNutritionPreview(
    calories,
    protein,
    carbs,
    fat
) {

    document.getElementById(
        "previewCalories"
    ).textContent =
        `${Math.round(calories)} kcal`;


    document.getElementById(
        "previewProtein"
    ).textContent =
        `${Number(protein).toFixed(1)} g`;


    document.getElementById(
        "previewCarbs"
    ).textContent =
        `${Number(carbs).toFixed(1)} g`;


    document.getElementById(
        "previewFat"
    ).textContent =
        `${Number(fat).toFixed(1)} g`;

}


/* Meal Submit */

nutritionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (
            !nutritionForm.checkValidity()
        ) {

            nutritionForm.reportValidity();

            return;

        }


        const result =
            calculateFoodNutrition();


        if (!result) {
            return;
        }


        const food =
            result.food;


        const entry = {

            id:
                editingMealId
                ||
                Date.now(),

            date:
                mealDate.value,

            mealType:
                mealType.value,

            foodId:
                food.id,

            foodName:
                food.name,

            amount:
                result.amount,

            unit:
                result.unit,

            cookingMethod:
                food.cookingRequired
                    ?
                    cookingMethod.value
                    :
                    null,

            preparation:
                food.supplement
                    ?
                    document.getElementById(
                        "supplementPreparation"
                    ).value
                    :
                    null,

            oilAmount:
                Number(
                    result.oil.toFixed(1)
                ),

            calories:
                Math.round(
                    result.calories
                ),

            protein:
                Number(
                    result.protein.toFixed(1)
                ),

            carbs:
                Number(
                    result.carbs.toFixed(1)
                ),

            fat:
                Number(
                    result.fat.toFixed(1)
                )

        };


        if (
            editingMealId
        ) {

            FitHealthData
                .updateMealEntry(
                    entry
                );


            showMessage(
                "nutritionMessage",
                "Meal updated successfully.",
                "success"
            );

        } else {

            FitHealthData
                .addMealEntry(
                    entry
                );


            showMessage(
                "nutritionMessage",
                "Meal added successfully.",
                "success"
            );

        }


        finishMealEdit();

        displayMeals();

    }
);


/* Edit Meal */

function startMealEdit(
    entry
) {

    editingMealId =
        entry.id;


    mealDate.value =
        entry.date;

    mealType.value =
        entry.mealType;

    foodSelect.value =
        String(
            entry.foodId
        );


    updateFoodInterface();


    foodAmount.value =
        entry.amount;


    if (
        entry.cookingMethod
    ) {

        cookingMethod.value =
            entry.cookingMethod;

    }


    if (
        entry.oilAmount !==
        undefined
    ) {

        oilAmount.value =
            entry.oilAmount;

    }


    if (
        entry.preparation
    ) {

        document.getElementById(
            "supplementPreparation"
        ).value =
            entry.preparation;

    }


    document.getElementById(
        "nutritionFormTitle"
    ).textContent =
        "Edit Food";


    document.getElementById(
        "mealSubmitText"
    ).textContent =
        "Update Meal";


    document
        .getElementById(
            "mealSubmitButton"
        )
        .querySelector("i")
        .className =
            "bi bi-check-circle-fill me-2";


    cancelEditButton.classList.remove(
        "d-none"
    );


    updateNutritionPreview();


    document.getElementById(
        "nutritionFormPanel"
    ).scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "start"
        }
    );

}


function finishMealEdit() {

    const currentDate =
        mealDate.value;


    editingMealId =
        null;


    nutritionForm.reset();


    mealDate.value =
        currentDate;


    document.getElementById(
        "nutritionFormTitle"
    ).textContent =
        "Add Food";


    document.getElementById(
        "mealSubmitText"
    ).textContent =
        "Add Meal";


    document
        .getElementById(
            "mealSubmitButton"
        )
        .querySelector("i")
        .className =
            "bi bi-plus-circle-fill me-2";


    cancelEditButton.classList.add(
        "d-none"
    );


    updateFoodInterface();

}


cancelEditButton.addEventListener(
    "click",
    finishMealEdit
);


/* Display Meals */

function displayMeals() {

    updateSummaryTitle();


    const entries =
        FitHealthData
            .getMealEntriesByDate(
                mealDate.value
            );


    const container =
        document.getElementById(
            "mealList"
        );


    const groups = {
        breakfast:
            "Breakfast",

        lunch:
            "Lunch",

        afternoon:
            "Afternoon Snack",

        dinner:
            "Dinner"
    };


    container.innerHTML =
        "";


    Object.entries(
        groups
    ).forEach(

        function (
            [
                key,
                label
            ]
        ) {

            const mealEntries =
                entries.filter(
                    function (entry) {

                        return (
                            entry.mealType ===
                            key
                        );

                    }
                );


            const calories =
                mealEntries.reduce(
                    function (
                        total,
                        entry
                    ) {

                        return (
                            total
                            +
                            Number(
                                entry.calories
                            )
                        );

                    },
                    0
                );


            const group =
                document.createElement(
                    "div"
                );


            group.className =
                "meal-group";


            group.innerHTML = `
                <div class="meal-title">

                    <h5>
                        ${label}
                    </h5>

                    <strong>
                        ${Math.round(calories)} kcal
                    </strong>

                </div>
            `;


            if (
                mealEntries.length ===
                0
            ) {

                group.innerHTML += `
                    <p class="text-body-secondary small">
                        No food added.
                    </p>
                `;

            }


            mealEntries.forEach(
                function (entry) {

                    group.appendChild(
                        createMealElement(
                            entry
                        )
                    );

                }
            );


            container.appendChild(
                group
            );

        }

    );


    updateDailySummary(
        entries
    );

}


/* Meal Element */

function createMealElement(
    entry
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "meal-entry";


    let extra =
        "";


    if (
        entry.cookingMethod
    ) {

        extra =
            formatCookingMethod(
                entry.cookingMethod
            );

    }


    if (
        entry.preparation
    ) {

        extra =
            formatPreparation(
                entry.preparation
            );

    }


    item.innerHTML = `
        <div>

            <div class="food-name">
                ${entry.foodName}
            </div>

            <div class="food-details">

                ${entry.amount}
                ${entry.unit}

                ${
                    extra
                        ?
                        `• ${extra}`
                        :
                        ""
                }

            </div>

            <div class="food-macros">

                Protein:
                ${entry.protein} g

                • Carbs:
                ${entry.carbs} g

                • Fat:
                ${entry.fat} g

            </div>

        </div>


        <div class="d-flex align-items-center gap-2">

            <span class="food-calories">
                ${entry.calories} kcal
            </span>

            <div class="meal-actions">

                <button
                    type="button"
                    class="edit-food"
                    aria-label="Edit food"
                >
                    <i class="bi bi-pencil-fill"></i>
                </button>

                <button
                    type="button"
                    class="delete-food"
                    aria-label="Delete food"
                >
                    <i class="bi bi-trash-fill"></i>
                </button>

            </div>

        </div>
    `;


    item
        .querySelector(
            ".edit-food"
        )
        .addEventListener(
            "click",
            function () {

                startMealEdit(
                    entry
                );

            }
        );


    item
        .querySelector(
            ".delete-food"
        )
        .addEventListener(
            "click",
            function () {

                FitHealthData
                    .deleteMealEntry(
                        entry.id
                    );


                if (
                    editingMealId ===
                    entry.id
                ) {

                    finishMealEdit();

                }


                displayMeals();


                showMessage(
                    "nutritionMessage",
                    "Meal deleted.",
                    "warning"
                );

            }
        );


    return item;

}


/* Summary */

function updateDailySummary(
    entries
) {

    const totals =
        entries.reduce(

            function (
                total,
                entry
            ) {

                total.calories +=
                    Number(
                        entry.calories
                    )
                    ||
                    0;

                total.protein +=
                    Number(
                        entry.protein
                    )
                    ||
                    0;

                total.carbs +=
                    Number(
                        entry.carbs
                    )
                    ||
                    0;

                total.fat +=
                    Number(
                        entry.fat
                    )
                    ||
                    0;

                return total;

            },
            {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }

        );


    document.getElementById(
        "dailyConsumed"
    ).textContent =
        Math.round(
            totals.calories
        );


    document.getElementById(
        "dailyProtein"
    ).textContent =
        totals.protein.toFixed(1);


    document.getElementById(
        "dailyCarbs"
    ).textContent =
        totals.carbs.toFixed(1);


    document.getElementById(
        "dailyFat"
    ).textContent =
        totals.fat.toFixed(1);


    const profile =
        updateDailyTargets();


    updateNutritionProgress(
        totals,
        profile
    );


    updateRemainingCalories(
        totals.calories
    );

}


/* Target */

function updateDailyTargets() {

    const profile =
        FitHealthData
            .getHealthProfile();


    if (!profile) {

        document.getElementById(
            "dailyTarget"
        ).textContent =
            "--";

        document.getElementById(
            "dailyProteinTarget"
        ).textContent =
            "--";

        document.getElementById(
            "dailyCarbsTarget"
        ).textContent =
            "--";

        document.getElementById(
            "dailyFatTarget"
        ).textContent =
            "--";

        return null;

    }


    document.getElementById(
        "dailyTarget"
    ).textContent =
        Math.round(
            profile.targetCalories
        );


    document.getElementById(
        "dailyProteinTarget"
    ).textContent =
        Math.round(
            profile.proteinTarget
        );


    document.getElementById(
        "dailyCarbsTarget"
    ).textContent =
        Math.round(
            profile.carbsTarget
        );


    document.getElementById(
        "dailyFatTarget"
    ).textContent =
        Math.round(
            profile.fatTarget
        );


    return profile;

}


/* Progress */

function updateNutritionProgress(
    totals,
    profile
) {

    if (!profile) {

        setProgress(
            "caloriesProgress",
            0,
            0
        );

        setProgress(
            "proteinProgress",
            0,
            0
        );

        setProgress(
            "carbsProgress",
            0,
            0
        );

        setProgress(
            "fatProgress",
            0,
            0
        );

        return;

    }


    setProgress(
        "caloriesProgress",
        totals.calories,
        profile.targetCalories
    );

    setProgress(
        "proteinProgress",
        totals.protein,
        profile.proteinTarget
    );

    setProgress(
        "carbsProgress",
        totals.carbs,
        profile.carbsTarget
    );

    setProgress(
        "fatProgress",
        totals.fat,
        profile.fatTarget
    );

}


function setProgress(
    elementId,
    current,
    target
) {

    const bar =
        document.getElementById(
            elementId
        );


    if (
        !target
        ||
        target <= 0
    ) {

        bar.style.width =
            "0%";

        bar.classList.remove(
            "over-target"
        );

        return;

    }


    const percentage =
        (
            current /
            target
        )
        *
        100;


    bar.style.width =
        `${Math.min(
            percentage,
            100
        )}%`;


    if (
        current > target
    ) {

        bar.classList.add(
            "over-target"
        );

    } else {

        bar.classList.remove(
            "over-target"
        );

    }

}


/* Remaining */

function updateRemainingCalories(
    consumed
) {

    const profile =
        FitHealthData
            .getHealthProfile();


    const card =
        document.getElementById(
            "remainingCalories"
        );


    const value =
        document.getElementById(
            "remainingCaloriesValue"
        );


    if (!profile) {

        value.textContent =
            "Calculate your Health Profile first";

        card.classList.remove(
            "over-target"
        );

        return;

    }


    const remaining =
        Math.round(
            profile.targetCalories
            -
            consumed
        );


    if (
        remaining >= 0
    ) {

        value.textContent =
            `${remaining} kcal remaining`;

        card.classList.remove(
            "over-target"
        );

    } else {

        value.textContent =
            `${Math.abs(
                remaining
            )} kcal over target`;

        card.classList.add(
            "over-target"
        );

    }

}


/* Summary Title */

function updateSummaryTitle() {

    const title =
        document.getElementById(
            "dailySummaryTitle"
        );


    if (
        mealDate.value ===
        getTodayString()
    ) {

        title.textContent =
            "Today's Summary";

        return;

    }


    const date =
        new Date(
            `${mealDate.value}T00:00:00`
        );


    const formatted =
        date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    title.textContent =
        `${formatted} Summary`;

}


/* Formatting */

function formatCookingMethod(
    method
) {

    const methods = {
        raw: "Raw",
        boiled: "Boiled",
        steamed: "Steamed",
        grilled: "Grilled",
        baked: "Baked",
        airFried: "Air Fried",
        panFried: "Pan Fried",
        stirFried: "Stir Fried",
        deepFried: "Deep Fried"
    };


    return (
        methods[method]
        ||
        method
    );

}


function formatPreparation(
    preparation
) {

    if (
        preparation ===
        "water"
    ) {

        return "Mixed with Water";

    }


    return "Mixed with Other Ingredients";

}