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

/**
 * Resolves a Turnstile token. Usually invisible; when Cloudflare wants a
 * click, the widget appears inside `mount` (so it works inside dialogs).
 */
export async function getTurnstileToken(siteKey: string, mount?: HTMLElement | null): Promise<string> {
  await loadScript();
  const api = window.turnstile;
  if (!api) throw new Error("Bot check unavailable.");

  const host = document.createElement("div");
  if (mount) {
    mount.replaceChildren(host);
  } else {
    host.style.cssText = "position:fixed;bottom:16px;right:16px;z-index:60";
    document.body.appendChild(host);
  }

  return new Promise((resolve, reject) => {
    const cleanup = (id: string) => {
      api.remove(id);
      host.remove();
    };
    const fail = (id: string, message: string) => {
      cleanup(id);
      reject(new Error(message));
    };
    const id = api.render(host, {
      sitekey: siteKey,
      appearance: "interaction-only",
      callback: (token: string) => {
        cleanup(id);
        resolve(token);
      },
      "error-callback": () => fail(id, "The bot check failed. Please try again."),
      "expired-callback": () => fail(id, "The bot check expired. Please try again."),
      "timeout-callback": () => fail(id, "The bot check timed out. Please try again."),
    });
  });
}
