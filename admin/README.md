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

## Schedule event IDs

Every event in `schedule.json` has a stable `id`. The mobile app stores "Мой план" by this `id`, so editing the artist name, date, time, or stage does not remove the event from a user's plan.

The admin UI generates `id` automatically when you add a new slot and keeps it unchanged when you edit the slot. If you edit JSON manually, keep every event `id` unique and do not rename existing IDs unless you intentionally want to break saved plans for that event.

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
