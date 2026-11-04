import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import { siteUrl } from "@/lib/env";
import { site } from "@/lib/site";

import "./globals.css";

const titleSuffix = `${site.name}, ${site.jobTitle.toLowerCase()}`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: titleSuffix, template: `%s — ${titleSuffix}` },
  description: site.description,
  authors: [{ name: site.name, url: site.links.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Vercel Analytics and Speed Insights only exist on Vercel: elsewhere their scripts
// would 404 and pollute the console (Lighthouse "best practices").
const onVercel = Boolean(process.env.VERCEL);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        {onVercel ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
