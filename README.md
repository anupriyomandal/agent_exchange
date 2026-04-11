# Agent Exchange

An internal marketplace/catalog for AI agents. Browse, discover, and manage conversational agents deployed across web, Telegram, WhatsApp, Slack, and other channels.

## Project structure

```
agent-exchange/
├── client/     # React + Vite frontend → deploy to Vercel
└── server/     # Express + Prisma backend → deploy to Railway
```

## Local development

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

npm install
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev       # starts on http://localhost:4000
```

### 2. Frontend

```bash
cd client
npm install

# Create .env.local:
echo "VITE_API_URL=http://localhost:4000" > .env.local

npm run dev       # starts on http://localhost:5173
```

### Default admin credentials

- Email: `admin@agentexchange.com`
- Password: `admin123`

---

## Deployment

### Railway (backend)

1. Create a new Railway project
2. Add a **PostgreSQL** plugin — `DATABASE_URL` is set automatically
3. Add a service from Git, set root directory to `/server`
4. Set environment variables:
   - `JWT_SECRET` — a long random string
   - `FRONTEND_URL` — your Vercel frontend URL (set after Vercel deploy)
5. Start command: `node index.js`
6. Build command: `npx prisma generate && npx prisma migrate deploy`
7. After deploy, run seed via Railway shell: `node prisma/seed.js`

### Vercel (frontend)

1. Import the Git repo, set root directory to `/client`
2. Framework preset: **Vite**
3. Set environment variable:
   - `VITE_API_URL` — your Railway backend URL (e.g. `https://agent-exchange-api.up.railway.app`)
4. `vercel.json` is already configured for SPA routing

---

## API overview

### Public endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/agents` | List published agents (`?category=`, `?search=`, `?sort=likes\|newest`) |
| GET | `/api/agents/:slug` | Agent detail + reviews |
| POST | `/api/agents/:slug/like` | Increment like count |
| POST | `/api/agents/:slug/reviews` | Submit a review |

### Admin endpoints (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/auth/me` | Current user |
| GET | `/api/admin/agents` | All agents |
| POST | `/api/admin/agents` | Create agent (multipart) |
| PUT | `/api/admin/agents/:id` | Update agent |
| DELETE | `/api/admin/agents/:id` | Delete agent |
| PATCH | `/api/admin/agents/:id/status` | Change status |
| GET | `/api/admin/reviews` | All reviews |
| DELETE | `/api/admin/reviews/:id` | Delete review |
