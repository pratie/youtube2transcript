import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free YouTube Transcript Generator – YouTube to Transcript, No Sign-up",
    template: "%s · YouTube2Transcript",
  },
  description: "Free YouTube transcript generator. Paste a video or Shorts link, get the transcript with timestamps, then copy it or download TXT, SRT or VTT. No sign-up.",
  applicationName: SITE_NAME,
  authors: [{ name: "BulkTranscripts", url: "https://bulktranscripts.co" }],
  creator: "BulkTranscripts",
  publisher: "BulkTranscripts",
  alternates: { canonical: "/" },
  keywords: ["YouTube to transcript", "free YouTube transcript", "YouTube transcript generator", "YouTube to text", "YouTube transcript with timestamps"],
  openGraph: {
    type: "website", url: SITE_URL, siteName: SITE_NAME, locale: "en_US",
    title: "Free YouTube Transcript Generator – YouTube to Transcript, No Sign-up",
    description: "Paste one YouTube video. Get clean, timestamped text you can copy or download.",
  },
  twitter: {
    card: "summary_large_image", title: "Free YouTube Transcript Generator – YouTube to Transcript, No Sign-up",
    description: "Paste one YouTube video. Get clean, timestamped text you can copy or download.",
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, themeColor: "#fffdf8", colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-7T65HQ5HLL";
  return <html lang="en"><body>
    {children}
    <Script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
    <Script id="google-analytics">
      {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`}
    </Script>
  </body></html>;
}
