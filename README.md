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

## 3. Put it live on saysecretly.com (Netlify)

Your site already lives on Netlify, and saysecretly.com already points there (DNS at Cloudflare). That stays the same. The one new thing is the database.

> **Why a new database?** Netlify runs the site as short-lived "serverless functions" that can't keep a file between visits, so the SQLite file can't work there. The live site needs a PostgreSQL database instead.

### Step A: Create a free PostgreSQL database (Supabase)

1. Go to **supabase.com**, sign in, and click **New project**. Name it `saysecretly`, pick a strong database password (save it!) and the region closest to your users.
   - Use a new project rather than your old one, so the old site's tables don't get mixed in.
2. When it's ready, click **Connect** (top of the page).
3. Under **Connection string**, choose **Session pooler** and copy the URI. It looks like:
   `postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
4. Replace `[YOUR-PASSWORD]` with your database password.

(Any PostgreSQL works: Neon, Railway, etc. You just need its connection URL.)

### Step B: Set the environment variables on Netlify

In Netlify, open your site, then **Site configuration → Environment variables**.

1. **Delete the old site's variables** (any of these you see). The new site doesn't use them:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_SECRET`, `ADMIN_EMAILS`, `MAINTENANCE_MODE`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
   - `OPENAI_API_KEY`, if it's there
2. **Add these:**

| Key | Value |
|---|---|
| `DATABASE_URL` | the Supabase URL from Step A |
| `SESSION_SECRET` | a **new** output of `openssl rand -hex 32` (don't reuse your local one) |
| `ADMIN_EMAIL` | your email |
| `ADMIN_TIMEZONE` | optional, e.g. `America/New_York` (used for the per-day charts) |

### Step C: Deploy

Push the code to GitHub:

```bash
git push
```

Netlify builds automatically. On every deploy it runs `npm run deploy:build`, which:

1. Creates or updates the database tables.
2. Adds the example questions, but **only if the database is empty** (so it never duplicates them).
3. Builds the site.

When the deploy is green, open **https://saysecretly.com**, sign up with your `ADMIN_EMAIL`, and you're the admin. 🎉

The old `sharesecretly.netlify.app` address still redirects to saysecretly.com. That rule is in `netlify.toml`.

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
