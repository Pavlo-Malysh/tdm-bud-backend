# TDM BUD Backend

REST API for the website of the construction company **TDM BUD**. It runs on **Cloudflare Workers**. The server provides the project portfolio and client reviews, accepts requests (leads) from the website, and sends a notification about each new lead to Telegram.

## Tech Stack

- **Cloudflare Workers** (`nodejs_compat`) + **Wrangler**
- **Hono**: web framework (routing, CORS, error handling)
- **MongoDB** (official `mongodb` driver): data storage
- **Joi**: request body validation
- **ESLint**, **Prettier**: development tools

## Project Structure

```
src/
├── index.js                 # Worker entry point: Hono app, CORS, routers, 404 and error handlers
├── routers/
│   ├── projects.js          # /projects routes
│   ├── reviews.js           # /reviews routes
│   └── leads.js             # /leads routes
├── controllers/
│   ├── projects.js          # Project controllers
│   ├── reviews.js           # Review controllers
│   └── leads.js             # Lead controllers + Telegram notification
├── services/
│   ├── projects.js          # Database access for the projects collection
│   ├── reviews.js           # Database access for the reviews collection
│   ├── leads.js             # Database access for the leads collection
│   └── telegram.js          # Sends a lead to a Telegram bot
├── db/
│   └── mongo.js             # MongoDB client (created once and reused between requests)
├── middlewares/
│   └── validateBody.js      # Validates the request body against a Joi schema
└── validation/
    └── project.js           # Joi schema for leads (createLeadSchema)
wrangler.toml                # Worker configuration
```

## How It Works

- The MongoDB connection string is built from the Worker bindings `MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_URL` and `MONGODB_DB`.
- The Telegram notification uses `TG_TOKEN` and `TG_CHAT_ID`. If either is missing, no message is sent.
- The notification runs through `executionCtx.waitUntil`, so the client gets the response without waiting for Telegram.
- Every created document gets `createdAt` and `updatedAt`; `PATCH` refreshes `updatedAt`.
- Only leads are validated. Projects and reviews are stored exactly as they are sent.

## API

Base URL: the Worker URL (`http://localhost:8787` when running `wrangler dev`).

### Projects

| Method  | Route                   | Description                                    |
| ------- | ----------------------- | ---------------------------------------------- |
| `GET`   | `/projects`             | List all projects                              |
| `GET`   | `/projects/:projectId`  | Get a project by ID (404 if not found)         |
| `POST`  | `/projects`             | Create a project                               |
| `PATCH` | `/projects/:projectId`  | Partially update a project (404 if not found)  |

Example project:

```json
{
  "title": "string",
  "description": "string",
  "cover": {
    "mobile": "string URL",
    "desktop": "string URL"
  },
  "photos": [{ "url": "string", "caption": "string" }]
}
```

### Reviews

| Method | Route      | Description      |
| ------ | ---------- | ---------------- |
| `GET`  | `/reviews` | List all reviews |
| `POST` | `/reviews` | Create a review  |

Example review:

```json
{
  "title": "string",
  "description": "string",
  "cover": "string URL"
}
```

### Leads

| Method | Route    | Description                                             |
| ------ | -------- | ------------------------------------------------------- |
| `GET`  | `/leads` | List all leads                                          |
| `POST` | `/leads` | Create a lead (with validation + Telegram notification) |

`POST /leads` request body:

```json
{
  "username": "Ivan",
  "phone": "067 123 45 67"
}
```

Validation rules (Joi):

- `username`: string, trimmed, 3 to 30 characters, required.
- `phone`: all non-digit characters are removed, then it must match `380XXXXXXXXX` or `0XXXXXXXXX` and is normalized to `+380XXXXXXXXX`. Required.
- Unknown fields are stripped (`stripUnknown`), and all errors are returned at once (`abortEarly: false`).

Validation error messages are in Ukrainian.

After the lead is saved, the bot sends this message to Telegram (in Ukrainian):

```
🏠 Нова заявка TDM BUD

👤 Імʼя: Ivan
📞 Телефон: +380671234567
```

## Response Format

Success (`200`):

```json
{ "status": 200, "data": [ ... ] }
```

Creation (`201`):

```json
{
  "status": 201,
  "message": "Successfully created a lead!",
  "data": { "_id": "...", "...": "..." }
}
```

Errors:

| Code  | When                    | Body                                                       |
| ----- | ----------------------- | ---------------------------------------------------------- |
| `400` | Validation failed       | `{ "status": 400, "message": "Bad Request", "errors": [...] }` |
| `404` | Project not found       | `{ "status": 404, "message": "Project not found" }`        |
| `404` | Unknown route           | `{ "status": 404, "message": "Route not found" }`          |
| `500` | Any other server error  | `{ "status": 500, "message": "Something went wrong" }`     |

## Author

Pavlo Malysh. License: ISC.
