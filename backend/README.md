# PetCare AI - Backend

## Setup

1. Ensure Docker is running.
2. Run `docker-compose up -d` in the root directory.
3. Install dependencies: `npm install`
4. Run migrations: `npm run db:migrate` (Ensure `DATABASE_URL` is set in .env or passed inline)

## Verification

- **Health Check**: `curl http://localhost:3000/health` -> `{"status":"ok",...}`
- **Create Client**:
  ```bash
  curl -X POST http://localhost:3000/clients \
    -H "Content-Type: application/json" \
    -d '{"name":"John Doe", "phone":"5511999999999", "email":"john@example.com"}'
  ```
- **List Appointments**: `curl http://localhost:3000/appointments`

## Architecture

- **Infrastructure**: Fastify, Postgres (pg), Redis.
- **Repositories**: `ClientRepository`, `AppointmentRepository`.
- **Routes**: `clients.ts`, `appointments.ts`.
