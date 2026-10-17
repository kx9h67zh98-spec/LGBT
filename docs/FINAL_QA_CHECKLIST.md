# FitHealth Final QA Checklist

Use this checklist before submission and before a live demo.

## Source control

- [ ] `git status` shows a clean working tree
- [ ] Active branch is the intended release branch
- [ ] `persistence.xml` contains `ur_sql_password`, not a real password
- [ ] `git diff --check` returns no whitespace errors
- [ ] Production commit is pushed to `origin/main`

## Build

- [ ] `mvn clean package` finishes with `BUILD SUCCESS`
- [ ] `target/FitHealth.war` is created
- [ ] Tomcat starts without deployment errors
- [ ] Hibernate schema validation succeeds

## Authentication

- [ ] Register a new account
- [ ] Duplicate email is rejected
- [ ] Invalid password is rejected by frontend and backend
- [ ] Login succeeds with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Logout ends the session
- [ ] Opening a protected page after logout redirects to login

## Health Profile

- [ ] Save age, gender, height, weight, activity level, goal
- [ ] Save optional target weight
- [ ] BMI/BMR/TDEE/calorie/macros render
- [ ] Refresh page and confirm values persist
- [ ] Invalid age/height/weight is rejected

## Weight / Goal Progress

- [ ] Saving Health Profile creates or updates today's weight log
- [ ] Start, Current, and Target values render
- [ ] Progress increases when moving toward target
- [ ] Progress does not become negative when moving away
- [ ] Progress becomes 100% when target is reached
- [ ] Progress remains 100% if the target is passed

## Nutrition

- [ ] Food list loads
- [ ] Add a meal
- [ ] Edit a meal
- [ ] Delete a meal
- [ ] Daily totals update
- [ ] Smart Nutrition Suggestion renders
- [ ] Suggested food can prefill the meal form
- [ ] Weekly Nutrition Insight renders for seven days

## Water

- [ ] +250 ml works
- [ ] +500 ml works
- [ ] Custom amount works
- [ ] Same day updates one daily row
- [ ] Reset today sets the daily amount to 0
- [ ] Refresh page and confirm amount persists

## Weekly Health Score

- [ ] Score renders as /100
- [ ] Nutrition component renders
- [ ] Workout component renders
- [ ] Running component renders
- [ ] Hydration component renders
- [ ] Weight Tracking component renders
- [ ] Medical disclaimer is visible

## Exercise / Workout

- [ ] Exercise library loads
- [ ] Muscle selection works
- [ ] Workout can be added to Calendar
- [ ] Workout can be edited
- [ ] Workout completion can be toggled
- [ ] Workout can be deleted

## Running

- [ ] Existing running history loads
- [ ] Manual running entry can be created
- [ ] Running overview recalculates
- [ ] Delete works
- [ ] GPS denial/unavailability shows a usable error state instead of crashing

## Calendar

- [ ] Previous/next month works
- [ ] Today button works
- [ ] Meals appear on correct date
- [ ] Workouts appear on correct date
- [ ] Runs appear on correct date
- [ ] Empty dates render normally without console errors

## Responsive / accessibility

- [ ] Desktop layout
- [ ] Tablet layout
- [ ] Mobile layout
- [ ] Keyboard Tab shows visible focus
- [ ] Form labels are associated with inputs
- [ ] Status messages are announced with live regions where applicable
- [ ] No essential information depends only on hover

## Browser console / network

- [ ] No unexpected red JavaScript errors
- [ ] No unexpected 404
- [ ] No unexpected 500
- [ ] Authenticated API requests return 200
- [ ] Unauthorized API requests return 401

## Railway production

- [ ] Deployment status is Success
- [ ] Production domain opens
- [ ] Hard refresh loads latest frontend assets
- [ ] Railway MySQL contains `target_weight`
- [ ] Railway MySQL contains `weight_logs`
- [ ] Railway MySQL contains `water_logs`
- [ ] Saving target weight persists in Railway
- [ ] Adding water persists in Railway

## Demo preparation

- [ ] Prepare one account with useful sample data
- [ ] Have at least several days of meals
- [ ] Have at least two weight dates so the trend chart is visible
- [ ] Have at least one completed workout
- [ ] Have at least one running session
- [ ] Have today's water entry
- [ ] Open Dashboard before presenting
- [ ] Keep the Architecture section of README ready for explanation
- [ ] Keep `docs/VIVA_GUIDE.md` open as a final review
