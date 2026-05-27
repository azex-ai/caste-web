import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js 16 dev treats requests from a host other than the one the server
  // was started on as cross-origin and blocks the RSC / HMR payloads — which
  // silently breaks client-side hydration (the page renders SSR HTML but no
  // hooks fire). Whitelist the loopback IP variants explicitly so the app
  // works whether you visit via localhost or 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Allow our Ponder API to live on a different port in dev.
  async rewrites() {
    const apiBase = process.env.PONDER_API_URL ?? "http://localhost:42069";
    return [
      {
        source: "/ponder/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
