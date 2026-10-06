// "Featured on" badge row for the footer. Add a directory's badge by appending
// one entry to FEATURED_ON; while the list is empty the component renders
// nothing, so the footer looks exactly as it does today.
//
// Directories that list us usually require a followed link back, so the
// anchor deliberately carries no `rel` (no nofollow/ugc/sponsored) and no
// target. Keep width/height set to the badge's real pixel size so the footer
// does not shift while the image loads.

export type FeaturedBadge = {
  /** Directory page that lists YouTube2Transcript. */
  href: string;
  /** Badge image URL, as the directory provides it. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const FEATURED_ON: FeaturedBadge[] = [
  // { href: "https://example-directory.com/tools/youtube2transcript", src: "https://example-directory.com/badge.svg", alt: "Featured on Example Directory", width: 150, height: 54 },
];

export default function FeaturedOn() {
  if (FEATURED_ON.length === 0) return null;
  return (
    <nav className="featured-on" aria-label="Featured on">
      <span>Featured on</span>
      <ul>
        {FEATURED_ON.map((badge) => (
          <li key={badge.href}>
            <a href={badge.href}>
              {/* External badge images are hotlinked as the directories ask; next/image would proxy them. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badge.src} alt={badge.alt} width={badge.width} height={badge.height} loading="lazy" decoding="async" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
