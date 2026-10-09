import { NextRequest, NextResponse } from "next/server";
import {
  productionRedirectUrl,
  trailingSlashRedirectUrl,
} from "./lib/production-host";

export function proxy(request: NextRequest) {
  const canonical = productionRedirectUrl(request.url);
  if (canonical) return NextResponse.redirect(canonical, 308);
  // Keep the existing canonical/Preview slash policy after alias consolidation.
  const normalized = trailingSlashRedirectUrl(request.url);
  if (normalized) return NextResponse.redirect(normalized, 308);
  return NextResponse.next();
}

export const config = { matcher: "/:path*" };
