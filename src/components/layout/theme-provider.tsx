"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { CrisisProvider } from "@/components/providers/crisis-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <CrisisProvider>{children}</CrisisProvider>
        </AuthProvider>
      </MotionConfig>
    </NextThemesProvider>
  );
}
