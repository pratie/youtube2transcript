import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Bump when the page content materially changes; Google uses lastmod and
// ignores changeFrequency/priority.
const HOME_UPDATED = new Date("2026-09-02");
const LEGAL_UPDATED = new Date("2026-08-30");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: HOME_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacy`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
