import type { ReactNode } from "react";
import { SITE_ORIGIN } from "../../site-config.mjs";
import { GoogleAnalytics } from "./GoogleAnalytics";

export function DocumentLayout({
  children,
  locale,
}: {
  children: ReactNode;
  locale: { htmlLang: string; direction: "ltr" | "rtl" };
}) {
  return (
    <html lang={locale.htmlLang} dir={locale.direction}>
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
