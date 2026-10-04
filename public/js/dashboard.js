/** Dashboard Elements **/

let logoutButton;

let currentUser = null;

let currentHealthProfile = null;

let currentMealEntries = [];

let currentRunningEntries = [];

let currentWorkoutEntries = [];

let dashboardGreeting;

let dashboardDate;

let dashboardAccountLabel;

let dashboardMessage;

let dashboardBmi;

let dashboardBmiStatus;

let dashboardCaloriesToday;

let dashboardCaloriesTarget;

let dashboardWorkoutDone;

let dashboardWorkoutTotal;

let dashboardRunDistance;

let dashboardRunCount;

let nutritionCaloriesValue;

let nutritionCaloriesTarget;

let nutritionCaloriesBar;

let nutritionProteinValue;

let nutritionProteinTarget;

let nutritionProteinBar;

let nutritionCarbsValue;

let nutritionCarbsTarget;

let nutritionCarbsBar;

let nutritionFatValue;

let nutritionFatTarget;

let nutritionFatBar;

let nutritionEmptyState;

let workoutProgressLabel;

let workoutProgressPercent;

let workoutProgressBar;

let todayWorkoutList;

let weeklyActivityBody;

let healthProfileContent;

let healthProfileEmpty;

let profileWeight;

let profileHeight;

let profileTdee;

let profileGoal;

let runningMonthDistance;

let runningMonthRuns;

let runningLongest;

let runningMonthCalories;

let latestRunContent;

let upcomingTrainingList;

/** Start **/

document.addEventListener(

    "DOMContentLoaded",

    async function () {

        getDashboardElements();

        if (

            logoutButton

        ) {

            logoutButton.addEventListener(

                "click",

                handleLogout

            );

        }

        await Promise.all([

            loadDashboardHealthProfile(),

            loadDashboardMealEntries(),

            loadDashboardRunningEntries(),

            loadDashboardWorkoutEntries()

        ]);

        renderDashboard();

    }

);

document.addEventListener(

    "fithealth:user-authenticated",

    function (event) {

        currentUser =

            event.detail;

        updateAuthenticatedUser();

    }

);

window.addEventListener(

    "focus",

    async function () {

        await Promise.all([

            loadDashboardHealthProfile(),

            loadDashboardMealEntries(),

            loadDashboardRunningEntries(),

            loadDashboardWorkoutEntries()

        ]);

        renderDashboard();

    }

);

/** Elements **/

function getDashboardElements() {

    logoutButton =

        document.getElementById(

            "logoutButton"

        );

    dashboardGreeting =

        document.getElementById(

            "dashboardGreeting"

        );

    dashboardDate =

        document.getElementById(

            "dashboardDate"

        );

    dashboardAccountLabel =

        document.getElementById(

            "dashboardAccountLabel"

        );

    dashboardMessage =

        document.getElementById(

            "dashboardMessage"

        );

    dashboardBmi =

        document.getElementById(

            "dashboardBmi"

        );

    dashboardBmiStatus =

        document.getElementById(

            "dashboardBmiStatus"

        );

    dashboardCaloriesToday =

        document.getElementById(

            "dashboardCaloriesToday"

        );

    dashboardCaloriesTarget =

        document.getElementById(

            "dashboardCaloriesTarget"

        );

    dashboardWorkoutDone =

        document.getElementById(

            "dashboardWorkoutDone"

        );

    dashboardWorkoutTotal =

        document.getElementById(

            "dashboardWorkoutTotal"

        );

    dashboardRunDistance =

        document.getElementById(

            "dashboardRunDistance"

        );

    dashboardRunCount =

        document.getElementById(

            "dashboardRunCount"

        );

    nutritionCaloriesValue =

        document.getElementById(

            "nutritionCaloriesValue"

        );

    nutritionCaloriesTarget =

        document.getElementById(

            "nutritionCaloriesTarget"

        );

    nutritionCaloriesBar =

        document.getElementById(

            "nutritionCaloriesBar"

        );

    nutritionProteinValue =

        document.getElementById(

            "nutritionProteinValue"

        );

    nutritionProteinTarget =

        document.getElementById(

            "nutritionProteinTarget"

        );

    nutritionProteinBar =

        document.getElementById(

            "nutritionProteinBar"

        );

    nutritionCarbsValue =

        document.getElementById(

            "nutritionCarbsValue"

        );

    nutritionCarbsTarget =

        document.getElementById(

            "nutritionCarbsTarget"

        );

    nutritionCarbsBar =

        document.getElementById(

            "nutritionCarbsBar"

        );

    nutritionFatValue =

        document.getElementById(

            "nutritionFatValue"

        );

    nutritionFatTarget =

        document.getElementById(

            "nutritionFatTarget"

        );

    nutritionFatBar =

        document.getElementById(

            "nutritionFatBar"

        );

    nutritionEmptyState =

        document.getElementById(

            "nutritionEmptyState"

        );

    workoutProgressLabel =

        document.getElementById(

            "workoutProgressLabel"

        );

    workoutProgressPercent =

        document.getElementById(

            "workoutProgressPercent"

        );

    workoutProgressBar =

        document.getElementById(

            "workoutProgressBar"

        );

    todayWorkoutList =

        document.getElementById(

            "todayWorkoutList"

        );

    weeklyActivityBody =

        document.getElementById(

            "weeklyActivityBody"

        );

    healthProfileContent =

        document.getElementById(

            "healthProfileContent"

        );

    healthProfileEmpty =

        document.getElementById(

            "healthProfileEmpty"

        );

    profileWeight =

        document.getElementById(

            "profileWeight"

        );

    profileHeight =

        document.getElementById(

            "profileHeight"

        );

    profileTdee =

        document.getElementById(

            "profileTdee"

        );

    profileGoal =

        document.getElementById(

            "profileGoal"

        );

    runningMonthDistance =

        document.getElementById(

            "runningMonthDistance"

        );

    runningMonthRuns =

        document.getElementById(

            "runningMonthRuns"

        );

    runningLongest =

        document.getElementById(

            "runningLongest"

        );

    runningMonthCalories =

        document.getElementById(

            "runningMonthCalories"

        );

    latestRunContent =

        document.getElementById(

            "latestRunContent"

        );

    upcomingTrainingList =

        document.getElementById(

            "upcomingTrainingList"

        );

}

/** Authenticated User **/

function updateAuthenticatedUser() {

    if (

        !currentUser

    ) {

        return;

    }

    if (

        dashboardGreeting

        &&

        currentUser.firstName

    ) {

        dashboardGreeting.textContent =

            `Welcome back, ${currentUser.firstName}`;

    }

    if (

        dashboardAccountLabel

    ) {

        const fullName =

            [

                currentUser.firstName,

                currentUser.lastName

            ]

                .filter(Boolean)

                .join(" ");

        dashboardAccountLabel.textContent =

            fullName

            ||

            currentUser.email

            ||

            "Signed in";

    }

}

async function handleLogout() {

    try {

        if (

            logoutButton

        ) {

            logoutButton.disabled =

                true;

        }

        const response =

            await fetch(

                "logout",

                {

                    method:

                        "POST",

                    credentials:

                        "same-origin"

                }

            );

        let data =

            {};

        try {

            data =

                await response.json();

        } catch (error) {

            console.error(

                "Unable to parse logout response:",

                error

            );

        }

        if (

            !response.ok

            ||

            !data.success

        ) {

            throw new Error(

                data.message

                ||

                "Unable to logout."

            );

        }

        window.location.href =

            "login.html";

    } catch (error) {

        console.error(

            "Logout failed:",

            error

        );

        if (

            dashboardMessage

        ) {

            dashboardMessage.className =

                "alert alert-danger";

            dashboardMessage.textContent =

                error.message

                ||

                "Unable to logout.";

            dashboardMessage.classList.remove(

                "d-none"

            );

        }

    } finally {

        if (

            logoutButton

        ) {

            logoutButton.disabled =

                false;

        }

    }

}

/** Main Render **/

function renderDashboard() {

    const profile =

        getHealthProfile();

    const meals =

        getMealEntries();

    const workouts =

        getWorkoutEntries();

    const runs =

        getRunningEntries();

    const today =

        new Date();

    const todayString =

        getLocalDateString(

            today

        );

    renderHeader(

        today

    );

    renderHealthSummary(

        profile

    );

    renderNutrition(

        profile,

        meals,

        todayString

    );

    renderWorkout(

        workouts,

        todayString

    );

    renderRunning(

        runs,

        today

    );

    renderWeeklyActivity(

        meals,

        workouts,

        runs,

        today

    );

    renderUpcomingTraining(

        workouts,

        today

    );

}

/** Header **/

function renderHeader(

    date

) {

    const hour =

        date.getHours();

    if (

        hour < 12

    ) {

        dashboardGreeting.textContent =

            "Good morning";

    } else if (

        hour < 18

    ) {

        dashboardGreeting.textContent =

            "Good afternoon";

    } else {

        dashboardGreeting.textContent =

            "Good evening";

    }

    dashboardDate.textContent =

        new Intl.DateTimeFormat(

            "en-US",

            {

                weekday:

                    "long",

                month:

                    "long",

                day:

                    "numeric",

                year:

                    "numeric"

            }

        ).format(

            date

        );

    if (

        currentUser

        &&

        currentUser.firstName

    ) {

        dashboardGreeting.textContent =

            `Welcome back, ${currentUser.firstName}`;

    }

    if (

        dashboardAccountLabel

    ) {

        if (

            currentUser

        ) {

            const fullName =

                [

                    currentUser.firstName,

                    currentUser.lastName

                ]

                    .filter(Boolean)

                    .join(" ");

            dashboardAccountLabel.textContent =

                fullName

                ||

                currentUser.email

                ||

                "Signed in";

        } else {

            dashboardAccountLabel.textContent =

                "Loading account...";

        }

    }

}

/** Health **/

function renderHealthSummary(

    profile

) {

    if (

        !profile

    ) {

        dashboardBmi.textContent =

            "--";

        dashboardBmiStatus.textContent =

            "Add health profile";

        healthProfileContent.classList.add(

            "d-none"

        );

        healthProfileEmpty.classList.remove(

            "d-none"

        );

        return;

    }

    healthProfileContent.classList.remove(

        "d-none"

    );

    healthProfileEmpty.classList.add(

        "d-none"

    );

    const bmi =

        getNumericValue(

            profile,

            [

                "bmi"

            ]

        );

    dashboardBmi.textContent =

        bmi > 0

        ?

        formatNumber(

            bmi

        )

        :

        "--";

    dashboardBmiStatus.textContent =

        getBmiLabel(

            bmi

        );

    const weight =

        getNumericValue(

            profile,

            [

                "weight"

            ]

        );

    const height =

        getNumericValue(

            profile,

            [

                "height"

            ]

        );

    const tdee =

        getNumericValue(

            profile,

            [

                "tdee"

            ]

        );

    const goal =

        getFirstValue(

            profile,

            [

                "goal"

            ]

        );

    profileWeight.textContent =

        weight > 0

        ?

        `${formatNumber(weight)} kg`

        :

        "--";

    profileHeight.textContent =

        height > 0

        ?

        `${formatNumber(height)} cm`

        :

        "--";

    profileTdee.textContent =

        tdee > 0

        ?

        `${Math.round(tdee)} kcal`

        :

        "--";

    profileGoal.textContent =

        goal

        ?

        formatLabel(

            goal

        )

        :

        "--";

}

/** Nutrition **/

function renderNutrition(

    profile,

    meals,

    todayString

) {

    const todayMeals =

        meals.filter(

            function (meal) {

                return (

                    meal.date

                    ===

                    todayString

                );

            }

        );

    const totals =

        todayMeals.reduce(

            function (

                result,

                meal

            ) {

                result.calories +=

                    Number(

                        meal.calories

                        ||

                        0

                    );

                result.protein +=

                    Number(

                        meal.protein

                        ||

                        0

                    );

                result.carbs +=

                    Number(

                        meal.carbs

                        ||

                        0

                    );

                result.fat +=

                    Number(

                        meal.fat

                        ||

                        0

                    );

                return result;

            },

            {

                calories:

                    0,

                protein:

                    0,

                carbs:

                    0,

                fat:

                    0

            }

        );

    const targets =

        getNutritionTargets(

            profile

        );

    dashboardCaloriesToday.textContent =

        Math.round(

            totals.calories

        );

    if (

        targets.calories > 0

    ) {

        dashboardCaloriesTarget.textContent =

            `of ${Math.round(targets.calories)} kcal target`;

    } else {

        dashboardCaloriesTarget.textContent =

            "No target yet";

    }

    setNutritionProgress(

        nutritionCaloriesValue,

        nutritionCaloriesTarget,

        nutritionCaloriesBar,

        totals.calories,

        targets.calories

    );

    setNutritionProgress(

        nutritionProteinValue,

        nutritionProteinTarget,

        nutritionProteinBar,

        totals.protein,

        targets.protein

    );

    setNutritionProgress(

        nutritionCarbsValue,

        nutritionCarbsTarget,

        nutritionCarbsBar,

        totals.carbs,

        targets.carbs

    );

    setNutritionProgress(

        nutritionFatValue,

        nutritionFatTarget,

        nutritionFatBar,

        totals.fat,

        targets.fat

    );

    nutritionEmptyState.classList.toggle(

        "d-none",

        todayMeals.length > 0

    );

}

function getNutritionTargets(

    profile

) {

    if (

        !profile

    ) {

        return {

            calories:

                0,

            protein:

                0,

            carbs:

                0,

            fat:

                0

        };

    }

    return {

        calories:

            getNumericValue(

                profile,

                [

                    "targetCalories",

                    "target_calories",

                    "calorieTarget",

                    "calories"

                ]

            ),

        protein:

            getNumericValue(

                profile,

                [

                    "proteinTarget",

                    "protein_target",

                    "protein"

                ]

            ),

        carbs:

            getNumericValue(

                profile,

                [

                    "carbsTarget",

                    "carbs_target",

                    "carbs"

                ]

            ),

        fat:

            getNumericValue(

                profile,

                [

                    "fatTarget",

                    "fat_target",

                    "fat"

                ]

            )

    };

}

function setNutritionProgress(

    valueElement,

    targetElement,

    barElement,

    value,

    target

) {

    valueElement.textContent =

        formatNumber(

            value

        );

    targetElement.textContent =

        target > 0

        ?

        formatNumber(

            target

        )

        :

        "--";

    let percent =

        0;

    if (

        target > 0

    ) {

        percent =

            (

                value

                /

                target

            )

            *

            100;

    }

    barElement.style.width =

        `${Math.min(Math.max(percent, 0), 100)}%`;

}

/** Workout **/

function renderWorkout(

    workouts,

    todayString

) {

    const todayWorkouts =

        workouts.filter(

            function (workout) {

                return (

                    getWorkoutDate(

                        workout

                    )

                    ===

                    todayString

                );

            }

        );

    const completed =

        todayWorkouts.filter(

            function (workout) {

                return Boolean(

                    workout.completed

                );

            }

        ).length;

    dashboardWorkoutDone.textContent =

        completed;

    dashboardWorkoutTotal.textContent =

        todayWorkouts.length;

    const percent =

        todayWorkouts.length > 0

        ?

        Math.round(

            (

                completed

                /

                todayWorkouts.length

            )

            *

            100

        )

        :

        0;

    workoutProgressLabel.textContent =

        `${completed} of ${todayWorkouts.length} completed`;

    workoutProgressPercent.textContent =

        `${percent}%`;

    workoutProgressBar.style.width =

        `${percent}%`;

    todayWorkoutList.innerHTML =

        "";

    if (

        todayWorkouts.length === 0

    ) {

        todayWorkoutList.appendChild(

            createEmptyListItem(

                "No workout planned for today.",

                "Open Training Calendar to add exercises."

            )

        );

        return;

    }

    todayWorkouts.forEach(

        function (workout) {

            const item =

                document.createElement(

                    "div"

                );

            item.className =

                "dashboard-list-item";

            if (

                workout.completed

            ) {

                item.classList.add(

                    "completed"

                );

            }

            const main =

                document.createElement(

                    "div"

                );

            main.className =

                "dashboard-list-main";

            const title =

                document.createElement(

                    "strong"

                );

            title.textContent =

                workout.exerciseName

                ||

                workout.name

                ||

                "Exercise";

            const details =

                document.createElement(

                    "small"

                );

            details.textContent =

                formatWorkoutDetails(

                    workout

                );

            main.appendChild(

                title

            );

            main.appendChild(

                details

            );

            const value =

                document.createElement(

                    "span"

                );

            value.className =

                "dashboard-list-value";

            value.textContent =

                workout.completed

                ?

                "Done"

                :

                "Planned";

            item.appendChild(

                main

            );

            item.appendChild(

                value

            );

            todayWorkoutList.appendChild(

                item

            );

        }

    );

}

/** Running **/

function renderRunning(

    runs,

    currentDate

) {

    const year =

        currentDate.getFullYear();

    const month =

        currentDate.getMonth();

    const monthRuns =

        runs.filter(

            function (run) {

                const date =

                    parseLocalDate(

                        getRunDate(

                            run

                        )

                    );

                return (

                    date.getFullYear()

                    ===

                    year

                    &&

                    date.getMonth()

                    ===

                    month

                );

            }

        );

    const totalDistance =

        monthRuns.reduce(

            function (

                total,

                run

            ) {

                return (

                    total

                    +

                    Number(

                        run.distance

                        ||

                        0

                    )

                );

            },

            0

        );

    const totalCalories =

        monthRuns.reduce(

            function (

                total,

                run

            ) {

                return (

                    total

                    +

                    Number(

                        run.calories

                        ||

                        0

                    )

                );

            },

            0

        );

    const longest =

        monthRuns.reduce(

            function (

                longestValue,

                run

            ) {

                return Math.max(

                    longestValue,

                    Number(

                        run.distance

                        ||

                        0

                    )

                );

            },

            0

        );

    dashboardRunDistance.textContent =

        formatNumber(

            totalDistance

        );

    dashboardRunCount.textContent =

        `${monthRuns.length} run${monthRuns.length === 1 ? "" : "s"}`;

    runningMonthDistance.textContent =

        formatNumber(

            totalDistance

        );

    runningMonthRuns.textContent =

        monthRuns.length;

    runningLongest.textContent =

        formatNumber(

            longest

        );

    runningMonthCalories.textContent =

        Math.round(

            totalCalories

        );

    renderLatestRun(

        runs

    );

}

function renderLatestRun(

    runs

) {

    latestRunContent.innerHTML =

        "";

    if (

        runs.length === 0

    ) {

        const message =

            document.createElement(

                "p"

            );

        message.className =

            "mb-0 mt-2 text-body-secondary";

        message.textContent =

            "No running sessions yet.";

        latestRunContent.appendChild(

            message

        );

        return;

    }

    const sorted =

        [

            ...runs

        ].sort(

            function (

                first,

                second

            ) {

                return (

                    parseLocalDate(

                        getRunDate(

                            second

                        )

                    )

                    -

                    parseLocalDate(

                        getRunDate(

                            first

                        )

                    )

                );

            }

        );

    const latest =

        sorted[0];

    const distance =

        document.createElement(

            "strong"

        );

    distance.className =

        "d-block mt-2 fs-5";

    distance.textContent =

        `${formatNumber(latest.distance || 0)} km`;

    const info =

        document.createElement(

            "small"

        );

    info.className =

        "text-body-secondary";

    info.textContent =

        `${formatDateLabel(getRunDate(latest))} • ${formatDuration(latest.duration)}`;

    latestRunContent.appendChild(

        distance

    );

    latestRunContent.appendChild(

        info

    );

}

/** Weekly **/

function renderWeeklyActivity(

    meals,

    workouts,

    runs,

    currentDate

) {

    weeklyActivityBody.innerHTML =

        "";

    for (

        let offset = 6;

        offset >= 0;

        offset--

    ) {

        const date =

            new Date(

                currentDate.getFullYear(),

                currentDate.getMonth(),

                currentDate.getDate() - offset

            );

        const dateString =

            getLocalDateString(

                date

            );

        const dayMeals =

            meals.filter(

                function (meal) {

                    return (

                        meal.date

                        ===

                        dateString

                    );

                }

            );

        const dayWorkouts =

            workouts.filter(

                function (workout) {

                    return (

                        getWorkoutDate(

                            workout

                        )

                        ===

                        dateString

                    );

                }

            );

        const dayRuns =

            runs.filter(

                function (run) {

                    return (

                        getRunDate(

                            run

                        )

                        ===

                        dateString

                    );

                }

            );

        const runDistance =

            dayRuns.reduce(

                function (

                    total,

                    run

                ) {

                    return (

                        total

                        +

                        Number(

                            run.distance

                            ||

                            0

                        )

                    );

                },

                0

            );

        const completed =

            dayWorkouts.filter(

                function (workout) {

                    return Boolean(

                        workout.completed

                    );

                }

            ).length;

        const row =

            document.createElement(

                "tr"

            );

        row.innerHTML =

            `

                <td>

                    <strong>${formatShortDate(date)}</strong>

                </td>

                <td>

                    ${dayMeals.length}

                </td>

                <td>

                    ${completed}/${dayWorkouts.length}

                </td>

                <td>

                    ${formatNumber(runDistance)} km

                </td>

            `;

        weeklyActivityBody.appendChild(

            row

        );

    }

}

/** Upcoming Training **/

function renderUpcomingTraining(

    workouts,

    currentDate

) {

    upcomingTrainingList.innerHTML =

        "";

    const todayString =

        getLocalDateString(

            currentDate

        );

    const limitDate =

        new Date(

            currentDate.getFullYear(),

            currentDate.getMonth(),

            currentDate.getDate() + 7

        );

    const limitString =

        getLocalDateString(

            limitDate

        );

    const upcoming =

        workouts

            .filter(

                function (workout) {

                    const date =

                        getWorkoutDate(

                            workout

                        );

                    return (

                        date >= todayString

                        &&

                        date <= limitString

                    );

                }

            )

            .sort(

                function (

                    first,

                    second

                ) {

                    return (

                        getWorkoutDate(

                            first

                        )

                        .localeCompare(

                            getWorkoutDate(

                                second

                            )

                        )

                    );

                }

            )

            .slice(

                0,

                5

            );

    if (

        upcoming.length === 0

    ) {

        upcomingTrainingList.appendChild(

            createEmptyListItem(

                "No upcoming exercises.",

                "Plan your next workout in Training Calendar."

            )

        );

        return;

    }

    upcoming.forEach(

        function (workout) {

            const item =

                document.createElement(

                    "div"

                );

            item.className =

                "dashboard-list-item";

            const main =

                document.createElement(

                    "div"

                );

            main.className =

                "dashboard-list-main";

            const title =

                document.createElement(

                    "strong"

                );

            title.textContent =

                workout.exerciseName

                ||

                workout.name

                ||

                "Exercise";

            const details =

                document.createElement(

                    "small"

                );

            details.textContent =

                formatWorkoutDetails(

                    workout

                );

            main.appendChild(

                title

            );

            main.appendChild(

                details

            );

            const value =

                document.createElement(

                    "span"

                );

            value.className =

                "dashboard-list-value";

            value.textContent =

                formatDateLabel(

                    getWorkoutDate(

                        workout

                    )

                );

            item.appendChild(

                main

            );

            item.appendChild(

                value

            );

            upcomingTrainingList.appendChild(

                item

            );

        }

    );

}

/** Health Profile API **/

async function loadDashboardHealthProfile() {

    try {

        const response =

            await fetch(

                "api/health-profile",

                {

                    method:
                        "GET",

                    credentials:
                        "same-origin",

                    cache:
                        "no-store"

                }

            );


        if (

            response.status === 401

        ) {

            window.location.href =
                "login.html";

            return;

        }


        const responseText =

            await response.text();


        let data = {};


        if (

            responseText

        ) {

            try {

                data =

                    JSON.parse(

                        responseText

                    );

            } catch (
                parseError
            ) {

                console.error(

                    "Invalid Health Profile response:",

                    responseText

                );


                throw new Error(

                    "Server returned an invalid Health Profile response."

                );

            }

        }


        if (

            !response.ok

            ||

            !data.success

        ) {

            throw new Error(

                data.message

                ||

                "Unable to load health profile."

            );

        }


        currentHealthProfile =

            data.profile

            ||

            null;


    } catch (
        error
    ) {

        console.error(

            "Unable to load Dashboard Health Profile:",

            error

        );


        currentHealthProfile =
            null;


        if (

            dashboardMessage

        ) {

            dashboardMessage.className =
                "alert alert-warning";


            dashboardMessage.textContent =
                "Unable to load Health Profile from the server.";


            dashboardMessage.classList.remove(

                "d-none"

            );

        }

    }

}


/** Meal Entries API **/

async function loadDashboardMealEntries() {

    const today =

        new Date();


    const dates = [];


    for (

        let offset = 6;

        offset >= 0;

        offset--

    ) {

        const date =

            new Date(

                today.getFullYear(),

                today.getMonth(),

                today.getDate() - offset

            );


        dates.push(

            getLocalDateString(

                date

            )

        );

    }


    try {

        const requests =

            dates.map(

                async function (

                    dateString

                ) {

                    const response =

                        await fetch(

                            `api/meal-entries?date=${encodeURIComponent(dateString)}`,

                            {

                                method:
                                    "GET",

                                credentials:
                                    "same-origin",

                                cache:
                                    "no-store"

                            }

                        );


                    if (

                        response.status === 401

                    ) {

                        window.location.href =
                            "login.html";


                        throw new Error(

                            "Not authenticated."

                        );

                    }


                    const responseText =

                        await response.text();


                    let data = {};


                    if (

                        responseText

                    ) {

                        try {

                            data =

                                JSON.parse(

                                    responseText

                                );

                        } catch (
                            parseError
                        ) {

                            console.error(

                                "Invalid Meal Entries response:",

                                responseText

                            );


                            throw new Error(

                                "Server returned an invalid Meal Entries response."

                            );

                        }

                    }


                    if (

                        !response.ok

                        ||

                        !data.success

                    ) {

                        throw new Error(

                            data.message

                            ||

                            "Unable to load meal entries."

                        );

                    }


                    return (

                        Array.isArray(

                            data.entries

                        )

                        ?

                        data.entries

                        :

                        []

                    );

                }

            );


        const mealGroups =

            await Promise.all(

                requests

            );


        currentMealEntries =

            mealGroups

                .flat()

                .map(

                    normalizeDashboardMealEntry

                )

                .filter(

                    Boolean

                );


    } catch (
        error
    ) {

        console.error(

            "Unable to load Dashboard Meal Entries:",

            error

        );


        currentMealEntries =
            [];


        if (

            dashboardMessage

        ) {

            dashboardMessage.className =
                "alert alert-warning";


            dashboardMessage.textContent =
                "Unable to load Nutrition data from the server.";


            dashboardMessage.classList.remove(

                "d-none"

            );

        }

    }

}


function normalizeDashboardMealEntry(

    entry

) {

    if (

        !entry

    ) {

        return null;

    }


    const normalized = {

        ...entry

    };


    [

        "id",

        "foodId",

        "amount",

        "oilAmount",

        "calories",

        "protein",

        "carbs",

        "fat"

    ].forEach(

        function (

            field

        ) {

            if (

                normalized[field]

                !==

                null

                &&

                normalized[field]

                !==

                undefined

                &&

                normalized[field]

                !==

                ""

            ) {

                normalized[field] =

                    Number(

                        normalized[field]

                    );

            }

        }

    );


    return normalized;

}


/** Running Sessions API **/

async function loadDashboardRunningEntries() {

    try {

        const response =

            await fetch(

                "api/running-sessions",

                {

                    method:
                        "GET",

                    credentials:
                        "same-origin",

                    cache:
                        "no-store"

                }

            );


        if (

            response.status === 401

        ) {

            window.location.href =
                "login.html";


            throw new Error(

                "Not authenticated."

            );

        }


        const responseText =

            await response.text();


        let data = {};


        if (

            responseText

        ) {

            try {

                data =

                    JSON.parse(

                        responseText

                    );

            } catch (
                parseError
            ) {

                console.error(

                    "Invalid Running Sessions response:",

                    responseText

                );


                throw new Error(

                    "Server returned an invalid Running Sessions response."

                );

            }

        }


        if (

            !response.ok

            ||

            !data.success

        ) {

            throw new Error(

                data.message

                ||

                "Unable to load running sessions."

            );

        }


        currentRunningEntries =

            (

                Array.isArray(

                    data.entries

                )

                ?

                data.entries

                :

                []

            )

                .map(

                    normalizeDashboardRunningEntry

                )

                .filter(

                    Boolean

                );


    } catch (
        error
    ) {

        console.error(

            "Unable to load Dashboard Running Sessions:",

            error

        );


        currentRunningEntries =
            [];


        if (

            dashboardMessage

        ) {

            dashboardMessage.className =
                "alert alert-warning";


            dashboardMessage.textContent =
                "Unable to load Running data from the server.";


            dashboardMessage.classList.remove(

                "d-none"

            );

        }

    }

}


function normalizeDashboardRunningEntry(

    entry

) {

    if (

        !entry

    ) {

        return null;

    }


    const normalized = {

        ...entry

    };


    [

        "id",

        "distance",

        "duration",

        "averageSpeed",

        "averagePace",

        "calories"

    ].forEach(

        function (

            field

        ) {

            if (

                normalized[field]

                !==

                null

                &&

                normalized[field]

                !==

                undefined

                &&

                normalized[field]

                !==

                ""

            ) {

                normalized[field] =

                    Number(

                        normalized[field]

                    );

            }

        }

    );


    return normalized;

}


/** Workout Plans API **/

async function loadDashboardWorkoutEntries() {

    try {

        const response =
            await fetch(
                "api/workout-plans",
                {
                    method:
                        "GET",

                    credentials:
                        "same-origin",

                    cache:
                        "no-store"
                }
            );


        if (
            response.status === 401
        ) {

            window.location.href =
                "login.html";

            throw new Error(
                "Not authenticated."
            );

        }


        const responseText =
            await response.text();


        let data = {};


        if (
            responseText
        ) {

            try {

                data =
                    JSON.parse(
                        responseText
                    );

            } catch (
                parseError
            ) {

                console.error(
                    "Invalid Workout response:",
                    responseText
                );

                throw new Error(
                    "Server returned an invalid Workout response."
                );

            }

        }


        if (
            !response.ok
            ||
            !data.success
        ) {

            throw new Error(
                data.message
                ||
                "Unable to load workout entries."
            );

        }


        currentWorkoutEntries =
            (
                Array.isArray(
                    data.entries
                )
                ?
                data.entries
                :
                []
            )
                .map(
                    normalizeDashboardWorkoutEntry
                )
                .filter(
                    Boolean
                );


    } catch (
        error
    ) {

        console.error(
            "Unable to load Dashboard Workout entries:",
            error
        );

        currentWorkoutEntries =
            [];


        if (
            dashboardMessage
        ) {

            dashboardMessage.className =
                "alert alert-warning";

            dashboardMessage.textContent =
                "Unable to load Calendar data from the server.";

            dashboardMessage.classList.remove(
                "d-none"
            );

        }

    }

}


function normalizeDashboardWorkoutEntry(
    entry
) {

    if (
        !entry
    ) {

        return null;

    }


    const normalized = {
        ...entry
    };


    [
        "id",
        "workoutId",
        "exerciseId",
        "sets",
        "reps",
        "weight"
    ].forEach(
        function (
            field
        ) {

            if (
                normalized[field]
                !==
                null
                &&
                normalized[field]
                !==
                undefined
                &&
                normalized[field]
                !==
                ""
            ) {

                normalized[field] =
                    Number(
                        normalized[field]
                    );

            }

        }
    );


    normalized.completed =
        Boolean(
            normalized.completed
        );


    return normalized;

}


/** Data **/

function getHealthProfile() {

    return currentHealthProfile;

}


function getMealEntries() {

    return currentMealEntries;

}


function getWorkoutEntries() {

    return currentWorkoutEntries;

}


function getRunningEntries() {

    return currentRunningEntries;

}


function readLocalObject(

    key

) {

    try {

        const stored =

            localStorage.getItem(

                key

            );

        return (

            stored

            ?

            JSON.parse(

                stored

            )

            :

            null

        );

    } catch (

        error

    ) {

        console.error(

            `Unable to read ${key}:`,

            error

        );

        return null;

    }

}

function readLocalArray(

    key

) {

    const value =

        readLocalObject(

            key

        );

    return (

        Array.isArray(

            value

        )

        ?

        value

        :

        []

    );

}

/** Helpers **/

function getNumericValue(

    object,

    keys

) {

    if (

        !object

    ) {

        return 0;

    }

    for (

        const key

        of

        keys

    ) {

        const value =

            Number(

                object[key]

            );

        if (

            Number.isFinite(

                value

            )

        ) {

            return value;

        }

    }

    return 0;

}

function getFirstValue(

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

function getBmiLabel(

    bmi

) {

    if (

        !bmi

        ||

        bmi <= 0

    ) {

        return "BMI not available";

    }

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

function getWorkoutDate(

    workout

) {

    return (

        workout.date

        ||

        workout.workoutDate

        ||

        workout.workout_date

        ||

        ""

    );

}

function getRunDate(

    run

) {

    return (

        run.date

        ||

        run.runDate

        ||

        run.run_date

        ||

        ""

    );

}

function formatWorkoutDetails(

    workout

) {

    let result =

        `${workout.sets || 0} sets × ${workout.reps || 0} reps`;

    const weight =

        Number(

            workout.weight

            ||

            0

        );

    if (

        weight > 0

    ) {

        result +=

            ` • ${formatNumber(weight)} kg`;

    }

    const muscle =

        workout.primaryMuscle

        ||

        workout.muscleGroup;

    if (

        muscle

    ) {

        result +=

            ` • ${muscle}`;

    }

    return result;

}

function createEmptyListItem(

    title,

    description

) {

    const item =

        document.createElement(

            "div"

        );

    item.className =

        "dashboard-empty";

    const icon =

        document.createElement(

            "i"

        );

    icon.className =

        "bi bi-calendar2-plus";

    const content =

        document.createElement(

            "div"

        );

    const strong =

        document.createElement(

            "strong"

        );

    strong.textContent =

        title;

    const paragraph =

        document.createElement(

            "p"

        );

    paragraph.className =

        "mb-0";

    paragraph.textContent =

        description;

    content.appendChild(

        strong

    );

    content.appendChild(

        paragraph

    );

    item.appendChild(

        icon

    );

    item.appendChild(

        content

    );

    return item;

}

function getLocalDateString(

    date

) {

    const year =

        date.getFullYear();

    const month =

        String(

            date.getMonth() + 1

        ).padStart(

            2,

            "0"

        );

    const day =

        String(

            date.getDate()

        ).padStart(

            2,

            "0"

        );

    return (

        `${year}-${month}-${day}`

    );

}

function parseLocalDate(

    dateString

) {

    if (

        !dateString

    ) {

        return (

            new Date(

                0

            )

        );

    }

    const parts =

        String(

            dateString

        )

            .split(

                "-"

            )

            .map(

                Number

            );

    if (

        parts.length !== 3

        ||

        parts.some(

            Number.isNaN

        )

    ) {

        return (

            new Date(

                0

            )

        );

    }

    return (

        new Date(

            parts[0],

            parts[1] - 1,

            parts[2]

        )

    );

}

function formatDateLabel(

    dateString

) {

    const date =

        parseLocalDate(

            dateString

        );

    return (

        new Intl.DateTimeFormat(

            "en-US",

            {

                month:

                    "short",

                day:

                    "numeric"

            }

        ).format(

            date

        )

    );

}

function formatShortDate(

    date

) {

    return (

        new Intl.DateTimeFormat(

            "en-US",

            {

                weekday:

                    "short",

                month:

                    "short",

                day:

                    "numeric"

            }

        ).format(

            date

        )

    );

}

function formatLabel(

    value

) {

    return (

        String(

            value

        )

            .replace(

                /([A-Z])/g,

                " $1"

            )

            .replace(

                /[-_]/g,

                " "

            )

            .trim()

            .replace(

                /\b\w/g,

                function (

                    letter

                ) {

                    return (

                        letter.toUpperCase()

                    );

                }

            )

    );

}

function formatDuration(

    value

) {

    const duration =

        Number(

            value

        );

    if (

        !Number.isFinite(

            duration

        )

        ||

        duration <= 0

    ) {

        return "0 min";

    }

    if (

        duration > 300

    ) {

        const minutes =

            Math.floor(

                duration

                /

                60

            );

        const seconds =

            Math.round(

                duration

                %

                60

            );

        return (

            `${minutes}m ${seconds}s`

        );

    }

    return (

        `${Math.round(duration)} min`

    );

}

function formatNumber(

    value

) {

    const number =

        Number(

            value

        );

    if (

        !Number.isFinite(

            number

        )

    ) {

        return "0";

    }

    return (

        Number(

            number.toFixed(

                1

            )

        ).toString()

    );

}

