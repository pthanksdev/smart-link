# Smart Link — URL Shortener & Analytics

A full-stack URL shortener with click analytics. Flask + SQLite backend, Next.js dashboard frontend.

## Quick start

### Prerequisites

- Python 3.12+
- Node.js 20+
- (Optional) Docker & Docker Compose

### Backend

```bash
cd backend
cp .env.example .env
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

API runs at **http://localhost:5000**.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Dashboard runs at **http://localhost:3000**.

### Docker Compose

```bash
docker compose up --build
```

## API reference

### Shorten a URL

```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/long/path", "customAlias": "my-link"}'
```

Response `201`:
```json
{
  "alias": "my-link",
  "shortUrl": "http://localhost:5000/my-link",
  "originalUrl": "https://example.com/long/path"
}
```

### Redirect (logs a click)

```bash
curl -L http://localhost:5000/my-link
```

Returns `302` redirect. Click is logged asynchronously.

### Get stats

```bash
curl http://localhost:5000/api/stats/my-link
```

### List links (paginated)

```bash
curl "http://localhost:5000/api/links?page=1&limit=20"
```

### Delete a link

```bash
curl -X DELETE http://localhost:5000/api/links/my-link
```

Returns `204` on success.

## Dashboard pages

| Route | Description |
|---|---|
| `/` | Shorten form + 5 most recent links |
| `/links` | Paginated table of all links with delete action |
| `/stats/[alias]` | Clicks-by-day chart, referrer breakdown, recent clicks |

## Running tests

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test
```

## Environment variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `BASE_URL` | `http://localhost:5000` | Base URL for generated short links |
| `DB_PATH` | `./data/database.sqlite` | SQLite database path |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:5000` | Backend API base URL |

## Project structure

See [docs/architecture.md](docs/architecture.md) for a detailed breakdown.

## License

MIT
# smart-link
