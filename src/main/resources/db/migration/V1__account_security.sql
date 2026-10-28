-- FitHealth account security migration.
-- Existing users are marked verified so the rollout does not lock out current accounts.

ALTER TABLE users
    ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 1 AFTER password_hash,
    ADD COLUMN email_verified_at TIMESTAMP NULL DEFAULT NULL AFTER email_verified;

UPDATE users
SET email_verified = 1,
    email_verified_at = COALESCE(email_verified_at, created_at);

ALTER TABLE users
    MODIFY COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0;

CREATE TABLE account_tokens (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token_hash CHAR(64) NOT NULL,
    purpose VARCHAR(32) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_account_token_hash (token_hash),
    KEY idx_account_token_user_purpose (user_id, purpose, expires_at),
    CONSTRAINT fk_account_token_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
