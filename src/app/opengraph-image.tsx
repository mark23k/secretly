import { ImageResponse } from "next/og";
import { OgFrame, loadBrandFonts } from "@/lib/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame eyebrow="Anonymous. Always.">
        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces",
            fontSize: 76,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            maxWidth: 940,
          }}
        >
          {siteConfig.tagline}
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await loadBrandFonts() }
  );
}
