import type { NextConfig } from "next";
import { SITE_ORIGIN } from "./site-config.mjs";

const canonicalHostname = new URL(SITE_ORIGIN).hostname;

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https://*.analytics.google.com https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com https://www.scrolllaunch.com https://launchstreak.dev https://easylaunch.dev https://www.easylaunch.dev",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${canonicalHostname}` }],
        destination: `${SITE_ORIGIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
