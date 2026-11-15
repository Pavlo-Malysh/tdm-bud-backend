# TDM BUD Backend

REST API for the website of the construction company **TDM BUD**. The server provides the project portfolio and client reviews, accepts requests (leads) from the website, and instantly sends a notification about each new lead to Telegram.

## Tech Stack

- **Node.js** (ES Modules) + **Express 5**
- **MongoDB** + **Mongoose**: data storage
- **Joi**: request body validation
- **http-errors**: HTTP errors
- **pino-http** / **pino-pretty**: request logging
- **cors**, **dotenv**
- **ESLint**, **Prettier**, **nodemon**: development tools

## Project Structure

```
src/
├── index.js                 # Entry point: connect to MongoDB → start the server
├── server.js                # Express setup: middleware, routers, error handling
├── routers/
│   └── projects.js          # All API routes (projects, reviews, leads)
├── controllers/
│   ├── projects.js          # Project controllers
│   ├── reviews.js           # Review controllers
│   └── leads.js             # Lead controllers + Telegram notification call
├── services/
│   └── projects.js          # Database access (CRUD for all collections)
├── db/
│   ├── initMongoDB.js       # MongoDB Atlas connection
│   └── models/
│       ├── project.js       # Project model
│       ├── reviews.js       # Review model
│       └── user.js          # Lead model
├── middlewares/
│   ├── validateBody.js      # Validates req.body against a Joi schema
│   ├── notifyTelegram.js    # Sends the lead to a Telegram bot
│   ├── notFoundHandler.js   # 404 for unknown routes
│   └── errorHandler.js      # Global error handler
├── validation/
│   └── project.js           # Joi schema for leads (createLeadSchema)
└── utils/
    ├── ctrlWrapper.js       # Controller wrapper (try/catch → next(err))
    └── getEnvVar.js         # Reads environment variables with an optional default
```

## API

Base URL: `http://localhost:3000` (default port, configurable via `PORT`)

### Projects

| Method  | Route                   | Description                       |
| ------- | ----------------------- | --------------------------------- |
| `GET`   | `/projects`             | List all projects                 |
| `GET`   | `/projects/:projectId`  | Get a project by ID (404 if none) |
| `POST`  | `/projects`             | Create a project                  |
| `PATCH` | `/projects/:projectId`  | Partially update a project        |

`Project` model:

```json
{
  "title": "string (required)",
  "description": "string",
  "cover": {
    "mobile": "string URL (required)",
    "desktop": "string URL (required)"
  },
  "photos": [{ "url": "string (required)", "caption": "string" }]
}
```

### Reviews

| Method | Route      | Description      |
| ------ | ---------- | ---------------- |
| `GET`  | `/reviews` | List all reviews |
| `POST` | `/reviews` | Create a review  |

`Review` model:

```json
{
  "title": "string (required)",
  "description": "string",
  "cover": "string URL (required)"
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

MongoDB adds the `createdAt` and `updatedAt` timestamps automatically.

## Response Format

Successful creation (`201`):

```json
{
  "status": 201,
  "message": "Successfully created a lead!",
  "data": { "...": "..." }
}
```

List retrieval (`200`):

```json
{ "data": [ ... ] }
```

Errors:

| Code  | When                    | Body                                                                           |
| ----- | ----------------------- | ------------------------------------------------------------------------------ |
| `400` | Validation failed       | `{ "status": 400, "message": "BadRequestError", "data": { "errors": [...] } }` |
| `404` | Resource not found      | `{ "status": 404, "message": "NotFoundError", "data": {...} }`                 |
| `404` | Unknown route           | `{ "message": "Route not found" }`                                             |
| `500` | Any other server error  | `{ "status": 500, "message": "Something went wrong", "data": "<error message>" }` |

## Author

Pavlo Malysh. License: ISC.