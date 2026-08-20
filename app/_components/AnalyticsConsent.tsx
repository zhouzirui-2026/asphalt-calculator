"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ANALYTICS_CONSENT_KEY,
  analyticsPageLocation,
  isGoogleAnalyticsCookieName,
  isProductionAnalyticsOrigin,
  isValidGaMeasurementId,
} from "../../lib/analytics";

type Consent = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const ANALYTICS_PREFERENCES_EVENT = "asphalt:analytics-preferences";

function removeGoogleAnalyticsCookies() {
  const hostname = window.location.hostname;
  const domainCandidates = new Set([hostname, `.${hostname}`]);
  const hostnameParts = hostname.split(".");
  if (hostnameParts.length > 2) {
    domainCandidates.add(`.${hostnameParts.slice(-2).join(".")}`);
  }

  for (const entry of document.cookie.split(";")) {
    const cookieName = entry.split("=", 1)[0]?.trim();
    if (!cookieName || !isGoogleAnalyticsCookieName(cookieName)) continue;
    document.cookie = `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
    for (const domain of domainCandidates) {
      document.cookie = `${cookieName}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
    }
  }
}

export function AnalyticsConsent({
  measurementId,
  productionOrigin,
}: {
  measurementId?: string;
  productionOrigin: string;
}) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | "loading">("loading");
  const [tagReady, setTagReady] = useState(false);
  const previousPath = useRef<string | null>(null);
  const hadGrantedConsent = useRef(false);
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
    if (!analyticsEnabled) return;
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    hadGrantedConsent.current = stored === "granted";
    let active = true;
    queueMicrotask(() => {
      if (active) setConsent(stored === "granted" || stored === "denied" ? stored : null);
    });

    const openPreferences = () => setConsent(null);
    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences);
    return () => {
      active = false;
      window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences);
    };
  }, [analyticsEnabled]);

  useEffect(() => {
    if (!tagReady || consent !== "granted" || !analyticsEnabled || !validMeasurementId || !window.gtag) return;
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.gtag("event", "page_view", {
      page_location: analyticsPageLocation(window.location.origin, pathname),
      page_path: pathname,
      page_title: document.title,
    });
  }, [analyticsEnabled, consent, pathname, tagReady, validMeasurementId]);

  if (!analyticsEnabled || !validMeasurementId) return null;

  const choose = (choice: Exclude<Consent, null>) => {
    const shouldReload = choice === "denied" && hadGrantedConsent.current;
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
    hadGrantedConsent.current = choice === "granted";
    if (choice === "denied") removeGoogleAnalyticsCookies();
    setConsent(choice);
    if (shouldReload) window.location.reload();
  };

  return (
    <>
      {consent === "granted" ? (
        <Script
          id="google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`}
          strategy="afterInteractive"
          onLoad={() => {
            window.dataLayer = window.dataLayer || [];
            window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
            window.gtag("js", new Date());
            window.gtag("config", validMeasurementId, {
              allow_ad_personalization_signals: false,
              allow_google_signals: false,
              send_page_view: false,
            });
            setTagReady(true);
          }}
        />
      ) : null}
      {consent === null ? (
        <aside className="analytics-consent" aria-labelledby="analytics-consent-title">
          <div>
            <p className="analytics-consent__title" id="analytics-consent-title">Optional analytics</p>
            <p>
              Allow Google Analytics to help us understand which pages are useful. Calculator
              inputs and share-link query values are excluded. You can continue without analytics.
            </p>
          </div>
          <div className="analytics-consent__actions">
            <button className="button button--primary" type="button" onClick={() => choose("granted")}>
              Allow analytics
            </button>
            <button className="button button--secondary" type="button" onClick={() => choose("denied")}>
              Continue without analytics
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
