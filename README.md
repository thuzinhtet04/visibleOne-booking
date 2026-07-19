# VisibleOne - Booking App

React frontend served by Express — no CORS config, no separate deployment. Two commands, everything works.

**Stack:** React + Express + Prisma + SQLite + better-auth

## About This Project

I built this as a simple full-stack demo focused on functionality over design. [better-auth](https://better-auth.com) handles authentication with minimal setup, and Prisma + SQLite keeps the database portable with no external dependencies. Role-based authorization is enforced on both the API layer and the React frontend. Since Express serves the built React SPA directly from the same origin, there's no CORS configuration needed — and for the same reason, I skipped axios in favor of the native `fetch` API. UI components are generated rather than hand-crafted, as visual polish isn't the goal here.

## Quick Start

```bash
npm run build && npm start
```

Open `http://localhost:3000`.

**Live demo:** [https://visibleone-booking.onrender.com/](https://visibleone-booking.onrender.com/)

## Environment Variables

Copy `.env.example` to `.env` at the project root. Generate `BETTER_AUTH_SECRET` from [better-auth.com/docs/installation](https://better-auth.com/docs/installation).

## Default Admin

On every deploy the database is reset and an admin account is created:

- **Email:** admin@admin.com
- **Password:** admin123

Sign in and use the admin panel to create users with **user** or **owner** roles.

## Postman Collection

Import `Auth.postman_collection.json` for all API endpoints. Set environment variable `baseUrl` to `http://localhost:3000`.

## Deploy on Render

1. Push this repo to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com) create a **New Web Service** and connect your GitHub repo.
3. Use these settings:
   - **Runtime:** Node
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Add the required environment variables (see below).
5. Deploy.

> **Note:** On Render's free tier, the service spins down after 15 minutes of inactivity. The first request after idle will take a few seconds to wake up.

## Notes

- **SQLite** — no external database needed
- **No Docker** — Deploy on Render as Web Service for simple sample full-stack project
- Express serves both the API and the React SPA on a single port
