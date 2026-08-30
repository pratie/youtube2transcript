export type InputKind = "video" | "playlist" | "channel" | "invalid";

export type ClassifiedInput = {
  kind: InputKind;
  videoId?: string;
  normalizedUrl?: string;
};

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

export function classifyYoutubeInput(raw: string): ClassifiedInput {
  const trimmed = raw.trim();
  if (!trimmed) return { kind: "invalid" };

  let parsed: URL;
  try {
    const withScheme = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    parsed = new URL(withScheme);
  } catch {
    return { kind: "invalid" };
  }

  const host = parsed.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return { kind: "invalid" };

  const path = parsed.pathname.toLowerCase();
  if (parsed.searchParams.has("list") || path === "/playlist") {
    return { kind: "playlist" };
  }
  if (
    path.startsWith("/@") ||
    path.startsWith("/channel/") ||
    path.startsWith("/c/") ||
    path.startsWith("/user/")
  ) {
    return { kind: "channel" };
  }

  let videoId = "";
  if (host.endsWith("youtu.be")) {
    videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
  } else if (path === "/watch") {
    videoId = parsed.searchParams.get("v") || "";
  } else {
    const match = parsed.pathname.match(
      /^\/(?:shorts|live|embed)\/([A-Za-z0-9_-]{11})(?:\/|$)/,
    );
    videoId = match?.[1] || "";
  }

  if (!VIDEO_ID.test(videoId)) return { kind: "invalid" };
  return {
    kind: "video",
    videoId,
    normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

export function formatClock(seconds: number): string {
  const value = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const secs = value % 60;
  if (hours) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function formatDuration(seconds?: number | null): string {
  if (!seconds) return "";
  return formatClock(seconds);
}
