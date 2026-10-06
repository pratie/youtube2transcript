import type { ReactNode } from "react";
import TranscriptTool from "@/components/transcript-tool";
import ChromeExtensionLink from "@/components/chrome-extension-link";
import SiteMenu from "@/components/site-menu";
import FeaturedOn from "@/components/featured-on";
import { BraveIcon, ChromeIcon } from "@/components/browser-icons";
import { BULKTRANSCRIPTS_URL, CHROME_EXTENSION_URL, SITE_NAME, SITE_URL } from "@/lib/constants";

const BULK_LINK = `${BULKTRANSCRIPTS_URL}/?source=youtube2transcript`;

// The visible FAQ and the FAQPage JSON-LD both render from this list, so the
// structured data always matches the page text word for word. `link` turns the
// first occurrence of its text into a link on the page; the schema keeps the
// plain sentence.
type Faq = { question: string; answer: string; link?: { text: string; href: string } };
const faq: Faq[] = [
  { question: "Is YouTube to Transcript free to use?", answer: "Yes. Paste one public YouTube video and get the transcript without an account or credit card. Fair-use limits keep the free service running for everyone. For 100+ videos, a channel or a playlist, use BulkTranscripts.", link: { text: "BulkTranscripts", href: BULK_LINK } },
  { question: "How do I get the transcript of a YouTube video?", answer: "Copy the video link from YouTube, paste it into the box above and press Get transcript. The text appears below the video within a few seconds when the video has captions." },
  { question: "Does it work on YouTube Shorts?", answer: "Yes. Paste a Shorts link (youtube.com/shorts/…) exactly like a regular video link. If the Short has a caption track, including an auto-generated one, you get its transcript with timestamps." },
  { question: "Does it work on videos without captions?", answer: "No. The tool reads the caption track YouTube already has for the video, so a video with captions disabled and no auto-generated track returns nothing. It does not generate speech-to-text." },
  { question: "Can I download the transcript as SRT or TXT?", answer: "Yes. Download clean text as TXT, or timed captions as SRT or VTT. Copy also works with timestamps on or off." },
  { question: "Can I get the transcript in another language?", answer: "The tool returns English captions when the video has them. Otherwise it returns the caption language the video does have, so a Spanish video with only Spanish captions gives you Spanish text. It does not translate." },
  { question: "Is there a limit on video length?", answer: "Long videos work as long as YouTube provides captions. A three-hour podcast takes a little longer to load than a ten-minute clip, that is all." },
  { question: "Can I get transcripts for a whole channel or playlist?", answer: "Not on this page, which handles one video at a time. Paste a playlist or channel link and it points you to BulkTranscripts, built by the same team, which pulls every video's transcript into one download.", link: { text: "BulkTranscripts", href: BULK_LINK } },
  { question: "Do you offer a YouTube transcript API?", answer: "Yes, through BulkTranscripts: a REST API and a hosted MCP server that handle channels, playlists and large collections, with 30 free credits to start.", link: { text: "BulkTranscripts", href: `${BULKTRANSCRIPTS_URL}/docs` } },
];

// Same pattern for the three visible steps and the HowTo JSON-LD.
const steps = [
  { text: "Copy the video link from YouTube. Watch links, share links and Shorts links all work." },
  { text: "Paste it above and press Get transcript. Captioned videos usually appear in a few seconds.", strong: "Get transcript" },
  { text: "Search, copy with or without timestamps, or download the file you need." },
];

function withInline(text: string, phrase: string | undefined, wrap: (phrase: string) => ReactNode) {
  const at = phrase ? text.indexOf(phrase) : -1;
  if (!phrase || at < 0) return text;
  return <>{text.slice(0, at)}{wrap(phrase)}{text.slice(at + phrase.length)}</>;
}

const ORG_ID = `${BULKTRANSCRIPTS_URL}/#organization`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": ORG_ID, name: "BulkTranscripts", url: BULKTRANSCRIPTS_URL },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, alternateName: ["YouTube to Transcript", "youtube2transcript.xyz"], inLanguage: "en", publisher: { "@id": ORG_ID } },
    {
      "@type": "WebApplication", "@id": `${SITE_URL}/#app`, name: SITE_NAME, url: SITE_URL,
      applicationCategory: "UtilitiesApplication", operatingSystem: "Any", browserRequirements: "Requires JavaScript",
      description: "Free YouTube transcript generator: paste one YouTube video or Shorts link and get its transcript as text with timestamps, then copy it or download TXT, SRT or VTT.",
      image: `${SITE_URL}/opengraph-image`, inLanguage: "en", isAccessibleForFree: true,
      featureList: ["Transcript from one YouTube video or Short", "Timestamps on or off", "Search inside the transcript", "Copy to clipboard", "Download as TXT, SRT or VTT", "No sign-up"],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      creator: { "@id": ORG_ID }, publisher: { "@id": ORG_ID },
    },
    {
      "@type": "HowTo", "@id": `${SITE_URL}/#how-it-works`, name: "How to get a YouTube transcript in three steps",
      step: steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, text: step.text, url: `${SITE_URL}/#how-it-works` })),
    },
    { "@type": "FAQPage", "@id": `${SITE_URL}/#faq`, mainEntity: faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ],
};

function Mark() { return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><rect x="4.5" y="6" width="23" height="19" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M10 12.5h12M10 17h8M10 21.5h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg></span>; }

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className="site-header"><SiteMenu /><a className="brand" href="#top" aria-label="YouTube2Transcript home"><Mark /><span>YouTube<span>2</span>Transcript</span></a><a className="header-link" href={BULK_LINK} aria-label="Need bulk transcripts? Open BulkTranscripts"><em>Need bulk transcripts?</em> <span>↗</span></a></header>
    <main id="top">
      <section className="hero"><div className="bookmark-badge"><kbd>Ctrl</kbd><b>/</b><kbd>⌘</kbd><b>+</b><kbd>D</kbd> Bookmark us!</div><h1>Free YouTube to Transcript</h1><p className="hero-copy">Paste a YouTube link, get the transcript as text. Free, no sign-up.<br />Search it, copy it, or download TXT, SRT and VTT.</p><TranscriptTool /><div className="chrome-cta"><span className="browser-icons"><ChromeIcon /><BraveIcon /></span><ChromeExtensionLink href={CHROME_EXTENSION_URL} /></div><div className="benefits"><span>▣ One-click copy</span><span>◷ Timestamps on or off</span><span>◎ Works on Shorts too</span></div></section>
      <a className="bulk-banner" href={BULK_LINK}>〈/〉 &nbsp; Need a YouTube Transcript API? Try BulkTranscripts with low bulk pricing <b>→</b></a>
      <section className="seo-content" id="how-it-works"><h2 className="color-heading purple">What you get from a YouTube video</h2><p>YouTube2Transcript turns one public YouTube video into readable text. It reads the video&rsquo;s own caption track, whether the creator wrote it or YouTube generated it, cleans up the caption fragments into sentences, and shows the result under the video. You can search inside it, toggle timestamps, copy the whole thing, or download it as a TXT, SRT or VTT file. No account, no card, no watermark.</p><h2 className="color-heading violet">How to get a YouTube transcript in three steps</h2><ol>{steps.map((step) => <li key={step.text}>{withInline(step.text, step.strong, (phrase) => <strong>{phrase}</strong>)}</li>)}</ol><h3 className="try-heading">Try it here</h3><TranscriptTool idPrefix="second" /><h2 className="color-heading pink">Which file to download</h2><ul><li><strong>TXT</strong> is plain text, one line per caption, for notes, documents and pasting into ChatGPT, Claude or NotebookLM.</li><li><strong>SRT</strong> keeps the start and end time of every line, for video editors and re-uploading captions.</li><li><strong>VTT</strong> is the web caption format for HTML5 players and browser extensions.</li></ul><h2 className="color-heading green">Languages and timestamps</h2><p>The tool returns English captions when the video has them, and otherwise the caption track the video does have: a Spanish video with only Spanish captions gives you Spanish text. It does not translate. Timestamps can be switched on when you need to quote a moment and off when you want clean reading text, and the copied text follows the switch.</p><h2 className="color-heading yellow">Why read instead of watch</h2><p>A one-hour lecture is a ten-minute read. Transcripts make a video searchable, quotable and easy to skim, and they are the fastest way to give an AI assistant the content of a video: paste the text into ChatGPT, Claude or NotebookLM and ask for a summary, a study guide, or the three points that matter. Students, researchers, journalists and people who prefer reading all use it the same way.</p><h2 className="color-heading purple">What it cannot do</h2><p>If a video has no captions at all, there is nothing to read and the tool says so rather than inventing text. Private and members-only videos are not reachable. And this page handles one video at a time by design: for a whole playlist or channel, or for hundreds of videos in one file, use <a className="inline-link" href={`${BULKTRANSCRIPTS_URL}/app?source=youtube2transcript`}>BulkTranscripts</a>, which is built by the same team for exactly that.</p></section>
      <section className="faq-section" id="faq"><h2 className="color-heading green">FAQ</h2><div className="faq-list">{faq.map(({ question, answer, link }) => <details key={question}><summary>{question}<span>⌄</span></summary><p>{link ? withInline(answer, link.text, (text) => <a className="inline-link" href={link.href}>{text}</a>) : answer}</p></details>)}</div></section><a className="bottom-cta" href="#top">Get YouTube Transcript For Free!</a>
    </main>
    <footer className="site-footer"><a className="brand" href="#top"><Mark /><span>YouTube<span>2</span>Transcript</span></a><p>Built by the team behind <a href={BULKTRANSCRIPTS_URL}>BulkTranscripts.co</a>. Independent service, not affiliated with YouTube or Google.</p><div><a href={`${BULKTRANSCRIPTS_URL}/docs`}>API</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="mailto:hello@bulktranscripts.co">Contact</a></div><FeaturedOn /></footer>
  </>;
}
