/* Food Database */

const foods = [

    {
        id: 1,
        name: "Chicken Breast",
        category: "Protein",

        nutritionType:
            "per100g",

        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,

        cookingRequired:
            true
    },

    {
        id: 2,
        name: "Chicken Thigh",
        category: "Protein",

        nutritionType:
            "per100g",

        calories: 209,
        protein: 26,
        carbs: 0,
        fat: 11,

        cookingRequired:
            true
    },

    {
        id: 3,
        name: "Beef",
        category: "Protein",

        nutritionType:
            "per100g",

        calories: 250,
        protein: 26,
        carbs: 0,
        fat: 15,

        cookingRequired:
            true
    },

    {
        id: 4,
        name: "Salmon",
        category: "Protein",

        nutritionType:
            "per100g",

        calories: 208,
        protein: 20,
        carbs: 0,
        fat: 13,

        cookingRequired:
            true
    },

    {
        id: 5,
        name: "Egg",
        category: "Protein",

        nutritionType:
            "per100g",

        calories: 155,
        protein: 13,
        carbs: 1.1,
        fat: 11,

        cookingRequired:
            true
    },

    {
        id: 6,
        name: "White Rice",
        category: "Carbohydrates",

        nutritionType:
            "per100g",

        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,

        cookingRequired:
            false
    },

    {
        id: 7,
        name: "Sweet Potato",
        category: "Carbohydrates",

        nutritionType:
            "per100g",

        calories: 86,
        protein: 1.6,
        carbs: 20,
        fat: 0.1,

        cookingRequired:
            true
    },

    {
        id: 8,
        name: "Oats",
        category: "Carbohydrates",

        nutritionType:
            "per100g",

        calories: 389,
        protein: 16.9,
        carbs: 66.3,
        fat: 6.9,

        cookingRequired:
            false
    },

    {
        id: 9,
        name: "Banana",
        category: "Fruit",

        nutritionType:
            "per100g",

        calories: 89,
        protein: 1.1,
        carbs: 22.8,
        fat: 0.3,

        cookingRequired:
            false
    },

    {
        id: 10,
        name: "Apple",
        category: "Fruit",

        nutritionType:
            "per100g",

        calories: 52,
        protein: 0.3,
        carbs: 13.8,
        fat: 0.2,

        cookingRequired:
            false
    },

    {
        id: 11,
        name: "Avocado",
        category: "Fruit",

        nutritionType:
            "per100g",

        calories: 160,
        protein: 2,
        carbs: 8.5,
        fat: 14.7,

        cookingRequired:
            false
    },

    {
        id: 12,
        name: "Broccoli",
        category: "Vegetable",

        nutritionType:
            "per100g",

        calories: 35,
        protein: 2.4,
        carbs: 7.2,
        fat: 0.4,

        cookingRequired:
            true
    },

    {
        id: 13,
        name: "Greek Yogurt",
        category: "Dairy",

        nutritionType:
            "per100g",

        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,

        cookingRequired:
            false
    },

    {
        id: 14,
        name: "Milk",
        category: "Dairy",

        nutritionType:
            "per100g",

        calories: 61,
        protein: 3.2,
        carbs: 4.8,
        fat: 3.3,

        cookingRequired:
            false
    },


    /* NutraBio Whey */

    {
        id: 15,

        name:
            "NutraBio Whey Protein",

        category:
            "Supplements",

        nutritionType:
            "serving",

        servingUnit:
            "scoop",

        servingSize:
            32,

        calories:
            120,

        protein:
            25,

        carbs:
            2,

        fat:
            1,

        cookingRequired:
            false,

        supplement:
            true
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


const healthEmpty =
    document.getElementById(
        "healthEmpty"
    );


const healthResults =
    document.getElementById(
        "healthResults"
    );


const nutritionForm =
    document.getElementById(
        "nutritionForm"
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


const amountLabel =
    document.getElementById(
        "amountLabel"
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
                        button.dataset.tab
                        ===
                        "health"
                    ) {

                        healthTab.classList.remove(
                            "d-none"
                        );


                        nutritionTab.classList.add(
                            "d-none"
                        );

                    }

                    else {

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



/* Health */

healthForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


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


        const activity =
            Number(
                document.getElementById(
                    "activity"
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
            bmr
            *
            activity;


        const calories =
            calculateTargetCalories(
                tdee,
                goal
            );


        const macros =
            calculateMacros(
                calories,
                weight
            );


        const profile = {

            age:
                age,

            gender:
                gender,

            height:
                height,

            weight:
                weight,

            activity:
                activity,

            goal:
                goal,

            bmi:
                bmi,

            bmr:
                bmr,

            tdee:
                tdee,

            calories:
                calories,

            protein:
                macros.protein,

            carbs:
                macros.carbs,

            fat:
                macros.fat

        };


        localStorage.setItem(
            "fithealthHealthProfile",
            JSON.stringify(
                profile
            )
        );


        displayHealthResults(
            profile
        );


        updateDailyTargets();

    }
);



/* BMI */

function calculateBMI(
    weight,
    height
) {

    const meters =
        height
        /
        100;


    return (
        weight
        /
        (
            meters
            *
            meters
        )
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

        return (
            base + 5
        );

    }


    return (
        base - 161
    );

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

        return (
            tdee - 500
        );

    }


    if (
        goal ===
        "gain"
    ) {

        return (
            tdee + 300
        );

    }


    return tdee;

}



/* Macros */

function calculateMacros(
    calories,
    weight
) {

    const protein =
        weight
        *
        2;


    const proteinCalories =
        protein
        *
        4;


    const fatCalories =
        calories
        *
        0.25;


    const fat =
        fatCalories
        /
        9;


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
        remaining
        /
        4;


    return {

        protein:
            Math.round(
                protein
            ),

        carbs:
            Math.round(
                carbs
            ),

        fat:
            Math.round(
                fat
            )

    };

}



/* BMI Status */

function getBMIStatus(
    bmi
) {

    if (bmi < 18.5) {

        return "Underweight";

    }


    if (bmi < 25) {

        return "Normal";

    }


    if (bmi < 30) {

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
        profile.bmi.toFixed(
            1
        );


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
            profile.calories
        );


    document.getElementById(
        "proteinResult"
    ).textContent =
        `${profile.protein} g`;


    document.getElementById(
        "carbsResult"
    ).textContent =
        `${profile.carbs} g`;


    document.getElementById(
        "fatResult"
    ).textContent =
        `${profile.fat} g`;

}



/* Load Health */

function loadHealthProfile() {

    const stored =
        localStorage.getItem(
            "fithealthHealthProfile"
        );


    if (!stored) {

        updateDailyTargets();

        return;

    }


    try {

        const profile =
            JSON.parse(
                stored
            );


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
            "activity"
        ).value =
            profile.activity;


        document.getElementById(
            "goal"
        ).value =
            profile.goal;


        displayHealthResults(
            profile
        );

    }

    catch (error) {

        console.error(
            error
        );

    }

}



/* Populate Foods */

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
                            food.category
                            ===
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



/* Selected Food */

function getSelectedFood() {

    const id =
        Number(
            foodSelect.value
        );


    return foods.find(

        function (food) {

            return (
                food.id
                ===
                id
            );

        }

    );

}



/* Food Interface */

function updateFoodInterface() {

    const food =
        getSelectedFood();


    if (!food) {

        return;

    }


    /* Supplement */

    if (
        food.nutritionType
        ===
        "serving"
    ) {

        amountLabel.textContent =
            "Amount";


        amountUnit.textContent =
            food.servingUnit;


        foodAmount.value =
            1;

        foodAmount.min =
            "0.5";


        foodAmount.step =
            "0.5";


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

    }


    /* Normal Food */

    else {

        amountLabel.textContent =
            "Amount";


        amountUnit.textContent =
            "g";


        foodAmount.value =
            100;


        foodAmount.step =
            "1";


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

        }

        else {

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



/* Food Change */

foodSelect.addEventListener(
    "change",
    updateFoodInterface
);



/* Amount */

foodAmount.addEventListener(
    "input",
    function () {

        updateEstimatedOil();

        updateNutritionPreview();

    }
);



/* Cooking */

cookingMethod.addEventListener(
    "change",
    function () {

        updateEstimatedOil();

        updateNutritionPreview();

    }
);



/* Oil */

oilAmount.addEventListener(
    "input",
    updateNutritionPreview
);



/* Date */

function setupDate() {

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


    mealDate.value =
        `${year}-${month}-${day}`;

}



mealDate.addEventListener(
    "change",
    displayMeals
);



/* Oil Estimate */

function updateEstimatedOil() {

    const food =
        getSelectedFood();


    if (
        !food
        ||
        food.nutritionType
        ===
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


    const method =
        cookingMethod.value;


    const per100 =
        cookingMethods[
            method
        ]
        ||
        0;


    const oil =
        (
            amount
            /
            100
        )
        *
        per100;


    oilAmount.value =
        oil.toFixed(
            1
        );

}



/* Calculate Nutrition */

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


    /* Serving */

    if (
        food.nutritionType
        ===
        "serving"
    ) {

        return {

            food:
                food,

            amount:
                amount,

            displayAmount:
                `${amount} ${food.servingUnit}`,

            calories:
                food.calories
                *
                amount,

            protein:
                food.protein
                *
                amount,

            carbs:
                food.carbs
                *
                amount,

            fat:
                food.fat
                *
                amount,

            oil:
                0

        };

    }


    /* Per 100 g */

    const ratio =
        amount
        /
        100;


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

        food:
            food,

        amount:
            amount,

        displayAmount:
            `${amount} g`,

        calories:
            (
                food.calories
                *
                ratio
            )
            +
            (
                oil
                *
                9
            ),

        protein:
            food.protein
            *
            ratio,

        carbs:
            food.carbs
            *
            ratio,

        fat:
            (
                food.fat
                *
                ratio
            )
            +
            oil,

        oil:
            oil

    };

}



/* Preview */

function updateNutritionPreview() {

    const result =
        calculateFoodNutrition();


    if (!result) {

        return;

    }


    document.getElementById(
        "previewCalories"
    ).textContent =
        `${Math.round(
            result.calories
        )} kcal`;


    document.getElementById(
        "previewProtein"
    ).textContent =
        `${result.protein.toFixed(
            1
        )} g`;


    document.getElementById(
        "previewCarbs"
    ).textContent =
        `${result.carbs.toFixed(
            1
        )} g`;


    document.getElementById(
        "previewFat"
    ).textContent =
        `${result.fat.toFixed(
            1
        )} g`;

}



/* Add Nutrition */

nutritionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const result =
            calculateFoodNutrition();


        if (!result) {

            return;

        }


        const food =
            result.food;


        const entry = {

            id:
                Date.now(),

            date:
                mealDate.value,

            meal:
                mealType.value,

            foodId:
                food.id,

            foodName:
                food.name,

            amount:
                result.amount,

            displayAmount:
                result.displayAmount,

            nutritionType:
                food.nutritionType,

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

            oil:
                Number(
                    result.oil.toFixed(
                        1
                    )
                ),

            calories:
                Math.round(
                    result.calories
                ),

            protein:
                Number(
                    result.protein.toFixed(
                        1
                    )
                ),

            carbs:
                Number(
                    result.carbs.toFixed(
                        1
                    )
                ),

            fat:
                Number(
                    result.fat.toFixed(
                        1
                    )
                )

        };


        const entries =
            getMealEntries();


        entries.push(
            entry
        );


        localStorage.setItem(
            "fithealthMealEntries",
            JSON.stringify(
                entries
            )
        );


        displayMeals();

    }
);



/* Get Meals */

function getMealEntries() {

    const stored =
        localStorage.getItem(
            "fithealthMealEntries"
        );


    if (!stored) {

        return [];

    }


    try {

        return JSON.parse(
            stored
        );

    }

    catch (error) {

        return [];

    }

}



/* Meals */

function displayMeals() {

    const container =
        document.getElementById(
            "mealList"
        );


    const entries =
        getMealEntries()
            .filter(

                function (entry) {

                    return (
                        entry.date
                        ===
                        mealDate.value
                    );

                }

            );


    const meals = {

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
        meals
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
                            entry.meal
                            ===
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
                mealEntries.length
                ===
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

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "meal-entry";


                    let methodText =
                        "";


                    if (
                        entry.cookingMethod
                    ) {

                        methodText =
                            formatCookingMethod(
                                entry.cookingMethod
                            );

                    }


                    if (
                        entry.preparation
                    ) {

                        methodText =
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

                                ${entry.displayAmount}

                                ${
                                    methodText
                                    ?
                                    `• ${methodText}`
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


                            <button
                                class="delete-food"
                                type="button"
                            >

                                <i class="bi bi-trash-fill"></i>

                            </button>

                        </div>
                    `;


                    item
                        .querySelector(
                            ".delete-food"
                        )
                        .addEventListener(
                            "click",
                            function () {

                                deleteMealEntry(
                                    entry.id
                                );

                            }
                        );


                    group.appendChild(
                        item
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



/* Delete */

function deleteMealEntry(
    id
) {

    const entries =
        getMealEntries()
            .filter(

                function (entry) {

                    return (
                        entry.id
                        !==
                        id
                    );

                }

            );


    localStorage.setItem(
        "fithealthMealEntries",
        JSON.stringify(
            entries
        )
    );


    displayMeals();

}



/* Daily Summary */

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
        totals.protein.toFixed(
            1
        );


    document.getElementById(
        "dailyCarbs"
    ).textContent =
        totals.carbs.toFixed(
            1
        );


    document.getElementById(
        "dailyFat"
    ).textContent =
        totals.fat.toFixed(
            1
        );


    updateDailyTargets();

}



/* Targets */

function updateDailyTargets() {

    const stored =
        localStorage.getItem(
            "fithealthHealthProfile"
        );


    if (!stored) {

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


        return;

    }


    const profile =
        JSON.parse(
            stored
        );


    document.getElementById(
        "dailyTarget"
    ).textContent =
        Math.round(
            profile.calories
        );


    document.getElementById(
        "dailyProteinTarget"
    ).textContent =
        Math.round(
            profile.protein
        );


    document.getElementById(
        "dailyCarbsTarget"
    ).textContent =
        Math.round(
            profile.carbs
        );


    document.getElementById(
        "dailyFatTarget"
    ).textContent =
        Math.round(
            profile.fat
        );

}



/* Cooking */

function formatCookingMethod(
    method
) {

    const methods = {

        raw:
            "Raw",

        boiled:
            "Boiled",

        steamed:
            "Steamed",

        grilled:
            "Grilled",

        baked:
            "Baked",

        airFried:
            "Air Fried",

        panFried:
            "Pan Fried",

        stirFried:
            "Stir Fried",

        deepFried:
            "Deep Fried"

    };


    return (
        methods[method]
        ||
        method
    );

}



/* Preparation */

function formatPreparation(
    preparation
) {

    if (
        preparation
        ===
        "water"
    ) {

        return "Mixed with Water";

    }


    return "Mixed with Other Ingredients";

}