export const SITE_URL = "https://youtube2transcript.xyz";
export const SITE_NAME = "YouTube2Transcript";
export const BULKTRANSCRIPTS_URL = "https://bulktranscripts.co";
export const TRANSCRIPT_ENDPOINT =
  process.env.NEXT_PUBLIC_TRANSCRIPT_ENDPOINT ||
  "https://bulktranscripts.co/api/free-transcript";
export const EVENTS_ENDPOINT =
  process.env.NEXT_PUBLIC_EVENTS_ENDPOINT ||
  "https://bulktranscripts.co/api/events";

// The extension is live in the Chrome Web Store (Brave installs from the same
// listing), so the real URL is the default; the env var remains an override.
export const CHROME_EXTENSION_URL =
  process.env.NEXT_PUBLIC_CHROME_EXTENSION_URL ||
  "https://chromewebstore.google.com/detail/alcpcpgkeoddnjgfnminefbmmedpkiho";
