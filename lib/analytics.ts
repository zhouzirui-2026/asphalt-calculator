export function isValidGaMeasurementId(value: string | undefined): value is string {
  return Boolean(value && /^G-[A-Z0-9]+$/i.test(value));
}

export function analyticsPageLocation(origin: string, pathname: string): string {
  const url = new URL(pathname, origin);
  return `${url.origin}${url.pathname}`;
}

export function isProductionAnalyticsOrigin(
  currentOrigin: string,
  productionOrigin: string,
): boolean {
  try {
    const current = new URL(currentOrigin);
    const production = new URL(productionOrigin);
    return current.protocol === "https:" && current.origin === production.origin;
  } catch {
    return false;
  }
}
