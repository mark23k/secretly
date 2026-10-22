import { ImageResponse } from "next/og";
import { brand, loadBrandFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(145deg, #7a3488 0%, ${brand.plum} 60%, #4a1f56 100%)`,
          color: brand.paper,
          fontFamily: "Fraunces",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 132,
          paddingBottom: 14,
        }}
      >
        S
      </div>
    ),
    { ...size, fonts: await loadBrandFonts() }
  );
}
