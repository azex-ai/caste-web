import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "$CASTE",
    short_name: "CASTE",
    description: "Flip-card meme protocol on Uniswap v4 · rank · roll · repeat",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1310",
    theme_color: "#caf03c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
