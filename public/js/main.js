document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateHomepageGreeting();

        setupSamePageSmoothScroll();

        loadHomepageDashboard();

    }
);


/* =========================================================
   Greeting
   ========================================================= */

function updateHomepageGreeting() {

    const greeting =
        document.getElementById(
            "greeting"
        );


    if (
        !greeting
    ) {

        return;

    }


    const hour =
        new Date()
            .getHours();


    if (
        hour < 12
    ) {

        greeting.textContent =
            "Good morning";

        return;

    }


    if (
        hour < 18
    ) {

        greeting.textContent =
            "Good afternoon";

        return;

    }


    greeting.textContent =
        "Good evening";

}


/* =========================================================
   Same-page navigation
   ========================================================= */

function setupSamePageSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href
                        ||
                        href === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            href
                        );


                    if (
                        !target
                    ) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth",
                            block:
                                "start"
                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   Homepage Dashboard
   ========================================================= */

async function loadHomepageDashboard() {

    const elements =
        getHomepageDashboardElements();


    /*
     * main.js is also loaded on other pages.
     * Do nothing if this is not the homepage.
     */
    if (
        !elements
    ) {

        return;

    }


    setHomepageLoadingState(
        elements
    );


    try {

        const responses =
            await Promise.all(
                [
                    fetchHomepageApi(
                        "api/health-profile"
                    ),

                    fetchHomepageApi(
                        "api/running-sessions"
                    ),

                    fetchHomepageApi(
                        "api/workout-plans"
                    )
                ]
            );


        const healthResponse =
            responses[0];

        const runningResponse =
            responses[1];

        const workoutResponse =
            responses[2];


        /*
         * Every personal endpoint is session-protected.
         * If any of the primary endpoints says 401/403,
         * show the logged-out state instead of fake data.
         */
        if (
            isUnauthenticatedResponse(
                healthResponse
            )
            ||
            isUnauthenticatedResponse(
                runningResponse
            )
            ||
            isUnauthenticatedResponse(
                workoutResponse
            )
        ) {

            showHomepageLoggedOutState(
                elements
            );

            return;

        }


        const healthData =
            await parseHomepageJson(
                healthResponse
            );

        const runningData =
            await parseHomepageJson(
                runningResponse
            );

        const workoutData =
            await parseHomepageJson(
                workoutResponse
            );


        renderHomepageHealth(
            elements,
            healthResponse,
            healthData
        );


        renderHomepageRunning(
            elements,
            runningResponse,
            runningData
        );


        renderHomepageWorkouts(
            elements,
            workoutResponse,
            workoutData
        );


        const anyServerError =
            (
                !healthResponse.ok
                &&
                healthResponse.status !== 404
            )
            ||
            !runningResponse.ok
            ||
            !workoutResponse.ok;


        if (
            anyServerError
        ) {

            elements.message.textContent =
                "Some dashboard data could not be loaded.";

        }
        else {

            elements.message.textContent =
                "Live data from your FitHealth account.";

        }

    }
    catch (
        error
    ) {

        console.error(
            "Homepage dashboard error:",
            error
        );


        showHomepageUnavailableState(
            elements
        );

    }

}


/* =========================================================
   API helpers
   ========================================================= */

function fetchHomepageApi(
    url
) {

    return fetch(
        url,
        {
            method:
                "GET",

            credentials:
                "same-origin",

            cache:
                "no-store",

            headers: {
                "Accept":
                    "application/json"
            }
        }
    );

}


function isUnauthenticatedResponse(
    response
) {

    return (
        response.status === 401
        ||
        response.status === 403
    );

}


async function parseHomepageJson(
    response
) {

    const text =
        await response.text();


    if (
        !text
    ) {

        return {};

    }


    try {

        return JSON.parse(
            text
        );

    }
    catch (
        error
    ) {

        console.error(
            "Invalid JSON response from:",
            response.url,
            text
        );


        return {};

    }

}


/* =========================================================
   Elements / states
   ========================================================= */

function getHomepageDashboardElements() {

    const message =
        document.getElementById(
            "homeDashboardMessage"
        );

    const bmiValue =
        document.getElementById(
            "homeBmiValue"
        );

    const bmiStatus =
        document.getElementById(
            "homeBmiStatus"
        );

    const caloriesValue =
        document.getElementById(
            "homeCaloriesValue"
        );

    const runningValue =
        document.getElementById(
            "homeRunningValue"
        );

    const workoutValue =
        document.getElementById(
            "homeWorkoutValue"
        );


    if (
        !message
        ||
        !bmiValue
        ||
        !bmiStatus
        ||
        !caloriesValue
        ||
        !runningValue
        ||
        !workoutValue
    ) {

        return null;

    }


    return {
        message,
        bmiValue,
        bmiStatus,
        caloriesValue,
        runningValue,
        workoutValue
    };

}


function setHomepageLoadingState(
    elements
) {

    elements.message.textContent =
        "Loading your FitHealth data...";


    elements.bmiValue.textContent =
        "—";

    elements.bmiStatus.textContent =
        "Loading";


    elements.caloriesValue.textContent =
        "—";

    elements.runningValue.textContent =
        "—";

    elements.workoutValue.textContent =
        "—";

}


function showHomepageLoggedOutState(
    elements
) {

    elements.message.textContent =
        "Sign in to view your personal dashboard.";


    elements.bmiValue.textContent =
        "—";

    elements.bmiStatus.textContent =
        "Sign in";


    elements.caloriesValue.textContent =
        "—";

    elements.runningValue.textContent =
        "—";

    elements.workoutValue.textContent =
        "—";

}


function showHomepageUnavailableState(
    elements
) {

    elements.message.textContent =
        "Unable to load your dashboard data.";


    elements.bmiValue.textContent =
        "—";

    elements.bmiStatus.textContent =
        "Unavailable";


    elements.caloriesValue.textContent =
        "—";

    elements.runningValue.textContent =
        "—";

    elements.workoutValue.textContent =
        "—";

}


/* =========================================================
   Health
   ========================================================= */

function renderHomepageHealth(
    elements,
    response,
    data
) {

    if (
        !response.ok
        ||
        !data
        ||
        data.success === false
    ) {

        elements.bmiValue.textContent =
            "—";

        elements.bmiStatus.textContent =
            "No profile";

        elements.caloriesValue.textContent =
            "—";

        return;

    }


    const profile =
        data.profile
        ||
        data.entry
        ||
        data.data
        ||
        null;


    if (
        !profile
    ) {

        elements.bmiValue.textContent =
            "—";

        elements.bmiStatus.textContent =
            "No profile";

        elements.caloriesValue.textContent =
            "—";

        return;

    }


    const bmi =
        getNumericField(
            profile,
            [
                "bmi"
            ]
        );


    const calories =
        getNumericField(
            profile,
            [
                "targetCalories",
                "target_calories"
            ]
        );


    if (
        bmi > 0
    ) {

        elements.bmiValue.textContent =
            bmi.toFixed(
                1
            );

        elements.bmiStatus.textContent =
            getHomepageBmiStatus(
                bmi
            );

    }
    else {

        elements.bmiValue.textContent =
            "—";

        elements.bmiStatus.textContent =
            "No profile";

    }


    if (
        calories > 0
    ) {

        elements.caloriesValue.textContent =
            Math.round(
                calories
            )
                .toLocaleString();

    }
    else {

        elements.caloriesValue.textContent =
            "—";

    }

}


function getHomepageBmiStatus(
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


/* =========================================================
   Running
   ========================================================= */

function renderHomepageRunning(
    elements,
    response,
    data
) {

    if (
        !response.ok
        ||
        !data
        ||
        data.success === false
    ) {

        elements.runningValue.textContent =
            "—";

        return;

    }


    const entries =
        Array.isArray(
            data.entries
        )
            ?
            data.entries
            :
            [];


    const range =
        getCurrentWeekRange();


    const totalDistance =
        entries.reduce(
            function (
                total,
                entry
            ) {

                const dateText =
                    getFirstField(
                        entry,
                        [
                            "date",
                            "runDate",
                            "run_date"
                        ]
                    );


                if (
                    !isDateInRange(
                        dateText,
                        range
                    )
                ) {

                    return total;

                }


                const distance =
                    getNumericField(
                        entry,
                        [
                            "distance"
                        ]
                    );


                return (
                    total
                    +
                    distance
                );

            },
            0
        );


    elements.runningValue.textContent =
        totalDistance.toFixed(
            1
        );

}


/* =========================================================
   Workouts
   ========================================================= */

function renderHomepageWorkouts(
    elements,
    response,
    data
) {

    if (
        !response.ok
        ||
        !data
        ||
        data.success === false
    ) {

        elements.workoutValue.textContent =
            "—";

        return;

    }


    const entries =
        Array.isArray(
            data.entries
        )
            ?
            data.entries
            :
            [];


    const range =
        getCurrentWeekRange();


    const sessions =
        new Set();


    entries.forEach(
        function (entry) {

            const dateText =
                getFirstField(
                    entry,
                    [
                        "date",
                        "workoutDate",
                        "workout_date"
                    ]
                );


            if (
                !isDateInRange(
                    dateText,
                    range
                )
            ) {

                return;

            }


            /*
             * The Workout API returns flat exercise entries.
             * Prefer workoutId when available so multiple exercises
             * from the same plan count as one training session.
             */
            const workoutId =
                getFirstField(
                    entry,
                    [
                        "workoutId",
                        "workout_id",
                        "planId",
                        "plan_id"
                    ]
                );


            const key =
                workoutId
                    ?
                    String(
                        workoutId
                    )
                    :
                    dateText;


            sessions.add(
                key
            );

        }
    );


    elements.workoutValue.textContent =
        String(
            sessions.size
        );

}


/* =========================================================
   Date helpers
   ========================================================= */

function getCurrentWeekRange() {

    const now =
        new Date();


    now.setHours(
        0,
        0,
        0,
        0
    );


    const day =
        now.getDay();


    const mondayOffset =
        day === 0
            ?
            -6
            :
            1 - day;


    const start =
        new Date(
            now
        );


    start.setDate(
        start.getDate()
        +
        mondayOffset
    );


    const end =
        new Date(
            start
        );


    end.setDate(
        end.getDate()
        +
        6
    );


    end.setHours(
        23,
        59,
        59,
        999
    );


    return {
        start,
        end
    };

}


function isDateInRange(
    dateText,
    range
) {

    if (
        !dateText
    ) {

        return false;

    }


    const date =
        new Date(
            String(
                dateText
            )
            +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return false;

    }


    return (
        date >= range.start
        &&
        date <= range.end
    );

}


/* =========================================================
   Generic data helpers
   ========================================================= */

function getFirstField(
    object,
    keys
) {

    if (
        !object
    ) {

        return "";

    }


    for (
        const key
        of
        keys
    ) {

        const value =
            object[key];


        if (
            value !== undefined
            &&
            value !== null
            &&
            value !== ""
        ) {

            return value;

        }

    }


    return "";

}


function getNumericField(
    object,
    keys
) {

    const value =
        getFirstField(
            object,
            keys
        );


    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {

        return 0;

    }


    return number;

}
