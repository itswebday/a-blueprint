import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const baseConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "124mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // TODO: Change to correct domain
        hostname: "a-blueprint-1.com",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "https",
        // TODO: Change to correct domain
        hostname: "www.a-blueprint-1.com",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "https",
        // TODO: Change to correct domain
        hostname: "a-blueprint-1.vercel.app",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "http",
        hostname: "::1",
        pathname: "/api/media/file/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return webpackConfig;
  },

  async rewrites() {
    return [
      {
        source: "/nl/privacybeleid",
        destination: "/nl/privacy-policy",
      },
      {
        source: "/nl/cookiebeleid",
        destination: "/nl/cookie-policy",
      },
      {
        source: "/nl/algemene-voorwaarden",
        destination: "/nl/terms-and-conditions",
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            // TODO: Change to correct domain
            value: "a-blueprint-1.com",
          },
        ],
        // TODO: Change to correct domain
        destination: "https://www.a-blueprint-1.com/:path*",
        permanent: true,
      },
    ];
  },
};

const config = withNextIntl(withPayload(baseConfig));

export default config;
