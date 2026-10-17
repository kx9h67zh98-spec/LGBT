(function () {
    "use strict";

    const base =
        window.location.pathname.substring(
            0,
            window.location.pathname.lastIndexOf("/") + 1
        );

    const waterApi =
        base + "api/water-logs";

    const mealApi =
        base + "api/meal-entries";

    const runningApi =
        base + "api/running-sessions";

    const workoutApi =
        base + "api/workout-plans";

    const weightApi =
        base + "api/weight-logs";

    const WATER_TARGET =
        2500;

    let refreshTimer =
        null;


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            inject();
            bindWaterControls();
            refresh();

        }
    );


    window.FitHealthDashboard = {
        refresh
    };


    function app() {

        return window.FitHealthNutrition
            ||
            null;

    }


    function inject() {

        const health =
            document.getElementById(
                "healthTab"
            );

        if (!health) {
            return;
        }

        const weightPanel =
            document.getElementById(
                "weightProgressPanel"
            );


        if (
            !document.getElementById(
                "waterTrackerPanel"
            )
        ) {

            const waterHtml =
                '<section class="insight-section mt-4" id="waterTrackerPanel">'
                +
                '<div class="insight-heading">'
                +
                '<div><p class="text-success fw-bold mb-1">HYDRATION</p>'
                +
                '<h2 class="fw-bold mb-1">Water Intake</h2>'
                +
                '<p class="text-body-secondary mb-0">Track today\'s water and build a consistent hydration habit. The 2,500 ml target is an app tracking goal, not a medical recommendation.</p></div>'
                +
                '<div class="insight-heading-icon"><i class="bi bi-droplet-half"></i></div>'
                +
                '</div>'
                +
                '<div id="waterTrackerContent" class="mt-4">'
                +
                '<div class="insight-loading">Loading water intake...</div>'
                +
                '</div>'
                +
                '<div class="water-controls mt-3">'
                +
                '<button type="button" class="btn btn-outline-success" data-water-add="250">'
                +
                '<i class="bi bi-plus-circle me-1"></i>250 ml</button>'
                +
                '<button type="button" class="btn btn-outline-success" data-water-add="500">'
                +
                '<i class="bi bi-plus-circle me-1"></i>500 ml</button>'
                +
                '<div class="water-custom-input input-group">'
                +
                '<input type="number" id="waterCustomAmount" class="form-control" min="50" max="3000" step="50" placeholder="Custom ml" aria-label="Custom water amount">'
                +
                '<button type="button" class="btn btn-success" id="waterCustomAdd">'
                +
                '<i class="bi bi-plus-lg me-1"></i>Add</button>'
                +
                '</div>'
                +
                '<button type="button" class="btn btn-outline-secondary" id="waterResetButton">'
                +
                '<i class="bi bi-arrow-counterclockwise me-1"></i>Reset today</button>'
                +
                '</div>'
                +
                '</section>';

            if (weightPanel) {

                weightPanel.insertAdjacentHTML(
                    "afterend",
                    waterHtml
                );

            } else {

                health.insertAdjacentHTML(
                    "beforeend",
                    waterHtml
                );

            }

        }


        if (
            !document.getElementById(
                "weeklyHealthScorePanel"
            )
        ) {

            const waterPanel =
                document.getElementById(
                    "waterTrackerPanel"
                );

            const scoreHtml =
                '<section class="insight-section mt-4" id="weeklyHealthScorePanel">'
                +
                '<div class="insight-heading">'
                +
                '<div><p class="text-success fw-bold mb-1">WEEKLY OVERVIEW</p>'
                +
                '<h2 class="fw-bold mb-1">Weekly Health Score</h2>'
                +
                '<p class="text-body-secondary mb-0">A simple 7-day consistency score from your FitHealth activity.</p></div>'
                +
                '<div class="insight-heading-icon"><i class="bi bi-speedometer2"></i></div>'
                +
                '</div>'
                +
                '<div id="weeklyHealthScoreContent" class="mt-4">'
                +
                '<div class="insight-loading">Calculating weekly score...</div>'
                +
                '</div>'
                +
                '</section>';

            if (waterPanel) {

                waterPanel.insertAdjacentHTML(
                    "afterend",
                    scoreHtml
                );

            } else {

                health.insertAdjacentHTML(
                    "beforeend",
                    scoreHtml
                );

            }

        }

    }


    function bindWaterControls() {

        document
            .querySelectorAll(
                "[data-water-add]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            saveWater(
                                Number(
                                    button.dataset.waterAdd
                                ),
                                "add"
                            );

                        }
                    );

                }
            );


        const customButton =
            document.getElementById(
                "waterCustomAdd"
            );

        if (customButton) {

            customButton.addEventListener(
                "click",
                function () {

                    const input =
                        document.getElementById(
                            "waterCustomAmount"
                        );

                    const amount =
                        Number(
                            input
                            ?
                            input.value
                            :
                            0
                        );

                    if (
                        !Number.isFinite(
                            amount
                        )
                        ||
                        amount < 50
                        ||
                        amount > 3000
                    ) {

                        showWaterMessage(
                            "Enter a custom amount between 50 and 3000 ml.",
                            "warning"
                        );

                        return;

                    }

                    saveWater(
                        Math.round(
                            amount
                        ),
                        "add"
                    );

                    input.value =
                        "";

                }
            );

        }


        const resetButton =
            document.getElementById(
                "waterResetButton"
            );

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                function () {

                    saveWater(
                        0,
                        "set"
                    );

                }
            );

        }

    }


    function refresh() {

        clearTimeout(
            refreshTimer
        );

        refreshTimer =
            setTimeout(
                function () {

                    inject();

                    Promise.allSettled(
                        [
                            loadWaterToday(),
                            loadWeeklyScore()
                        ]
                    );

                },
                120
            );

    }


    async function saveWater(
        amountMl,
        mode
    ) {

        try {

            setWaterButtonsDisabled(
                true
            );

            const response =
                await fetch(
                    waterApi,
                    {
                        method:
                            "POST",

                        credentials:
                            "same-origin",

                        cache:
                            "no-store",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                {
                                    date:
                                        dateString(
                                            new Date()
                                        ),

                                    amountMl,

                                    mode
                                }
                            )
                    }
                );

            const data =
                await readJson(
                    response
                );

            if (
                response.status ===
                401
            ) {

                window.location.href =
                    "login.html";

                return;

            }

            if (
                !response.ok
                ||
                !data.success
            ) {

                throw new Error(
                    data.message
                    ||
                    "Unable to save water intake."
                );

            }

            showWaterMessage(
                data.message
                ||
                "Water intake saved.",
                "success"
            );

            refresh();

        } catch (
            error
        ) {

            console.error(
                "Water save error:",
                error
            );

            showWaterMessage(
                error.message
                ||
                "Unable to save water intake.",
                "danger"
            );

        } finally {

            setWaterButtonsDisabled(
                false
            );

        }

    }


    async function loadWaterToday() {

        const box =
            document.getElementById(
                "waterTrackerContent"
            );

        if (!box) {
            return;
        }

        try {

            const today =
                dateString(
                    new Date()
                );

            const data =
                await fetchJson(
                    waterApi
                    +
                    "?date="
                    +
                    encodeURIComponent(
                        today
                    )
                );

            const entry =
                Array.isArray(
                    data.entries
                )
                &&
                data.entries.length
                ?
                data.entries[0]
                :
                null;

            const amount =
                entry
                ?
                number(
                    entry.amountMl
                )
                :
                0;

            const percentage =
                Math.min(
                    100,
                    (
                        amount
                        /
                        WATER_TARGET
                    )
                    *
                    100
                );

            const remaining =
                Math.max(
                    0,
                    WATER_TARGET
                    -
                    amount
                );

            box.innerHTML =
                '<div class="water-summary">'
                +
                '<div class="water-value-block">'
                +
                '<span>Today</span>'
                +
                '<strong>'
                +
                Math.round(
                    amount
                )
                +
                ' <small>ml</small></strong>'
                +
                '<p class="mb-0 text-body-secondary">'
                +
                (
                    remaining > 0
                    ?
                    Math.round(
                        remaining
                    )
                      + ' ml remaining to the 2,500 ml daily tracker target.'
                    :
                    'Daily tracker target reached.'
                )
                +
                '</p></div>'
                +
                '<div class="water-percentage">'
                +
                Math.round(
                    percentage
                )
                +
                '%</div>'
                +
                '</div>'
                +
                '<div class="water-progress-track mt-3">'
                +
                '<div style="width:'
                +
                percentage.toFixed(
                    1
                )
                +
                '%"></div></div>'
                +
                '<div id="waterMessage" class="alert d-none mt-3 mb-0" role="alert" aria-live="polite" aria-atomic="true"></div>';

        } catch (
            error
        ) {

            console.error(
                "Water load error:",
                error
            );

            box.innerHTML =
                empty(
                    error.message
                    ||
                    "Unable to load water intake."
                );

        }

    }


    async function loadWeeklyScore() {

        const box =
            document.getElementById(
                "weeklyHealthScoreContent"
            );

        const bridge =
            app();

        if (
            !box
            ||
            !bridge
        ) {

            return;

        }

        const profile =
            bridge.getProfile();

        if (!profile) {

            box.innerHTML =
                empty(
                    "Complete your Health Profile to calculate the weekly score."
                );

            return;

        }

        try {

            const dates =
                recentDates(
                    7
                );

            const dateSet =
                new Set(
                    dates
                );

            const results =
                await Promise.all(
                    [
                        loadMealDays(
                            dates
                        ),

                        fetchJson(
                            waterApi
                            +
                            "?days=7"
                        ),

                        fetchJson(
                            runningApi
                        ),

                        fetchJson(
                            workoutApi
                        ),

                        fetchJson(
                            weightApi
                            +
                            "?limit=30"
                        )
                    ]
                );

            const mealDays =
                results[0];

            const waterEntries =
                results[1].entries
                ||
                [];

            const runningEntries =
                results[2].entries
                ||
                [];

            const workoutEntries =
                results[3].entries
                ||
                [];

            const weightEntries =
                results[4].entries
                ||
                [];


            const nutritionRatio =
                average(
                    mealDays.map(
                        function (
                            day
                        ) {

                            return nutritionDayRatio(
                                day,
                                profile
                            );

                        }
                    )
                );

            const nutritionPoints =
                Math.round(
                    nutritionRatio
                    *
                    35
                );


            const completedWorkoutDays =
                uniqueDateCount(
                    workoutEntries.filter(
                        function (
                            entry
                        ) {

                            return Boolean(
                                entry.completed
                            );

                        }
                    ),
                    dateSet
                );

            const workoutPoints =
                Math.round(
                    Math.min(
                        completedWorkoutDays
                        /
                        3,
                        1
                    )
                    *
                    25
                );


            const runningDays =
                uniqueDateCount(
                    runningEntries,
                    dateSet
                );

            const runningPoints =
                Math.round(
                    Math.min(
                        runningDays
                        /
                        3,
                        1
                    )
                    *
                    15
                );


            const waterByDate =
                new Map();

            waterEntries.forEach(
                function (
                    entry
                ) {

                    if (
                        entry.date
                        &&
                        dateSet.has(
                            entry.date
                        )
                    ) {

                        waterByDate.set(
                            entry.date,
                            number(
                                entry.amountMl
                            )
                        );

                    }

                }
            );

            const averageWater =
                average(
                    dates.map(
                        function (
                            date
                        ) {

                            return waterByDate.get(
                                date
                            )
                            ||
                            0;

                        }
                    )
                );

            const hydrationPoints =
                Math.round(
                    Math.min(
                        averageWater
                        /
                        WATER_TARGET,
                        1
                    )
                    *
                    15
                );


            const weightDays =
                uniqueDateCount(
                    weightEntries,
                    dateSet
                );

            const weightPoints =
                Math.round(
                    Math.min(
                        weightDays
                        /
                        3,
                        1
                    )
                    *
                    10
                );


            const total =
                nutritionPoints
                +
                workoutPoints
                +
                runningPoints
                +
                hydrationPoints
                +
                weightPoints;


            box.innerHTML =
                '<div class="weekly-score-layout">'
                +
                '<div class="weekly-score-main">'
                +
                '<div class="weekly-score-number">'
                +
                '<strong>'
                +
                total
                +
                '</strong><span>/100</span></div>'
                +
                '<h3 class="h5 fw-bold mb-1">'
                +
                scoreLabel(
                    total
                )
                +
                '</h3>'
                +
                '<p class="small text-body-secondary mb-0">Last 7 days of FitHealth activity</p>'
                +
                '</div>'
                +
                '<div class="weekly-score-components">'
                +
                scoreCard(
                    "Nutrition",
                    nutritionPoints,
                    35,
                    "bi-egg-fried"
                )
                +
                scoreCard(
                    "Workout",
                    workoutPoints,
                    25,
                    "bi-lightning-charge"
                )
                +
                scoreCard(
                    "Running",
                    runningPoints,
                    15,
                    "bi-person-walking"
                )
                +
                scoreCard(
                    "Hydration",
                    hydrationPoints,
                    15,
                    "bi-droplet"
                )
                +
                scoreCard(
                    "Weight tracking",
                    weightPoints,
                    10,
                    "bi-graph-up-arrow"
                )
                +
                '</div>'
                +
                '</div>'
                +
                '<div class="weekly-score-note mt-3">'
                +
                '<i class="bi bi-info-circle"></i>'
                +
                '<p class="mb-0">This is a consistency score for your FitHealth records, not a medical assessment. Nutrition contributes 35 points, workouts 25, running 15, hydration 15 and weight tracking 10.</p>'
                +
                '</div>';

        } catch (
            error
        ) {

            console.error(
                "Weekly health score error:",
                error
            );

            box.innerHTML =
                empty(
                    error.message
                    ||
                    "Unable to calculate weekly score."
                );

        }

    }


    async function loadMealDays(
        dates
    ) {

        const result =
            [];

        for (
            const date of dates
        ) {

            const data =
                await fetchJson(
                    mealApi
                    +
                    "?date="
                    +
                    encodeURIComponent(
                        date
                    )
                );

            result.push(
                totals(
                    data.entries
                    ||
                    []
                )
            );

        }

        return result;

    }


    function nutritionDayRatio(
        totalsValue,
        profile
    ) {

        const values =
            [
                [
                    totalsValue.calories,
                    number(
                        profile.targetCalories
                    )
                ],

                [
                    totalsValue.protein,
                    number(
                        profile.proteinTarget
                    )
                ],

                [
                    totalsValue.carbs,
                    number(
                        profile.carbsTarget
                    )
                ],

                [
                    totalsValue.fat,
                    number(
                        profile.fatTarget
                    )
                ]
            ];

        return average(
            values.map(
                function (
                    pair
                ) {

                    return targetCloseness(
                        pair[0],
                        pair[1]
                    );

                }
            )
        );

    }


    function targetCloseness(
        actual,
        target
    ) {

        actual =
            number(
                actual
            );

        target =
            number(
                target
            );

        if (
            target <= 0
        ) {

            return 0;

        }

        const ratio =
            actual
            /
            target;

        if (
            ratio <= 1
        ) {

            return Math.max(
                0,
                ratio
            );

        }

        return Math.max(
            0,
            2
            -
            ratio
        );

    }


    function uniqueDateCount(
        entries,
        dateSet
    ) {

        const dates =
            new Set();

        (
            entries
            ||
            []
        ).forEach(
            function (
                entry
            ) {

                if (
                    entry.date
                    &&
                    dateSet.has(
                        entry.date
                    )
                ) {

                    dates.add(
                        entry.date
                    );

                }

            }
        );

        return dates.size;

    }


    function totals(
        entries
    ) {

        return (
            entries
            ||
            []
        ).reduce(
            function (
                total,
                entry
            ) {

                total.calories +=
                    number(
                        entry.calories
                    );

                total.protein +=
                    number(
                        entry.protein
                    );

                total.carbs +=
                    number(
                        entry.carbs
                    );

                total.fat +=
                    number(
                        entry.fat
                    );

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


    function scoreCard(
        label,
        value,
        max,
        icon
    ) {

        const percentage =
            max > 0
            ?
            Math.min(
                100,
                (
                    value
                    /
                    max
                )
                *
                100
            )
            :
            0;

        return (
            '<article class="weekly-score-card">'
            +
            '<div class="weekly-score-card-icon"><i class="bi '
            +
            icon
            +
            '"></i></div>'
            +
            '<div class="weekly-score-card-body">'
            +
            '<div class="d-flex justify-content-between gap-3">'
            +
            '<span>'
            +
            escapeHtml(
                label
            )
            +
            '</span><strong>'
            +
            value
            +
            '/'
            +
            max
            +
            '</strong></div>'
            +
            '<div class="weekly-score-progress mt-2"><div style="width:'
            +
            percentage.toFixed(
                1
            )
            +
            '%"></div></div>'
            +
            '</div></article>'
        );

    }


    function scoreLabel(
        score
    ) {

        if (
            score >= 85
        ) {

            return "Excellent consistency";

        }

        if (
            score >= 70
        ) {

            return "Strong week";

        }

        if (
            score >= 50
        ) {

            return "Building consistency";

        }

        return "Getting started";

    }


    function recentDates(
        count
    ) {

        const result =
            [];

        const today =
            new Date();

        for (
            let offset =
                count - 1;
            offset >= 0;
            offset--
        ) {

            const date =
                new Date(
                    today
                );

            date.setDate(
                today.getDate()
                -
                offset
            );

            result.push(
                dateString(
                    date
                )
            );

        }

        return result;

    }


    async function fetchJson(
        url
    ) {

        const response =
            await fetch(
                url,
                {
                    credentials:
                        "same-origin",

                    cache:
                        "no-store"
                }
            );

        if (
            response.status ===
            401
        ) {

            window.location.href =
                "login.html";

            throw new Error(
                "Not authenticated."
            );

        }

        const data =
            await readJson(
                response
            );

        if (
            !response.ok
            ||
            !data.success
        ) {

            throw new Error(
                data.message
                ||
                "Unable to load FitHealth data."
            );

        }

        return data;

    }


    async function readJson(
        response
    ) {

        const text =
            await response.text();

        return text
            ?
            JSON.parse(
                text
            )
            :
            {};

    }


    function showWaterMessage(
        message,
        type
    ) {

        const element =
            document.getElementById(
                "waterMessage"
            );

        if (!element) {
            return;
        }

        element.className =
            "alert alert-"
            +
            type
            +
            " mt-3 mb-0";

        element.textContent =
            message;

        setTimeout(
            function () {

                element.classList.add(
                    "d-none"
                );

            },
            2500
        );

    }


    function setWaterButtonsDisabled(
        disabled
    ) {

        document
            .querySelectorAll(
                "#waterTrackerPanel button"
            )
            .forEach(
                function (
                    button
                ) {

                    button.disabled =
                        disabled;

                }
            );

    }


    function average(
        values
    ) {

        if (
            !values
            ||
            values.length === 0
        ) {

            return 0;

        }

        return values.reduce(
            function (
                sum,
                value
            ) {

                return sum
                    +
                    number(
                        value
                    );

            },
            0
        )
        /
        values.length;

    }


    function number(
        value
    ) {

        const parsed =
            Number(
                value
            );

        return Number.isFinite(
            parsed
        )
        ?
        parsed
        :
        0;

    }


    function dateString(
        date
    ) {

        return (
            date.getFullYear()
            +
            "-"
            +
            String(
                date.getMonth()
                +
                1
            ).padStart(
                2,
                "0"
            )
            +
            "-"
            +
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            )
        );

    }


    function empty(
        message
    ) {

        return (
            '<div class="insight-empty-state">'
            +
            '<i class="bi bi-info-circle"></i>'
            +
            '<div><strong>FitHealth Insight</strong>'
            +
            '<p class="mb-0">'
            +
            escapeHtml(
                message
            )
            +
            '</p></div></div>'
        );

    }


    function escapeHtml(
        value
    ) {

        return String(
            value
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }

}());
