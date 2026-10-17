# FitHealth

FitHealth is a course project for tracking health, nutrition, workouts, running, hydration, and body-weight progress in one web application.

## Technology stack

- Frontend: HTML5, CSS3, Bootstrap 5, Bootstrap Icons, vanilla JavaScript
- Backend: Java 17, Jakarta Servlets, JPA/Hibernate
- Database: MySQL
- Build: Maven WAR
- Runtime: Apache Tomcat 11
- Deployment: Docker + Railway

The production backend is the Java Servlet application. The Maven/Tomcat application is the authoritative runtime.

## Main features

- Account registration, login, logout, and session authentication
- Health Profile with BMI, BMR, TDEE, calorie target, macro targets, and target weight
- Nutrition Tracker with food database and daily meal entries
- Rule-based Smart Nutrition Suggestions
- 7-day Nutrition Insight
- Weight history, trend chart, and Goal Progress
- Daily Water Intake tracking
- Weekly Health Score based on recorded FitHealth activity
- Exercise library and muscle map
- Workout Planner integrated into Calendar
- Running Tracker with manual/GPS-oriented workflow and history
- Dashboard summary of health, nutrition, workouts, and running

## Architecture

```text
Browser
  |
  | HTML / CSS / JavaScript
  | fetch() + JSON
  v
Java Servlets
  |
  v
DAO layer
  |
  v
JPA / Hibernate
  |
  v
MySQL
```

The frontend never sends a user ID for protected data operations. Authenticated endpoints obtain `userId` from the server-side HTTP session.

## Health calculations

The Health Profile is calculated on the backend so the server remains the source of truth.

BMI:

```text
BMI = weight(kg) / height(m)^2
```

BMR uses Mifflin-St Jeor:

```text
Base = 10W + 6.25H - 5A
Male   BMR = Base + 5
Female BMR = Base - 161
```

TDEE:

```text
TDEE = BMR x activity level
```

Goal calories:

```text
Fat loss     = max(TDEE - 500, 1200)
Maintain     = TDEE
Muscle gain  = TDEE + 300
```

Macro targets:

```text
Protein = 2 g x body weight (kg)
Fat     = 25% of target calories / 9
Carbs   = remaining calories / 4
```

These values are estimates for fitness tracking and are not medical advice.

## Smart Nutrition Suggestion

The recommendation feature is rule-based, not machine learning.

For each food, FitHealth evaluates realistic portion sizes against the user's remaining calories, protein, carbohydrates, and fat. It rewards useful nutrient coverage and penalizes overshooting the remaining target, then ranks the best candidates.

This makes the behavior deterministic and explainable during a project presentation.

## Weekly Health Score

The score is a consistency score for the last 7 days, not a medical assessment.

Current weighting:

| Component | Points |
| --- | ---: |
| Nutrition | 35 |
| Completed workouts | 25 |
| Running | 15 |
| Hydration | 15 |
| Weight tracking | 10 |
| Total | 100 |

## Database

Current application tables:

1. `users`
2. `health_profiles`
3. `foods`
4. `meal_entries`
5. `running_sessions`
6. `exercises`
7. `workout_plans`
8. `workout_exercises`
9. `weight_logs`
10. `water_logs`

Important design choices:

- `health_profiles` stores the latest health profile for each user.
- `weight_logs` stores historical weight values because one current weight is not enough for a trend.
- `water_logs` has one row per user per date and updates the daily total.
- Foreign keys use user ownership to keep each user's data separated.
- Existing deployed databases should be updated with migration files, not by re-running the destructive full schema.

## API overview

| Endpoint | Purpose |
| --- | --- |
| `POST /register` | Create account |
| `POST /login` | Authenticate and create session |
| `POST /logout` | End session |
| `GET /api/auth/me` | Read current authenticated user |
| `GET/POST/PUT /api/health-profile` | Health profile |
| `GET /api/foods` | Food database |
| `/api/meal-entries` | Meal tracking |
| `/api/exercises` | Exercise database |
| `/api/workout-plans` | Workout planner |
| `/api/running-sessions` | Running history |
| `GET/POST /api/weight-logs` | Weight history |
| `GET/POST /api/water-logs` | Water tracking |

## Local setup

Requirements:

- Java 17
- Maven
- MySQL
- Tomcat 11

Create/import the local `fithealth` database, then configure MySQL through environment variables.

```bash
export MYSQLHOST=localhost
export MYSQLPORT=3306
export MYSQLUSER=root
export MYSQLDATABASE=fithealth

read -rs "MYSQLPASSWORD?MySQL password: "
echo
export MYSQLPASSWORD
```

Do not commit a real database password. The repository version of `persistence.xml` must keep:

```text
ur_sql_password
```

Build:

```bash
mvn clean package
```

Deploy locally:

```bash
rm -rf /opt/homebrew/opt/tomcat/libexec/webapps/FitHealth
rm -f /opt/homebrew/opt/tomcat/libexec/webapps/FitHealth.war
cp target/FitHealth.war /opt/homebrew/opt/tomcat/libexec/webapps/FitHealth.war
/opt/homebrew/opt/tomcat/libexec/bin/catalina.sh run
```

Local URL:

```text
http://localhost:8080/FitHealth/
```

## Database migrations

For an existing database, run only the required migration files.

Examples:

```text
database/migration-add-health-insights.sql
database/migration-add-wellness-dashboard.sql
```

Do not run the full `database/schema.sql` against an existing production database because it contains table recreation statements.

## Railway deployment

The Docker image builds the Maven WAR and deploys it as Tomcat `ROOT.war`. Therefore production API paths start directly from the domain, for example:

```text
/api/health-profile
/api/water-logs
```

Railway MySQL connection values are read from environment variables by `JPAUtil`.

## Security implemented

- BCrypt password hashing
- Server-side HTTP session authentication
- Session rotation on successful login
- Authenticated user ID is taken from the session
- Backend input validation
- `Cache-Control: no-store` on authentication and sensitive JSON responses
- Database credentials are read from environment variables in deployment

## Scope / known limitations

This is a university course project, not a medical system.

The current scope does not include password recovery, email verification, CSRF tokens, rate limiting, production-grade connection pooling, or clinical recommendations. Those are appropriate future improvements if the application is extended beyond the course project.

## Project documentation

- `docs/VIVA_GUIDE.md` — common defense questions and concise answers
- `docs/FINAL_QA_CHECKLIST.md` — pre-submission and pre-demo test checklist
