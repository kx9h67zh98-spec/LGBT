# Move FitHealth from Railway MySQL to TiDB Cloud Starter

This guide keeps FitHealth on the MySQL protocol and avoids rewriting DAO/JPA code.

## 1. Create a free TiDB Cloud Starter instance

- Choose **Starter**
- Compatibility mode: **MySQL Compatible**
- Keep the spending limit at **0** if you want to stay within the free quota
- Open the instance and click **Connect**
- Generate a password
- Keep these values privately:
  - Host
  - Port (normally 4000)
  - Username (Starter usernames usually include an instance prefix)
  - Password

## 2. Create the FitHealth database

Open TiDB Cloud SQL Editor and run:

```sql
CREATE DATABASE IF NOT EXISTS fithealth
    CHARACTER SET utf8mb4;
```

Then select the `fithealth` database.

## 3A. Preserve existing Railway data

If the old Railway MySQL service still accepts connections, export it locally:

```bash
mysqldump \
  -h <RAILWAY_PUBLIC_HOST> \
  -P <RAILWAY_PUBLIC_PORT> \
  -u <RAILWAY_MYSQL_USER> \
  -p \
  --single-transaction \
  --set-gtid-purged=OFF \
  <RAILWAY_DATABASE_NAME> \
  > fithealth_railway_backup.sql
```

Do not commit this backup to Git if it contains user/account data.

Import the dump into TiDB with the connection values shown by TiDB Cloud:

```bash
mysql \
  -h <TIDB_HOST> \
  -P 4000 \
  -u '<TIDB_USER>' \
  -p \
  --ssl-mode=VERIFY_IDENTITY \
  fithealth \
  < fithealth_railway_backup.sql
```

If the raw MySQL dump contains unsupported dump-only statements, create the base schema with `database/tidb-bootstrap.sql` first and migrate table data separately.

## 3B. Fresh database without preserving old user data

Run these two files in this order:

1. `database/tidb-bootstrap.sql`
2. `database/tidb-seed.sql`

The application will then run Flyway automatically on first database connection and apply the account-security migration.

## 4. Configure the application

Preferred FitHealth variables:

```text
TIDB_HOST=<host shown in TiDB Connect>
TIDB_PORT=4000
TIDB_DATABASE=fithealth
TIDB_USER=<full TiDB username including instance prefix>
TIDB_PASSWORD=<TiDB password>

DB_POOL_MAX=10
DB_POOL_MIN_IDLE=2
DB_POOL_CONNECTION_TIMEOUT_MS=10000
DB_POOL_IDLE_TIMEOUT_MS=600000
DB_POOL_MAX_LIFETIME_MS=1500000
HIBERNATE_SHOW_SQL=false
```

FitHealth automatically builds a TLS JDBC connection using:

```text
sslMode=VERIFY_IDENTITY
enabledTLSProtocols=TLSv1.2,TLSv1.3
```

You can alternatively supply a complete JDBC URL through `DB_JDBC_URL`.

Example shape:

```text
jdbc:mysql://<host>:4000/fithealth?serverTimezone=UTC&tcpKeepAlive=true&sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3
```

Keep the password in the hosting provider's secret/environment-variable UI. Never commit it to Git.

## 5. Remove old Railway MySQL variables

After TiDB is working, remove or stop using:

```text
MYSQLHOST
MYSQLPORT
MYSQLDATABASE
MYSQLUSER
MYSQLPASSWORD
```

The new `TIDB_*` variables take priority.

## 6. Verify

After restart/deploy:

- Register or log in
- Open Health & Nutrition
- Load foods
- Generate the weekly meal menu
- Save a meal
- Open Calendar
- Restart the application and confirm data remains

If all of these work, FitHealth is no longer dependent on Railway MySQL.
