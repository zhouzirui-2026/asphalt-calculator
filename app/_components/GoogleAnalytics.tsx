"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  analyticsPageLocation,
  isProductionAnalyticsOrigin,
  isValidGaMeasurementId,
} from "../../lib/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics({
  measurementId,
  productionOrigin,
}: {
  measurementId?: string;
  productionOrigin: string;
}) {
  const pathname = usePathname();
  const [tagReady, setTagReady] = useState(false);
  const previousPath = useRef<string | null>(null);
  const validMeasurementId = isValidGaMeasurementId(measurementId)
    ? measurementId
    : undefined;
  const isProductionHost = useSyncExternalStore(
    () => () => undefined,
    () => isProductionAnalyticsOrigin(window.location.origin, productionOrigin),
    () => false,
  );
  const analyticsEnabled = Boolean(validMeasurementId && isProductionHost);

  useEffect(() => {
    if (!tagReady || !analyticsEnabled || !validMeasurementId || !window.gtag) return;
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.gtag("event", "page_view", {
      page_location: analyticsPageLocation(window.location.origin, pathname),
      page_path: pathname,
      page_title: document.title,
    });
  }, [analyticsEnabled, pathname, tagReady, validMeasurementId]);

  if (!analyticsEnabled || !validMeasurementId) return null;

  return (
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () { window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', ${JSON.stringify(validMeasurementId)}, {
            allow_ad_personalization_signals: false,
            allow_google_signals: false,
            send_page_view: false
          });
        `}
      </Script>
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`}
        strategy="afterInteractive"
        onLoad={() => setTagReady(true)}
      />
    </>
  );
}
