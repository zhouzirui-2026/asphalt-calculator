import type { Metadata } from "next";
import { SITE_INDEXING_ENABLED, SITE_ORIGIN } from "../site-config.mjs";
import { GoogleAnalytics } from "./_components/GoogleAnalytics";
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
  verification: {
    google: "wIM8A1q0ozQnPZs4ahAXGhpWbHxZ4TjjQGtgBYnxDo4",
    yandex: "0e0f71b443cf0200",
    other: {
      "naver-site-verification": "f3d10a5731baa16cc14ac722e81dfbc90531b99d",
    },
  },
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
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          productionOrigin={SITE_ORIGIN}
        />
      </body>
    </html>
  );
}
