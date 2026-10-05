-- MySQL dump 10.13  Distrib 8.4.11, for macos15 (arm64)
--
-- Host: localhost    Database: fithealth
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (1,'Chicken Breast','Protein','per100g',NULL,NULL,165.00,31.00,0.00,3.60,1,0),(2,'Chicken Thigh','Protein','per100g',NULL,NULL,209.00,26.00,0.00,11.00,1,0),(3,'Beef','Protein','per100g',NULL,NULL,250.00,26.00,0.00,15.00,1,0),(4,'Salmon','Protein','per100g',NULL,NULL,208.00,20.00,0.00,13.00,1,0),(5,'Egg','Protein','per100g',NULL,NULL,155.00,13.00,1.10,11.00,1,0),(6,'White Rice','Carbohydrates','per100g',NULL,NULL,130.00,2.70,28.00,0.30,0,0),(7,'Brown Rice','Carbohydrates','per100g',NULL,NULL,123.00,2.70,25.60,1.00,0,0),(8,'Sweet Potato','Carbohydrates','per100g',NULL,NULL,86.00,1.60,20.00,0.10,1,0),(9,'Oats','Carbohydrates','per100g',NULL,NULL,389.00,16.90,66.30,6.90,0,0),(10,'Pasta','Carbohydrates','per100g',NULL,NULL,131.00,5.00,25.00,1.10,0,0),(11,'Banana','Fruit','per100g',NULL,NULL,89.00,1.10,22.80,0.30,0,0),(12,'Apple','Fruit','per100g',NULL,NULL,52.00,0.30,13.80,0.20,0,0),(13,'Avocado','Fruit','per100g',NULL,NULL,160.00,2.00,8.50,14.70,0,0),(14,'Broccoli','Vegetable','per100g',NULL,NULL,35.00,2.40,7.20,0.40,1,0),(15,'Greek Yogurt','Dairy','per100g',NULL,NULL,59.00,10.00,3.60,0.40,0,0),(16,'Milk','Dairy','per100g',NULL,NULL,61.00,3.20,4.80,3.30,0,0),(17,'NutraBio Whey Protein','Supplements','serving','scoop',32.00,120.00,25.00,2.00,1.00,0,1);
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-05  8:07:41

-- =========================================================
-- FitHealth exercise seed (53 exercises)
-- =========================================================

INSERT INTO exercises
    (name, muscle_group, equipment, difficulty, exercise_type, video_url)
VALUES
    ('Push Up', 'Chest', 'Bodyweight', 'Beginner', 'Strength', NULL);

INSERT INTO exercises
    (name, muscle_group, equipment, difficulty, exercise_type, video_url)
VALUES
    ('Machine Chest Press', 'Chest', 'Chest Press Machine', 'Beginner', 'Compound', NULL),
    ('Barbell Bench Press', 'Chest', 'Barbell + Flat Bench', 'Intermediate', 'Compound', NULL),
    ('Incline Dumbbell Press', 'Upper Chest', 'Dumbbells + Adjustable Bench', 'Intermediate', 'Compound', NULL),
    ('Cable Crossover', 'Chest', 'Cable Machine', 'Intermediate', 'Isolation', NULL),
    ('Chest Dip', 'Chest', 'Dip Station', 'Intermediate', 'Compound', NULL),
    ('Machine Shoulder Press', 'Shoulders', 'Shoulder Press Machine', 'Beginner', 'Compound', NULL),
    ('Dumbbell Lateral Raise', 'Lateral Deltoids', 'Dumbbells', 'Beginner', 'Isolation', NULL),
    ('Dumbbell Shoulder Press', 'Shoulders', 'Dumbbells + Bench', 'Intermediate', 'Compound', NULL),
    ('Face Pull', 'Rear Deltoids', 'Cable Machine + Rope', 'Beginner', 'Compound', NULL),
    ('Dumbbell Biceps Curl', 'Biceps', 'Dumbbells', 'Beginner', 'Isolation', NULL),
    ('Hammer Curl', 'Biceps', 'Dumbbells', 'Beginner', 'Isolation', NULL),
    ('Barbell Biceps Curl', 'Biceps', 'Barbell', 'Intermediate', 'Isolation', NULL),
    ('Chin Up', 'Biceps', 'Pull-Up Bar', 'Intermediate', 'Compound', NULL),
    ('Rope Triceps Pushdown', 'Triceps', 'Cable Machine + Rope', 'Beginner', 'Isolation', NULL),
    ('Overhead Cable Triceps Extension', 'Triceps', 'Cable Machine + Rope', 'Beginner', 'Isolation', NULL),
    ('Skull Crusher', 'Triceps', 'EZ Bar + Bench', 'Intermediate', 'Isolation', NULL),
    ('Close-Grip Bench Press', 'Triceps', 'Barbell + Bench', 'Intermediate', 'Compound', NULL),
    ('Wrist Curl', 'Forearms', 'Dumbbells', 'Beginner', 'Isolation', NULL),
    ('Reverse Wrist Curl', 'Forearms', 'Dumbbells', 'Beginner', 'Isolation', NULL),
    ('Farmer''s Carry', 'Forearms', 'Dumbbells', 'Intermediate', 'Compound', NULL),
    ('Crunch', 'Abdominals', 'Bodyweight', 'Beginner', 'Isolation', NULL),
    ('Plank', 'Abdominals', 'Bodyweight', 'Beginner', 'Isometric', NULL),
    ('Hanging Leg Raise', 'Abdominals', 'Pull-Up Bar', 'Advanced', 'Compound', NULL),
    ('Side Plank', 'Obliques', 'Bodyweight', 'Beginner', 'Isometric', NULL),
    ('Cable Wood Chop', 'Obliques', 'Cable Machine', 'Intermediate', 'Compound', NULL),
    ('Russian Twist', 'Obliques', 'Bodyweight', 'Intermediate', 'Compound', NULL),
    ('Bodyweight Squat', 'Quadriceps', 'Bodyweight', 'Beginner', 'Compound', NULL),
    ('Leg Extension', 'Quadriceps', 'Leg Extension Machine', 'Beginner', 'Isolation', NULL),
    ('Leg Press', 'Quadriceps', 'Leg Press Machine', 'Beginner', 'Compound', NULL),
    ('Barbell Back Squat', 'Quadriceps', 'Barbell + Squat Rack', 'Intermediate', 'Compound', NULL),
    ('Standing Tibialis Raise', 'Tibialis Anterior', 'Bodyweight + Wall', 'Beginner', 'Isolation', NULL),
    ('Resistance Band Dorsiflexion', 'Tibialis Anterior', 'Resistance Band', 'Beginner', 'Isolation', NULL),
    ('Standing Calf Raise', 'Calves', 'Bodyweight', 'Beginner', 'Isolation', NULL),
    ('Seated Calf Raise', 'Calves', 'Seated Calf Raise Machine', 'Beginner', 'Isolation', NULL),
    ('Dumbbell Shrug', 'Trapezius', 'Dumbbells', 'Beginner', 'Isolation', NULL),
    ('Barbell Shrug', 'Trapezius', 'Barbell', 'Beginner', 'Isolation', NULL),
    ('Face Pull', 'Trapezius', 'Cable Machine + Rope', 'Beginner', 'Compound', NULL),
    ('Lat Pulldown', 'Latissimus Dorsi', 'Lat Pulldown Machine', 'Beginner', 'Compound', NULL),
    ('Pull Up', 'Latissimus Dorsi', 'Pull-Up Bar', 'Intermediate', 'Compound', NULL),
    ('Single-Arm Dumbbell Row', 'Latissimus Dorsi', 'Dumbbell + Bench', 'Intermediate', 'Compound', NULL),
    ('Bird Dog', 'Lower Back', 'Bodyweight', 'Beginner', 'Stability', NULL),
    ('Back Extension', 'Lower Back', 'Roman Chair', 'Beginner', 'Compound', NULL),
    ('Barbell Deadlift', 'Posterior Chain', 'Barbell', 'Intermediate', 'Compound', NULL),
    ('Glute Bridge', 'Glutes', 'Bodyweight', 'Beginner', 'Compound', NULL),
    ('Cable Glute Kickback', 'Glutes', 'Cable Machine', 'Beginner', 'Isolation', NULL),
    ('Barbell Hip Thrust', 'Glutes', 'Barbell + Bench', 'Intermediate', 'Compound', NULL),
    ('Seated Leg Curl', 'Hamstrings', 'Seated Leg Curl Machine', 'Beginner', 'Isolation', NULL),
    ('Romanian Deadlift', 'Hamstrings', 'Barbell', 'Intermediate', 'Compound', NULL),
    ('Nordic Hamstring Curl', 'Hamstrings', 'Bodyweight + Ankle Support', 'Advanced', 'Compound', NULL),
    ('Hip Adduction', 'Adductors', 'Hip Adduction Machine', 'Beginner', 'Isolation', NULL),
    ('Sumo Squat', 'Adductors', 'Bodyweight or Dumbbell', 'Beginner', 'Compound', NULL),
    ('Copenhagen Plank', 'Adductors', 'Bench', 'Advanced', 'Isometric', NULL);

