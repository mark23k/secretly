# 🤫 SaySecretly

**Say what everyone's thinking.** A cozy, anonymous site about the unwritten rules of everyday life. People whisper a question ("Is it rude to eat tuna on a plane?"), everyone votes **Totally fine 👍 / Depends 🤔 / Please don't 🙅**, and confesses with **Guilty 🙋**.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Prisma.

- **On your computer:** SQLite, a single file with nothing to install.
- **Live site:** PostgreSQL. You switch by changing `DATABASE_URL`; nothing else changes.

---

## 1. Run it on your computer

You need **Node.js 22** (check with `node -v`).

```bash
npm install                 # install everything
cp .env.example .env        # create your settings file
```

Open `.env` and set:

- `SESSION_SECRET`: paste the output of `openssl rand -hex 32`.
- `ADMIN_EMAIL`: your email. This account becomes the admin.
- Leave `DATABASE_URL="file:./prisma/dev.db"` as it is.

Then:

```bash
npm run db:setup            # creates the database and adds ~15 example questions
npm run dev                 # starts the site
```

Open **http://localhost:3000**. 🎉

## 2. Create your admin account

1. Go to **/signup** and sign up with the **same email** you put in `ADMIN_EMAIL`.
2. An **Admin** link appears in the top bar. That's **/admin**.

If you already had an account with that email, just log in again and it becomes admin automatically. Nobody else can open `/admin`; they get a "not found" page.

What /admin shows:

- **📊 Stats**
  - Unique visitors, page views, questions, answers, replies and sign-ups.
  - Each one has today's number, an all-time total, and a per-day chart for 7 days, 30 days or all time.
  - Visitors are counted with an anonymous cookie. IP addresses are never stored. The example questions are not counted.
- **🚩 Moderation:** everything people reported. For each item you can **Dismiss** the report, **Delete** the post, or **Ban user** (which also deletes that post).
- **📝 Recent questions:** the newest questions, each with a delete button.

## 3. How the live site is set up

| Piece | Where | Notes |
|---|---|---|
| Website | **Vercel** (project `saysecretly`, free Hobby plan) | Deploys automatically on every `git push` |
| Database | **Supabase** (PostgreSQL) | The site can't use SQLite on Vercel, because serverless functions can't keep a file |
| Domain | **Cloudflare** (bought and DNS there) | `saysecretly.com` redirects to `www.saysecretly.com`. Both records are **DNS only** (grey cloud) |

### Environment variables (Vercel → project → Environment Variables)

| Key | Value |
|---|---|
| `DATABASE_URL` | Supabase → **Connect** → **Transaction pooler** URL (port **6543**), with your database password in place of `[YOUR-PASSWORD]` |
| `DIRECT_URL` | Supabase → **Connect** → **Session pooler** URL (port **5432**), with the password. Used only while deploying, to update the tables |
| `SESSION_SECRET` | the output of `openssl rand -hex 32` (the random code, not the command) |
| `ADMIN_EMAIL` | your email |
| `ADMIN_TIMEZONE` | optional, e.g. `America/New_York` (for the per-day charts) |

> **Why two database URLs?** Each visit can run in its own copy of the site, and each copy needs database connections. The Session pooler allows only 15 at a time, which runs out quickly. The Transaction pooler shares connections and handles many visitors. Changing tables needs a steady connection, so deploys use the Session pooler through `DIRECT_URL`.

### Deploying

```bash
git push
```

Vercel runs `npm run deploy:build` (set in `vercel.json`), which:

1. Creates or updates the database tables.
2. Adds the example questions, but **only if the database is empty**.
3. Builds the site.

After changing an environment variable, redeploy: Vercel → **Deployments** → **⋯** on the newest one → **Redeploy**.

---

## Handy commands

| Command | What it does |
|---|---|
| `npm run dev` | Run the site locally at http://localhost:3000 |
| `npm run db:setup` | Create the tables and add the example questions |
| `npm run db:push` | Update the tables after changing `prisma/schema.prisma` |
| `npm run db:seed` | Replace the example questions with a fresh set (your real posts are kept) |
| `npm run build` | Build for production (to check for errors) |
| `npm run lint` / `npm run typecheck` | Check the code |

**Start over locally:** delete `prisma/dev.db`, then run `npm run db:setup`.

## How "only change DATABASE_URL" works

Prisma normally needs the database type written in `prisma/schema.prisma`. `scripts/set-db-provider.mjs` writes it for you from `DATABASE_URL` every time you install, build or update the database:

- `file:...` → SQLite
- `postgresql://...` → PostgreSQL

The app also picks the matching driver at runtime (`src/lib/db.ts`). If git shows that `schema.prisma` changed from `sqlite` to `postgresql` after testing against Postgres, that's expected and harmless.

## Rules built into the site

- **Accounts:** email and password only. There are no emails and no verification. Passwords are hashed with bcrypt, and logins use secure httpOnly cookies.
- **Anonymity:** emails are never shown. Each person gets a cute name ("Quiet Penguin") that is different in every question thread.
- **Login needed to:** ask, answer, reply, react, or report. Anyone can browse and search.
- **One answer per person per question:** the answer carries their verdict. After that they can reply to others.
- **Limits:**
  - Questions: up to 150 characters, plus an optional 500-character description.
  - Answers: up to 1,000 characters.
  - Replies: up to 500 characters.
  - About **10 posts per hour** per person.
- **Bad-word filter:** a basic list in `src/lib/filter.ts`. Edit the `BLOCKED` list to add or remove words.
- **Report button:** on every question, answer and reply. Reports go to /admin → Moderation.

## Where things are

```
prisma/schema.prisma     database tables
prisma/seed.ts           the example questions
src/app/                 pages (home, /q/[id], /c/[category], /search, /ask, /login, /signup, /admin)
src/app/actions/         what happens when someone posts, votes, logs in, moderates
src/components/          buttons, cards, forms, charts
src/lib/                 database, login sessions, anonymous names, filter, stats
```
