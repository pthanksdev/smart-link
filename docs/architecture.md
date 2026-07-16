# Architecture

## Overview

Smart Link is a URL shortener with click analytics, split into two independently deployable services:

```
Browser ──HTTP──▶ Next.js frontend (port 3000)
                      │
                      │ HTTP (NEXT_PUBLIC_API_BASE_URL)
                      ▼
                 Flask backend (port 5000)
                      │
                      ▼
                 SQLite (backend/data/)
```

The frontend is a thin presentation layer — all business logic lives in the Flask API.

## Backend layers

| Layer | Responsibility |
|---|---|
| `routes/` | HTTP routing, request parsing, response formatting |
| `controllers/` | Orchestration — ties routes to services |
| `services/` | Business logic (shortening, analytics aggregation) |
| `models/` | Raw SQL data access |
| `middleware/` | Validation (Pydantic), rate limiting, error handling |
| `utils/` | Logging, referrer parsing |

### Key design decisions

- **App factory pattern** — `create_app()` in `app/__init__.py` enables test isolation with in-memory/temp SQLite databases.
- **Non-blocking click logging** — redirect responses are sent first; click rows are written in a background thread via `@after_this_request`.
- **Rate limiting** — `POST /api/shorten` is capped at 20 requests/min per IP via Flask-Limiter.

## Frontend structure

| Path | Type | Purpose |
|---|---|---|
| `app/page.tsx` | Server component | Home — shorten form + recent links |
| `app/links/page.tsx` | Server component | Paginated link table |
| `app/stats/[alias]/page.tsx` | Server component | Analytics dashboard |
| `components/ShortenForm.tsx` | Client component | Form submission + result display |
| `components/ClicksByDayChart.tsx` | Client component | Recharts bar chart |
| `components/LinkTable.tsx` | Client component | Delete actions, pagination |
| `lib/api.ts` | Shared | Typed fetch client |

Server components fetch data at render time; client components handle interactivity (forms, charts, clipboard, modals).

## Data flow: redirect + click logging

```
GET /:alias
  │
  ├─ Lookup link in SQLite
  ├─ Check expiry → 410 if expired
  ├─ Return 302 redirect immediately
  └─ after_this_request → background thread:
       INSERT into clicks + increment click_count
```

## Optional proxy route

`app/api/proxy/[...path]/route.ts` forwards requests to the backend server-side. Useful if you later add API-key auth and don't want the key exposed in the browser.

## Deployment

- **Development**: run `python run.py` (backend) and `npm run dev` (frontend) separately.
- **Docker Compose**: `docker compose up` builds and runs both services with a shared network.
- **CI**: GitHub Actions runs backend pytest + ruff and frontend lint/build/test in parallel on every push/PR to `main`.
