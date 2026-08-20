export const ANALYTICS_CONSENT_KEY = "asphalt-analytics-consent";

export function isValidGaMeasurementId(value: string | undefined): value is string {
  return Boolean(value && /^G-[A-Z0-9]+$/i.test(value));
}

export function analyticsPageLocation(origin: string, pathname: string): string {
  const url = new URL(pathname, origin);
  return `${url.origin}${url.pathname}`;
}

export function isGoogleAnalyticsCookieName(value: string): boolean {
  return /^_(?:ga(?:_.+)?|gid|gat(?:_.+)?|gac_.+)$/i.test(value);
}
