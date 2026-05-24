import { ImageResponse } from "next/og";

export const alt = "$CASTE — flip-card meme protocol";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACID = "#caf03c";
const ACID_LO = "#5e6f1e";
const INK_BG = "#0f1310";
const INK_700 = "#a8a99f";

export default async function OpenGraphImage() {
  const [vt323, plexMono] = await Promise.all([
    fetch("https://fonts.gstatic.com/s/vt323/v18/pxiKyp0ihIEF2isfFJA.ttf").then(
      (r) => r.arrayBuffer(),
    ),
    fetch(
      "https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q0g.ttf",
    ).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: INK_BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            fontFamily: "IBM Plex Mono",
            fontSize: 18,
            color: ACID_LO,
            letterSpacing: 6,
            display: "flex",
          }}
        >
          CASTE@MAINNET:~$ ./join
        </div>
        <div
          style={{
            position: "absolute",
            top: 44,
            right: 60,
            fontFamily: "IBM Plex Mono",
            fontSize: 16,
            color: ACID_LO,
            letterSpacing: 5,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              background: ACID,
              display: "flex",
              boxShadow: `0 0 10px ${ACID}`,
            }}
          />
          LIVE
        </div>

        <div
          style={{
            fontFamily: "VT323",
            fontSize: 280,
            color: ACID,
            textShadow: `0 0 24px ${ACID}, 0 0 6px ${ACID}`,
            letterSpacing: 14,
            lineHeight: 1,
            display: "flex",
          }}
        >
          $CASTE
        </div>

        <div
          style={{
            marginTop: 36,
            paddingTop: 18,
            width: 880,
            borderTop: `1px dashed ${ACID_LO}`,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "IBM Plex Mono",
            fontSize: 20,
            letterSpacing: 8,
            color: INK_700,
          }}
        >
          <span style={{ display: "flex" }}>RANK · ROLL · REPEAT</span>
          <span style={{ display: "flex", color: ACID }}>21B · MAINNET</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 60,
            right: 60,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "IBM Plex Mono",
            fontSize: 14,
            color: ACID_LO,
            letterSpacing: 5,
          }}
        >
          <span style={{ display: "flex" }}>VT323 · IBM PLEX MONO</span>
          <span style={{ display: "flex" }}>LED / 280 · ACID</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "VT323", data: vt323, weight: 400, style: "normal" },
        { name: "IBM Plex Mono", data: plexMono, weight: 400, style: "normal" },
      ],
    },
  );
}
