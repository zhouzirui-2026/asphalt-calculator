const badges = [
  {
    href: "https://www.scrolllaunch.com/products/ac-asphalt-calculator?utm_source=badge&utm_medium=embed&utm_campaign=ac-asphalt-calculator&ref=scrolllaunch",
    src: "https://www.scrolllaunch.com/api/badge/ac-asphalt-calculator",
    alt: "Featured on ScrollLaunch",
    width: 220,
    height: 48,
  },
  {
    href: "https://launchstreak.dev/productivity/asphalt-project-planning-without-hidden-assumptions",
    src: "https://launchstreak.dev/badge/launch-streak-badge-light.svg",
    alt: "Launched on Launch Streak",
    width: 248,
    height: 68,
  },
  {
    href: "https://easylaunch.dev/productivity/asphalt-project-planning-without-hidden-assumptions",
    src: "https://easylaunch.dev/badge/easylaunch-badge-light.svg",
    alt: "Featured on EasyLaunch",
    width: 188,
    height: 56,
  },
] as const;

export function DirectoryBadges() {
  return (
    <div className="directory-badges" aria-label="Directory listings">
      {badges.map((badge) => (
        <a key={badge.href} href={badge.href} target="_blank" rel="noopener noreferrer">
          {/* Directory services require their remotely hosted image URL for verification. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={badge.src}
            alt={badge.alt}
            width={badge.width}
            height={badge.height}
            loading="lazy"
            decoding="async"
          />
        </a>
      ))}
    </div>
  );
}
