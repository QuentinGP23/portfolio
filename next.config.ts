import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const vercelEnv = process.env.VERCEL_ENV;
const isPreview = vercelEnv === "preview";

/**
 * Content-Security-Policy of the static public pages.
 * Scripts need 'unsafe-inline': prerendered pages embed the React Server Components
 * payload in inline scripts, which neither a nonce (pages are built ahead of time)
 * nor experimental.sri (external files only) can cover. Tested in phase 1, see
 * docs/adr/0005-csp.md. The admin will get a nonce-based CSP from proxy.ts.
 * Preview deployments also allow the Vercel Toolbar, as documented in
 * https://vercel.com/docs/vercel-toolbar/managing-toolbar#using-a-content-security-policy
 */
const directives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    ...(isPreview ? ["https://vercel.live"] : []),
  ],
  "style-src": [
    "'self'",
    ...(isDev || isPreview ? ["'unsafe-inline'"] : []),
    ...(isPreview ? ["https://vercel.live"] : []),
  ],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    ...(isPreview ? ["https://vercel.live", "https://vercel.com"] : []),
  ],
  "font-src": [
    "'self'",
    ...(isPreview ? ["https://vercel.live", "https://assets.vercel.com"] : []),
  ],
  "connect-src": [
    "'self'",
    ...(isPreview ? ["https://vercel.live", "wss://ws-us3.pusher.com"] : []),
  ],
  "frame-src": isPreview ? ["https://vercel.live"] : ["'none'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  ...(vercelEnv ? { "upgrade-insecure-requests": [] } : {}),
};

const contentSecurityPolicy = Object.entries(directives)
  .map(([name, values]) => [name, ...values].join(" "))
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    // Media files are versioned by name, so a long cache is safe (plan: Performance).
    minimumCacheTTL: 2_678_400,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
