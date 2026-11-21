-- FitHealth bootstrap schema for a fresh TiDB Cloud Starter database.
-- This creates the pre-security base schema. Flyway V1 then adds
-- email verification fields and account_tokens automatically.

CREATE DATABASE IF NOT EXISTS fithealth
    CHARACTER SET utf8mb4;

USE fithealth;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS foods (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    nutrition_type VARCHAR(30) NOT NULL,
    serving_unit VARCHAR(30) DEFAULT NULL,
    serving_size DECIMAL(8,2) DEFAULT NULL,
    calories DECIMAL(10,2) NOT NULL,
    protein DECIMAL(10,2) NOT NULL,
    carbs DECIMAL(10,2) NOT NULL,
    fat DECIMAL(10,2) NOT NULL,
    cooking_required TINYINT(1) DEFAULT 0,
    is_supplement TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exercises (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    muscle_group VARCHAR(100) NOT NULL,
    equipment VARCHAR(100) DEFAULT NULL,
    difficulty VARCHAR(50) DEFAULT NULL,
    exercise_type VARCHAR(50) DEFAULT NULL,
    video_url VARCHAR(500) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS health_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    height DECIMAL(6,2) NOT NULL,
    weight DECIMAL(6,2) NOT NULL,
    activity_level DECIMAL(5,3) NOT NULL,
    goal VARCHAR(30) NOT NULL,
    target_weight DECIMAL(6,2) DEFAULT NULL,
    bmi DECIMAL(6,2) DEFAULT NULL,
    bmr DECIMAL(10,2) DEFAULT NULL,
    tdee DECIMAL(10,2) DEFAULT NULL,
    target_calories DECIMAL(10,2) DEFAULT NULL,
    protein_target DECIMAL(10,2) DEFAULT NULL,
    carbs_target DECIMAL(10,2) DEFAULT NULL,
    fat_target DECIMAL(10,2) DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_health_user (user_id),
    CONSTRAINT fk_health_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS weight_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    log_date DATE NOT NULL,
    weight DECIMAL(6,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_weight_user_date (user_id, log_date),
    CONSTRAINT fk_weight_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS water_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    log_date DATE NOT NULL,
    amount_ml INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_water_user_date (user_id, log_date),
    CONSTRAINT fk_water_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS meal_entries (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    food_id BIGINT DEFAULT NULL,
    entry_date DATE NOT NULL,
    meal_type VARCHAR(30) NOT NULL,
    food_name VARCHAR(150) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    cooking_method VARCHAR(50) DEFAULT NULL,
    preparation VARCHAR(100) DEFAULT NULL,
    oil_amount DECIMAL(10,2) DEFAULT 0.00,
    calories DECIMAL(10,2) NOT NULL,
    protein DECIMAL(10,2) NOT NULL,
    carbs DECIMAL(10,2) NOT NULL,
    fat DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_meal_user (user_id),
    KEY idx_meal_food (food_id),
    CONSTRAINT fk_meal_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_meal_food
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS running_sessions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    run_date DATE NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL,
    average_speed DECIMAL(10,2) DEFAULT NULL,
    average_pace DECIMAL(10,2) DEFAULT NULL,
    calories DECIMAL(10,2) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_running_user (user_id),
    CONSTRAINT fk_running_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS workout_plans (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    workout_date DATE NOT NULL,
    workout_name VARCHAR(150) DEFAULT NULL,
    completed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_workout_user (user_id),
    CONSTRAINT fk_workout_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS workout_exercises (
    id BIGINT NOT NULL AUTO_INCREMENT,
    workout_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    sets INT DEFAULT 0,
    reps INT DEFAULT 0,
    weight DECIMAL(8,2) DEFAULT 0.00,
    completed TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_workout_exercise_plan (workout_id),
    KEY idx_workout_exercise (exercise_id),
    CONSTRAINT fk_workout_exercise_plan
        FOREIGN KEY (workout_id)
        REFERENCES workout_plans(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_workout_exercise
        FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
