import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Shared brand assets for ImageResponse-based icons and Open Graph images. */
export const brand = {
  plum: "#6b2d78",
  plumLight: "#d6b0e0",
  ink: "#1e1724",
  paper: "#fcfaf7",
  night: "#16131a",
} as const;

const fontDir = join(process.cwd(), "src/assets/fonts");

export async function loadBrandFonts() {
  const [frauncesItalic, fraunces, inter] = await Promise.all([
    readFile(join(fontDir, "fraunces-latin-600-italic.woff")),
    readFile(join(fontDir, "fraunces-latin-400-normal.woff")),
    readFile(join(fontDir, "inter-latin-500-normal.woff")),
  ]);
  return [
    { name: "Fraunces", data: frauncesItalic, style: "italic" as const, weight: 600 as const },
    { name: "Fraunces", data: fraunces, style: "normal" as const, weight: 400 as const },
    { name: "Inter", data: inter, style: "normal" as const, weight: 500 as const },
  ];
}

export function OgWordmark({ size = 44, color = brand.paper }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Fraunces",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "-0.03em",
        color,
      }}
    >
      Secretly<span style={{ color: brand.plumLight, fontStyle: "normal" }}>.</span>
    </div>
  );
}

/** Branded 1200×630 frame: dark plum gradient, wordmark top-left, content centred. */
export function OgFrame({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: `radial-gradient(circle at 85% 15%, #4a1f56 0%, ${brand.night} 60%)`,
        color: brand.paper,
      }}
    >
      <OgWordmark />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 26,
              color: brand.plumLight,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        {children}
      </div>
      <div style={{ display: "flex", fontFamily: "Inter", fontSize: 24, color: "#a99db0" }}>
        Anonymous · Honest · secretly
      </div>
    </div>
  );
}
