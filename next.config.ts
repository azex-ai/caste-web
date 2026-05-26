import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
