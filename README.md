# InstaLite

A lightweight Instagram-style REST API built with **Express 5** and **Prisma 7** (PostgreSQL). It lets you create users, publish posts, and manage both with full CRUD endpoints — a great starting point for learning backend development with Prisma.

## Tech stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Runtime   | Node.js (CommonJS)                  |
| Framework | Express 5                           |
| Database  | PostgreSQL                          |
| ORM       | Prisma 7 (with the `pg` adapter)    |
| Config    | `dotenv` (`.env` file)              |

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ installed — check with `node -v`
- **A PostgreSQL database** you can connect to. Local install works, or use any managed Postgres (Neon, Supabase, Railway, etc.)
- **npm** (ships with Node)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/SharanyoBanerjee/Instalite.git
cd Instalite
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your database connection string:

```bash
cp .env.example .env
```

Then open `.env` and set:

```ini
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

> Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your Postgres credentials. If you use a local install, it usually looks like `postgresql://postgres:mypassword@localhost:5432/instalite?schema=public`.
>
> ⚠️ Never commit your real `.env` file — it is already listed in `.gitignore`.

### 4. Generate the Prisma client and set up the database

```bash
# Generate the Prisma client from prisma/schema.prisma
npx prisma generate

# Create the database tables using the existing migrations
npx prisma migrate deploy
```

If you are setting up locally and want to experiment with schema changes, use `npx prisma migrate dev` instead.

### 5. (Optional) Seed the database

This resets the `User` and `Post` tables and inserts one sample user and one sample post:

```bash
npm run seed
```

### 6. Start the server

```bash
npm start
```

You should see `Server started on port 3000`. Everything below assumes the base URL `http://localhost:3000`.

### 7. Verify it's running

```bash
curl http://localhost:3000/health
# → {"status":"OK"}
```

## API reference

### Health

| Method | Endpoint  | Description        |
| ------ | --------- | ------------------ |
| GET    | `/health` | Service health check |

### Users

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/users`            | Create a user      |
| GET    | `/users`            | List all users     |
| GET    | `/users/:id`        | Get one user by id |
| PATCH  | `/users/:id`        | Update a user      |
| DELETE | `/users/:id`        | Delete a user      |

Create a user — `username`, `email`, and `fullname` are required:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"riya_travels","email":"riya@example.com","fullname":"Riya Sharma","bio":"Traveler"}'
```

```
201 Created → {"id":1,"username":"riya_travels","email":"riya@example.com","fullname":"Riya Sharma","bio":"Traveler","isPrivate":false}
```

Update a user — all fields are optional, only send the ones you want changed:

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"bio":"Photographer on the move","isPrivate":true}'
```

Delete a user:

```bash
curl -X DELETE http://localhost:3000/users/1
```

```
204 No Content
```

### Posts

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/posts`            | Create a post      |
| GET    | `/posts`            | List all posts     |
| GET    | `/posts/:id`        | Get one post by id |
| PATCH  | `/posts/:id`        | Update a post      |
| DELETE | `/posts/:id`        | Delete a post      |

Create a post — `imageUrl` is required:

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e","caption":"Sunset at the beach","location":"Goa"}'
```

```
201 Created → {"id":1,"imageUrl":"...","caption":"Sunset at the beach","location":"Goa"}
```

Update a post:

```bash
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"caption":"Golden hour at Palolem"}'
```

Delete a post:

```bash
curl -X DELETE http://localhost:3000/posts/1
```

```
204 No Content
```

### Error responses

| Status | When it happens                                  |
| ------ | ------------------------------------------------ |
| 400    | Required fields missing (`username`/`email`/`fullname` or `imageUrl`) |
| 404    | Id does not exist, or the id is not a number     |
| 409    | Creating a user with a `username` or `email` that is already taken |
| 500    | Unexpected server/database error                 |

## Data model

Defined in `prisma/schema.prisma`:

```
User    id, username (unique), email (unique), fullname, bio?, isPrivate, createdAt, updatedAt
Post    id, imageUrl, caption?, location?, createdAt, updatedAt
```

> Currently, posts are not linked to users — see the roadmap below.

## Project structure

```
├── index.js                     # Entry point (re-exports src/index.js)
├── src/
│   ├── index.js                 # Starts the Express server on port 3000
│   ├── app.js                   # Express app: JSON parsing + routes
│   ├── db.js                    # Prisma client wired to PostgreSQL via the pg adapter
│   ├── seed.js                  # Resets and seeds the database (npm run seed)
│   ├── routes/                  # Route definitions (users, posts)
│   ├── controllers/             # Request handling, validation, HTTP codes
│   └── services/                # Database access via Prisma
├── prisma/
│   ├── schema.prisma            # Data model
│   └── migrations/              # SQL migrations
├── prisma7.config.ts            # Prisma 7 config (reads DATABASE_URL from .env)
├── lab-13/                      # Companion lab exercises (problem.md, hints.md, screenshots)
├── .env.example                 # Template for required environment variables
└── .gitignore                   # node_modules, .env, generated client, etc.
```

## Troubleshooting

| Symptom                                                      | Fix                                                                   |
| ------------------------------------------------------------ | --------------------------------------------------------------------- |
| `Environment variable "DATABASE_URL" is missing or empty`    | Create `.env` from `.env.example` and set a valid Postgres connection string |
| Connection refused / timeout at startup                       | Check that Postgres is running and that host/port/credentials are correct |
| Table does not exist                                          | Run `npx prisma migrate deploy`                                        |
| Prisma client types look stale after schema edits             | Run `npx prisma generate`                                              |
| Port `3000` already in use                                    | Stop the other process, or change `PORT` in `src/index.js`             |

## Roadmap

- [ ] Link posts to authors (a `Post → User` relation)
- [ ] Like / comment functionality
- [ ] Auth (signup, login, JWT)
- [ ] Tests and CI

## License

ISC
