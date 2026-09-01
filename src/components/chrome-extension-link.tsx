"use client";

import { EVENTS_ENDPOINT } from "@/lib/constants";

function deviceId(): string {
  const key = "youtube2transcript_device";
  const stored = window.localStorage.getItem(key);
  if (stored) return stored;
  const created = window.crypto?.randomUUID?.() ||
    `yt2t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(key, created);
  return created;
}

export default function ChromeExtensionLink({ href }: { href: string }) {
  function trackClick() {
    try {
      const analyticsWindow = window as unknown as {
        gtag?: (...args: unknown[]) => void;
      };
      analyticsWindow.gtag?.("event", "chrome_extension_click", {
        source: "youtube2transcript",
      });
    } catch { /* analytics must never block navigation */ }
    void fetch(EVENTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Id": deviceId(),
      },
      body: JSON.stringify({ name: "chrome_extension_click", detail: "landing" }),
      keepalive: true,
    }).catch(() => undefined);
  }

  return <a href={href} onClick={trackClick} target="_blank" rel="noopener">
    <strong>Add the browser extension</strong>
    <small>Works in Chrome &amp; Brave — get transcripts without leaving YouTube!</small>
  </a>;
}
