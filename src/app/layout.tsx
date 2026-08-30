import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "YouTube to Transcript – Free YouTube Transcript Generator",
  description: "Convert a YouTube video to text for free. Paste a video URL to get a readable transcript with timestamps, then copy or download TXT, SRT and VTT.",
  applicationName: SITE_NAME,
  authors: [{ name: "BulkTranscripts", url: "https://bulktranscripts.co" }],
  creator: "BulkTranscripts",
  publisher: "BulkTranscripts",
  alternates: { canonical: "/" },
  keywords: ["YouTube to transcript", "YouTube transcript generator", "YouTube transcript downloader", "YouTube to text", "YouTube transcript with timestamps"],
  openGraph: {
    type: "website", url: SITE_URL, siteName: SITE_NAME,
    title: "YouTube to Transcript – Free Transcript Generator",
    description: "Paste one YouTube video. Get clean, timestamped text you can copy or download.",
  },
  twitter: {
    card: "summary_large_image", title: "YouTube to Transcript – Free Transcript Generator",
    description: "Paste one YouTube video. Get clean, timestamped text you can copy or download.",
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, themeColor: "#fffdf8", colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}
