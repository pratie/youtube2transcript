import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How YouTube2Transcript handles URLs, transcripts and privacy-safe usage data.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <main className="legal-page">
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">≋</span><span>YouTube<span>2</span>Transcript</span></Link>
      <span className="eyebrow">Last updated August 30, 2026</span>
      <h1>Privacy policy</h1>
      <p>We designed this tool to work without an account and to collect as little personal information as practical.</p>
      <article>
        <h2>What the tool processes</h2>
        <p>When you request a transcript, the YouTube video URL is sent to the BulkTranscripts extraction service. The resulting transcript and basic public video metadata may be cached so the same public transcript does not need to be fetched repeatedly.</p>
        <h2>Anonymous identity and abuse prevention</h2>
        <p>Your browser stores a random device identifier. The service also derives privacy-safe, one-way identifiers from the device and public IP address to enforce fair-use limits and prevent automated abuse. Raw device identifiers and raw IP addresses are not stored with transcript activity.</p>
        <h2>Usage measurements</h2>
        <p>We record limited product events such as a transcript completing, a download format being selected, or a BulkTranscripts link being opened. These events are used to understand reliability and improve the tool. We do not sell personal information.</p>
        <h2>Embedded YouTube player</h2>
        <p>Transcript results can include a privacy-enhanced YouTube embed served from youtube-nocookie.com. Playing or interacting with that embed is subject to Google and YouTube’s own privacy practices.</p>
        <h2>Payments and accounts</h2>
        <p>YouTube2Transcript does not collect payment-card information. If you follow a link to BulkTranscripts and purchase credits, its payment provider and separate privacy terms apply.</p>
        <h2>Contact</h2>
        <p>Questions or deletion requests can be sent to <a href="mailto:sneakyguysaas@gmail.com">sneakyguysaas@gmail.com</a>.</p>
      </article>
      <Link className="back-home" href="/">← Back to the transcript tool</Link>
    </main>
  );
}
