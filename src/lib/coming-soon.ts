/**
 * Maintenance mode: set MAINTENANCE_MODE=1 (and redeploy) to show a
 * "coming soon" page on every public page. Manager pages and sign-in keep
 * working. Served from proxy.ts as a 503, so search engines treat it as
 * temporary.
 */
export const maintenanceMode = process.env.MAINTENANCE_MODE === "1";

/** Paths that keep working during maintenance (managers need to sign in). */
export function bypassesMaintenance(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/api/");
}

export const comingSoonHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#140d17">
<title>Secretly · Coming soon</title>
<link rel="icon" href="/icon">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,500;1,9..144,600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box}
  html,body{margin:0;height:100%}
  body{
    min-height:100dvh;display:flex;align-items:center;justify-content:center;
    background:#140d17;color:#f4ecf7;font-family:Inter,system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;overflow:hidden;text-align:center;
    padding:max(24px,env(safe-area-inset-top)) 24px max(24px,env(safe-area-inset-bottom));
  }
  .glow{position:fixed;inset:0;pointer-events:none;
    background:
      radial-gradient(60vmax 45vmax at 50% 20%,rgba(138,63,154,.55),transparent 60%),
      radial-gradient(40vmax 30vmax at 80% 90%,rgba(107,45,120,.35),transparent 65%);
    animation:breathe 9s ease-in-out infinite alternate}
  @keyframes breathe{from{opacity:.75;transform:scale(1)}to{opacity:1;transform:scale(1.06)}}
  main{position:relative;max-width:34rem}
  .mark{font-family:Fraunces,Georgia,serif;font-style:italic;font-weight:600;font-size:1.6rem;letter-spacing:-.03em}
  .mark b{color:#d6a4e3;font-weight:600}
  h1{margin:2.25rem 0 0;font-family:Fraunces,Georgia,serif;font-weight:400;font-size:clamp(2.6rem,9vw,4.5rem);line-height:1.04;letter-spacing:-.02em}
  h1 em{color:#e2c3ea;font-weight:500}
  p{margin:1.25rem auto 0;max-width:24rem;color:rgba(244,236,247,.7);font-size:1.05rem;line-height:1.6}
  .soon{margin-top:2.5rem;display:inline-flex;align-items:center;gap:.6rem;padding:.55rem 1.1rem;
    border:1px solid rgba(226,195,234,.25);border-radius:999px;background:rgba(255,255,255,.04);
    font-size:.85rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#e2c3ea}
  .dot{width:.5rem;height:.5rem;border-radius:999px;background:#d6a4e3;box-shadow:0 0 12px #d6a4e3;animation:pulse 1.8s ease-in-out infinite}
  @keyframes pulse{50%{opacity:.35}}
  @media (prefers-reduced-motion:reduce){.glow,.dot{animation:none}}
</style>
</head>
<body>
  <div class="glow" aria-hidden="true"></div>
  <main>
    <div class="mark">Secretly<b>.</b></div>
    <h1>Something new is <em>coming.</em></h1>
    <p>We're working on something we think you'll love. Check back soon.</p>
    <div class="soon"><span class="dot" aria-hidden="true"></span>Coming soon</div>
  </main>
</body>
</html>`;
