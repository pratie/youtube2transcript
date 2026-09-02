import { EVENTS_ENDPOINT } from "@/lib/constants";

const DEVICE_KEY = "youtube2transcript_device";
let memoryDeviceId = "";

/** Stable per-browser id for fair-use limits. Storage may be blocked
 * (Safari private mode, strict privacy settings) so every access is guarded
 * and a per-page-load id is used as the fallback. */
export function deviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = window.localStorage.getItem(DEVICE_KEY);
    if (stored) return stored;
  } catch { /* storage blocked */ }
  if (!memoryDeviceId) {
    memoryDeviceId = window.crypto?.randomUUID?.() ||
      `yt2t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  try {
    window.localStorage.setItem(DEVICE_KEY, memoryDeviceId);
  } catch { /* storage blocked */ }
  return memoryDeviceId;
}

/** Fire-and-forget product event to GA4 and the first-party events endpoint.
 * Must never throw or block the tool. */
export function track(name: string, detail?: string) {
  if (typeof window === "undefined") return;
  try {
    const analyticsWindow = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof analyticsWindow.gtag === "function") {
      analyticsWindow.gtag("event", name, {
        event_category: "youtube2transcript",
        event_label: detail,
      });
    }
  } catch { /* analytics must never affect the tool */ }
  try {
    void fetch(EVENTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Id": deviceId(),
      },
      body: JSON.stringify({ name, detail }),
      keepalive: true,
    }).catch(() => undefined);
  } catch { /* ignore */ }
}
