/* Calendar State */

let calendarViewDate =
    startOfMonth(
        new Date()
    );

let selectedCalendarDate =
    getLocalDateString(
        new Date()
    );

let currentMealEntries =
    [];

let currentWorkoutEntries =
    [];

let currentRunningEntries =
    [];

const mealEntriesByDate =
    new Map();


/* Elements */

let calendarGrid;
let calendarMonthTitle;
let previousMonthButton;
let nextMonthButton;
let todayButton;
let selectedDateTitle;
let selectedDateSubtitle;
let selectedDateNumber;
let monthMealCount;
let monthWorkoutCount;
let monthRunCount;
let selectedCalories;
let selectedWorkoutCount;
let selectedRunDistance;
let selectedMealCount;
let selectedExerciseCount;
let selectedRunCount;
let selectedMealList;
let selectedWorkoutList;
let selectedRunList;


/* Start */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        getCalendarElements();

        setupCalendarActions();

        await loadCalendarData();

        renderCalendar();

    }
);


/* Elements */

function getCalendarElements() {

    calendarGrid =
        document.getElementById(
            "calendarGrid"
        );

    calendarMonthTitle =
        document.getElementById(
            "calendarMonthTitle"
        );

    previousMonthButton =
        document.getElementById(
            "previousMonthButton"
        );

    nextMonthButton =
        document.getElementById(
            "nextMonthButton"
        );

    todayButton =
        document.getElementById(
            "todayButton"
        );

    selectedDateTitle =
        document.getElementById(
            "selectedDateTitle"
        );

    selectedDateSubtitle =
        document.getElementById(
            "selectedDateSubtitle"
        );

    selectedDateNumber =
        document.getElementById(
            "selectedDateNumber"
        );

    monthMealCount =
        document.getElementById(
            "monthMealCount"
        );

    monthWorkoutCount =
        document.getElementById(
            "monthWorkoutCount"
        );

    monthRunCount =
        document.getElementById(
            "monthRunCount"
        );

    selectedCalories =
        document.getElementById(
            "selectedCalories"
        );

    selectedWorkoutCount =
        document.getElementById(
            "selectedWorkoutCount"
        );

    selectedRunDistance =
        document.getElementById(
            "selectedRunDistance"
        );

    selectedMealCount =
        document.getElementById(
            "selectedMealCount"
        );

    selectedExerciseCount =
        document.getElementById(
            "selectedExerciseCount"
        );

    selectedRunCount =
        document.getElementById(
            "selectedRunCount"
        );

    selectedMealList =
        document.getElementById(
            "selectedMealList"
        );

    selectedWorkoutList =
        document.getElementById(
            "selectedWorkoutList"
        );

    selectedRunList =
        document.getElementById(
            "selectedRunList"
        );

}


/* Actions */

function setupCalendarActions() {

    previousMonthButton.addEventListener(
        "click",
        async function () {

            calendarViewDate =
                new Date(
                    calendarViewDate.getFullYear(),
                    calendarViewDate.getMonth() - 1,
                    1
                );

            await loadMealEntriesForVisibleCalendar();

            renderCalendar();

        }
    );


    nextMonthButton.addEventListener(
        "click",
        async function () {

            calendarViewDate =
                new Date(
                    calendarViewDate.getFullYear(),
                    calendarViewDate.getMonth() + 1,
                    1
                );

            await loadMealEntriesForVisibleCalendar();

            renderCalendar();

        }
    );


    todayButton.addEventListener(
        "click",
        async function () {

            const today =
                new Date();

            calendarViewDate =
                startOfMonth(
                    today
                );

            selectedCalendarDate =
                getLocalDateString(
                    today
                );

            await loadMealEntriesForVisibleCalendar();

            renderCalendar();

        }
    );

}


/* API Load */

async function loadCalendarData() {

    await Promise.all([
        loadWorkoutEntries(),
        loadRunningEntries(),
        loadMealEntriesForVisibleCalendar()
    ]);

}


async function loadWorkoutEntries() {

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


        handleAuthentication(
            response
        );


        const data =
            await parseApiResponse(
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
                "Unable to load Calendar exercises."
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
            ).map(
                normalizeWorkoutEntry
            );


    } catch (
        error
    ) {

        console.error(
            "Unable to load Calendar exercises:",
            error
        );

        currentWorkoutEntries =
            [];

    }

}


async function loadRunningEntries() {

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


        handleAuthentication(
            response
        );


        const data =
            await parseApiResponse(
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
            ).map(
                normalizeRunningEntry
            );


    } catch (
        error
    ) {

        console.error(
            "Unable to load running sessions:",
            error
        );

        currentRunningEntries =
            [];

    }

}


async function loadMealEntriesForVisibleCalendar() {

    const dates =
        getVisibleCalendarDateStrings();


    const missingDates =
        dates.filter(
            function (
                dateString
            ) {

                return (
                    !mealEntriesByDate.has(
                        dateString
                    )
                );

            }
        );


    if (
        missingDates.length > 0
    ) {

        const results =
            await Promise.all(
                missingDates.map(
                    loadMealEntriesForDate
                )
            );


        results.forEach(
            function (
                result,
                index
            ) {

                mealEntriesByDate.set(
                    missingDates[index],
                    result
                );

            }
        );

    }


    currentMealEntries =
        dates.flatMap(
            function (
                dateString
            ) {

                return (
                    mealEntriesByDate.get(
                        dateString
                    )
                    ||
                    []
                );

            }
        );

}


async function loadMealEntriesForDate(
    dateString
) {

    try {

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


        handleAuthentication(
            response
        );


        const data =
            await parseApiResponse(
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
                `Unable to load meals for ${dateString}.`
            );

        }


        return (
            Array.isArray(
                data.entries
            )
            ?
            data.entries.map(
                normalizeMealEntry
            )
            :
            []
        );


    } catch (
        error
    ) {

        console.error(
            `Unable to load meals for ${dateString}:`,
            error
        );

        return [];

    }

}


/* Render Calendar */

function renderCalendar() {

    const year =
        calendarViewDate.getFullYear();

    const month =
        calendarViewDate.getMonth();


    calendarMonthTitle.textContent =
        new Intl.DateTimeFormat(
            "en-US",
            {
                month:
                    "long",

                year:
                    "numeric"
            }
        ).format(
            calendarViewDate
        );


    calendarGrid.innerHTML =
        "";


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const startDate =
        new Date(
            year,
            month,
            1 - firstDay.getDay()
        );


    for (
        let index = 0;
        index < 42;
        index++
    ) {

        const date =
            new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + index
            );


        const dateString =
            getLocalDateString(
                date
            );


        const dayElement =
            createCalendarDay(
                date,
                dateString,
                month
            );


        calendarGrid.appendChild(
            dayElement
        );

    }


    updateMonthOverview();

    renderSelectedDate();

}


/* Day Cell */

function createCalendarDay(
    date,
    dateString,
    currentMonth
) {

    const day =
        document.createElement(
            "button"
        );


    day.type =
        "button";

    day.className =
        "calendar-day text-start";

    day.dataset.date =
        dateString;


    if (
        date.getMonth()
        !==
        currentMonth
    ) {

        day.classList.add(
            "other-month"
        );

    }


    if (
        dateString
        ===
        getLocalDateString(
            new Date()
        )
    ) {

        day.classList.add(
            "today"
        );

    }


    if (
        dateString
        ===
        selectedCalendarDate
    ) {

        day.classList.add(
            "selected"
        );

    }


    const number =
        document.createElement(
            "span"
        );

    number.className =
        "day-number";

    number.textContent =
        date.getDate();

    day.appendChild(
        number
    );


    const data =
        getDataForDate(
            dateString
        );


    const eventContainer =
        document.createElement(
            "div"
        );

    eventContainer.className =
        "day-events";


    const events =
        buildDayEventPreview(
            data
        );


    events
        .slice(
            0,
            3
        )
        .forEach(
            function (
                event
            ) {

                eventContainer.appendChild(
                    event
                );

            }
        );


    if (
        events.length > 3
    ) {

        const more =
            document.createElement(
                "div"
            );

        more.className =
            "more-events";

        more.textContent =
            `+${events.length - 3} more`;

        eventContainer.appendChild(
            more
        );

    }


    day.appendChild(
        eventContainer
    );


    day.addEventListener(
        "click",
        async function () {

            selectedCalendarDate =
                dateString;

            calendarViewDate =
                startOfMonth(
                    date
                );

            await loadMealEntriesForVisibleCalendar();

            renderCalendar();

        }
    );


    return day;

}


/* Calendar Event Preview */

function buildDayEventPreview(
    data
) {

    const events = [];


    if (
        data.meals.length > 0
    ) {

        events.push(
            createEventBadge(
                `${data.meals.length} meal${data.meals.length === 1 ? "" : "s"}`,
                "meal-event"
            )
        );

    }


    data.workouts
        .slice(
            0,
            2
        )
        .forEach(
            function (
                workout
            ) {

                events.push(
                    createEventBadge(
                        workout.exerciseName
                        ||
                        workout.name
                        ||
                        "Exercise",
                        "workout-event"
                    )
                );

            }
        );


    if (
        data.runs.length > 0
    ) {

        const distance =
            data.runs.reduce(
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


        events.push(
            createEventBadge(
                `${formatNumber(distance)} km run`,
                "run-event"
            )
        );

    }


    return events;

}


function createEventBadge(
    text,
    className
) {

    const event =
        document.createElement(
            "div"
        );

    event.className =
        `day-event ${className}`;

    event.textContent =
        text;

    return event;

}


/* Selected Date */

function renderSelectedDate() {

    const date =
        parseLocalDate(
            selectedCalendarDate
        );

    const data =
        getDataForDate(
            selectedCalendarDate
        );


    selectedDateTitle.textContent =
        new Intl.DateTimeFormat(
            "en-US",
            {
                weekday:
                    "long"
            }
        ).format(
            date
        );


    selectedDateSubtitle.textContent =
        new Intl.DateTimeFormat(
            "en-US",
            {
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


    selectedDateNumber.textContent =
        date.getDate();


    const totalCalories =
        data.meals.reduce(
            function (
                total,
                meal
            ) {

                return (
                    total
                    +
                    Number(
                        meal.calories
                        ||
                        0
                    )
                );

            },
            0
        );


    const runDistance =
        data.runs.reduce(
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


    selectedCalories.textContent =
        Math.round(
            totalCalories
        );

    selectedWorkoutCount.textContent =
        data.workouts.length;

    selectedRunDistance.textContent =
        formatNumber(
            runDistance
        );

    selectedMealCount.textContent =
        data.meals.length;

    selectedExerciseCount.textContent =
        data.workouts.length;

    selectedRunCount.textContent =
        data.runs.length;


    renderMealList(
        data.meals
    );

    renderWorkoutList(
        data.workouts
    );

    renderRunList(
        data.runs
    );

}


/* Meals */

function renderMealList(
    meals
) {

    selectedMealList.innerHTML =
        "";


    if (
        meals.length === 0
    ) {

        selectedMealList.appendChild(
            createEmptyState(
                "No meals saved for this date."
            )
        );

        return;

    }


    meals.forEach(
        function (
            meal
        ) {

            selectedMealList.appendChild(
                createDayItem(
                    meal.foodName
                    ||
                    "Food",
                    `${Math.round(Number(meal.calories || 0))} kcal`,
                    formatMealMeta(
                        meal
                    )
                )
            );

        }
    );

}


/* Workouts */

function renderWorkoutList(
    workouts
) {

    selectedWorkoutList.innerHTML =
        "";


    if (
        workouts.length === 0
    ) {

        selectedWorkoutList.appendChild(
            createEmptyState(
                "No exercises planned for this date."
            )
        );

        return;

    }


    workouts.forEach(
        function (
            workout
        ) {

            selectedWorkoutList.appendChild(
                createWorkoutItem(
                    workout
                )
            );

        }
    );

}


function createWorkoutItem(
    workout
) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "day-item";


    if (
        workout.completed
    ) {

        item.classList.add(
            "completed"
        );

    }


    const header =
        document.createElement(
            "div"
        );

    header.className =
        "day-item-header";


    const nameElement =
        document.createElement(
            "div"
        );

    nameElement.className =
        "day-item-name";

    nameElement.textContent =
        workout.exerciseName
        ||
        workout.name
        ||
        "Exercise";


    const valueElement =
        document.createElement(
            "div"
        );

    valueElement.className =
        "day-item-value";

    valueElement.textContent =
        workout.completed
        ?
        "Done"
        :
        "Planned";


    header.appendChild(
        nameElement
    );

    header.appendChild(
        valueElement
    );

    item.appendChild(
        header
    );


    const weight =
        Number(
            workout.weight
            ||
            0
        );


    let meta =
        `${workout.sets || 0} sets × ${workout.reps || 0} reps`;


    if (
        weight > 0
    ) {

        meta +=
            ` • ${formatNumber(weight)} kg`;

    }


    const muscle =
        workout.primaryMuscle
        ||
        workout.muscleGroup;


    if (
        muscle
    ) {

        meta +=
            ` • ${muscle}`;

    }


    const metaElement =
        document.createElement(
            "div"
        );

    metaElement.className =
        "day-item-meta";

    metaElement.textContent =
        meta;

    item.appendChild(
        metaElement
    );


    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "d-flex flex-wrap gap-2 mt-3";


    const completeButton =
        createWorkoutActionButton(
            workout.completed
            ?
            "Mark Planned"
            :
            "Mark Done",
            workout.completed
            ?
            "bi-arrow-counterclockwise"
            :
            "bi-check-circle",
            "btn-outline-success"
        );


    completeButton.addEventListener(
        "click",
        async function () {

            await updateWorkoutEntry(
                workout,
                {
                    completed:
                        !workout.completed
                }
            );

        }
    );


    const editButton =
        createWorkoutActionButton(
            "Edit",
            "bi-pencil-square",
            "btn-outline-primary"
        );


    editButton.addEventListener(
        "click",
        async function () {

            await editWorkoutEntry(
                workout
            );

        }
    );


    const deleteButton =
        createWorkoutActionButton(
            "Delete",
            "bi-trash",
            "btn-outline-danger"
        );


    deleteButton.addEventListener(
        "click",
        async function () {

            await deleteWorkoutEntry(
                workout
            );

        }
    );


    actions.appendChild(
        completeButton
    );

    actions.appendChild(
        editButton
    );

    actions.appendChild(
        deleteButton
    );

    item.appendChild(
        actions
    );


    return item;

}


function createWorkoutActionButton(
    text,
    iconClass,
    buttonClass
) {

    const button =
        document.createElement(
            "button"
        );

    button.type =
        "button";

    button.className =
        `btn btn-sm ${buttonClass}`;

    button.innerHTML =
        `<i class="bi ${iconClass} me-1"></i>${text}`;

    return button;

}


async function editWorkoutEntry(
    workout
) {

    const date =
        window.prompt(
            "Workout date (YYYY-MM-DD):",
            getWorkoutDate(
                workout
            )
        );


    if (
        date === null
    ) {

        return;

    }


    const sets =
        window.prompt(
            "Sets:",
            String(
                workout.sets
                ||
                0
            )
        );


    if (
        sets === null
    ) {

        return;

    }


    const reps =
        window.prompt(
            "Reps:",
            String(
                workout.reps
                ||
                0
            )
        );


    if (
        reps === null
    ) {

        return;

    }


    const weight =
        window.prompt(
            "Weight (kg):",
            String(
                workout.weight
                ||
                0
            )
        );


    if (
        weight === null
    ) {

        return;

    }


    const parsedSets =
        Number(
            sets
        );

    const parsedReps =
        Number(
            reps
        );

    const parsedWeight =
        Number(
            weight
        );


    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            date
        )
        ||
        !Number.isInteger(
            parsedSets
        )
        ||
        parsedSets < 1
        ||
        parsedSets > 20
        ||
        !Number.isInteger(
            parsedReps
        )
        ||
        parsedReps < 1
        ||
        parsedReps > 100
        ||
        !Number.isFinite(
            parsedWeight
        )
        ||
        parsedWeight < 0
    ) {

        window.alert(
            "Please enter a valid date, sets, reps and weight."
        );

        return;

    }


    await updateWorkoutEntry(
        workout,
        {
            date:
                date,

            sets:
                parsedSets,

            reps:
                parsedReps,

            weight:
                parsedWeight
        }
    );

}


async function updateWorkoutEntry(
    workout,
    changes
) {

    try {

        const body = {
            id:
                workout.id,

            date:
                changes.date
                ??
                getWorkoutDate(
                    workout
                ),

            sets:
                changes.sets
                ??
                Number(
                    workout.sets
                    ||
                    0
                ),

            reps:
                changes.reps
                ??
                Number(
                    workout.reps
                    ||
                    0
                ),

            weight:
                changes.weight
                ??
                Number(
                    workout.weight
                    ||
                    0
                ),

            completed:
                changes.completed
                ??
                Boolean(
                    workout.completed
                )
        };


        const response =
            await fetch(
                "api/workout-plans",
                {
                    method:
                        "PUT",

                    credentials:
                        "same-origin",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            body
                        )
                }
            );


        handleAuthentication(
            response
        );


        const data =
            await parseApiResponse(
                response
            );


        if (
            !response.ok
            ||
            !data.success
            ||
            !data.entry
        ) {

            throw new Error(
                data.message
                ||
                "Unable to update exercise."
            );

        }


        const updated =
            normalizeWorkoutEntry(
                data.entry
            );


        currentWorkoutEntries =
            currentWorkoutEntries.map(
                function (
                    entry
                ) {

                    return (
                        Number(
                            entry.id
                        )
                        ===
                        Number(
                            updated.id
                        )
                        ?
                        updated
                        :
                        entry
                    );

                }
            );


        if (
            updated.date
            !==
            selectedCalendarDate
        ) {

            selectedCalendarDate =
                updated.date;

            calendarViewDate =
                startOfMonth(
                    parseLocalDate(
                        updated.date
                    )
                );

            await loadMealEntriesForVisibleCalendar();

        }


        renderCalendar();


    } catch (
        error
    ) {

        console.error(
            "Unable to update exercise:",
            error
        );

        window.alert(
            error.message
            ||
            "Unable to update exercise."
        );

    }

}


async function deleteWorkoutEntry(
    workout
) {

    const confirmed =
        window.confirm(
            `Delete ${workout.exerciseName || workout.name || "this exercise"} from Calendar?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `api/workout-plans?id=${encodeURIComponent(workout.id)}`,
                {
                    method:
                        "DELETE",

                    credentials:
                        "same-origin"
                }
            );


        handleAuthentication(
            response
        );


        const data =
            await parseApiResponse(
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
                "Unable to delete exercise."
            );

        }


        currentWorkoutEntries =
            currentWorkoutEntries.filter(
                function (
                    entry
                ) {

                    return (
                        Number(
                            entry.id
                        )
                        !==
                        Number(
                            workout.id
                        )
                    );

                }
            );


        renderCalendar();


    } catch (
        error
    ) {

        console.error(
            "Unable to delete exercise:",
            error
        );

        window.alert(
            error.message
            ||
            "Unable to delete exercise."
        );

    }

}


/* Running */

function renderRunList(
    runs
) {

    selectedRunList.innerHTML =
        "";


    if (
        runs.length === 0
    ) {

        selectedRunList.appendChild(
            createEmptyState(
                "No running session for this date."
            )
        );

        return;

    }


    runs.forEach(
        function (
            run
        ) {

            const distance =
                Number(
                    run.distance
                    ||
                    0
                );

            const calories =
                Number(
                    run.calories
                    ||
                    0
                );

            let meta =
                "";


            if (
                run.duration
            ) {

                meta =
                    `Duration: ${formatDuration(run.duration)}`;

            }


            if (
                calories > 0
            ) {

                if (
                    meta
                ) {

                    meta +=
                        " • ";

                }

                meta +=
                    `${Math.round(calories)} kcal`;

            }


            selectedRunList.appendChild(
                createDayItem(
                    "Running Session",
                    `${formatNumber(distance)} km`,
                    meta
                    ||
                    "Run saved"
                )
            );

        }
    );

}


/* Day Item */

function createDayItem(
    name,
    value,
    meta
) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "day-item";


    const header =
        document.createElement(
            "div"
        );

    header.className =
        "day-item-header";


    const nameElement =
        document.createElement(
            "div"
        );

    nameElement.className =
        "day-item-name";

    nameElement.textContent =
        name;


    const valueElement =
        document.createElement(
            "div"
        );

    valueElement.className =
        "day-item-value";

    valueElement.textContent =
        value;


    header.appendChild(
        nameElement
    );

    header.appendChild(
        valueElement
    );

    item.appendChild(
        header
    );


    const metaElement =
        document.createElement(
            "div"
        );

    metaElement.className =
        "day-item-meta";

    metaElement.textContent =
        meta;

    item.appendChild(
        metaElement
    );


    return item;

}


function createEmptyState(
    message
) {

    const empty =
        document.createElement(
            "div"
        );

    empty.className =
        "day-empty";

    empty.textContent =
        message;

    return empty;

}


/* Month Overview */

function updateMonthOverview() {

    const year =
        calendarViewDate.getFullYear();

    const month =
        calendarViewDate.getMonth();


    const meals =
        getMealEntries().filter(
            function (
                meal
            ) {

                const date =
                    parseLocalDate(
                        meal.date
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


    const workouts =
        getWorkoutEntries().filter(
            function (
                workout
            ) {

                const date =
                    parseLocalDate(
                        getWorkoutDate(
                            workout
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


    const runs =
        getRunningEntries().filter(
            function (
                run
            ) {

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


    monthMealCount.textContent =
        meals.length;

    monthWorkoutCount.textContent =
        workouts.length;

    monthRunCount.textContent =
        runs.length;

}


/* Data */

function getDataForDate(
    date
) {

    return {
        meals:
            getMealEntries().filter(
                function (
                    meal
                ) {

                    return (
                        meal.date
                        ===
                        date
                    );

                }
            ),

        workouts:
            getWorkoutEntries().filter(
                function (
                    workout
                ) {

                    return (
                        getWorkoutDate(
                            workout
                        )
                        ===
                        date
                    );

                }
            ),

        runs:
            getRunningEntries().filter(
                function (
                    run
                ) {

                    return (
                        getRunDate(
                            run
                        )
                        ===
                        date
                    );

                }
            )
    };

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


/* Normalizers */

function normalizeMealEntry(
    entry
) {

    return {
        ...entry,

        id:
            Number(
                entry.id
            ),

        amount:
            Number(
                entry.amount
                ||
                0
            ),

        calories:
            Number(
                entry.calories
                ||
                0
            ),

        protein:
            Number(
                entry.protein
                ||
                0
            )
    };

}


function normalizeWorkoutEntry(
    entry
) {

    return {
        ...entry,

        id:
            Number(
                entry.id
            ),

        workoutId:
            Number(
                entry.workoutId
                ||
                0
            ),

        exerciseId:
            Number(
                entry.exerciseId
                ||
                0
            ),

        sets:
            Number(
                entry.sets
                ||
                0
            ),

        reps:
            Number(
                entry.reps
                ||
                0
            ),

        weight:
            Number(
                entry.weight
                ||
                0
            ),

        completed:
            Boolean(
                entry.completed
            )
    };

}


function normalizeRunningEntry(
    entry
) {

    return {
        ...entry,

        id:
            Number(
                entry.id
            ),

        distance:
            Number(
                entry.distance
                ||
                0
            ),

        duration:
            Number(
                entry.duration
                ||
                0
            ),

        calories:
            Number(
                entry.calories
                ||
                0
            )
    };

}


/* API Helpers */

async function parseApiResponse(
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

    } catch (
        error
    ) {

        console.error(
            "Invalid API response:",
            text
        );

        throw new Error(
            "Server returned an invalid response."
        );

    }

}


function handleAuthentication(
    response
) {

    if (
        response.status === 401
    ) {

        window.location.href =
            "login.html";

        throw new Error(
            "Not authenticated."
        );

    }

}


/* Visible Date Range */

function getVisibleCalendarDateStrings() {

    const year =
        calendarViewDate.getFullYear();

    const month =
        calendarViewDate.getMonth();

    const firstDay =
        new Date(
            year,
            month,
            1
        );

    const startDate =
        new Date(
            year,
            month,
            1 - firstDay.getDay()
        );


    const dates = [];


    for (
        let index = 0;
        index < 42;
        index++
    ) {

        const date =
            new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + index
            );


        dates.push(
            getLocalDateString(
                date
            )
        );

    }


    return dates;

}


/* Date Helpers */

function startOfMonth(
    date
) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );

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


    return `${year}-${month}-${day}`;

}


function parseLocalDate(
    dateString
) {

    if (
        !dateString
    ) {

        return new Date(
            0
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

        return new Date(
            0
        );

    }


    return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

}


/* Data Date Helpers */

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


/* Formatting */

function formatMealMeta(
    meal
) {

    const parts = [];


    if (
        meal.mealType
    ) {

        parts.push(
            capitalizeWords(
                meal.mealType
            )
        );

    }


    if (
        meal.amount
    ) {

        parts.push(
            `${formatNumber(meal.amount)} ${meal.unit || "g"}`
        );

    }


    if (
        meal.protein
        !==
        undefined
    ) {

        parts.push(
            `${formatNumber(meal.protein)}g protein`
        );

    }


    return (
        parts.join(
            " • "
        )
        ||
        "Meal entry"
    );

}


function capitalizeWords(
    value
) {

    return String(
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

                return letter.toUpperCase();

            }
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
                duration / 60
            );

        const seconds =
            Math.round(
                duration % 60
            );


        return `${minutes}m ${seconds}s`;

    }


    return `${Math.round(duration)} min`;

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


    return Number(
        number.toFixed(
            1
        )
    ).toString();

}
