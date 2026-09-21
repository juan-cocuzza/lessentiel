import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "L'essentiel | Botines de Fútbol Premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0A0A0B",
          color: "#F4F0E8",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid #C9A962",
            height: "calc(100% - 48px)",
            left: "24px",
            position: "absolute",
            top: "24px",
            width: "calc(100% - 48px)",
          }}
        />
        <div style={{ color: "#C9A962", fontSize: 28, letterSpacing: "8px" }}>
          L&apos;ESSENTIEL
        </div>
        <div
          style={{
            fontFamily: "serif",
            fontSize: 72,
            fontWeight: 700,
            marginTop: 28,
            textAlign: "center",
          }}
        >
          Botines de Fútbol Premium
        </div>
        <div style={{ color: "#B9B3A8", fontSize: 26, marginTop: 24 }}>
          La mística del Diez. El alma de tus pies.
        </div>
      </div>
    ),
    { ...size }
  );
}
