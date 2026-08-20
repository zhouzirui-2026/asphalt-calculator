"use client";

import { useSyncExternalStore } from "react";
import {
  isProductionAnalyticsOrigin,
  isValidGaMeasurementId,
} from "../../lib/analytics";
import { ANALYTICS_PREFERENCES_EVENT } from "./AnalyticsConsent";

export function AnalyticsPreferencesButton({ productionOrigin }: { productionOrigin: string }) {
  const isProductionHost = useSyncExternalStore(
    () => () => undefined,
    () => isProductionAnalyticsOrigin(window.location.origin, productionOrigin),
    () => false,
  );

  if (
    !isProductionHost
    || !isValidGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
  ) return null;

  return (
    <button
      className="footer-link-button"
      type="button"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT))}
    >
      Analytics choices
    </button>
  );
}
