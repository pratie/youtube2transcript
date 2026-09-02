"use client";

import { track } from "@/lib/tracking";

export default function ChromeExtensionLink({ href }: { href: string }) {
  return <a href={href} onClick={() => track("chrome_extension_click", "landing")} target="_blank" rel="noopener">
    <strong>Add the browser extension</strong>
    <small>Works in Chrome &amp; Brave — get transcripts without leaving YouTube!</small>
  </a>;
}
