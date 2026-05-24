import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const ACID = "#caf03c";
const ACID_LO = "#5e6f1e";
const INK_BG = "#0f1310";

export default async function AppleIcon() {
  const vt323 = await fetch(
    "https://fonts.gstatic.com/s/vt323/v18/pxiKyp0ihIEF2isfFJA.ttf",
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: INK_BG,
          border: `3px solid ${ACID_LO}`,
          borderRadius: 36,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            width: 14,
            height: 14,
            borderLeft: `2px solid ${ACID}`,
            borderTop: `2px solid ${ACID}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 14,
            height: 14,
            borderRight: `2px solid ${ACID}`,
            borderTop: `2px solid ${ACID}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            width: 14,
            height: 14,
            borderLeft: `2px solid ${ACID}`,
            borderBottom: `2px solid ${ACID}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 14,
            height: 14,
            borderRight: `2px solid ${ACID}`,
            borderBottom: `2px solid ${ACID}`,
          }}
        />
        <div
          style={{
            fontFamily: "VT323",
            fontSize: 116,
            color: ACID,
            textShadow: `0 0 14px ${ACID}, 0 0 4px ${ACID}`,
            lineHeight: 1,
            display: "flex",
          }}
        >
          $C
        </div>
        <div
          style={{
            fontFamily: "VT323",
            fontSize: 22,
            color: ACID_LO,
            letterSpacing: 8,
            marginTop: 6,
            display: "flex",
          }}
        >
          CASTE
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "VT323", data: vt323, weight: 400, style: "normal" }],
    },
  );
}
