# 🧩 Template for Completing the Test Task

## Description

This template is designed to reduce the effort required to complete the test task.

It includes pre-configured containers for `PostgreSQL` and a `Node.js` application.
The app interacts with the database using `knex.js`.
The `app` container uses a `build` step for a TypeScript application, but JavaScript can also be used.

**This template is not mandatory!**
You can use it as-is or modify it to your liking.

All settings can be found in the following files:

* `compose.yaml`
* `Dockerfile`
* `package.json`
* `tsconfig.json`
* `src/config/env/env.ts`
* `src/config/knex/knexfile.ts`
---

## 🔧 Environment Variables (`.env`)

Create a `.env` file in the root of your project with the following content:

```env
# PostgreSQL Configuration
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# App Configuration
APP_PORT=5000
NODE_ENV=development

# Wildberries API
WB_API_TOKEN=

# Google Sheets Configuration
GOOGLE_SHEET_IDS=sheet_1,sheet_2
GOOGLE_CREDENTIALS_JSON='{
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": ""
}'
```

> ⚠️ **Important:** Ensure the `GOOGLE_CREDENTIALS_JSON` value is properly escaped.
> Alternatively, you can store the credentials in a separate JSON file and reference its path for better readability and security.

---

## Commands:

Start the database:

```bash
docker compose up -d --build postgres
```

To run migrations and seeds outside the container:

```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```

You can also use other Knex commands (`migrate make <name>`, `migrate up`, `migrate down`, etc.)

To run the application in development mode:

```bash
npm run dev
```

Run the app container for testing:

```bash
docker compose up -d --build app
```

For a clean final check, it is recommended to run:

```bash
docker compose down --rmi local --volumes
docker compose up --build
```


