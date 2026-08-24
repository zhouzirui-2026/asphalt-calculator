import type { Metadata } from "next";
import {
  FRENCH_LOCALE,
  SITE_INDEXING_ENABLED,
  SITE_ORIGIN,
} from "../../site-config.mjs";
import { DocumentLayout } from "../_components/DocumentLayout";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "Calcul d’enrobé", template: "%s" },
  description: "Calculez le tonnage d’enrobé avec des unités métriques, une formule visible et une densité modifiable.",
  robots: { index: SITE_INDEXING_ENABLED, follow: SITE_INDEXING_ENABLED },
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
};

export default function FrenchRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DocumentLayout locale={FRENCH_LOCALE}>{children}</DocumentLayout>;
}
