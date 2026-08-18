import type { Metadata } from "next";
import { SITE_ORIGIN } from "../site-config.mjs";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Asphalt Calculator — Material & Driveway Planning",
    template: "%s",
  },
  description:
    "Plan asphalt material and driveway costs with editable assumptions, visible formulas, and US or metric units.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
