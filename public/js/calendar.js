/* =========================================================
   FitHealth Training Calendar
   Backend/MySQL version
   - Meals:            GET  api/meal-entries?date=YYYY-MM-DD
   - Workouts:         GET/POST/PUT/DELETE api/workout-plans
   - Running sessions: GET  api/running-sessions
   - Exercise library: GET  api/exercises
   ========================================================= */


/* =========================================================
   State
   ========================================================= */

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

let currentExercises =
    [];

const mealEntriesByDate =
    new Map();

let editingWorkoutId =
    null;

let workoutModal =
    null;


/* =========================================================
   Elements
   ========================================================= */

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

let calendarMessage;

let addWorkoutButton;
let workoutForm;
let workoutModalTitle;
let workoutDate;
let workoutExerciseName;
let workoutMuscle;
let workoutSets;
let workoutReps;
let workoutWeight;
let workoutCompleted;


/* =========================================================
   Start
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        getCalendarElements();

        setupCalendarActions();

        setupWorkoutPlanner();

        try {

            await loadCalendarData();

        } catch (error) {

            console.error(
                "Unable to initialize calendar:",
                error
            );

            showCalendarMessage(
                error.message
                ||
                "Unable to load calendar data.",
                "danger"
            );

        }

        renderCalendar();

    }
);


/* =========================================================
   Elements
   ========================================================= */

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


    calendarMessage =
        document.getElementById(
            "calendarMessage"
        );


    addWorkoutButton =
        document.getElementById(
            "addWorkoutButton"
        );

    workoutForm =
        document.getElementById(
            "workoutForm"
        );

    workoutModalTitle =
        document.getElementById(
            "workoutModalTitle"
        );

    workoutDate =
        document.getElementById(
            "workoutDate"
        );

    workoutExerciseName =
        document.getElementById(
            "workoutExerciseName"
        );

    workoutMuscle =
        document.getElementById(
            "workoutMuscle"
        );

    workoutSets =
        document.getElementById(
            "workoutSets"
        );

    workoutReps =
        document.getElementById(
            "workoutReps"
        );

    workoutWeight =
        document.getElementById(
            "workoutWeight"
        );

    workoutCompleted =
        document.getElementById(
            "workoutCompleted"
        );

}


/* =========================================================
   Calendar actions
   ========================================================= */

function setupCalendarActions() {

    if (
        previousMonthButton
    ) {

        previousMonthButton.addEventListener(
            "click",
            async function () {

                calendarViewDate =
                    new Date(
                        calendarViewDate.getFullYear(),
                        calendarViewDate.getMonth() - 1,
                        1
                    );

                await reloadMealsAndRender();

            }
        );

    }


    if (
        nextMonthButton
    ) {

        nextMonthButton.addEventListener(
            "click",
            async function () {

                calendarViewDate =
                    new Date(
                        calendarViewDate.getFullYear(),
                        calendarViewDate.getMonth() + 1,
                        1
                    );

                await reloadMealsAndRender();

            }
        );

    }


    if (
        todayButton
    ) {

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

                await reloadMealsAndRender();

            }
        );

    }

}


async function reloadMealsAndRender() {

    try {

        await loadMealEntriesForVisibleCalendar();

    } catch (error) {

        console.error(
            "Unable to load meals for calendar:",
            error
        );

        showCalendarMessage(
            error.message
            ||
            "Unable to load meals.",
            "danger"
        );

    }

    renderCalendar();

}


/* =========================================================
   Workout Planner
   ========================================================= */

function setupWorkoutPlanner() {

    const modalElement =
        document.getElementById(
            "workoutModal"
        );


    if (
        modalElement
        &&
        typeof bootstrap !==
            "undefined"
    ) {

        workoutModal =
            new bootstrap.Modal(
                modalElement
            );

        modalElement.addEventListener(
            "hidden.bs.modal",
            function () {

                editingWorkoutId =
                    null;

                setWorkoutExerciseFieldsLocked(
                    false
                );

            }
        );

    }


    if (
        addWorkoutButton
    ) {

        addWorkoutButton.addEventListener(
            "click",
            function () {

                openWorkoutModal();

            }
        );

    }


    if (
        workoutForm
    ) {

        workoutForm.addEventListener(
            "submit",
            async function (
                event
            ) {

                event.preventDefault();

                await saveWorkoutFromForm();

            }
        );

    }


    if (
        workoutExerciseName
    ) {

        workoutExerciseName.addEventListener(
            "change",
            syncExerciseMuscleFromName
        );

        workoutExerciseName.addEventListener(
            "blur",
            syncExerciseMuscleFromName
        );

    }

}


function openWorkoutModal(
    workout = null
) {

    if (
        !workoutForm
    ) {

        return;

    }


    workoutForm.reset();


    if (
        workout
    ) {

        editingWorkoutId =
            Number(
                workout.id
            );

        if (
            workoutModalTitle
        ) {

            workoutModalTitle.textContent =
                "Edit Exercise";

        }


        workoutDate.value =
            getWorkoutDate(
                workout
            )
            ||
            selectedCalendarDate;

        workoutExerciseName.value =
            workout.exerciseName
            ||
            workout.name
            ||
            "";

        workoutMuscle.value =
            workout.primaryMuscle
            ||
            workout.muscleGroup
            ||
            "";

        workoutSets.value =
            Number(
                workout.sets
                ||
                3
            );

        workoutReps.value =
            Number(
                workout.reps
                ||
                10
            );

        workoutWeight.value =
            Number(
                workout.weight
                ||
                0
            );

        workoutCompleted.checked =
            Boolean(
                workout.completed
            );

        /*
         * PUT /api/workout-plans edits the planned
         * exercise details, not the exercise identity.
         */
        setWorkoutExerciseFieldsLocked(
            true
        );

    } else {

        editingWorkoutId =
            null;

        if (
            workoutModalTitle
        ) {

            workoutModalTitle.textContent =
                "Add Exercise";

        }


        workoutDate.value =
            selectedCalendarDate;

        workoutExerciseName.value =
            "";

        workoutMuscle.value =
            "";

        workoutSets.value =
            3;

        workoutReps.value =
            10;

        workoutWeight.value =
            0;

        workoutCompleted.checked =
            false;

        setWorkoutExerciseFieldsLocked(
            false
        );

    }


    if (
        workoutModal
    ) {

        workoutModal.show();

        return;

    }


    showCalendarMessage(
        "Workout modal is not available. Check Bootstrap JavaScript.",
        "danger"
    );

}


function setWorkoutExerciseFieldsLocked(
    locked
) {

    if (
        workoutExerciseName
    ) {

        workoutExerciseName.readOnly =
            locked;

    }


    if (
        workoutMuscle
    ) {

        workoutMuscle.readOnly =
            locked;

    }

}


async function saveWorkoutFromForm() {

    const date =
        workoutDate
            ?
            workoutDate.value
            :
            "";

    const exerciseName =
        workoutExerciseName
            ?
            workoutExerciseName.value.trim()
            :
            "";

    let muscleGroup =
        workoutMuscle
            ?
            workoutMuscle.value.trim()
            :
            "";

    const sets =
        Number(
            workoutSets
                ?
                workoutSets.value
                :
                0
        );

    const reps =
        Number(
            workoutReps
                ?
                workoutReps.value
                :
                0
        );

    const weight =
        Number(
            workoutWeight
                ?
                workoutWeight.value
                :
                0
        );

    const completed =
        Boolean(
            workoutCompleted
            &&
            workoutCompleted.checked
        );


    if (
        !date
        ||
        !exerciseName
    ) {

        showCalendarMessage(
            "Please choose a date and exercise.",
            "danger"
        );

        return;

    }


    if (
        !Number.isInteger(
            sets
        )
        ||
        sets < 1
        ||
        sets > 20
    ) {

        showCalendarMessage(
            "Sets must be between 1 and 20.",
            "danger"
        );

        return;

    }


    if (
        !Number.isInteger(
            reps
        )
        ||
        reps < 1
        ||
        reps > 100
    ) {

        showCalendarMessage(
            "Reps must be between 1 and 100.",
            "danger"
        );

        return;

    }


    if (
        !Number.isFinite(
            weight
        )
        ||
        weight < 0
    ) {

        showCalendarMessage(
            "Weight cannot be negative.",
            "danger"
        );

        return;

    }


    if (
        editingWorkoutId !==
        null
    ) {

        const workout =
            getWorkoutEntryById(
                editingWorkoutId
            );


        if (
            !workout
        ) {

            showCalendarMessage(
                "The workout exercise could not be found.",
                "danger"
            );

            return;

        }


        await updateWorkoutEntry(
            workout,
            {
                date:
                    date,

                sets:
                    sets,

                reps:
                    reps,

                weight:
                    weight,

                completed:
                    completed
            }
        );


        if (
            workoutModal
        ) {

            workoutModal.hide();

        }


        showCalendarMessage(
            "Workout exercise updated.",
            "success"
        );

        return;

    }


    const matchedExercise =
        findExerciseByName(
            exerciseName
        );


    if (
        matchedExercise
    ) {

        muscleGroup =
            matchedExercise.muscleGroup
            ||
            muscleGroup;

        if (
            workoutMuscle
        ) {

            workoutMuscle.value =
                muscleGroup;

        }

    }


    try {

        const body = {

            date:
                date,

            exerciseId:
                matchedExercise
                    ?
                    matchedExercise.id
                    :
                    null,

            exerciseName:
                exerciseName,

            muscleGroup:
                muscleGroup,

            sets:
                sets,

            reps:
                reps,

            weight:
                weight,

            completed:
                completed
        };


        const response =
            await fetch(
                "api/workout-plans",
                {
                    method:
                        "POST",

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
        ) {

            throw new Error(
                data.message
                ||
                "Unable to add exercise."
            );

        }


        if (
            data.entry
        ) {

            const created =
                normalizeWorkoutEntry(
                    data.entry
                );

            const alreadyExists =
                currentWorkoutEntries.some(
                    function (
                        entry
                    ) {

                        return (
                            Number(
                                entry.id
                            )
                            ===
                            Number(
                                created.id
                            )
                        );

                    }
                );


            if (
                !alreadyExists
            ) {

                currentWorkoutEntries.push(
                    created
                );

            }

        } else {

            await loadWorkoutEntries();

        }


        selectedCalendarDate =
            date;

        calendarViewDate =
            startOfMonth(
                parseLocalDate(
                    date
                )
            );


        if (
            workoutModal
        ) {

            workoutModal.hide();

        }


        showCalendarMessage(
            "Exercise added to the Training Calendar.",
            "success"
        );


        renderCalendar();


    } catch (
        error
    ) {

        console.error(
            "Unable to add exercise:",
            error
        );

        showCalendarMessage(
            error.message
            ||
            "Unable to add exercise.",
            "danger"
        );

    }

}


/* =========================================================
   Exercise library
   ========================================================= */

async function loadExerciseLibrary() {

    try {

        const response =
            await fetch(
                "api/exercises",
                {
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
                "Unable to load exercises."
            );

        }


        currentExercises =
            extractArray(
                data,
                [
                    "entries",
                    "exercises",
                    "items",
                    "data"
                ]
            )
                .map(
                    normalizeExercise
                )
                .filter(
                    function (
                        exercise
                    ) {

                        return (
                            exercise.id
                            &&
                            exercise.name
                        );

                    }
                );


        installExerciseDatalist();


    } catch (
        error
    ) {

        console.error(
            "Unable to load exercise library:",
            error
        );

        currentExercises =
            [];

    }

}


function normalizeExercise(
    exercise
) {

    return {

        id:
            Number(
                exercise.id
                ||
                0
            ),

        name:
            String(
                exercise.name
                ||
                ""
            ).trim(),

        muscleGroup:
            String(
                exercise.muscleGroup
                ||
                exercise.muscle_group
                ||
                ""
            ).trim(),

        equipment:
            String(
                exercise.equipment
                ||
                ""
            ).trim(),

        difficulty:
            String(
                exercise.difficulty
                ||
                ""
            ).trim(),

        exerciseType:
            String(
                exercise.exerciseType
                ||
                exercise.exercise_type
                ||
                ""
            ).trim()
    };

}


function installExerciseDatalist() {

    if (
        !workoutExerciseName
    ) {

        return;

    }


    let datalist =
        document.getElementById(
            "calendarExerciseOptions"
        );


    if (
        !datalist
    ) {

        datalist =
            document.createElement(
                "datalist"
            );

        datalist.id =
            "calendarExerciseOptions";

        document.body.appendChild(
            datalist
        );

    }


    datalist.innerHTML =
        "";


    currentExercises
        .slice()
        .sort(
            function (
                first,
                second
            ) {

                return (
                    first.name.localeCompare(
                        second.name
                    )
                );

            }
        )
        .forEach(
            function (
                exercise
            ) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    exercise.name;

                if (
                    exercise.muscleGroup
                ) {

                    option.label =
                        exercise.muscleGroup;

                }

                datalist.appendChild(
                    option
                );

            }
        );


    workoutExerciseName.setAttribute(
        "list",
        datalist.id
    );

}


function syncExerciseMuscleFromName() {

    if (
        !workoutExerciseName
        ||
        !workoutMuscle
    ) {

        return;

    }


    const exercise =
        findExerciseByName(
            workoutExerciseName.value
        );


    if (
        exercise
        &&
        exercise.muscleGroup
    ) {

        workoutMuscle.value =
            exercise.muscleGroup;

    }

}


function findExerciseByName(
    name
) {

    const normalizedName =
        String(
            name
            ||
            ""
        )
            .trim()
            .toLowerCase();


    if (
        !normalizedName
    ) {

        return null;

    }


    return (
        currentExercises.find(
            function (
                exercise
            ) {

                return (
                    exercise.name
                        .toLowerCase()
                    ===
                    normalizedName
                );

            }
        )
        ||
        null
    );

}


/* =========================================================
   Data loading
   ========================================================= */

async function loadCalendarData() {

    await Promise.all(
        [
            loadWorkoutEntries(),
            loadRunningEntries(),
            loadExerciseLibrary()
        ]
    );


    await loadMealEntriesForVisibleCalendar();

}


async function loadWorkoutEntries() {

    const response =
        await fetch(
            "api/workout-plans",
            {
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
            "Unable to load workout plans."
        );

    }


    currentWorkoutEntries =
        extractArray(
            data,
            [
                "entries",
                "workouts",
                "plans",
                "items",
                "data"
            ]
        )
            .map(
                normalizeWorkoutEntry
            )
            .filter(
                function (
                    workout
                ) {

                    return Boolean(
                        workout.date
                    );

                }
            );

}


async function loadRunningEntries() {

    const response =
        await fetch(
            "api/running-sessions",
            {
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
            "Unable to load running sessions."
        );

    }


    currentRunningEntries =
        extractArray(
            data,
            [
                "entries",
                "sessions",
                "runs",
                "items",
                "data"
            ]
        )
            .map(
                normalizeRunningEntry
            )
            .filter(
                function (
                    run
                ) {

                    return Boolean(
                        run.date
                    );

                }
            );

}


async function loadMealEntriesForVisibleCalendar() {

    const visibleDates =
        getVisibleCalendarDates();


    const results =
        await Promise.all(
            visibleDates.map(
                async function (
                    date
                ) {

                    const dateString =
                        getLocalDateString(
                            date
                        );


                    const response =
                        await fetch(
                            `api/meal-entries?date=${encodeURIComponent(dateString)}`,
                            {
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
                            `Unable to load meals for ${dateString}.`
                        );

                    }


                    const entries =
                        extractArray(
                            data,
                            [
                                "entries",
                                "meals",
                                "items",
                                "data"
                            ]
                        )
                            .map(
                                normalizeMealEntry
                            );


                    return {
                        date:
                            dateString,
                        entries:
                            entries
                    };

                }
            )
        );


    mealEntriesByDate.clear();


    results.forEach(
        function (
            result
        ) {

            mealEntriesByDate.set(
                result.date,
                result.entries
            );

        }
    );


    currentMealEntries =
        Array.from(
            mealEntriesByDate.values()
        ).flat();

}


/* =========================================================
   API helpers
   ========================================================= */

function handleAuthentication(
    response
) {

    if (
        response.status ===
        401
        ||
        response.status ===
        403
    ) {

        window.location.href =
            "login.html";

        throw new Error(
            "Your session has expired. Please sign in again."
        );

    }

}


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
            "The server returned an invalid response."
        );

    }

}


function extractArray(
    data,
    keys
) {

    if (
        Array.isArray(
            data
        )
    ) {

        return data;

    }


    for (
        const key
        of keys
    ) {

        if (
            Array.isArray(
                data[
                    key
                ]
            )
        ) {

            return data[
                key
            ];

        }

    }


    return [];

}


/* =========================================================
   Normalization
   ========================================================= */

function normalizeMealEntry(
    entry
) {

    return {

        ...entry,

        id:
            Number(
                entry.id
                ||
                0
            ),

        date:
            entry.date
            ||
            entry.entryDate
            ||
            entry.entry_date
            ||
            "",

        mealType:
            entry.mealType
            ||
            entry.meal_type
            ||
            "",

        foodName:
            entry.foodName
            ||
            entry.food_name
            ||
            entry.name
            ||
            "Food",

        amount:
            Number(
                entry.amount
                ||
                0
            ),

        unit:
            entry.unit
            ||
            "",

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
            ),

        carbs:
            Number(
                entry.carbs
                ||
                0
            ),

        fat:
            Number(
                entry.fat
                ||
                0
            ),

        cookingMethod:
            entry.cookingMethod
            ||
            entry.cooking_method
            ||
            "",

        preparation:
            entry.preparation
            ||
            ""
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
                ||
                0
            ),

        exerciseId:
            Number(
                entry.exerciseId
                ||
                entry.exercise_id
                ||
                0
            ),

        date:
            entry.date
            ||
            entry.workoutDate
            ||
            entry.workout_date
            ||
            "",

        exerciseName:
            entry.exerciseName
            ||
            entry.exercise_name
            ||
            entry.name
            ||
            "Exercise",

        muscleGroup:
            entry.muscleGroup
            ||
            entry.muscle_group
            ||
            entry.primaryMuscle
            ||
            "",

        primaryMuscle:
            entry.primaryMuscle
            ||
            entry.muscleGroup
            ||
            entry.muscle_group
            ||
            "",

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
            normalizeBoolean(
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
                ||
                0
            ),

        date:
            entry.date
            ||
            entry.runDate
            ||
            entry.run_date
            ||
            "",

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
            ),

        averageSpeed:
            Number(
                entry.averageSpeed
                ||
                entry.average_speed
                ||
                0
            ),

        averagePace:
            Number(
                entry.averagePace
                ||
                entry.average_pace
                ||
                0
            )
    };

}


function normalizeBoolean(
    value
) {

    if (
        value === true
        ||
        value === 1
        ||
        value === "1"
        ||
        value === "true"
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   Render calendar
   ========================================================= */

function renderCalendar() {

    if (
        !calendarGrid
        ||
        !calendarMonthTitle
    ) {

        return;

    }


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


    const visibleDates =
        getVisibleCalendarDates();


    visibleDates.forEach(
        function (
            date
        ) {

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
    );


    updateMonthOverview();

    renderSelectedDate();

}


/* =========================================================
   Day cell
   ========================================================= */

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
        events.length
        >
        3
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

            const oldYear =
                calendarViewDate.getFullYear();

            const oldMonth =
                calendarViewDate.getMonth();


            selectedCalendarDate =
                dateString;

            calendarViewDate =
                startOfMonth(
                    date
                );


            const changedMonth =
                oldYear
                !==
                calendarViewDate.getFullYear()
                ||
                oldMonth
                !==
                calendarViewDate.getMonth();


            if (
                changedMonth
            ) {

                await reloadMealsAndRender();

            } else {

                renderCalendar();

            }

        }
    );


    return day;

}


/* =========================================================
   Day preview
   ========================================================= */

function buildDayEventPreview(
    data
) {

    const events =
        [];


    if (
        data.meals.length
        >
        0
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

                const prefix =
                    workout.completed
                        ?
                        "✓ "
                        :
                        "";


                events.push(
                    createEventBadge(
                        prefix
                        +
                        (
                            workout.exerciseName
                            ||
                            "Workout"
                        ),
                        "workout-event"
                    )
                );

            }
        );


    if (
        data.runs.length
        >
        0
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


/* =========================================================
   Selected date
   ========================================================= */

function renderSelectedDate() {

    if (
        !selectedDateTitle
    ) {

        return;

    }


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


/* =========================================================
   Meals
   ========================================================= */

function renderMealList(
    meals
) {

    selectedMealList.innerHTML =
        "";


    if (
        meals.length ===
        0
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


/* =========================================================
   Workouts
   ========================================================= */

function renderWorkoutList(
    workouts
) {

    selectedWorkoutList.innerHTML =
        "";


    if (
        workouts.length ===
        0
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
        "day-item workout-plan-item";


    if (
        workout.completed
    ) {

        item.classList.add(
            "workout-completed"
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


    if (
        workout.completed
    ) {

        const icon =
            document.createElement(
                "i"
            );

        icon.className =
            "bi bi-check-circle-fill text-success me-2";

        nameElement.appendChild(
            icon
        );

    }


    const nameText =
        document.createElement(
            "span"
        );

    nameText.textContent =
        workout.exerciseName
        ||
        "Exercise";

    nameElement.appendChild(
        nameText
    );


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


    let meta =
        `${workout.sets || 0} sets × ${workout.reps || 0} reps`;


    if (
        Number(
            workout.weight
            ||
            0
        )
        >
        0
    ) {

        meta +=
            ` • ${formatNumber(workout.weight)} kg`;

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
        "workout-item-actions";


    const completeButton =
        createWorkoutActionButton(
            workout.completed
                ?
                "Undo"
                :
                "Complete",

            workout.completed
                ?
                "bi-arrow-counterclockwise"
                :
                "bi-check2-circle",

            workout.completed
                ?
                "btn-outline-secondary"
                :
                "btn-outline-success"
        );


    completeButton.addEventListener(
        "click",
        async function () {

            await updateWorkoutEntry(
                workout,
                {
                    completed:
                        !Boolean(
                            workout.completed
                        )
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
        function () {

            openWorkoutModal(
                workout
            );

        }
    );


    const deleteButton =
        createWorkoutActionButton(
            "Delete",
            "bi-trash3",
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


    const icon =
        document.createElement(
            "i"
        );

    icon.className =
        `bi ${iconClass} me-1`;


    button.appendChild(
        icon
    );

    button.appendChild(
        document.createTextNode(
            text
        )
    );


    return button;

}


/* =========================================================
   Update workout
   ========================================================= */

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
        ) {

            throw new Error(
                data.message
                ||
                "Unable to update exercise."
            );

        }


        if (
            data.entry
        ) {

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

        } else {

            await loadWorkoutEntries();

        }


        renderCalendar();


    } catch (
        error
    ) {

        console.error(
            "Unable to update exercise:",
            error
        );

        showCalendarMessage(
            error.message
            ||
            "Unable to update exercise.",
            "danger"
        );

    }

}


/* =========================================================
   Delete workout
   ========================================================= */

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


        showCalendarMessage(
            "Exercise deleted from Calendar.",
            "success"
        );


        renderCalendar();


    } catch (
        error
    ) {

        console.error(
            "Unable to delete exercise:",
            error
        );

        showCalendarMessage(
            error.message
            ||
            "Unable to delete exercise.",
            "danger"
        );

    }

}


/* =========================================================
   Running
   ========================================================= */

function renderRunList(
    runs
) {

    selectedRunList.innerHTML =
        "";


    if (
        runs.length ===
        0
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


            const parts =
                [];


            if (
                run.duration
            ) {

                parts.push(
                    `Duration: ${formatDuration(run.duration)}`
                );

            }


            if (
                calories >
                0
            ) {

                parts.push(
                    `${Math.round(calories)} kcal`
                );

            }


            selectedRunList.appendChild(
                createDayItem(
                    "Running Session",
                    `${formatNumber(distance)} km`,
                    parts.join(
                        " • "
                    )
                    ||
                    "Run saved"
                )
            );

        }
    );

}


/* =========================================================
   Generic day item
   ========================================================= */

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


/* =========================================================
   Overview / data selectors
   ========================================================= */

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

    return (
        currentMealEntries
        ||
        []
    );

}


function getWorkoutEntries() {

    return (
        currentWorkoutEntries
        ||
        []
    );

}


function getWorkoutEntryById(
    id
) {

    return (
        currentWorkoutEntries.find(
            function (
                entry
            ) {

                return (
                    Number(
                        entry.id
                    )
                    ===
                    Number(
                        id
                    )
                );

            }
        )
        ||
        null
    );

}


function getRunningEntries() {

    return (
        currentRunningEntries
        ||
        []
    );

}


/* =========================================================
   Messages
   ========================================================= */

function showCalendarMessage(
    message,
    type = "success"
) {

    if (
        !calendarMessage
    ) {

        if (
            type ===
            "danger"
        ) {

            window.alert(
                message
            );

        }

        return;

    }


    calendarMessage.className =
        `alert alert-${type}`;

    calendarMessage.textContent =
        message;

    calendarMessage.classList.remove(
        "d-none"
    );


    window.clearTimeout(
        showCalendarMessage.timer
    );


    showCalendarMessage.timer =
        window.setTimeout(
            function () {

                calendarMessage.classList.add(
                    "d-none"
                );

            },
            4000
        );

}


/* =========================================================
   Date helpers
   ========================================================= */

function startOfMonth(
    date
) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );

}


function getVisibleCalendarDates() {

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
            1
            -
            firstDay.getDay()
        );


    const dates =
        [];


    for (
        let index =
            0;
        index <
            42;
        index++
    ) {

        dates.push(
            new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
                +
                index
            )
        );

    }


    return dates;

}


function getLocalDateString(
    date
) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth()
            +
            1
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
        parts.length
        !==
        3
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
        parts[
            0
        ],
        parts[
            1
        ]
        -
        1,
        parts[
            2
        ]
    );

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


/* =========================================================
   Formatting
   ========================================================= */

function formatMealMeta(
    meal
) {

    const parts =
        [];


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
        Number(
            meal.amount
            ||
            0
        )
        >
        0
    ) {

        parts.push(
            `${formatNumber(meal.amount)} ${meal.unit || ""}`.trim()
        );

    }


    if (
        meal.cookingMethod
    ) {

        parts.push(
            capitalizeWords(
                meal.cookingMethod
            )
        );

    }


    if (
        meal.preparation
    ) {

        parts.push(
            capitalizeWords(
                meal.preparation
            )
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


function formatDuration(
    totalSeconds
) {

    const seconds =
        Math.max(
            0,
            Math.round(
                Number(
                    totalSeconds
                    ||
                    0
                )
            )
        );


    const hours =
        Math.floor(
            seconds
            /
            3600
        );

    const minutes =
        Math.floor(
            (
                seconds
                %
                3600
            )
            /
            60
        );

    const remainingSeconds =
        seconds
        %
        60;


    if (
        hours >
        0
    ) {

        return (
            `${hours}h ${minutes}m ${remainingSeconds}s`
        );

    }


    if (
        minutes >
        0
    ) {

        return (
            `${minutes}m ${remainingSeconds}s`
        );

    }


    return (
        `${remainingSeconds}s`
    );

}


function formatNumber(
    value
) {

    const number =
        Number(
            value
            ||
            0
        );


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "0";

    }


    return number.toLocaleString(
        undefined,
        {
            maximumFractionDigits:
                2
        }
    );

}


function capitalizeWords(
    value
) {

    return String(
        value
        ||
        ""
    )
        .replace(
            /[_-]+/g,
            " "
        )
        .replace(
            /\b\w/g,
            function (
                character
            ) {

                return character.toUpperCase();

            }
        );

}
