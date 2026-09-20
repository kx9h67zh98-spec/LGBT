// Database for Workouts and Nutrition Meal Plans in English
const workoutData = {
  // Monday: Chest & Triceps
  "1": {
    name: "💪 Chest & Triceps",
    badgeClass: "bg-success-subtle text-success border-success-subtle",
    calories: "2,200 kcal",
    exercises: [
      { name: "Barbell Bench Press", detail: "4 Sets x 10 Reps • 60kg" },
      { name: "Incline Dumbbell Press", detail: "3 Sets x 12 Reps • 22kg" },
      { name: "Cable Flyes", detail: "3 Sets x 15 Reps • 15kg" },
      { name: "Triceps Pushdown", detail: "3 Sets x 12 Reps • 25kg" }
    ],
    meals: [
      { time: "Breakfast (07:00 AM)", desc: "3 Boiled Eggs + 1 Slice Whole Wheat Toast + 1 Milk" },
      { time: "Lunch (12:30 PM)", desc: "200g Grilled Chicken Breast + Brown Rice + Broccoli" },
      { time: "Pre-Workout (04:30 PM)", desc: "1 Banana + 1 Scoop Whey Protein" },
      { time: "Dinner (07:30 PM)", desc: "200g Grilled Beef Steak + Mixed Green Salad" }
    ]
  },
  // Tuesday: Back & Biceps
  "2": {
    name: "🏋️ Back & Biceps",
    badgeClass: "bg-info-subtle text-info border-info-subtle",
    calories: "2,350 kcal",
    exercises: [
      { name: "Lat Pulldown", detail: "4 Sets x 12 Reps • 45kg" },
      { name: "Bent Over Barbell Row", detail: "4 Sets x 10 Reps • 50kg" },
      { name: "Dumbbell Bicep Curls", detail: "3 Sets x 12 Reps • 12kg" }
    ],
    meals: [
      { time: "Breakfast (07:00 AM)", desc: "Beef Noodle Soup + 2 Poached Eggs" },
      { time: "Lunch (12:30 PM)", desc: "200g Braised Salmon + Steamed Rice + Veggies" },
      { time: "Pre-Workout (04:30 PM)", desc: "1 Greek Yogurt + Almonds" },
      { time: "Dinner (07:30 PM)", desc: "200g Steamed Shrimp + Fresh Salad" }
    ]
  },
  // Thursday: Leg Day
  "4": {
    name: "🦵 Leg Day",
    badgeClass: "bg-purple-subtle text-purple border-purple-subtle",
    calories: "2,500 kcal",
    exercises: [
      { name: "Barbell Back Squat", detail: "4 Sets x 8 Reps • 80kg" },
      { name: "Leg Press Machine", detail: "4 Sets x 12 Reps • 120kg" },
      { name: "Romanian Deadlift", detail: "3 Sets x 10 Reps • 60kg" }
    ],
    meals: [
      { time: "Breakfast (07:00 AM)", desc: "Oatmeal with Milk & Sliced Bananas" },
      { time: "Lunch (12:30 PM)", desc: "250g Stir-fried Beef + Brown Rice" },
      { time: "Pre-Workout (04:30 PM)", desc: "Peanut Butter Sandwich + Whey Protein" },
      { time: "Dinner (07:30 PM)", desc: "200g Grilled Pork Ribs + Steamed Sweet Potato" }
    ]
  },
  // Friday: Shoulders & Abs
  "5": {
    name: "🪨 Shoulders & Abs",
    badgeClass: "bg-warning-subtle text-warning border-warning-subtle",
    calories: "2,100 kcal",
    exercises: [
      { name: "Overhead Dumbbell Press", detail: "4 Sets x 10 Reps • 16kg" },
      { name: "Dumbbell Lateral Raise", detail: "4 Sets x 15 Reps • 8kg" },
      { name: "Plank & Crunches", detail: "3 Sets x 60s / 20 Reps" }
    ],
    meals: [
      { time: "Breakfast (07:00 AM)", desc: "2 Fried Eggs + Omelet Toast + Avocado" },
      { time: "Lunch (12:30 PM)", desc: "200g Shredded Chicken Breast + Quinoa Bowl" },
      { time: "Pre-Workout (04:30 PM)", desc: "1 Apple + Handful of Walnuts" },
      { time: "Dinner (07:30 PM)", desc: "200g Pan-seared Fish + Asparagus" }
    ]
  }
};

// Rest Day Data
const restDayData = {
  name: "😴 Rest Day",
  badgeClass: "bg-secondary-subtle text-secondary border-secondary-subtle",
  calories: "1,800 kcal",
  exercises: [],
  meals: [
    { time: "Breakfast (07:30 AM)", desc: "2 Omelet Eggs + 1 Slice Toast + Black Coffee" },
    { time: "Lunch (12:30 PM)", desc: "150g Boiled Lean Pork + Rice + Vegetable Soup" },
    { time: "Snack (04:00 PM)", desc: "Avocado Smoothie (Low Sugar)" },
    { time: "Dinner (07:00 PM)", desc: "100g Boiled Chicken + Fresh Garden Salad" }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const dayHeads = document.querySelectorAll('.day-head');
  const dayTitle = document.querySelector('.panel-card h5');
  const badge = document.querySelector('.panel-card .badge');
  const exerciseList = document.querySelector('.exercise-list');
  const mealList = document.querySelector('.meal-list');
  const calorieBadge = document.querySelector('.panel-card .badge.bg-warning-subtle');
  const todayBtn = document.querySelector('.app-header .btn-outline-success');

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayMap = ["1", "2", "3", "4", "5", "6", "0"];

  // Function to render workout & meal plan by day
  function renderDayData(dayIndex, dayLabel) {
    const data = workoutData[dayIndex] || restDayData;

    // Update Title & Badges
    dayTitle.textContent = `${dayLabel} Schedule`;
    badge.textContent = data.name;
    badge.className = `badge ${data.badgeClass}`;
    if (calorieBadge) calorieBadge.textContent = data.calories;

    // Render Exercises
    if (data.exercises.length === 0) {
      exerciseList.innerHTML = `<div class="text-muted fs-7 py-3 text-center">It's Rest Day! Take time to recover your body. 🧘‍♂️</div>`;
    } else {
      exerciseList.innerHTML = data.exercises.map(ex => `
        <div class="exercise-item">
          <input type="checkbox" class="form-check-input exercise-check">
          <div class="flex-grow-1 ms-2">
            <div class="fw-bold fs-6">${ex.name}</div>
            <div class="fs-7 text-muted">${ex.detail}</div>
          </div>
        </div>
      `).join('');
    }

    // Render Meals
    mealList.innerHTML = data.meals.map(m => `
      <div class="meal-item">
        <div class="meal-title">${m.time}</div>
        <div class="meal-desc">${m.desc}</div>
      </div>
    `).join('');

    bindCheckboxes();
  }

  // Active a specific day on header grid
  function selectDay(index) {
    dayHeads.forEach(h => h.classList.remove('active'));
    if (dayHeads[index]) {
      dayHeads[index].classList.add('active');
      renderDayData(dayMap[index], dayNames[index]);
    }
  }

  // Handle clicking on calendar days
  dayHeads.forEach((head, index) => {
    head.addEventListener('click', () => {
      selectDay(index);
    });
  });

  // Handle clicking "Today" button (Default to Saturday - SAT 19 in sample)
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      // SAT is index 5 in array [MON, TUE, WED, THU, FRI, SAT, SUN]
      selectDay(5); 
    });
  }

  // Calculate Progress %
  function bindCheckboxes() {
    const checkboxes = document.querySelectorAll('.exercise-check');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    function updateProgress() {
      const total = checkboxes.length;
      let checkedCount = 0;
      checkboxes.forEach(cb => { if (cb.checked) checkedCount++; });
      const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.textContent = `${checkedCount} / ${total} Exercises`;
    }

    checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));
    updateProgress();
  }

  // Handle Save Schedule Modal
  const saveBtn = document.getElementById('saveWorkoutBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const workoutType = document.getElementById('workoutType').value;
      const workoutTime = document.getElementById('workoutTime').value;

      alert(`Successfully scheduled [${workoutType.toUpperCase()}] at ${workoutTime}!`);
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('addWorkoutModal'));
      modal.hide();
    });
  }

  // Initialize Today as default (SAT - Index 5)
  selectDay(5);
});