"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import {
  BULKTRANSCRIPTS_URL,
  EVENTS_ENDPOINT,
  TRANSCRIPT_ENDPOINT,
} from "@/lib/constants";
import {
  classifyYoutubeInput,
  formatClock,
  formatDuration,
  InputKind,
} from "@/lib/youtube";

type Segment = {
  text: string;
  start: number;
  duration?: number;
};

type Transcript = {
  video_id: string;
  title: string;
  channel?: string;
  duration?: number;
  language?: string;
  text: string;
  segments?: Segment[];
  word_count?: number;
  cached?: boolean;
};

type ApiError = {
  code?: string;
  message?: string;
  sourceType?: InputKind;
  bulkUrl?: string;
};

function deviceId(): string {
  const key = "youtube2transcript_device";
  const stored = window.localStorage.getItem(key);
  if (stored) return stored;
  const created = window.crypto?.randomUUID?.() ||
    `yt2t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(key, created);
  return created;
}

function track(name: string, detail?: string) {
  try {
    const analyticsWindow = typeof window !== "undefined"
      ? window as unknown as { gtag?: (...args: unknown[]) => void }
      : {};
    if (typeof analyticsWindow.gtag === "function") {
      analyticsWindow.gtag("event", name, {
        event_category: "youtube2transcript",
        event_label: detail,
      });
    }
  } catch { /* analytics must never affect the tool */ }
  void fetch(EVENTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-Id": deviceId(),
    },
    body: JSON.stringify({ name, detail }),
    keepalive: true,
  }).catch(() => undefined);
}

function timestamp(seconds: number, separator: "," | ".") {
  const millis = Math.max(0, Math.round((seconds || 0) * 1000));
  const hours = Math.floor(millis / 3_600_000);
  const minutes = Math.floor((millis % 3_600_000) / 60_000);
  const secs = Math.floor((millis % 60_000) / 1000);
  const ms = millis % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}${separator}${String(ms).padStart(3, "0")}`;
}

function asSrt(segments: Segment[]) {
  return segments.map((segment, index) => {
    const end = segment.start + Math.max(segment.duration || 2, 0.25);
    return `${index + 1}\n${timestamp(segment.start, ",")} --> ${timestamp(end, ",")}\n${segment.text}\n`;
  }).join("\n");
}

function asVtt(segments: Segment[]) {
  const cues = segments.map((segment) => {
    const end = segment.start + Math.max(segment.duration || 2, 0.25);
    return `${timestamp(segment.start, ".")} --> ${timestamp(end, ".")}\n${segment.text}`;
  }).join("\n\n");
  return `WEBVTT\n\n${cues}\n`;
}

function safeFilename(title: string) {
  return (title || "youtube-transcript")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
    .toLowerCase() || "youtube-transcript";
}

function download(content: string, filename: string, type = "text/plain") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function BulkHandoff({ kind, url }: { kind: InputKind; url: string }) {
  const isPlaylist = kind === "playlist";
  const source = isPlaylist ? "playlist" : "channel";
  const href = `${BULKTRANSCRIPTS_URL}/app?mode=${source}&url=${encodeURIComponent(url)}`;
  return (
    <div className="handoff-card" role="status">
      <span className="handoff-kicker">Multiple videos detected</span>
      <h3>This looks like a YouTube {source}.</h3>
      <p>
        YouTube2Transcript is deliberately built for one video at a time.
        BulkTranscripts can extract the complete {source} and combine every
        transcript into one research-ready document.
      </p>
      <a
        className="button button-dark"
        href={href}
        onClick={() => track("yt2t_bulk_clicked", source)}
      >
        Extract the entire {source}
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

export default function TranscriptTool() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [bulkKind, setBulkKind] = useState<InputKind | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [timestamps, setTimestamps] = useState(true);
  const [copied, setCopied] = useState(false);
  const [playerStart, setPlayerStart] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const segments = useMemo(() => transcript?.segments || [], [transcript]);
  const visibleSegments = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return segments;
    return segments.filter((segment) => segment.text.toLowerCase().includes(term));
  }, [query, segments]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setTranscript(null);
    setBulkKind(null);
    setCopied(false);

    const classified = classifyYoutubeInput(url);
    if (classified.kind === "playlist" || classified.kind === "channel") {
      setBulkKind(classified.kind);
      track("yt2t_bulk_detected", classified.kind);
      return;
    }
    if (classified.kind !== "video" || !classified.normalizedUrl) {
      setError("Paste a direct YouTube video link, such as youtube.com/watch?v=…");
      return;
    }

    setLoading(true);
    track("yt2t_transcript_started", "video");
    try {
      const response = await fetch(TRANSCRIPT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-Id": deviceId(),
        },
        body: JSON.stringify({ url: classified.normalizedUrl, languages: ["en"] }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const apiError: ApiError = payload?.error || payload;
        if (apiError.code === "bulk_source" && apiError.sourceType) {
          setBulkKind(apiError.sourceType);
          return;
        }
        if (apiError.code === "out_of_credits") {
          throw new Error(
            "This connection has used its free transcript allowance. You can continue with a BulkTranscripts credit pack.",
          );
        }
        throw new Error(apiError.message || "We could not retrieve that transcript.");
      }
      setTranscript(payload as Transcript);
      setPlayerStart(0);
      setQuery("");
      track("yt2t_transcript_completed", payload.cached ? "cached" : "fresh");
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Something went wrong. Please try again.";
      setError(message);
      track("yt2t_transcript_failed", "video");
    } finally {
      setLoading(false);
    }
  }

  async function copyTranscript() {
    if (!transcript) return;
    await navigator.clipboard.writeText(transcript.text);
    setCopied(true);
    track("yt2t_copy_clicked", "txt");
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadText(format: "txt" | "srt" | "vtt") {
    if (!transcript) return;
    const base = safeFilename(transcript.title);
    if (format === "srt") download(asSrt(segments), `${base}.srt`, "application/x-subrip");
    else if (format === "vtt") download(asVtt(segments), `${base}.vtt`, "text/vtt");
    else download(transcript.text, `${base}.txt`);
    track(`yt2t_download_${format}`, format);
  }

  function seek(start: number) {
    setPlayerStart(Math.floor(start));
    track("yt2t_timestamp_clicked", "video");
  }

  return (
    <div className="tool-shell" id="tool">
      <form className="url-form" onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor="youtube-url">YouTube video URL</label>
        <div className="input-wrap">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
            <path d="M10.6 13.4a2 2 0 0 0 2.8 0l3-3a2 2 0 0 0-2.8-2.8l-1 1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M13.4 10.6a2 2 0 0 0-2.8 0l-3 3a2 2 0 1 0 2.8 2.8l1-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            id="youtube-url"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="Paste a YouTube video URL"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onPaste={() => track("yt2t_url_pasted", "video")}
            aria-describedby="tool-note"
          />
        </div>
        <button className="button button-primary submit-button" type="submit" disabled={loading}>
          {loading ? <span className="spinner" aria-hidden="true" /> : null}
          {loading ? "Getting transcript…" : "Get transcript"}
        </button>
      </form>
      <p className="tool-note" id="tool-note">
        One video at a time · No signup · Copy or download instantly
      </p>

      <div className="tool-messages" aria-live="polite">
        {error ? (
          <div className="error-card">
            <strong>We couldn’t complete that request.</strong>
            <p>{error}</p>
            {error.includes("allowance") ? (
              <a className="text-link" href={`${BULKTRANSCRIPTS_URL}/#pricing`}>
                View one-time credit packs <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>
        ) : null}
        {bulkKind ? <BulkHandoff kind={bulkKind} url={url} /> : null}
      </div>

      {transcript ? (
        <div className="result" ref={resultRef}>
          <div className="result-heading">
            <div>
              <span className="eyebrow">Transcript ready</span>
              <h2>{transcript.title}</h2>
              <p>
                {[transcript.channel, formatDuration(transcript.duration), transcript.language?.toUpperCase()]
                  .filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="result-stat">
              <strong>{(transcript.word_count || transcript.text.split(/\s+/).length).toLocaleString()}</strong>
              <span>words</span>
            </div>
          </div>

          <div className="result-grid">
            <div className="video-column">
              <div className="video-frame">
                <iframe
                  key={`${transcript.video_id}-${playerStart}`}
                  src={`https://www.youtube-nocookie.com/embed/${transcript.video_id}?start=${playerStart}&autoplay=${playerStart ? 1 : 0}`}
                  title={`YouTube video: ${transcript.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="download-panel">
                <span>Download transcript</span>
                <div className="download-row">
                  <button type="button" onClick={() => downloadText("txt")}>TXT</button>
                  {segments.length ? <button type="button" onClick={() => downloadText("srt")}>SRT</button> : null}
                  {segments.length ? <button type="button" onClick={() => downloadText("vtt")}>VTT</button> : null}
                </div>
              </div>
              <a className="bulk-mini-card" href={`${BULKTRANSCRIPTS_URL}/?source=youtube2transcript#pricing`}>
                <span>Need the whole channel?</span>
                <strong>Extract it with BulkTranscripts <span aria-hidden="true">↗</span></strong>
              </a>
            </div>

            <div className="transcript-panel">
              <div className="transcript-toolbar">
                <div className="search-wrap">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17">
                    <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <input
                    type="search"
                    aria-label="Search transcript"
                    placeholder="Search transcript"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <button
                  className={`toggle ${timestamps ? "active" : ""}`}
                  type="button"
                  aria-pressed={timestamps}
                  onClick={() => setTimestamps((value) => !value)}
                >
                  Timestamps
                </button>
                <button className="copy-button" type="button" onClick={copyTranscript}>
                  {copied ? "Copied!" : "Copy all"}
                </button>
              </div>
              <div className="transcript-scroll">
                {segments.length ? visibleSegments.map((segment, index) => (
                  <button
                    className="segment"
                    type="button"
                    key={`${segment.start}-${index}`}
                    onClick={() => seek(segment.start)}
                    title="Play video from this line"
                  >
                    {timestamps ? <time>{formatClock(segment.start)}</time> : null}
                    <span>{segment.text}</span>
                  </button>
                )) : <p className="plain-transcript">{transcript.text}</p>}
                {segments.length && !visibleSegments.length ? (
                  <p className="no-results">No transcript lines match “{query}”.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
