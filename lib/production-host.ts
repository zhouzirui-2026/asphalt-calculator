import { SITE_ORIGIN } from "../site-config.mjs";

export function productionRedirectUrl(requestUrl: string): URL | null {
  const url = new URL(requestUrl);
  if (url.hostname !== "asphalt-calculator-sooty.vercel.app") return null;
  const canonical = new URL(SITE_ORIGIN);
  url.protocol = canonical.protocol;
  url.hostname = canonical.hostname;
  url.port = canonical.port;
  return url;
}

export function trailingSlashRedirectUrl(requestUrl: string): URL | null {
  const url = new URL(requestUrl);
  if (url.pathname === "/" || !url.pathname.endsWith("/")) return null;
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url;
}
