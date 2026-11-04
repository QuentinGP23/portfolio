import { describe, expect, it } from "vitest";

import { resolveSiteUrl } from "./env";

describe("resolveSiteUrl", () => {
  it("prefers the explicit site URL", () => {
    const url = resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://example.dev",
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(url.href).toBe("https://example.dev/");
  });

  it("falls back to the Vercel production URL over HTTPS", () => {
    const url = resolveSiteUrl({
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(url.href).toBe("https://portfolio.vercel.app/");
  });

  it("uses localhost when nothing is configured", () => {
    expect(resolveSiteUrl({}).href).toBe("http://localhost:3000/");
  });

  it("treats empty values as not set", () => {
    const url = resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "",
      VERCEL_PROJECT_PRODUCTION_URL: "",
    });
    expect(url.href).toBe("http://localhost:3000/");
  });

  it("rejects an invalid site URL instead of silently ignoring it", () => {
    expect(() =>
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "not a url" }),
    ).toThrow();
    expect(() =>
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "ftp://example.dev" }),
    ).toThrow();
  });
});
