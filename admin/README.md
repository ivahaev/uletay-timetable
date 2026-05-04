# Улетай 2026 schedule admin

Self-hosted admin and JSON server for the festival schedule.

## What it serves

- `GET /` — admin UI.
- `GET /schedule.json` — public schedule for the mobile app.
- `GET /api/schedule` — admin API, protected by `ADMIN_TOKEN` if set.
- `POST /api/schedule` — save schedule, protected by `ADMIN_TOKEN` if set.
- `GET /health` — health check.

## Run

```bash
cp .env.example .env
docker compose up -d --build
```

Open:

```txt
http://your-server:8080/
```

Public JSON:

```txt
http://your-server:8080/schedule.json
```

For HTTPS, put this service behind your existing reverse proxy, Caddy, Traefik, Nginx, or any tunnel. The mobile app should use the HTTPS URL.

## Connect the mobile app

In the static app repository, edit `schedule-source.json`:

```json
{
  "primaryScheduleUrl": "https://your-server.example.com/schedule.json",
  "fallbackScheduleUrl": "./schedule.json",
  "timeoutMs": 3000
}
```

If the server is unavailable, the app falls back to the bundled `schedule.json`.
