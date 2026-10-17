# FitHealth Viva / Defense Guide

This guide is based on the current FitHealth implementation.

## 1. What is the overall architecture?

FitHealth uses a layered web architecture:

```text
Frontend -> Servlet API -> DAO -> JPA/Hibernate -> MySQL
```

HTML/CSS/JavaScript handles presentation. Java Servlets receive HTTP requests and return JSON. DAO classes contain persistence operations. JPA/Hibernate maps Java entities to MySQL tables.

## 2. Why use Servlets instead of connecting JavaScript directly to MySQL?

A browser must not receive database credentials or connect directly to MySQL. The Servlet layer validates requests, checks authentication, applies business rules, and controls what data the client can read or change.

## 3. How is authentication implemented?

After a successful login, the server creates an HTTP session and stores the authenticated user's ID and basic account fields in it. Protected APIs read `userId` from the session.

The client does not choose which user ID to query.

## 4. How do you reduce session-fixation risk?

On successful login, an existing session is invalidated and a new session is created before user attributes are stored.

## 5. How are passwords stored?

Passwords are hashed with BCrypt before being persisted. Plain-text passwords are not stored in MySQL.

## 6. Why is password length limited?

BCrypt has an effective input limit around 72 bytes. Registration validates the UTF-8 byte length so two long passwords are not accidentally treated as equivalent after truncation.

## 7. Why is `EntityManagerFactory` shared but `EntityManager` created per operation?

Creating `EntityManagerFactory` is expensive, so FitHealth creates it once in `JPAUtil`. `EntityManager` is lightweight and not intended to be shared across concurrent requests, so DAO operations create and close their own instance.

## 8. Why use `RESOURCE_LOCAL` transactions?

The project runs directly in Tomcat rather than a full Jakarta EE application server with JTA. DAO methods explicitly begin, commit, and roll back local database transactions.

## 9. Why keep Health Profile and Weight Log separate?

`health_profiles.weight` represents the current profile value.

A trend requires historical values, so `weight_logs` stores dated measurements. If every old value were overwritten in `health_profiles`, a weight chart would be impossible.

## 10. Why does `water_logs` use one row per user per day?

The application tracks a daily total. A unique `(user_id, log_date)` rule avoids duplicate daily summary rows and lets quick-add operations update the same record.

## 11. What happens when a user saves weight twice on the same day?

Weight history uses one record per user/date. The DAO updates the existing row instead of creating a duplicate for the same day.

## 12. Where are BMI/BMR/TDEE calculated?

They are calculated by the Java backend in the Health Profile flow. The frontend displays the server result.

Keeping the calculation on the backend avoids different formulas being used by different clients.

## 13. Which BMR equation is used?

Mifflin-St Jeor.

```text
Base = 10W + 6.25H - 5A
Male:   Base + 5
Female: Base - 161
```

Then:

```text
TDEE = BMR x activity level
```

## 14. How are calorie goals calculated?

```text
Lose:     max(TDEE - 500, 1200)
Maintain: TDEE
Gain:     TDEE + 300
```

These are application estimates, not medical prescriptions.

## 15. Is Smart Nutrition an AI model?

No.

It is a deterministic rule-based recommendation algorithm. It calculates nutrients still needed for the selected day, tests candidate portion sizes, scores how well each candidate covers the remaining targets, penalizes overshoot, and returns the best matches.

Calling it rule-based is more accurate and easier to defend than claiming machine learning.

## 16. Why is rule-based recommendation useful here?

The current food database is small and structured. A deterministic algorithm is fast, explainable, requires no training data, and produces repeatable results.

## 17. What does Weekly Nutrition Insight do?

It loads seven days of meal data, calculates average calories/macros, compares them with Health Profile targets, and identifies weaker target coverage.

## 18. What is Weekly Health Score?

It is a 0-100 consistency score based on data recorded in FitHealth:

- Nutrition: 35
- Workouts: 25
- Running: 15
- Hydration: 15
- Weight tracking: 10

It is explicitly not a medical score.

## 19. Why is the hydration target 2,500 ml?

It is an application tracking goal used to make the hydration UI measurable. The interface states that it is not an individualized medical recommendation.

A production health product should let the target be personalized and should use appropriate health guidance.

## 20. How does Goal Progress work?

The first available weight log is treated as the starting weight. FitHealth compares movement from that start toward `target_weight`.

Progress is direction-aware. For a weight-loss target, moving downward increases progress; for a weight-gain target, moving upward increases progress. Passing the target is clamped to 100%.

## 21. Why is `target_weight` nullable?

A target is optional. Users can still calculate BMI/BMR/TDEE and track their current health profile without setting a weight goal.

## 22. Why use migration files instead of running `schema.sql` in production?

The full schema contains destructive table recreation statements. A migration makes only the required incremental change and preserves existing production data.

## 23. Why is the local URL different from Railway?

Local Tomcat deploys `FitHealth.war`, so the context path is:

```text
/FitHealth/
```

The Docker production image deploys the same application as `ROOT.war`, so Railway serves it from:

```text
/
```

Frontend API URLs are constructed relative to the current application path so both environments work.

## 24. What is the role of `persistence.xml`?

It defines the JPA persistence unit, provider, mapped entities, JDBC defaults, and Hibernate settings.

In Railway, `JPAUtil` overrides JDBC connection properties with environment variables.

## 25. Why is the database password in `persistence.xml` only a placeholder?

Real credentials must not be committed to Git. Local/production secrets are supplied separately through environment variables.

## 26. Why do APIs return JSON?

The frontend is a JavaScript client. JSON provides a simple, standard representation of success flags, messages, entities, and lists.

## 27. What database relationships exist?

Examples include:

- User -> HealthProfile: one-to-one
- User -> MealEntry: one-to-many
- User -> RunningSession: one-to-many
- User -> WorkoutPlan: one-to-many
- WorkoutPlan -> WorkoutExercise: one-to-many
- Exercise -> WorkoutExercise: many-to-one from workout entries
- User -> WeightLog: one-to-many
- User -> WaterLog: one-to-many

## 28. How is user data isolated?

Queries include the authenticated user ID. Update/delete operations verify ownership instead of trusting an ID supplied by the browser alone.

## 29. What happens if a DAO write fails?

Write operations use transactions. On a runtime exception, an active transaction is rolled back and the `EntityManager` is closed in `finally`.

## 30. Why not use a single global `EntityManager`?

`EntityManager` is not designed to be shared safely across concurrent servlet requests and it holds persistence-context state. Per-operation instances avoid request-to-request state leakage.

## 31. What is one production limitation of the current database setup?

Hibernate's simple built-in connection handling is acceptable for a course project but is not the preferred production pool. A larger deployment should use a production-grade pool such as HikariCP and tune connection limits.

## 32. Is CSRF protection implemented?

Not currently.

The application uses same-origin session-based requests, but a production system should add explicit CSRF protection for state-changing operations.

This is a known scope limitation rather than something to hide during the defense.

## 33. Is rate limiting implemented?

Not currently. A production system should rate-limit login and account creation attempts.

## 34. Why is password recovery not available?

It is outside the current course scope because secure recovery requires identity verification, time-limited tokens, email delivery, expiry, and replay protection.

## 35. What would you improve next?

Good answers:

- Automated unit/integration tests
- CSRF protection and login rate limiting
- Production-grade connection pooling
- Email verification/password recovery
- More food data and dietary/allergy filters
- Personalized hydration target
- Better observability and application metrics

Avoid saying that the next step is simply "add AI." The current explainable rule-based logic matches the available dataset and project scope well.
