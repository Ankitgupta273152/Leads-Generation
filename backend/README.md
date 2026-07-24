# Backend - Lead API

## Setup

```bash
npm install
cp .env.example .env
# Add MongoDB URI to .env
npm run dev
```

## API

- GET `/api/leads` - List leads
- POST `/api/leads/run` - Fetch now
- POST `/api/leads/cron/start` - Start automation
- GET `/api/leads/stats` - Statistics
- GET `/api/leads/search?q=keyword` - Search
- PATCH `/api/leads/:id` - Update
- GET `/api/leads/export` - Export

## Sources

- HackerNews Jobs API
- GitHub Issues API
- No authentication needed
- Optimized scoring (no token waste)
