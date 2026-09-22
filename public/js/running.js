/* Running State */

let runningMap = null;
let routePolyline = null;
let currentPositionMarker = null;
let watchId = null;
let timerInterval = null;

let runState = "ready";
let routePoints = [];
let totalDistanceKm = 0;
let accumulatedTimeMs = 0;
let activeStartedAt = null;
let lastAcceptedPosition = null;
let healthProfileWeight = null;


/* Elements */

let profileWeightValue = null;
let runningMessage = null;
let gpsStatusText = null;
let runStatusBadge = null;
let mapFallback = null;

let liveDistance = null;
let liveDuration = null;
let livePace = null;
let liveSpeed = null;
let liveCalories = null;
let liveAccuracy = null;

let startRunButton = null;
let pauseRunButton = null;
let resumeRunButton = null;
let finishRunButton = null;
let resetRunButton = null;

let totalDistanceValue = null;
let monthRunValue = null;
let longestRunValue = null;
let totalRunCaloriesValue = null;

let manualRunForm = null;
let manualRunDate = null;
let manualDistance = null;
let manualDuration = null;
let manualCalories = null;
let manualPacePreview = null;
let manualSpeedPreview = null;

let historyMonthFilter = null;
let runningHistoryList = null;


/* Start */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        getElements();

        loadHealthProfile();

        initializeMap();

        setupTrackerButtons();

        setupManualForm();

        setupHistoryFilter();

        setDefaultDates();

        updateManualPreview();

        renderRunningHistory();

        updateRunningOverview();

        updateLiveStats();

    }
);


/* Elements */

function getElements() {

    profileWeightValue =
        document.getElementById(
            "profileWeightValue"
        );

    runningMessage =
        document.getElementById(
            "runningMessage"
        );

    gpsStatusText =
        document.getElementById(
            "gpsStatusText"
        );

    runStatusBadge =
        document.getElementById(
            "runStatusBadge"
        );

    mapFallback =
        document.getElementById(
            "mapFallback"
        );

    liveDistance =
        document.getElementById(
            "liveDistance"
        );

    liveDuration =
        document.getElementById(
            "liveDuration"
        );

    livePace =
        document.getElementById(
            "livePace"
        );

    liveSpeed =
        document.getElementById(
            "liveSpeed"
        );

    liveCalories =
        document.getElementById(
            "liveCalories"
        );

    liveAccuracy =
        document.getElementById(
            "liveAccuracy"
        );

    startRunButton =
        document.getElementById(
            "startRunButton"
        );

    pauseRunButton =
        document.getElementById(
            "pauseRunButton"
        );

    resumeRunButton =
        document.getElementById(
            "resumeRunButton"
        );

    finishRunButton =
        document.getElementById(
            "finishRunButton"
        );

    resetRunButton =
        document.getElementById(
            "resetRunButton"
        );

    totalDistanceValue =
        document.getElementById(
            "totalDistanceValue"
        );

    monthRunValue =
        document.getElementById(
            "monthRunValue"
        );

    longestRunValue =
        document.getElementById(
            "longestRunValue"
        );

    totalRunCaloriesValue =
        document.getElementById(
            "totalRunCaloriesValue"
        );

    manualRunForm =
        document.getElementById(
            "manualRunForm"
        );

    manualRunDate =
        document.getElementById(
            "manualRunDate"
        );

    manualDistance =
        document.getElementById(
            "manualDistance"
        );

    manualDuration =
        document.getElementById(
            "manualDuration"
        );

    manualCalories =
        document.getElementById(
            "manualCalories"
        );

    manualPacePreview =
        document.getElementById(
            "manualPacePreview"
        );

    manualSpeedPreview =
        document.getElementById(
            "manualSpeedPreview"
        );

    historyMonthFilter =
        document.getElementById(
            "historyMonthFilter"
        );

    runningHistoryList =
        document.getElementById(
            "runningHistoryList"
        );

}


/* Health Profile */

function loadHealthProfile() {

    if (
        typeof FitHealthData
        ===
        "undefined"
        ||
        typeof FitHealthData.getHealthProfile
        !==
        "function"
    ) {

        profileWeightValue.textContent =
            "Not available";

        return;

    }


    const profile =
        FitHealthData.getHealthProfile();


    if (
        !profile
        ||
        !Number(profile.weight)
    ) {

        profileWeightValue.textContent =
            "Not available";

        return;

    }


    healthProfileWeight =
        Number(
            profile.weight
        );


    profileWeightValue.textContent =
        `${formatNumber(healthProfileWeight, 1)} kg`;

}


/* Map */

function initializeMap() {

    if (
        typeof L
        ===
        "undefined"
    ) {

        showMapFallback();

        return;

    }


    try {

        runningMap =
            L.map(
                "runningMap",
                {
                    zoomControl:
                        true
                }
            ).setView(
                [
                    16.0,
                    106.0
                ],
                5
            );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom:
                    19,

                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(
            runningMap
        );


        routePolyline =
            L.polyline(
                [],
                {
                    weight:
                        5
                }
            ).addTo(
                runningMap
            );


        setTimeout(
            function () {

                if (
                    runningMap
                ) {

                    runningMap.invalidateSize();

                }

            },
            200
        );

    } catch (error) {

        console.error(
            "Unable to initialize map:",
            error
        );

        showMapFallback();

    }

}


function showMapFallback() {

    const mapElement =
        document.getElementById(
            "runningMap"
        );


    if (
        mapElement
    ) {

        mapElement.classList.add(
            "d-none"
        );

    }


    if (
        mapFallback
    ) {

        mapFallback.classList.remove(
            "d-none"
        );

    }

}


/* Tracker Buttons */

function setupTrackerButtons() {

    startRunButton.addEventListener(
        "click",
        startRun
    );


    pauseRunButton.addEventListener(
        "click",
        pauseRun
    );


    resumeRunButton.addEventListener(
        "click",
        resumeRun
    );


    finishRunButton.addEventListener(
        "click",
        finishRun
    );


    resetRunButton.addEventListener(
        "click",
        resetCurrentRun
    );

}


/* Start Run */

function startRun() {

    if (
        runState ===
        "running"
    ) {

        return;

    }


    if (
        !navigator.geolocation
    ) {

        showMessage(
            "Geolocation is not supported by this browser. You can use Manual Entry instead.",
            "warning"
        );

        return;

    }


    resetRunData();


    runState =
        "running";


    activeStartedAt =
        Date.now();


    gpsStatusText.textContent =
        "Requesting GPS location...";


    updateRunStatus();

    startTimer();

    startGpsWatch();

}


/* Pause */

function pauseRun() {

    if (
        runState !==
        "running"
    ) {

        return;

    }


    accumulatedTimeMs +=
        Date.now()
        -
        activeStartedAt;


    activeStartedAt =
        null;


    runState =
        "paused";


    stopTimer();

    stopGpsWatch();


    gpsStatusText.textContent =
        "Run paused";


    updateRunStatus();

    updateLiveStats();

}


/* Resume */

function resumeRun() {

    if (
        runState !==
        "paused"
    ) {

        return;

    }


    runState =
        "running";


    activeStartedAt =
        Date.now();


    gpsStatusText.textContent =
        "Resuming GPS tracking...";


    updateRunStatus();

    startTimer();

    startGpsWatch();

}


/* Finish */

function finishRun() {

    if (
        runState !==
        "running"
        &&
        runState !==
        "paused"
    ) {

        return;

    }


    if (
        runState ===
        "running"
    ) {

        accumulatedTimeMs +=
            Date.now()
            -
            activeStartedAt;

    }


    activeStartedAt =
        null;


    stopTimer();

    stopGpsWatch();


    const durationSeconds =
        Math.max(
            1,
            Math.round(
                accumulatedTimeMs
                /
                1000
            )
        );


    if (
        totalDistanceKm <= 0
    ) {

        runState =
            "paused";


        updateRunStatus();


        showMessage(
            "No GPS distance was recorded. Move outdoors with GPS enabled, or use Manual Entry.",
            "warning"
        );

        return;

    }


    const metrics =
        calculateRunMetrics(
            totalDistanceKm,
            durationSeconds
        );


    const session = {

        id:
            Date.now(),

        date:
            getLocalDateString(
                new Date()
            ),

        distance:
            roundNumber(
                totalDistanceKm,
                3
            ),

        duration:
            durationSeconds,

        averageSpeed:
            roundNumber(
                metrics.averageSpeed,
                2
            ),

        averagePace:
            roundNumber(
                metrics.averagePace,
                2
            ),

        calories:
            roundNumber(
                estimateCalories(
                    totalDistanceKm
                ),
                0
            ),

        source:
            "gps",

        route:
            routePoints.map(
                function (point) {

                    return {
                        lat:
                            point.lat,

                        lng:
                            point.lng,

                        timestamp:
                            point.timestamp,

                        accuracy:
                            point.accuracy
                    };

                }
            ),

        createdAt:
            new Date().toISOString()

    };


    saveRunningSession(
        session
    );


    runState =
        "finished";


    gpsStatusText.textContent =
        "Run saved successfully";


    updateRunStatus();

    updateLiveStats();

    renderRunningHistory();

    updateRunningOverview();


    showMessage(
        `Run saved: ${formatNumber(session.distance, 2)} km in ${formatDuration(session.duration)}.`,
        "success"
    );

}


/* Reset */

function resetCurrentRun() {

    stopTimer();

    stopGpsWatch();

    resetRunData();


    runState =
        "ready";


    gpsStatusText.textContent =
        "Ready to start";


    updateRunStatus();

    updateLiveStats();

}


function resetRunData() {

    routePoints =
        [];

    totalDistanceKm =
        0;

    accumulatedTimeMs =
        0;

    activeStartedAt =
        null;

    lastAcceptedPosition =
        null;


    if (
        routePolyline
    ) {

        routePolyline.setLatLngs(
            []
        );

    }


    if (
        currentPositionMarker
        &&
        runningMap
    ) {

        runningMap.removeLayer(
            currentPositionMarker
        );

        currentPositionMarker =
            null;

    }

}


/* GPS */

function startGpsWatch() {

    stopGpsWatch();


    watchId =
        navigator.geolocation.watchPosition(
            handleGpsPosition,
            handleGpsError,
            {
                enableHighAccuracy:
                    true,

                timeout:
                    15000,

                maximumAge:
                    2000
            }
        );

}


function stopGpsWatch() {

    if (
        watchId !==
        null
        &&
        navigator.geolocation
    ) {

        navigator.geolocation.clearWatch(
            watchId
        );

    }


    watchId =
        null;

}


function handleGpsPosition(
    position
) {

    if (
        runState !==
        "running"
    ) {

        return;

    }


    const point = {
        lat:
            position.coords.latitude,

        lng:
            position.coords.longitude,

        accuracy:
            Number(
                position.coords.accuracy
                ||
                0
            ),

        timestamp:
            position.timestamp
            ||
            Date.now()
    };


    liveAccuracy.textContent =
        point.accuracy > 0
        ?
        Math.round(
            point.accuracy
        )
        :
        "--";


    if (
        point.accuracy > 100
    ) {

        gpsStatusText.textContent =
            `Waiting for better GPS accuracy (${Math.round(point.accuracy)} m)`;

        updateMapCurrentPosition(
            point
        );

        return;

    }


    if (
        lastAcceptedPosition
    ) {

        const segmentKm =
            calculateDistanceKm(
                lastAcceptedPosition.lat,
                lastAcceptedPosition.lng,
                point.lat,
                point.lng
            );


        const seconds =
            Math.max(
                1,
                (
                    point.timestamp
                    -
                    lastAcceptedPosition.timestamp
                )
                /
                1000
            );


        const segmentSpeedMps =
            (
                segmentKm
                *
                1000
            )
            /
            seconds;


        if (
            segmentSpeedMps <= 12
            &&
            segmentKm <= 0.5
        ) {

            totalDistanceKm +=
                segmentKm;

        } else {

            gpsStatusText.textContent =
                "GPS jump ignored";

            return;

        }

    }


    routePoints.push(
        point
    );


    lastAcceptedPosition =
        point;


    gpsStatusText.textContent =
        `GPS active • accuracy ${Math.round(point.accuracy)} m`;


    updateMapRoute();

    updateLiveStats();

}


function handleGpsError(
    error
) {

    let message =
        "Unable to access GPS location.";


    if (
        error.code ===
        error.PERMISSION_DENIED
    ) {

        message =
            "Location permission was denied. Allow location access or use Manual Entry.";

    }


    else if (
        error.code ===
        error.POSITION_UNAVAILABLE
    ) {

        message =
            "GPS position is currently unavailable.";

    }


    else if (
        error.code ===
        error.TIMEOUT
    ) {

        message =
            "GPS request timed out. Try moving outdoors or closer to a window.";

    }


    gpsStatusText.textContent =
        message;


    showMessage(
        message,
        "warning"
    );

}


/* Map Route */

function updateMapCurrentPosition(
    point
) {

    if (
        !runningMap
    ) {

        return;

    }


    const latLng =
        [
            point.lat,
            point.lng
        ];


    if (
        !currentPositionMarker
    ) {

        currentPositionMarker =
            L.circleMarker(
                latLng,
                {
                    radius:
                        7,

                    weight:
                        3
                }
            ).addTo(
                runningMap
            );

    } else {

        currentPositionMarker.setLatLng(
            latLng
        );

    }


    runningMap.setView(
        latLng,
        Math.max(
            runningMap.getZoom(),
            16
        )
    );

}


function updateMapRoute() {

    if (
        !runningMap
        ||
        !routePolyline
        ||
        routePoints.length === 0
    ) {

        return;

    }


    const latLngs =
        routePoints.map(
            function (point) {

                return [
                    point.lat,
                    point.lng
                ];

            }
        );


    routePolyline.setLatLngs(
        latLngs
    );


    updateMapCurrentPosition(
        routePoints[
            routePoints.length - 1
        ]
    );


    if (
        latLngs.length > 1
    ) {

        runningMap.fitBounds(
            routePolyline.getBounds(),
            {
                padding:
                    [
                        35,
                        35
                    ],

                maxZoom:
                    17
            }
        );

    }

}


/* Timer */

function startTimer() {

    stopTimer();


    timerInterval =
        setInterval(
            updateLiveStats,
            1000
        );

}


function stopTimer() {

    if (
        timerInterval
    ) {

        clearInterval(
            timerInterval
        );

    }


    timerInterval =
        null;

}


function getElapsedTimeMs() {

    let elapsed =
        accumulatedTimeMs;


    if (
        runState ===
        "running"
        &&
        activeStartedAt
    ) {

        elapsed +=
            Date.now()
            -
            activeStartedAt;

    }


    return elapsed;

}


/* Live Stats */

function updateLiveStats() {

    const elapsedSeconds =
        Math.max(
            0,
            Math.round(
                getElapsedTimeMs()
                /
                1000
            )
        );


    const metrics =
        calculateRunMetrics(
            totalDistanceKm,
            elapsedSeconds
        );


    liveDistance.textContent =
        formatNumber(
            totalDistanceKm,
            2
        );


    liveDuration.textContent =
        formatDurationClock(
            elapsedSeconds
        );


    livePace.textContent =
        totalDistanceKm > 0
        ?
        formatPace(
            metrics.averagePace
        )
        :
        "--:--";


    liveSpeed.textContent =
        formatNumber(
            metrics.averageSpeed,
            1
        );


    if (
        healthProfileWeight
    ) {

        liveCalories.textContent =
            Math.round(
                estimateCalories(
                    totalDistanceKm
                )
            );

    } else {

        liveCalories.textContent =
            "--";

    }

}


function updateRunStatus() {

    runStatusBadge.className =
        "run-status-badge";


    if (
        runState ===
        "running"
    ) {

        runStatusBadge.classList.add(
            "status-running"
        );

        runStatusBadge.textContent =
            "Running";

        startRunButton.classList.add(
            "d-none"
        );

        pauseRunButton.classList.remove(
            "d-none"
        );

        resumeRunButton.classList.add(
            "d-none"
        );

        finishRunButton.classList.remove(
            "d-none"
        );

        return;

    }


    if (
        runState ===
        "paused"
    ) {

        runStatusBadge.classList.add(
            "status-paused"
        );

        runStatusBadge.textContent =
            "Paused";

        startRunButton.classList.add(
            "d-none"
        );

        pauseRunButton.classList.add(
            "d-none"
        );

        resumeRunButton.classList.remove(
            "d-none"
        );

        finishRunButton.classList.remove(
            "d-none"
        );

        return;

    }


    if (
        runState ===
        "finished"
    ) {

        runStatusBadge.classList.add(
            "status-finished"
        );

        runStatusBadge.textContent =
            "Saved";

    } else {

        runStatusBadge.classList.add(
            "status-ready"
        );

        runStatusBadge.textContent =
            "Ready";

    }


    startRunButton.classList.remove(
        "d-none"
    );

    pauseRunButton.classList.add(
        "d-none"
    );

    resumeRunButton.classList.add(
        "d-none"
    );

    finishRunButton.classList.add(
        "d-none"
    );

}


/* Manual Entry */

function setupManualForm() {

    manualDistance.addEventListener(
        "input",
        updateManualPreview
    );


    manualDuration.addEventListener(
        "input",
        updateManualPreview
    );


    manualRunForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const date =
                manualRunDate.value;


            const distance =
                Number(
                    manualDistance.value
                );


            const durationMinutes =
                Number(
                    manualDuration.value
                );


            let calories =
                Number(
                    manualCalories.value
                );


            if (
                !date
                ||
                !Number.isFinite(distance)
                ||
                distance <= 0
                ||
                !Number.isFinite(durationMinutes)
                ||
                durationMinutes <= 0
            ) {

                showMessage(
                    "Please enter a valid date, distance and duration.",
                    "danger"
                );

                return;

            }


            if (
                !Number.isFinite(calories)
                ||
                calories < 0
            ) {

                calories =
                    0;

            }


            if (
                calories === 0
                &&
                healthProfileWeight
            ) {

                calories =
                    estimateCalories(
                        distance
                    );

            }


            const durationSeconds =
                Math.round(
                    durationMinutes
                    *
                    60
                );


            const metrics =
                calculateRunMetrics(
                    distance,
                    durationSeconds
                );


            const session = {

                id:
                    Date.now(),

                date:
                    date,

                distance:
                    roundNumber(
                        distance,
                        3
                    ),

                duration:
                    durationSeconds,

                averageSpeed:
                    roundNumber(
                        metrics.averageSpeed,
                        2
                    ),

                averagePace:
                    roundNumber(
                        metrics.averagePace,
                        2
                    ),

                calories:
                    roundNumber(
                        calories,
                        0
                    ),

                source:
                    "manual",

                route:
                    [],

                createdAt:
                    new Date().toISOString()

            };


            saveRunningSession(
                session
            );


            manualRunForm.reset();

            manualRunDate.value =
                getLocalDateString(
                    new Date()
                );


            updateManualPreview();

            renderRunningHistory();

            updateRunningOverview();


            showMessage(
                `Run saved: ${formatNumber(distance, 2)} km.`,
                "success"
            );

        }
    );

}


function updateManualPreview() {

    const distance =
        Number(
            manualDistance.value
        );


    const durationMinutes =
        Number(
            manualDuration.value
        );


    if (
        !Number.isFinite(distance)
        ||
        distance <= 0
        ||
        !Number.isFinite(durationMinutes)
        ||
        durationMinutes <= 0
    ) {

        manualPacePreview.textContent =
            "--:-- /km";

        manualSpeedPreview.textContent =
            "0.0 km/h";

        return;

    }


    const metrics =
        calculateRunMetrics(
            distance,
            durationMinutes * 60
        );


    manualPacePreview.textContent =
        `${formatPace(metrics.averagePace)} /km`;


    manualSpeedPreview.textContent =
        `${formatNumber(metrics.averageSpeed, 1)} km/h`;

}


/* History */

function setupHistoryFilter() {

    historyMonthFilter.addEventListener(
        "change",
        function () {

            renderRunningHistory();

        }
    );

}


function setDefaultDates() {

    const today =
        new Date();


    manualRunDate.value =
        getLocalDateString(
            today
        );


    historyMonthFilter.value =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

}


function renderRunningHistory() {

    const sessions =
        getRunningSessions()
            .slice()
            .sort(
                function (
                    first,
                    second
                ) {

                    const firstTime =
                        getSessionSortTime(
                            first
                        );

                    const secondTime =
                        getSessionSortTime(
                            second
                        );


                    return (
                        secondTime
                        -
                        firstTime
                    );

                }
            );


    const selectedMonth =
        historyMonthFilter.value;


    const filtered =
        selectedMonth
        ?
        sessions.filter(
            function (session) {

                return (
                    String(
                        session.date
                        ||
                        ""
                    ).startsWith(
                        selectedMonth
                    )
                );

            }
        )
        :
        sessions;


    runningHistoryList.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "run-empty-state";


        empty.innerHTML = `
            <i class="bi bi-person-walking"></i>
            <h5 class="fw-bold">No runs yet</h5>
            <p class="mb-0">
                Start GPS tracking or add a manual run.
            </p>
        `;


        runningHistoryList.appendChild(
            empty
        );

        return;

    }


    filtered.forEach(
        function (session) {

            runningHistoryList.appendChild(
                createRunHistoryCard(
                    session
                )
            );

        }
    );

}


function createRunHistoryCard(
    session
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "run-history-card";


    const top =
        document.createElement(
            "div"
        );


    top.className =
        "run-history-top";


    const heading =
        document.createElement(
            "div"
        );


    const date =
        document.createElement(
            "div"
        );


    date.className =
        "run-history-date";


    date.textContent =
        formatDateLong(
            session.date
        );


    const distance =
        document.createElement(
            "div"
        );


    distance.className =
        "run-history-distance";


    distance.textContent =
        `${formatNumber(session.distance || 0, 2)} km`;


    heading.appendChild(
        date
    );


    heading.appendChild(
        distance
    );


    const source =
        document.createElement(
            "span"
        );


    source.className =
        "run-source-badge";


    source.textContent =
        session.source === "gps"
        ?
        "GPS"
        :
        "Manual";


    top.appendChild(
        heading
    );


    top.appendChild(
        source
    );


    card.appendChild(
        top
    );


    const stats =
        document.createElement(
            "div"
        );


    stats.className =
        "run-history-stats";


    stats.appendChild(
        createHistoryStat(
            "Duration",
            formatDuration(
                session.duration
                ||
                0
            )
        )
    );


    stats.appendChild(
        createHistoryStat(
            "Pace",
            `${formatPace(Number(session.averagePace || 0))} /km`
        )
    );


    stats.appendChild(
        createHistoryStat(
            "Calories",
            Number(session.calories || 0) > 0
            ?
            `${Math.round(Number(session.calories))} kcal`
            :
            "--"
        )
    );


    card.appendChild(
        stats
    );


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "run-history-actions";


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "btn btn-outline-danger btn-sm";


    deleteButton.innerHTML =
        '<i class="bi bi-trash3 me-1"></i> Delete';


    deleteButton.addEventListener(
        "click",
        function () {

            deleteRunningSession(
                session.id
            );


            renderRunningHistory();

            updateRunningOverview();


            showMessage(
                "Run deleted.",
                "secondary"
            );

        }
    );


    actions.appendChild(
        deleteButton
    );


    card.appendChild(
        actions
    );


    return card;

}


function createHistoryStat(
    label,
    value
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "run-history-stat";


    const small =
        document.createElement(
            "small"
        );


    small.textContent =
        label;


    const strong =
        document.createElement(
            "strong"
        );


    strong.textContent =
        value;


    item.appendChild(
        small
    );


    item.appendChild(
        strong
    );


    return item;

}


/* Overview */

function updateRunningOverview() {

    const sessions =
        getRunningSessions();


    const totalDistance =
        sessions.reduce(
            function (
                total,
                session
            ) {

                return (
                    total
                    +
                    Number(
                        session.distance
                        ||
                        0
                    )
                );

            },
            0
        );


    const longest =
        sessions.reduce(
            function (
                currentLongest,
                session
            ) {

                return Math.max(
                    currentLongest,
                    Number(
                        session.distance
                        ||
                        0
                    )
                );

            },
            0
        );


    const totalCalories =
        sessions.reduce(
            function (
                total,
                session
            ) {

                return (
                    total
                    +
                    Number(
                        session.calories
                        ||
                        0
                    )
                );

            },
            0
        );


    const today =
        new Date();


    const currentMonthPrefix =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;


    const monthRuns =
        sessions.filter(
            function (session) {

                return String(
                    session.date
                    ||
                    ""
                ).startsWith(
                    currentMonthPrefix
                );

            }
        ).length;


    totalDistanceValue.textContent =
        formatNumber(
            totalDistance,
            1
        );


    monthRunValue.textContent =
        monthRuns;


    longestRunValue.textContent =
        formatNumber(
            longest,
            1
        );


    totalRunCaloriesValue.textContent =
        Math.round(
            totalCalories
        );

}


/* Data Service */

function getRunningSessions() {

    if (
        typeof FitHealthData
        !==
        "undefined"
        &&
        typeof FitHealthData.getRunningSessions
        ===
        "function"
    ) {

        return (
            FitHealthData.getRunningSessions()
            ||
            []
        );

    }


    return readRunningSessionsFallback();

}


function saveRunningSession(
    session
) {

    if (
        typeof FitHealthData
        !==
        "undefined"
        &&
        typeof FitHealthData.addRunningSession
        ===
        "function"
    ) {

        FitHealthData.addRunningSession(
            session
        );

        return;

    }


    const sessions =
        readRunningSessionsFallback();


    sessions.push(
        session
    );


    localStorage.setItem(
        "fithealthRunningSessions",
        JSON.stringify(
            sessions
        )
    );

}


function deleteRunningSession(
    id
) {

    if (
        typeof FitHealthData
        !==
        "undefined"
        &&
        typeof FitHealthData.deleteRunningSession
        ===
        "function"
    ) {

        FitHealthData.deleteRunningSession(
            id
        );

        return;

    }


    const updated =
        readRunningSessionsFallback()
            .filter(
                function (session) {

                    return (
                        session.id !== id
                    );

                }
            );


    localStorage.setItem(
        "fithealthRunningSessions",
        JSON.stringify(
            updated
        )
    );

}


function readRunningSessionsFallback() {

    try {

        const stored =
            localStorage.getItem(
                "fithealthRunningSessions"
            );


        if (
            !stored
        ) {

            return [];

        }


        const parsed =
            JSON.parse(
                stored
            );


        return (
            Array.isArray(
                parsed
            )
            ?
            parsed
            :
            []
        );

    } catch (error) {

        console.error(
            "Unable to load running sessions:",
            error
        );

        return [];

    }

}


/* Calculations */

function calculateDistanceKm(
    firstLat,
    firstLng,
    secondLat,
    secondLng
) {

    const earthRadiusKm =
        6371;


    const latitudeChange =
        degreesToRadians(
            secondLat
            -
            firstLat
        );


    const longitudeChange =
        degreesToRadians(
            secondLng
            -
            firstLng
        );


    const firstLatitude =
        degreesToRadians(
            firstLat
        );


    const secondLatitude =
        degreesToRadians(
            secondLat
        );


    const value =
        Math.sin(
            latitudeChange / 2
        )
        **
        2
        +
        Math.cos(
            firstLatitude
        )
        *
        Math.cos(
            secondLatitude
        )
        *
        Math.sin(
            longitudeChange / 2
        )
        **
        2;


    const angle =
        2
        *
        Math.atan2(
            Math.sqrt(
                value
            ),
            Math.sqrt(
                1 - value
            )
        );


    return (
        earthRadiusKm
        *
        angle
    );

}


function degreesToRadians(
    degrees
) {

    return (
        degrees
        *
        Math.PI
        /
        180
    );

}


function calculateRunMetrics(
    distanceKm,
    durationSeconds
) {

    if (
        !Number.isFinite(
            distanceKm
        )
        ||
        distanceKm <= 0
        ||
        !Number.isFinite(
            durationSeconds
        )
        ||
        durationSeconds <= 0
    ) {

        return {
            averageSpeed:
                0,

            averagePace:
                0
        };

    }


    const durationHours =
        durationSeconds
        /
        3600;


    const durationMinutes =
        durationSeconds
        /
        60;


    return {
        averageSpeed:
            distanceKm
            /
            durationHours,

        averagePace:
            durationMinutes
            /
            distanceKm
    };

}


function estimateCalories(
    distanceKm
) {

    if (
        !healthProfileWeight
        ||
        distanceKm <= 0
    ) {

        return 0;

    }


    return (
        healthProfileWeight
        *
        distanceKm
        *
        1.036
    );

}


/* Formatting */

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


function formatDurationClock(
    seconds
) {

    const safeSeconds =
        Math.max(
            0,
            Math.floor(
                Number(seconds)
                ||
                0
            )
        );


    const hours =
        Math.floor(
            safeSeconds
            /
            3600
        );


    const minutes =
        Math.floor(
            (
                safeSeconds
                %
                3600
            )
            /
            60
        );


    const remainingSeconds =
        safeSeconds
        %
        60;


    return (
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
    );

}


function formatDuration(
    seconds
) {

    const safeSeconds =
        Math.max(
            0,
            Math.round(
                Number(seconds)
                ||
                0
            )
        );


    const hours =
        Math.floor(
            safeSeconds
            /
            3600
        );


    const minutes =
        Math.floor(
            (
                safeSeconds
                %
                3600
            )
            /
            60
        );


    const remainingSeconds =
        safeSeconds
        %
        60;


    if (
        hours > 0
    ) {

        return (
            `${hours}h ${minutes}m ${remainingSeconds}s`
        );

    }


    return (
        `${minutes}m ${remainingSeconds}s`
    );

}


function formatPace(
    paceMinutes
) {

    if (
        !Number.isFinite(
            paceMinutes
        )
        ||
        paceMinutes <= 0
    ) {

        return (
            "--:--"
        );

    }


    let minutes =
        Math.floor(
            paceMinutes
        );


    let seconds =
        Math.round(
            (
                paceMinutes
                -
                minutes
            )
            *
            60
        );


    if (
        seconds === 60
    ) {

        minutes +=
            1;

        seconds =
            0;

    }


    return (
        `${minutes}:${String(seconds).padStart(2, "0")}`
    );

}


function formatNumber(
    value,
    decimalPlaces
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

        return (
            "0"
        );

    }


    return (
        number.toFixed(
            decimalPlaces
        )
    );

}


function roundNumber(
    value,
    decimalPlaces
) {

    const factor =
        10
        **
        decimalPlaces;


    return (
        Math.round(
            Number(value)
            *
            factor
        )
        /
        factor
    );

}


function formatDateLong(
    dateString
) {

    if (
        !dateString
    ) {

        return (
            "Unknown date"
        );

    }


    const parts =
        String(
            dateString
        )
            .split("-")
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
            dateString
        );

    }


    const date =
        new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );


    return (
        new Intl.DateTimeFormat(
            "en-US",
            {
                weekday:
                    "short",

                month:
                    "short",

                day:
                    "numeric",

                year:
                    "numeric"
            }
        ).format(
            date
        )
    );

}


function getSessionSortTime(
    session
) {

    if (
        session.createdAt
    ) {

        const time =
            new Date(
                session.createdAt
            ).getTime();


        if (
            Number.isFinite(
                time
            )
        ) {

            return time;

        }

    }


    if (
        session.date
    ) {

        const parts =
            String(
                session.date
            )
                .split("-")
                .map(
                    Number
                );


        if (
            parts.length === 3
        ) {

            return (
                new Date(
                    parts[0],
                    parts[1] - 1,
                    parts[2]
                ).getTime()
            );

        }

    }


    return 0;

}


/* Message */

function showMessage(
    message,
    type
) {

    runningMessage.className =
        `alert alert-${type}`;


    runningMessage.textContent =
        message;


    runningMessage.classList.remove(
        "d-none"
    );


    window.setTimeout(
        function () {

            runningMessage.classList.add(
                "d-none"
            );

        },
        4500
    );

}
