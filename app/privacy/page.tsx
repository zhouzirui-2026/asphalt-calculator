import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../lib/seo";
import { SiteShell } from "../_components/SiteShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this local-first asphalt calculator handles inputs, share links, printing, logs, cookies, analytics, and personal information.",
  alternates: { canonical: "/privacy" },
  openGraph: { type: "website", url: "/privacy", title: "Privacy Policy", description: "A plain-language privacy policy for a calculator that processes project inputs locally.", images: [SOCIAL_IMAGE] },
  twitter: { card: "summary", title: "Privacy Policy", description: "A plain-language privacy policy for a calculator that processes project inputs locally.", images: [TWITTER_IMAGE] },
};

export default function PrivacyPage() {
  return <SiteShell currentPath="/privacy"><main className="page-main prose-page shell">
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Privacy</span></nav>
    <header className="prose-header"><p className="eyebrow">Privacy</p><h1>Privacy policy</h1><p>This first release is designed not to collect personal information.</p><div className="byline"><span>Effective August 18, 2026</span><span>Last reviewed August 18, 2026</span></div></header>
    <section><h2>Calculator inputs</h2><p>Measurements, density, waste, and prices are calculated in your browser. The site does not send those values to a database or user account.</p></section>
    <section><h2>Share links and printing</h2><p>If you choose Copy share link, the visible calculator inputs are placed in the page URL and copied locally when browser permission allows. Anyone who receives that URL can read those values. Do not put confidential project information into calculator fields. Printing uses your browser’s print function.</p></section>
    <section><h2>Cookies, analytics, accounts, and advertising</h2><p>This first release has no account system, analytics tag, advertising script, payment service, email form, or application cookie. Hosting infrastructure may generate basic security and request logs when the site is eventually deployed; that hosting policy must be documented before launch.</p></section>
    <section><h2>Changes before launch</h2><p>If analytics, advertising, contact forms, or another data processor is added later, this policy and consent behavior must be updated before that feature is enabled. See the <Link href="/about">About page</Link> for the correction policy.</p></section>
  </main></SiteShell>;
}
