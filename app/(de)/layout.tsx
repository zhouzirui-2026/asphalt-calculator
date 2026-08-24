import type { Metadata } from "next";
import {
  GERMAN_LOCALE,
  SITE_INDEXING_ENABLED,
  SITE_ORIGIN,
} from "../../site-config.mjs";
import { DocumentLayout } from "../_components/DocumentLayout";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "Asphalt-Rechner", template: "%s" },
  description: "Asphaltmenge in Tonnen mit metrischen Eingaben, offener Formel und anpassbarer Dichte berechnen.",
  robots: { index: SITE_INDEXING_ENABLED, follow: SITE_INDEXING_ENABLED },
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  verification: {
    google: "wIM8A1q0ozQnPZs4ahAXGhpWbHxZ4TjjQGtgBYnxDo4",
    yandex: "0e0f71b443cf0200",
    other: {
      "naver-site-verification": "f3d10a5731baa16cc14ac722e81dfbc90531b99d",
    },
  },
};

export default function GermanRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DocumentLayout locale={GERMAN_LOCALE}>{children}</DocumentLayout>;
}
