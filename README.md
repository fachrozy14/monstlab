# Job & Tool Recommender (Netlify + Neon)

A ready-to-deploy full-stack app:
- **Frontend**: React (Vite) + Tailwind
- **Backend**: Netlify Functions (Node)
- **Database**: Neon (Postgres) via `@neondatabase/serverless`

## 1) Create tables (Neon)
Run this SQL in your Neon project's SQL editor:

```sql
create table if not exists jobs (
  id serial primary key,
  title text not null
);

create table if not exists tools (
  id serial primary key,
  job_id int references jobs(id) on delete cascade,
  name text not null,
  description text
);
```

> Tip: Use a **pooled** connection string for serverless (e.g. `...neon.tech/neondb?sslmode=require&pooler=true`).

## 2) Netlify setup
- Add environment variable in Netlify dashboard:
  - `NEON_DATABASE_URL=postgres://USER:PASS@HOST/DB?sslmode=require&pooler=true`
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

## 3) Local dev
```bash
npm install
# create .env for local functions if you want to test them with netlify dev
# echo "NEON_DATABASE_URL=postgres://..." > .env
npm run dev
```

For local serverless testing:
```bash
npx netlify-cli dev
```

## 4) Deploy
- Push this project to GitHub.
- Create a Netlify site from the repo.
- Set the environment variable above.
- Deploy.

## Endpoints
- `/.netlify/functions/jobs` (GET, POST)
- `/.netlify/functions/tools` (GET, POST)

## Notes
- CORS is enabled to allow cross-origin if needed.
- Minimal error handling included; extend as desired.
