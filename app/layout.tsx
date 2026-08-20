import type { Metadata } from "next";
import { SITE_INDEXING_ENABLED, SITE_ORIGIN } from "../site-config.mjs";
import { AnalyticsConsent } from "./_components/AnalyticsConsent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Asphalt Calculator — Material & Driveway Planning",
    template: "%s",
  },
  description:
    "Plan asphalt material and driveway costs with editable assumptions, visible formulas, and US or metric units.",
  robots: { index: SITE_INDEXING_ENABLED, follow: SITE_INDEXING_ENABLED },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
