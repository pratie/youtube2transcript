import TranscriptTool from "@/components/transcript-tool";
import {
  BULKTRANSCRIPTS_URL,
  CHROME_EXTENSION_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";

const faq = [
  {
    question: "Is YouTube2Transcript free to use?",
    answer:
      "You can start free without creating an account or entering a credit card. Fair-use limits protect the service from automated abuse. If you need transcripts from many videos, BulkTranscripts offers one-time credit packs that never expire.",
  },
  {
    question: "Can I download the transcript?",
    answer:
      "Yes. Download a clean TXT document or timestamped SRT and VTT caption files. You can also copy the full transcript to your clipboard in one click.",
  },
  {
    question: "Does it work with playlists and channels?",
    answer:
      "This tool intentionally handles one YouTube video at a time. When you paste a playlist or channel URL, we hand it to BulkTranscripts, which is designed to extract complete playlists and channels.",
  },
  {
    question: "Which transcript languages are supported?",
    answer:
      "The tool returns an accessible caption track supplied for that YouTube video. It prefers English when available and otherwise uses another available transcript language. It does not invent or automatically translate captions.",
  },
  {
    question: "Can I click a transcript line to play that moment?",
    answer:
      "Yes. Timestamped transcript lines are interactive. Select one and the embedded video starts from that point, which makes long interviews, lectures and tutorials easier to navigate.",
  },
  {
    question: "Do you offer a YouTube transcript API?",
    answer:
      "Yes. BulkTranscripts provides a REST API and hosted MCP server for developers and AI agents, with one-time credits instead of a monthly subscription.",
  },
];

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  description:
    "Convert a YouTube video into a readable transcript with timestamps. Copy it or download TXT, SRT and VTT files.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: {
    "@type": "Organization",
    name: "BulkTranscripts",
    url: BULKTRANSCRIPTS_URL,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <rect x="4.5" y="6" width="23" height="19" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M10 12.5h12M10 17h8M10 21.5h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="YouTube2Transcript home">
          <Mark />
          <span>YouTube<span>2</span>Transcript</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#use-cases">Use cases</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-link" href={`${BULKTRANSCRIPTS_URL}/?source=youtube2transcript`}>
          Need bulk transcripts? <Arrow />
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-inner">
            <div className="hero-proof"><span className="pulse" />Free single-video transcript tool</div>
            <h1>YouTube to Transcript</h1>
            <p className="hero-copy">
              Turn any YouTube video into clean, readable text. Search it, copy it,
              or download timestamped caption files in seconds.
            </p>
            <TranscriptTool />
            <div className="trust-row" aria-label="Tool benefits">
              <span><b>✓</b> No signup</span>
              <span><b>✓</b> Clickable timestamps</span>
              <span><b>✓</b> TXT, SRT and VTT</span>
              <span><b>✓</b> No monthly plan</span>
            </div>
          </div>
        </section>

        <section className="format-strip" aria-label="Available formats">
          <p>One video in. Your transcript out.</p>
          <div>
            <span>Readable text</span><i /><span>Timestamped captions</span><i /><span>AI-ready copy</span>
          </div>
        </section>

        <section className="section how" id="how-it-works">
          <div className="section-heading centered">
            <span className="eyebrow">Three simple steps</span>
            <h2>Get the words without scrubbing through the video.</h2>
            <p>No account setup, browser extension or complicated export screen required.</p>
          </div>
          <div className="steps">
            <article>
              <span className="step-number">01</span><div className="step-icon link-icon" aria-hidden="true">↗</div>
              <h3>Paste the video link</h3><p>Copy a direct YouTube video URL from your browser or the YouTube app.</p>
            </article>
            <article>
              <span className="step-number">02</span><div className="step-icon" aria-hidden="true">≋</div>
              <h3>Get the transcript</h3><p>We retrieve an available caption track and arrange it into readable lines.</p>
            </article>
            <article>
              <span className="step-number">03</span><div className="step-icon" aria-hidden="true">↓</div>
              <h3>Copy or download</h3><p>Copy clean text, search the transcript, or save TXT, SRT and VTT files.</p>
            </article>
          </div>
        </section>

        <section className="section player-feature">
          <div className="feature-copy">
            <span className="eyebrow">Transcript meets video</span>
            <h2>Find the exact moment you need.</h2>
            <p>
              Every timestamp is a shortcut into the embedded video. Jump directly to a
              quote, explanation or chapter instead of dragging the playhead and guessing.
            </p>
            <ul className="check-list">
              <li><span>✓</span> Search across the full transcript</li>
              <li><span>✓</span> Turn timestamps on or off</li>
              <li><span>✓</span> Keep the video and words side by side</li>
            </ul>
          </div>
          <div className="demo-card" aria-label="Example of a timestamped transcript">
            <div className="demo-video"><span className="demo-play">▶</span><span className="demo-duration">12:48</span></div>
            <div className="demo-lines">
              <span className="demo-label">Transcript</span>
              <p><time>00:00</time> Today we’re breaking down the idea step by step.</p>
              <p className="active"><time>00:14</time> The useful part starts with one simple question.</p>
              <p><time>00:27</time> Once you see the pattern, the rest becomes much clearer.</p>
            </div>
          </div>
        </section>

        <section className="section use-cases" id="use-cases">
          <div className="section-heading">
            <span className="eyebrow">More useful than subtitles alone</span>
            <h2>Turn video into material you can actually work with.</h2>
          </div>
          <div className="use-grid">
            <article><span className="use-icon" aria-hidden="true">⌁</span><h3>Study and research</h3><p>Search lectures, interviews and explainers. Pull quotations into notes without replaying the same section.</p></article>
            <article><span className="use-icon" aria-hidden="true">✦</span><h3>Work with AI tools</h3><p>Give clean source material to ChatGPT, Claude or NotebookLM for questions, summaries and study guides.</p></article>
            <article><span className="use-icon" aria-hidden="true">◫</span><h3>Repurpose your content</h3><p>Turn your own videos into show notes, articles, newsletters, social posts and accessible written resources.</p></article>
          </div>
        </section>

        <section className="section extension-section">
          <div className="extension-card">
            <div className="chrome-symbol" aria-hidden="true"><span /></div>
            <div>
              <span className="eyebrow">Stay on YouTube</span>
              <h2>Read transcripts without switching tabs.</h2>
              <p>The BulkTranscripts Chrome extension puts the transcript next to the video, ready to search and copy while you watch.</p>
            </div>
            {CHROME_EXTENSION_URL ? (
              <a className="button button-light" href={CHROME_EXTENSION_URL}>Add to Chrome <Arrow /></a>
            ) : <span className="coming-soon">Chrome Web Store · Coming soon</span>}
          </div>
        </section>

        <section className="section bulk-section">
          <div className="bulk-copy">
            <span className="eyebrow">When one video is not enough</span>
            <h2>A playlist is a project.<br />A channel is a library.</h2>
            <p>
              YouTube2Transcript handles the video in front of you. BulkTranscripts handles
              50, 500 or 5,000 videos—complete channels, playlists and export-ready research collections.
            </p>
            <a className="button button-primary" href={`${BULKTRANSCRIPTS_URL}/?source=youtube2transcript`}>Explore BulkTranscripts <Arrow /></a>
          </div>
          <div className="bulk-visual" aria-hidden="true">
            <div className="source-card source-one"><span>01</span><b>Video transcript</b><i /></div>
            <div className="source-card source-two"><span>02</span><b>Video transcript</b><i /></div>
            <div className="source-card source-three"><span>03</span><b>Video transcript</b><i /></div>
            <div className="combined-card"><small>COMBINED DOCUMENT</small><strong>Complete channel research</strong><i /><i /><i /><i /></div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading centered">
            <span className="eyebrow">Frequently asked questions</span><h2>Everything you need to know.</h2>
          </div>
          <div className="faq-list">
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">The fastest way from video to words</span><h2>Have a YouTube link?</h2>
          <p>Paste it above and get the transcript while it’s still on your mind.</p>
          <a className="button button-light" href="#tool">Get a transcript</a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <a className="brand" href="#top"><Mark /><span>YouTube<span>2</span>Transcript</span></a>
          <p>A focused single-video tool built by the team behind <a href={BULKTRANSCRIPTS_URL}>BulkTranscripts.co</a>.</p>
        </div>
        <div className="footer-links">
          <div><strong>Tool</strong><a href="#how-it-works">How it works</a><a href="#use-cases">Use cases</a><a href="#faq">FAQ</a></div>
          <div><strong>BulkTranscripts</strong><a href={`${BULKTRANSCRIPTS_URL}/app`}>Web app</a><a href={`${BULKTRANSCRIPTS_URL}/docs`}>API docs</a><a href={`${BULKTRANSCRIPTS_URL}/youtube-mcp-server`}>MCP server</a></div>
          <div><strong>Legal</strong><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:sneakyguysaas@gmail.com">Contact</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 YouTube2Transcript</span><span>Independent service. Not affiliated with YouTube or Google.</span></div>
      </footer>
    </>
  );
}
