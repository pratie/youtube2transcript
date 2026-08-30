import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the YouTube2Transcript single-video transcript tool.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <main className="legal-page">
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">≋</span><span>YouTube<span>2</span>Transcript</span></Link>
      <span className="eyebrow">Last updated August 30, 2026</span>
      <h1>Terms of use</h1>
      <p>By using YouTube2Transcript, you agree to use the service responsibly and only for content you are permitted to access and process.</p>
      <article>
        <h2>Single-video utility</h2>
        <p>This site is intended for individual YouTube video transcripts. Channel, playlist, API and bulk workflows are provided separately through BulkTranscripts.</p>
        <h2>Fair use and availability</h2>
        <p>Free access is subject to request, device and network limits. We may throttle or block automated, abusive or disruptive traffic. The service is provided as available; a transcript may be unavailable because captions do not exist, YouTube restricts access, or an upstream service changes.</p>
        <h2>Your responsibilities</h2>
        <ul>
          <li>Do not use the service to infringe copyright, privacy or other rights.</li>
          <li>Do not evade usage limits, probe credentials or disrupt the service.</li>
          <li>Confirm that your use of transcript content is lawful in your jurisdiction.</li>
        </ul>
        <h2>No YouTube affiliation</h2>
        <p>YouTube2Transcript is an independent service and is not affiliated with, sponsored by or endorsed by YouTube or Google. YouTube is a trademark of Google LLC.</p>
        <h2>Changes</h2>
        <p>We may update the tool and these terms as the service evolves. Continued use after an update means you accept the revised terms.</p>
        <h2>Contact</h2>
        <p>Questions can be sent to <a href="mailto:sneakyguysaas@gmail.com">sneakyguysaas@gmail.com</a>.</p>
      </article>
      <Link className="back-home" href="/">← Back to the transcript tool</Link>
    </main>
  );
}
