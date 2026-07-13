# Gym Profile Service

Gym Profile Service provides API operations for gym user profiles, including:

- customer profiles
- trainer profiles
- trainer certifications

## Features

- Express API server
- PostgreSQL persistence via `pg`
- SQL-based migrations in `src/db/migrations`
- Local Docker Compose support for database setup
- Unit and integration tests with Jest + Supertest
- Kubernetes manifests for app deployment and PostgreSQL StatefulSet

## Prerequisites

- Node.js >= 20
- npm
- Docker and Docker Compose (for local database)

## Local development setup

1. Install packages:
   ```bash
   npm install
   ```
2. Copy example env file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your local database values.

### Recommended local `.env`

Use either a connection string or standard Postgres env vars.

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gym_profile
PGSSLMODE=disable
```

If you prefer individual values, use standard Postgres env names instead of `POSTGRES_*`:

```env
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=gym_profile
PGHOST=localhost
PGPORT=5432
PGSSLMODE=disable
```

## Run PostgreSQL locally

Start the local database with Docker Compose:

```bash
docker compose up -d
```

Verify the database:

```bash
docker compose ps
```

View Postgres logs:

```bash
docker compose logs -f db
```

## Apply migrations

Run schema migrations before starting the app:

```bash
npm run migrate
```

If there are no pending migrations, the script will report that the database is up to date.

## Run the app

Start the service:

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

The app base URL is:

```text
http://localhost:3000/api/profiles
```

## API reference

### Customer endpoints

- `POST /api/profiles/customers`
- `GET /api/profiles/customers`
- `GET /api/profiles/customers/:id`
- `GET /api/profiles/customers/by-user/:user_id`
- `PUT /api/profiles/customers/:id`
- `DELETE /api/profiles/customers/:id`

### Trainer endpoints

- `POST /api/profiles/trainers`
- `GET /api/profiles/trainers`
- `GET /api/profiles/trainers/:id`
- `GET /api/profiles/trainers/by-user/:user_id`
- `PUT /api/profiles/trainers/:id`
- `DELETE /api/profiles/trainers/:id`

### Certification endpoints

- `POST /api/profiles/certifications`
- `GET /api/profiles/trainers/:trainerId/certifications`
- `GET /api/profiles/certifications/:id`
- `PUT /api/profiles/certifications/:id`
- `DELETE /api/profiles/certifications/:id`

## Testing

Run the full test suite:

```bash
npm test
```

Run tests in band for CI or local troubleshooting:

```bash
npm test -- --runInBand
```

## Docker

Build the app image:

```bash
docker build -t gym-profile-service .
```

Run the container with a database connection string:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@db:5432/gym_profile" \
  gym-profile-service
```

## Kubernetes

Manifests are in `k8s/`.

### What is included

- `k8s/storageclass.yaml` — storage class for database volumes
- `k8s/postgres-service.yaml` — ClusterIP service for Postgres
- `k8s/postgres-statefulset.yaml` — PostgreSQL StatefulSet with 1 replica
- `k8s/app-deployment.yaml` — app Deployment with 3 replicas
- `k8s/app-service.yaml` — ClusterIP service for the app

### Notes

- The app connects to Postgres using the DNS name `postgres` within the same namespace.
- Secrets are expected to be injected by your CD pipeline.
- The Postgres StatefulSet expects a secret named `postgres-secret`.
- The app deployment expects `DATABASE_URL` to be populated from a secret.

## Project structure highlights

- `src/app.js` — Express app definition for tests and runtime
- `src/index.js` — runtime entrypoint that starts the server
- `src/config/database.js` — pg Pool configuration
- `src/db/migrate.js` — migration runner
- `src/db/migrations/` — SQL migrations
- `src/controllers/profile.controller.js` — route handlers
- `src/routes/profile.routes.js` — API routes
- `tests/` — unit and integration tests

## Notes

- `./.env` should not be committed.
- Use `PG*` env vars or `DATABASE_URL` locally.
- Run migrations before starting the service in any environment.
