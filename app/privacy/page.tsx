import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../lib/seo";
import { SiteShell } from "../_components/SiteShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this asphalt calculator handles inputs, share links, hosting logs, Google Analytics, cookies, and personal information.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
  openGraph: { type: "website", url: "/privacy", title: "Privacy Policy", description: "A plain-language privacy policy for a calculator that processes project inputs locally.", images: [SOCIAL_IMAGE] },
  twitter: { card: "summary", title: "Privacy Policy", description: "A plain-language privacy policy for a calculator that processes project inputs locally.", images: [TWITTER_IMAGE] },
};

export default function PrivacyPage() {
  return <SiteShell currentPath="/privacy"><main className="page-main prose-page shell">
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Privacy</span></nav>
    <header className="prose-header"><p className="eyebrow">Privacy</p><h1>Privacy policy</h1><p>You can use every calculator without providing personal information.</p><div className="byline"><span>Effective August 20, 2026</span><span>Last reviewed August 21, 2026</span></div></header>
    <section><h2>Calculator inputs</h2><p>Measurements, density, waste, and prices are calculated in your browser. The site does not send those values to a database or user account.</p></section>
    <section><h2>Share links and printing</h2><p>If you choose Copy share link, the visible calculator inputs are placed in the page URL and copied locally when browser permission allows. Anyone who receives that URL can read those values. Do not put confidential project information into calculator fields. Printing uses your browser’s print function.</p></section>
    <section><h2>Hosting and operational logs</h2><p>Vercel hosts the site and may automatically process standard request metadata, such as IP address, browser details, requested URL, and timestamps, for delivery, reliability, abuse prevention, and security.</p></section>
    <section><h2>Google Analytics</h2><p>On the canonical production site, Google Analytics loads automatically to measure basic page use. It may use cookies and process page paths, referrer information, browser and device details, approximate location derived from network information, and usage events. The implementation removes URL query strings before sending page-location events, so calculator inputs stored in share links are not included. Advertising personalization and Google signals are disabled.</p><p>Google describes its processing in its <a href="https://policies.google.com/privacy">Privacy Policy</a>. Browser privacy controls, content blockers, or Google&apos;s analytics opt-out tools may prevent collection.</p></section>
    <section><h2>Support email</h2><p>If you voluntarily email <a href="mailto:support@asphalt-calculator.top">support@asphalt-calculator.top</a>, Cloudflare Email Routing forwards the message to a monitored Google mailbox. Cloudflare and Google may process your sender address, message content, routing metadata, and attachments to deliver and protect the message. Messages may remain in the mailbox while needed to respond and maintain a correction record. Do not send passwords, payment details, confidential project data, or other sensitive information.</p><p>The calculator never emails your measurements, prices, share-link values, or analytics choice. Sending a support message is optional and is separate from using the calculators.</p></section>
    <section><h2>Accounts, payments, and advertising</h2><p>The site has no account system, payment service, contact form, remote application database, outbound email service, or advertising script.</p></section>
    <section><h2>Future changes</h2><p>If advertising, contact forms, or another data processor is added later, this policy will be updated before that feature is enabled. See the <Link href="/about">About page</Link> for the correction policy.</p></section>
  </main></SiteShell>;
}
