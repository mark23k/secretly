import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VisitTracker } from "@/components/visit-tracker";

// Nunito (rounded, friendly), bundled locally so builds never depend on Google Fonts.
const nunito = localFont({
  src: "../assets/fonts/nunito-latin-variable.woff2",
  weight: "200 1000",
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saysecretly.com"),
  title: { default: "SaySecretly – Say what everyone's thinking", template: "%s · SaySecretly" },
  description:
    "The unwritten rules of everyday life, settled anonymously. Is it rude to eat tuna on a plane? Whisper a question and find out what everyone really thinks.",
  openGraph: {
    title: "SaySecretly",
    description: "Say what everyone's thinking. The unwritten rules of everyday life, settled anonymously.",
    url: "https://saysecretly.com",
    siteName: "SaySecretly",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffaf3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-dvh font-sans antialiased">
        <Header />
        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4 sm:pb-16">{children}</main>
        <Footer />
        <VisitTracker />
      </body>
    </html>
  );
}
