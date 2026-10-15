-- FitHealth wellness dashboard migration
-- Adds target weight and daily water tracking.
-- Safe to run more than once.

SET @target_weight_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'health_profiles'
      AND COLUMN_NAME = 'target_weight'
);

SET @target_weight_sql = IF(
    @target_weight_exists = 0,
    'ALTER TABLE health_profiles ADD COLUMN target_weight DECIMAL(6,2) NULL AFTER goal',
    'SELECT 1'
);

PREPARE target_weight_stmt FROM @target_weight_sql;
EXECUTE target_weight_stmt;
DEALLOCATE PREPARE target_weight_stmt;

CREATE TABLE IF NOT EXISTS `water_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `log_date` date NOT NULL,
  `amount_ml` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_water_user_date` (`user_id`,`log_date`),
  KEY `fk_water_user` (`user_id`),
  CONSTRAINT `fk_water_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
