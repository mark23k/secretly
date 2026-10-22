/** Minimal Cloudflare Turnstile loader: renders an invisible widget and resolves a token. */

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Couldn't load the bot check."));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export async function getTurnstileToken(siteKey: string): Promise<string> {
  await loadScript();
  const api = window.turnstile;
  if (!api) throw new Error("Bot check unavailable.");

  const host = document.createElement("div");
  host.style.cssText = "position:fixed;bottom:16px;right:16px;z-index:60";
  document.body.appendChild(host);

  return new Promise((resolve, reject) => {
    const cleanup = (id: string) => {
      api.remove(id);
      host.remove();
    };
    const id = api.render(host, {
      sitekey: siteKey,
      appearance: "interaction-only",
      callback: (token: string) => {
        cleanup(id);
        resolve(token);
      },
      "error-callback": () => {
        cleanup(id);
        reject(new Error("The bot check failed. Please try again."));
      },
    });
  });
}
