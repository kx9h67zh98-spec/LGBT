# FitHealth migration: Railway -> Render + external MySQL-compatible database

This is a preparation guide, **not** evidence that the app or DB is online.
No production database has been copied or modified.

## A. Protect the current Railway database first

- The original Railway project is `renewed-tranquility`, with service `MySQL` and persistent volume `mysql-volume`.
- **Do not delete the project, MySQL service, or volume.**
- If the trial has expired, use Railway Workspace > Plans to check whether **Downgrade to Free** is available. If no suitable free restore option is available, evaluate the minimum paid option for a one-time export. Railway trial volumes may be deleted after 30 days.
- If MySQL is able to run again, export using a trusted local terminal (with credentials provided privately through Railway Variables, not saved in Git):

```bash
# Set MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
# from the public TCP proxy information and Railway Variables.
# Never paste secrets into a ticket, screenshot, or commit.
MYSQL_PWD="$MYSQLPASSWORD" mysqldump \
  --host="$MYSQLHOST" --port="$MYSQLPORT" --user="$MYSQLUSER" \
  --single-transaction --routines --triggers --no-tablespaces \
  --set-gtid-purged=OFF "$MYSQLDATABASE" > fithealth-backup.sql

# Check that backup is not empty and contains expected CREATE TABLE statements.
ls -lh fithealth-backup.sql
```

Do not use the checked-in `database/schema.sql` to update an existing populated database: it has DROP TABLE statements.

## B. Create an independent cloud database

1. In TiDB Cloud, create a **MySQL-compatible Starter** instance within its free allowance.
2. Create a database named `fithealth`, or use the database created in your account.
3. Get Host, Port, Database, Username and Password from TiDB's **Connect** dialog. Keep secrets in the hosting dashboard only.
4. If preserving prior Railway data, restore a sanitized SQL dump into a newly created **empty** database and validate table counts and row counts before changing production traffic.
5. If starting over with a new DB, do **not** blindly run `database/schema.sql` on a nonempty target. Verify the current Flyway baseline/init scripts and test them separately.
6. TiDB uses the MySQL protocol, but is not identical to MySQL. Verify schema, Hibernate compatibility and Flyway migrations on a throwaway database first.

TiDB Cloud Starter requires an encrypted public JDBC connection. The patched `JPAUtil` supports `MYSQL_SSL_MODE=VERIFY_IDENTITY`. It defaults to `DISABLED` for compatibility with existing local/Railway settings; set the secure mode explicitly for an external database.

## C. Deploy the Dockerized backend to Render

1. Connect GitHub to Render.
2. Use **New > Blueprint** and select this repo and the `render.yaml` file, or create a **Web Service** with **Docker** and select this repo/branch.
3. Choose the **Free** web-service plan and keep the HTTP port set to **8080** (Tomcat's current Dockerfile listens there).
4. Enter all five required database values shown in `render.yaml`. **Never commit real secrets**.
5. Set `APP_BASE_URL` to the final `https://<your-service>.onrender.com` URL if the account/email flows require it. Configure SMTP secrets and verification settings separately.
6. Verify successful Maven build, Tomcat startup, Flyway migration and JDBC connection in logs.
7. Open `https://<your-service>.onrender.com/` and test registration/login, account verification, nutrition write/read, weekly menu, and session behavior.
8. After tests pass, merge this branch to `main` and point auto-deploy at `main`.

The Docker image serves the WAR at `/`, so API endpoints are at `/api/...`, not `/FitHealth/api/...`.

## Known limitations and cautions

- Render Free sleeps after approximately 15 minutes without traffic, and the first request can take about a minute. In-memory Tomcat sessions can be lost when the instance restarts.
- The free web service has ephemeral local storage. Store persistent application data in the external database.
- TiDB Cloud Starter has monthly RU and storage limits; it is not a guarantee of unrestricted $0 production service.
- Current `pom.xml` uses Flyway MySQL modules; TiDB recognition and migrations must be tested against a real TiDB instance before describing the integration as finished.
- Existing user data requires a validated backup/restore; deploying only a new schema would lose the history from Railway.

Reference: https://render.com/docs/free and https://docs.pingcap.com/tidbcloud/serverless-limitations/
