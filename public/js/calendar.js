/* Calendar State */
let calendarViewDate = startOfMonth(new Date());
let selectedCalendarDate = getLocalDateString(new Date());
let editingWorkoutId = null;
let workoutModal = null;

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

/* Start */
document.addEventListener("DOMContentLoaded", function () {
    getCalendarElements();
    setupCalendarActions();
    setupWorkoutPlanner();
    renderCalendar();
});

/* Elements */
function getCalendarElements() {
    calendarGrid = document.getElementById("calendarGrid");
    calendarMonthTitle = document.getElementById("calendarMonthTitle");
    previousMonthButton = document.getElementById("previousMonthButton");
    nextMonthButton = document.getElementById("nextMonthButton");
    todayButton = document.getElementById("todayButton");

    selectedDateTitle = document.getElementById("selectedDateTitle");
    selectedDateSubtitle = document.getElementById("selectedDateSubtitle");
    selectedDateNumber = document.getElementById("selectedDateNumber");

    monthMealCount = document.getElementById("monthMealCount");
    monthWorkoutCount = document.getElementById("monthWorkoutCount");
    monthRunCount = document.getElementById("monthRunCount");

    selectedCalories = document.getElementById("selectedCalories");
    selectedWorkoutCount = document.getElementById("selectedWorkoutCount");
    selectedRunDistance = document.getElementById("selectedRunDistance");

    selectedMealCount = document.getElementById("selectedMealCount");
    selectedExerciseCount = document.getElementById("selectedExerciseCount");
    selectedRunCount = document.getElementById("selectedRunCount");

    selectedMealList = document.getElementById("selectedMealList");
    selectedWorkoutList = document.getElementById("selectedWorkoutList");
    selectedRunList = document.getElementById("selectedRunList");

    calendarMessage = document.getElementById("calendarMessage");

    addWorkoutButton = document.getElementById("addWorkoutButton");
    workoutForm = document.getElementById("workoutForm");
    workoutModalTitle = document.getElementById("workoutModalTitle");
    workoutDate = document.getElementById("workoutDate");
    workoutExerciseName = document.getElementById("workoutExerciseName");
    workoutMuscle = document.getElementById("workoutMuscle");
    workoutSets = document.getElementById("workoutSets");
    workoutReps = document.getElementById("workoutReps");
    workoutWeight = document.getElementById("workoutWeight");
    workoutCompleted = document.getElementById("workoutCompleted");
}

/* Calendar Actions */
function setupCalendarActions() {
    previousMonthButton.addEventListener("click", function () {
        calendarViewDate = new Date(
            calendarViewDate.getFullYear(),
            calendarViewDate.getMonth() - 1,
            1
        );

        renderCalendar();
    });

    nextMonthButton.addEventListener("click", function () {
        calendarViewDate = new Date(
            calendarViewDate.getFullYear(),
            calendarViewDate.getMonth() + 1,
            1
        );

        renderCalendar();
    });

    todayButton.addEventListener("click", function () {
        const today = new Date();

        calendarViewDate = startOfMonth(today);
        selectedCalendarDate = getLocalDateString(today);

        renderCalendar();
    });
}

/* Workout Planner */
function setupWorkoutPlanner() {
    const modalElement = document.getElementById("workoutModal");

    if (
        modalElement &&
        typeof bootstrap !== "undefined"
    ) {
        workoutModal = new bootstrap.Modal(modalElement);
    }

    addWorkoutButton.addEventListener("click", function () {
        openWorkoutModal();
    });

    workoutForm.addEventListener("submit", function (event) {
        event.preventDefault();
        saveWorkoutFromForm();
    });
}

function openWorkoutModal(workout = null) {
    workoutForm.reset();

    if (workout) {
        editingWorkoutId = workout.id;
        workoutModalTitle.textContent = "Edit Exercise";
        workoutDate.value = getWorkoutDate(workout) || selectedCalendarDate;
        workoutExerciseName.value =
            workout.exerciseName ||
            workout.name ||
            "";
        workoutMuscle.value =
            workout.primaryMuscle ||
            workout.muscleGroup ||
            "";
        workoutSets.value = workout.sets || 3;
        workoutReps.value = workout.reps || 10;
        workoutWeight.value = Number(workout.weight || 0);
        workoutCompleted.checked = Boolean(workout.completed);
    } else {
        editingWorkoutId = null;
        workoutModalTitle.textContent = "Add Exercise";
        workoutDate.value = selectedCalendarDate;
        workoutSets.value = 3;
        workoutReps.value = 10;
        workoutWeight.value = 0;
        workoutCompleted.checked = false;
    }

    if (workoutModal) {
        workoutModal.show();
    }
}

function saveWorkoutFromForm() {
    const date = workoutDate.value;
    const exerciseName = workoutExerciseName.value.trim();
    const primaryMuscle = workoutMuscle.value.trim();
    const sets = Number(workoutSets.value);
    const reps = Number(workoutReps.value);
    const weight = Number(workoutWeight.value || 0);

    if (!date || !exerciseName) {
        showCalendarMessage(
            "Please enter a date and exercise name.",
            "danger"
        );
        return;
    }

    if (
        !Number.isInteger(sets) ||
        sets < 1 ||
        !Number.isInteger(reps) ||
        reps < 1 ||
        !Number.isFinite(weight) ||
        weight < 0
    ) {
        showCalendarMessage(
            "Sets and reps must be positive whole numbers, and weight cannot be negative.",
            "danger"
        );
        return;
    }

    if (editingWorkoutId !== null) {
        const oldWorkout = getWorkoutEntryById(editingWorkoutId);

        if (!oldWorkout) {
            showCalendarMessage(
                "The workout exercise could not be found.",
                "danger"
            );
            return;
        }

        const updatedWorkout = {
            ...oldWorkout,
            date: date,
            exerciseName: exerciseName,
            primaryMuscle: primaryMuscle,
            muscleGroup: primaryMuscle || oldWorkout.muscleGroup || "",
            sets: sets,
            reps: reps,
            weight: weight,
            completed: workoutCompleted.checked
        };

        updateWorkoutEntry(updatedWorkout);

        showCalendarMessage(
            "Workout exercise updated.",
            "success"
        );
    } else {
        const newWorkout = {
            id: Date.now(),
            date: date,
            exerciseKey: createExerciseKey(
                primaryMuscle || "exercise",
                exerciseName
            ),
            exerciseName: exerciseName,
            muscleGroup: primaryMuscle,
            primaryMuscle: primaryMuscle,
            equipment: "",
            difficulty: "",
            type: "workout",
            sets: sets,
            reps: reps,
            weight: weight,
            completed: workoutCompleted.checked
        };

        addWorkoutEntry(newWorkout);

        showCalendarMessage(
            "Exercise added to the Training Calendar.",
            "success"
        );
    }

    selectedCalendarDate = date;
    calendarViewDate = startOfMonth(parseLocalDate(date));

    if (workoutModal) {
        workoutModal.hide();
    }

    editingWorkoutId = null;
    renderCalendar();
}

function toggleWorkoutCompleted(workout) {
    const updatedWorkout = {
        ...workout,
        completed: !Boolean(workout.completed)
    };

    updateWorkoutEntry(updatedWorkout);

    showCalendarMessage(
        updatedWorkout.completed
            ? "Exercise marked as completed."
            : "Exercise marked as planned.",
        "success"
    );

    renderCalendar();
}

function removeWorkout(workout) {
    const name =
        workout.exerciseName ||
        workout.name ||
        "this exercise";

    const confirmed = window.confirm(
        `Delete ${name} from this workout plan?`
    );

    if (!confirmed) {
        return;
    }

    deleteWorkoutEntry(workout.id);

    showCalendarMessage(
        "Exercise deleted from the workout plan.",
        "success"
    );

    renderCalendar();
}

/* Render Calendar */
function renderCalendar() {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    calendarMonthTitle.textContent = new Intl.DateTimeFormat(
        "en-US",
        {
            month: "long",
            year: "numeric"
        }
    ).format(calendarViewDate);

    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(
        year,
        month,
        1 - firstDay.getDay()
    );

    for (let index = 0; index < 42; index++) {
        const date = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + index
        );

        const dateString = getLocalDateString(date);

        const dayElement = createCalendarDay(
            date,
            dateString,
            month
        );

        calendarGrid.appendChild(dayElement);
    }

    updateMonthOverview();
    renderSelectedDate();
}

/* Day Cell */
function createCalendarDay(date, dateString, currentMonth) {
    const day = document.createElement("button");

    day.type = "button";
    day.className = "calendar-day text-start";
    day.dataset.date = dateString;

    if (date.getMonth() !== currentMonth) {
        day.classList.add("other-month");
    }

    if (dateString === getLocalDateString(new Date())) {
        day.classList.add("today");
    }

    if (dateString === selectedCalendarDate) {
        day.classList.add("selected");
    }

    const number = document.createElement("span");

    number.className = "day-number";
    number.textContent = date.getDate();

    day.appendChild(number);

    const data = getDataForDate(dateString);

    const eventContainer = document.createElement("div");
    eventContainer.className = "day-events";

    const events = buildDayEventPreview(data);

    events.slice(0, 3).forEach(function (event) {
        eventContainer.appendChild(event);
    });

    if (events.length > 3) {
        const more = document.createElement("div");

        more.className = "more-events";
        more.textContent = `+${events.length - 3} more`;

        eventContainer.appendChild(more);
    }

    day.appendChild(eventContainer);

    day.addEventListener("click", function () {
        selectedCalendarDate = dateString;
        calendarViewDate = startOfMonth(date);
        renderCalendar();
    });

    return day;
}

/* Event Preview */
function buildDayEventPreview(data) {
    const events = [];

    if (data.meals.length > 0) {
        events.push(
            createEventBadge(
                `${data.meals.length} meal${data.meals.length === 1 ? "" : "s"}`,
                "meal-event"
            )
        );
    }

    data.workouts.slice(0, 2).forEach(function (workout) {
        const prefix = workout.completed ? "✓ " : "";

        events.push(
            createEventBadge(
                prefix +
                (
                    workout.exerciseName ||
                    workout.name ||
                    "Workout"
                ),
                "workout-event"
            )
        );
    });

    if (data.runs.length > 0) {
        const distance = data.runs.reduce(function (total, run) {
            return total + Number(run.distance || 0);
        }, 0);

        events.push(
            createEventBadge(
                `${formatNumber(distance)} km run`,
                "run-event"
            )
        );
    }

    return events;
}

function createEventBadge(text, className) {
    const event = document.createElement("div");

    event.className = `day-event ${className}`;
    event.textContent = text;

    return event;
}

/* Selected Date */
function renderSelectedDate() {
    const date = parseLocalDate(selectedCalendarDate);
    const data = getDataForDate(selectedCalendarDate);

    selectedDateTitle.textContent = new Intl.DateTimeFormat(
        "en-US",
        {
            weekday: "long"
        }
    ).format(date);

    selectedDateSubtitle.textContent = new Intl.DateTimeFormat(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    ).format(date);

    selectedDateNumber.textContent = date.getDate();

    const totalCalories = data.meals.reduce(function (total, meal) {
        return total + Number(meal.calories || 0);
    }, 0);

    const runDistance = data.runs.reduce(function (total, run) {
        return total + Number(run.distance || 0);
    }, 0);

    selectedCalories.textContent = Math.round(totalCalories);
    selectedWorkoutCount.textContent = data.workouts.length;
    selectedRunDistance.textContent = formatNumber(runDistance);

    selectedMealCount.textContent = data.meals.length;
    selectedExerciseCount.textContent = data.workouts.length;
    selectedRunCount.textContent = data.runs.length;

    renderMealList(data.meals);
    renderWorkoutList(data.workouts);
    renderRunList(data.runs);
}

/* Meals */
function renderMealList(meals) {
    selectedMealList.innerHTML = "";

    if (meals.length === 0) {
        selectedMealList.appendChild(
            createEmptyState(
                "No meals saved for this date."
            )
        );

        return;
    }

    meals.forEach(function (meal) {
        selectedMealList.appendChild(
            createDayItem(
                meal.foodName || "Food",
                `${Math.round(Number(meal.calories || 0))} kcal`,
                formatMealMeta(meal)
            )
        );
    });
}

/* Workouts */
function renderWorkoutList(workouts) {
    selectedWorkoutList.innerHTML = "";

    if (workouts.length === 0) {
        selectedWorkoutList.appendChild(
            createEmptyState(
                "No exercises planned. Add an exercise or choose one from Muscle Map."
            )
        );

        return;
    }

    workouts.forEach(function (workout) {
        selectedWorkoutList.appendChild(
            createWorkoutItem(workout)
        );
    });
}

function createWorkoutItem(workout) {
    const item = document.createElement("div");
    item.className = "day-item workout-plan-item";

    if (workout.completed) {
        item.classList.add("workout-completed");
    }

    const header = document.createElement("div");
    header.className = "day-item-header";

    const nameElement = document.createElement("div");
    nameElement.className = "day-item-name";

    if (workout.completed) {
        const icon = document.createElement("i");
        icon.className = "bi bi-check-circle-fill text-success me-2";
        nameElement.appendChild(icon);
    }

    const nameText = document.createElement("span");
    nameText.textContent =
        workout.exerciseName ||
        workout.name ||
        "Exercise";

    nameElement.appendChild(nameText);

    const valueElement = document.createElement("div");
    valueElement.className = "day-item-value";
    valueElement.textContent =
        workout.completed
            ? "Done"
            : "Planned";

    header.appendChild(nameElement);
    header.appendChild(valueElement);

    item.appendChild(header);

    const weight = Number(workout.weight || 0);

    let meta =
        `${workout.sets || 0} sets × ${workout.reps || 0} reps`;

    if (weight > 0) {
        meta += ` • ${formatNumber(weight)} kg`;
    }

    if (
        workout.primaryMuscle ||
        workout.muscleGroup
    ) {
        meta +=
            ` • ${workout.primaryMuscle || workout.muscleGroup}`;
    }

    const metaElement = document.createElement("div");
    metaElement.className = "day-item-meta";
    metaElement.textContent = meta;

    item.appendChild(metaElement);

    const actions = document.createElement("div");
    actions.className = "workout-item-actions";

    const completeButton = createActionButton(
        workout.completed
            ? "Undo"
            : "Complete",
        workout.completed
            ? "bi-arrow-counterclockwise"
            : "bi-check2-circle",
        workout.completed
            ? "btn-outline-secondary"
            : "btn-outline-success"
    );

    completeButton.addEventListener("click", function () {
        toggleWorkoutCompleted(workout);
    });

    const editButton = createActionButton(
        "Edit",
        "bi-pencil-square",
        "btn-outline-primary"
    );

    editButton.addEventListener("click", function () {
        openWorkoutModal(workout);
    });

    const deleteButton = createActionButton(
        "Delete",
        "bi-trash3",
        "btn-outline-danger"
    );

    deleteButton.addEventListener("click", function () {
        removeWorkout(workout);
    });

    actions.appendChild(completeButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(actions);

    return item;
}

function createActionButton(text, iconClass, buttonClass) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `btn btn-sm ${buttonClass}`;

    const icon = document.createElement("i");
    icon.className = `bi ${iconClass} me-1`;

    button.appendChild(icon);
    button.appendChild(document.createTextNode(text));

    return button;
}

/* Running */
function renderRunList(runs) {
    selectedRunList.innerHTML = "";

    if (runs.length === 0) {
        selectedRunList.appendChild(
            createEmptyState(
                "No running session for this date."
            )
        );

        return;
    }

    runs.forEach(function (run) {
        const distance = Number(run.distance || 0);
        const calories = Number(run.calories || 0);

        let meta = "";

        if (run.duration) {
            meta =
                `Duration: ${formatDuration(run.duration)}`;
        }

        if (calories > 0) {
            if (meta) {
                meta += " • ";
            }

            meta +=
                `${Math.round(calories)} kcal`;
        }

        selectedRunList.appendChild(
            createDayItem(
                "Running Session",
                `${formatNumber(distance)} km`,
                meta || "Run saved"
            )
        );
    });
}

/* General Day Item */
function createDayItem(name, value, meta) {
    const item = document.createElement("div");
    item.className = "day-item";

    const header = document.createElement("div");
    header.className = "day-item-header";

    const nameElement = document.createElement("div");
    nameElement.className = "day-item-name";
    nameElement.textContent = name;

    const valueElement = document.createElement("div");
    valueElement.className = "day-item-value";
    valueElement.textContent = value;

    header.appendChild(nameElement);
    header.appendChild(valueElement);

    item.appendChild(header);

    const metaElement = document.createElement("div");
    metaElement.className = "day-item-meta";
    metaElement.textContent = meta;

    item.appendChild(metaElement);

    return item;
}

function createEmptyState(message) {
    const empty = document.createElement("div");

    empty.className = "day-empty";
    empty.textContent = message;

    return empty;
}

/* Month Overview */
function updateMonthOverview() {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const meals = getMealEntries().filter(function (meal) {
        const date = parseLocalDate(meal.date);

        return (
            date.getFullYear() === year &&
            date.getMonth() === month
        );
    });

    const workouts = getWorkoutEntries().filter(function (workout) {
        const date = parseLocalDate(
            getWorkoutDate(workout)
        );

        return (
            date.getFullYear() === year &&
            date.getMonth() === month
        );
    });

    const runs = getRunningEntries().filter(function (run) {
        const date = parseLocalDate(
            getRunDate(run)
        );

        return (
            date.getFullYear() === year &&
            date.getMonth() === month
        );
    });

    monthMealCount.textContent = meals.length;
    monthWorkoutCount.textContent = workouts.length;
    monthRunCount.textContent = runs.length;
}

/* Data */
function getDataForDate(date) {
    return {
        meals: getMealEntries().filter(function (meal) {
            return meal.date === date;
        }),

        workouts: getWorkoutEntries().filter(function (workout) {
            return getWorkoutDate(workout) === date;
        }),

        runs: getRunningEntries().filter(function (run) {
            return getRunDate(run) === date;
        })
    };
}

function getMealEntries() {
    if (
        typeof FitHealthData !== "undefined" &&
        typeof FitHealthData.getMealEntries === "function"
    ) {
        return FitHealthData.getMealEntries() || [];
    }

    return readLocalArray(
        "fithealthMealEntries"
    );
}

function getWorkoutEntries() {
    if (
        typeof FitHealthData !== "undefined" &&
        typeof FitHealthData.getWorkoutDraft === "function"
    ) {
        return FitHealthData.getWorkoutDraft() || [];
    }

    return readLocalArray(
        "fithealthWorkoutDraft"
    );
}

function getWorkoutEntryById(id) {
    return (
        getWorkoutEntries().find(function (entry) {
            return String(entry.id) === String(id);
        }) ||
        null
    );
}

function addWorkoutEntry(entry) {
    if (
        typeof FitHealthData !== "undefined" &&
        typeof FitHealthData.addWorkoutDraftEntry === "function"
    ) {
        FitHealthData.addWorkoutDraftEntry(entry);
        return;
    }

    const entries = getWorkoutEntries();
    entries.push(entry);

    localStorage.setItem(
        "fithealthWorkoutDraft",
        JSON.stringify(entries)
    );
}

function updateWorkoutEntry(updatedEntry) {
    if (
        typeof FitHealthData !== "undefined" &&
        typeof FitHealthData.updateWorkoutDraftEntry === "function"
    ) {
        FitHealthData.updateWorkoutDraftEntry(updatedEntry);
        return;
    }

    const entries = getWorkoutEntries().map(function (entry) {
        return (
            String(entry.id) === String(updatedEntry.id)
                ? updatedEntry
                : entry
        );
    });

    localStorage.setItem(
        "fithealthWorkoutDraft",
        JSON.stringify(entries)
    );
}

function deleteWorkoutEntry(id) {
    if (
        typeof FitHealthData !== "undefined" &&
        typeof FitHealthData.deleteWorkoutDraftEntry === "function"
    ) {
        FitHealthData.deleteWorkoutDraftEntry(id);
        return;
    }

    const entries = getWorkoutEntries().filter(function (entry) {
        return String(entry.id) !== String(id);
    });

    localStorage.setItem(
        "fithealthWorkoutDraft",
        JSON.stringify(entries)
    );
}

function getRunningEntries() {
    if (
        typeof FitHealthData !== "undefined" &&
        typeof FitHealthData.getRunningSessions === "function"
    ) {
        return FitHealthData.getRunningSessions() || [];
    }

    const possibleKeys = [
        "fithealthRunningSessions",
        "fithealthRuns",
        "runningSessions"
    ];

    for (const key of possibleKeys) {
        const data = readLocalArray(key);

        if (data.length > 0) {
            return data;
        }
    }

    return [];
}

function readLocalArray(key) {
    try {
        const stored =
            localStorage.getItem(key);

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return (
            Array.isArray(parsed)
                ? parsed
                : []
        );
    } catch (error) {
        console.error(
            `Unable to read ${key}:`,
            error
        );

        return [];
    }
}

/* Messages */
function showCalendarMessage(message, type = "success") {
    if (!calendarMessage) {
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
            3500
        );
}

/* Date Helpers */
function startOfMonth(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );
}

function getLocalDateString(date) {
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

function parseLocalDate(dateString) {
    if (!dateString) {
        return new Date(0);
    }

    const parts =
        String(dateString)
            .split("-")
            .map(Number);

    if (
        parts.length !== 3 ||
        parts.some(Number.isNaN)
    ) {
        return new Date(0);
    }

    return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );
}

/* Data Date Helpers */
function getWorkoutDate(workout) {
    return (
        workout.date ||
        workout.workoutDate ||
        workout.workout_date ||
        ""
    );
}

function getRunDate(run) {
    return (
        run.date ||
        run.runDate ||
        run.run_date ||
        ""
    );
}

function createExerciseKey(muscle, name) {
    return (
        `${muscle}-${name}`
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
    );
}

/* Formatting */
function formatMealMeta(meal) {
    const parts = [];

    if (meal.mealType) {
        parts.push(
            capitalizeWords(
                meal.mealType
            )
        );
    }

    if (meal.amount) {
        parts.push(
            `${formatNumber(meal.amount)} ${meal.unit || "g"}`
        );
    }

    if (meal.protein !== undefined) {
        parts.push(
            `${formatNumber(meal.protein)}g protein`
        );
    }

    return (
        parts.join(" • ") ||
        "Meal entry"
    );
}

function capitalizeWords(value) {
    return String(value)
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
            function (letter) {
                return letter.toUpperCase();
            }
        );
}

function formatDuration(value) {
    const duration =
        Number(value);

    if (
        !Number.isFinite(duration) ||
        duration <= 0
    ) {
        return "0 min";
    }

    if (duration > 300) {
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

function formatNumber(value) {
    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return Number(
        number.toFixed(1)
    ).toString();
}
