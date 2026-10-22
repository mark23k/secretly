import { ImageResponse } from "next/og";
import { brand, loadBrandFonts } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.plum,
          borderRadius: 16,
          color: brand.paper,
          fontFamily: "Fraunces",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 50,
          paddingBottom: 6,
        }}
      >
        S
      </div>
    ),
    { ...size, fonts: await loadBrandFonts() }
  );
}
