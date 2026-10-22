"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getViewer } from "@/app/actions/account";
import { AuthDialog, type AuthMode } from "@/components/auth/auth-dialog";

export type AuthUser = { id: string; email: string | null; isAdmin: boolean };

/** Thrown by requireAuth() when the visitor closes the sign-in dialog. */
export class AuthCancelledError extends Error {
  constructor() {
    super("Sign-in cancelled.");
  }
}

type AuthContextValue = {
  /** undefined while the session is loading, null when signed out. */
  user: AuthUser | null | undefined;
  /**
   * Resolves once the visitor is signed in. Opens the sign-in dialog if they
   * aren't (or if `force`), and rejects with AuthCancelledError if they close it.
   */
  requireAuth: (opts?: { force?: boolean; reason?: string }) => Promise<void>;
  openAuth: (mode?: AuthMode) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(user: User | null | undefined, isAdmin = false): AuthUser | null {
  if (!user || user.is_anonymous) return null;
  return { id: user.id, email: user.email ?? null, isAdmin };
}

/**
 * Email + password accounts. Browsing never needs one; the first time a
 * signed-out visitor votes, posts, replies or reports, the sign-in dialog opens
 * and the action carries on as soon as they're signed in.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(isSupabaseConfigured ? undefined : null);
  const [dialog, setDialog] = useState<{ open: boolean; mode: AuthMode; reason?: string }>({
    open: false,
    mode: "sign-in",
  });
  const waiter = useRef<{ resolve: () => void; reject: (e: Error) => void } | null>(null);
  const userRef = useRef(user);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    let lastId: string | null | undefined;

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const next = toAuthUser(session?.user);
      const changed = next?.id !== lastId;
      lastId = next?.id ?? null;
      setUser((prev) => (prev && next && prev.id === next.id ? { ...next, isAdmin: prev.isAdmin } : next));
      userRef.current = next;

      if (next) {
        waiter.current?.resolve();
        waiter.current = null;
        setDialog((d) => ({ ...d, open: false }));
      }
      if (changed) {
        if (next) {
          void getViewer().then((v) =>
            setUser((prev) => (prev && prev.id === next.id ? { ...prev, isAdmin: v.isAdmin } : prev))
          );
        }
        // Server-rendered parts (your votes, My posts) depend on the session.
        if (event !== "INITIAL_SESSION") router.refresh();
      }
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  const requireAuth = useCallback(async ({ force = false, reason }: { force?: boolean; reason?: string } = {}) => {
    if (!isSupabaseConfigured) throw new Error("Secretly isn't connected to its database yet.");
    if (userRef.current && !force) return;
    waiter.current?.reject(new AuthCancelledError());
    return new Promise<void>((resolve, reject) => {
      waiter.current = { resolve, reject };
      setDialog({ open: true, mode: "sign-in", reason });
    });
  }, []);

  const openAuth = useCallback((mode: AuthMode = "sign-in") => {
    setDialog({ open: true, mode });
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setDialog((d) => ({ ...d, open }));
    if (!open) {
      waiter.current?.reject(new AuthCancelledError());
      waiter.current = null;
    }
  }, []);

  const signOut = useCallback(async () => {
    await createClient().auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, requireAuth, openAuth, signOut }),
    [user, requireAuth, openAuth, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthDialog
        open={dialog.open}
        onOpenChange={onOpenChange}
        initialMode={dialog.mode}
        reason={dialog.reason}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
