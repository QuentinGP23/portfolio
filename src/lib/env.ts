import { z } from "zod";

/** An empty string in an environment file means "not set". */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optional(z.url({ protocol: /^https?$/ })),
  VERCEL_PROJECT_PRODUCTION_URL: optional(z.string().min(1)),
});

export type PublicEnv = z.input<typeof publicEnvSchema>;

/**
 * Resolves the canonical site URL: the explicit NEXT_PUBLIC_SITE_URL first, then the
 * production URL Vercel provides, then localhost for development and tests.
 * Throws if a value is set but invalid, so a bad configuration fails the build.
 */
export function resolveSiteUrl(env: PublicEnv): URL {
  const parsed = publicEnvSchema.parse(env);
  if (parsed.NEXT_PUBLIC_SITE_URL) return new URL(parsed.NEXT_PUBLIC_SITE_URL);
  if (parsed.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${parsed.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  return new URL("http://localhost:3000");
}

export const siteUrl = resolveSiteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
});
