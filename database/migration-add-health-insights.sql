-- FitHealth migration: weight progress support
-- Safe to run on an existing Railway database.

CREATE TABLE IF NOT EXISTS `weight_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `log_date` date NOT NULL,
  `weight` decimal(6,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_weight_user_date` (`user_id`,`log_date`),
  KEY `fk_weight_user` (`user_id`),
  CONSTRAINT `fk_weight_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
