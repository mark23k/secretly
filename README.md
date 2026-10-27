# Secretly

A calm, anonymous space to share the thoughts, questions and secrets you'd never say out loud.

- **Am I the only one?**: post a thought, see how many people relate.
- **The question you can't ask**: anonymous Q&A with similar-question detection.
- **The secret exchange**: give a secret, get a stranger's secret back (3 per day).

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui and Supabase.

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. **Email + password sign-in, no emails sent**: Authentication → Sign In / Providers → Email. Keep the
   Email provider enabled and turn **Confirm email** OFF. Accounts are then signed in straight after
   sign-up, and Secretly never sends any email (there's no email verification or password reset).
3. **Copy keys** from Project Settings → API into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `anon` / publishable key
   - `SUPABASE_SERVICE_ROLE_KEY`: `service_role` / secret key (**server only, never commit**)
4. **Apply the database migrations** (in `supabase/migrations`):
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
5. Set `APP_SECRET` (any long random string, e.g. `openssl rand -base64 32`) and `ADMIN_EMAILS`
   (your account's email). Sign up on the site with that email, then open **/admin** for the manager dashboard.

## Accounts and anonymity

Anyone can read. Posting, replying, voting and reporting need an email + password account, which also
tracks the 3-secrets-a-day limit. Emails aren't verified, so turning on Turnstile (below) is recommended
to keep bots from mass-creating accounts. Accounts are never shown publicly: every post is anonymous, and the
manager dashboard only shows totals.

The dashboard's visitor numbers come from a first-party heartbeat (`/api/track`): a random browser id in
localStorage, no cookies and no third-party scripts.

### Optional

- **Bot protection** (recommended): create a Cloudflare Turnstile widget, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, and add the secret key under Supabase → Authentication → Attack Protection → CAPTCHA.
- **AI moderation**: set `OPENAI_API_KEY` to add OpenAI's free moderation endpoint on top of the built-in filters.

## Deploying to Netlify

1. Push the repo to GitHub, then in Netlify choose **Add new site → Import an existing project** and pick it.
   Netlify detects Next.js and uses its Next.js runtime automatically; `netlify.toml` sets the build command.
2. Under **Site configuration → Environment variables**, add everything from `.env.example`.
   `NEXT_PUBLIC_SITE_URL` is optional on Netlify (it falls back to Netlify's `URL`); set it if you use a
   custom domain. Keep `SUPABASE_SERVICE_ROLE_KEY` scoped to **Functions** / builds only.
3. Deploy. After the first deploy, check sign-up, voting and `/admin` on the live site.

Netlify's Next.js support is Netlify's own integration (not yet a Next.js-verified adapter), so test new
Next.js upgrades on a deploy preview first.

## Taking the site offline (coming soon page)

In Netlify, add the environment variable `MAINTENANCE_MODE` = `1`, then Deploys → Trigger deploy.
Every public page shows a "coming soon" page (sent as a temporary 503, so search rankings are kept).
`/admin` and sign-in keep working. To bring the site back, delete the variable and redeploy.

## Project structure

```
src/
  app/                 routes (App Router)
  components/
    brand/             wordmark
    layout/            header, footer, nav, theme
    shared/            reusable page pieces
    ui/                shadcn/ui primitives
  config/              site config, crisis resources
  lib/
    supabase/          browser / server / service-role clients
  proxy.ts             refreshes signed-in Supabase sessions
supabase/migrations/   SQL schema + RLS policies
```
