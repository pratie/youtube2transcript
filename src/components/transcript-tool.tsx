"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { BULKTRANSCRIPTS_URL, TRANSCRIPT_ENDPOINT } from "@/lib/constants";
import { deviceId, track } from "@/lib/tracking";
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
  channel_url?: string;
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
  // Firefox/Safari can cancel the download if the URL is revoked synchronously.
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const CHANNEL_URL = /^https:\/\/(www\.)?youtube\.com\/(@[\w.-]{1,60}|channel\/UC[\w-]{22}|c\/[\w.-]{1,80}|user\/[\w.-]{1,80})$/;
const FETCH_TIMEOUT_MS = 75_000;
const SOURCE = "source=youtube2transcript";

function ChannelUpsell({ channel, channelUrl }: { channel?: string; channelUrl?: string }) {
  const valid = !!channelUrl && CHANNEL_URL.test(channelUrl);
  const href = valid
    ? `${BULKTRANSCRIPTS_URL}/app?mode=channel&url=${encodeURIComponent(channelUrl!)}&${SOURCE}`
    : `${BULKTRANSCRIPTS_URL}/app?${SOURCE}`;
  return (
    <a className="bulk-mini-card" href={href} onClick={() => track("yt2t_channel_upsell_clicked", valid ? "channel" : "generic")}>
      <span>{valid ? "Want the rest of this channel?" : "Need 100+ videos?"}</span>
      <strong>
        {valid && channel
          ? <>Get every transcript from {channel} <span aria-hidden="true">↗</span></>
          : <>Extract channels and playlists with BulkTranscripts <span aria-hidden="true">↗</span></>}
      </strong>
      <small>30 transcripts free · no card · one AI-ready file</small>
    </a>
  );
}

function BulkHandoff({ kind, url }: { kind: InputKind; url: string }) {
  const isPlaylist = kind === "playlist";
  const source = isPlaylist ? "playlist" : "channel";
  const href = `${BULKTRANSCRIPTS_URL}/app?mode=${source}&url=${encodeURIComponent(url)}&${SOURCE}`;
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

export default function TranscriptTool({ idPrefix = "" }: { idPrefix?: string }) {
  const id = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [bulkKind, setBulkKind] = useState<InputKind | null>(null);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [lastVideoId, setLastVideoId] = useState("");
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
    setErrorCode("");
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
    setLastVideoId(classified.videoId || "");
    track("yt2t_transcript_started", "video");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      let response: Response;
      try {
        response = await fetch(TRANSCRIPT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Device-Id": deviceId(),
          },
          body: JSON.stringify({ url: classified.normalizedUrl, languages: ["en"] }),
          signal: controller.signal,
        });
      } catch (reason) {
        if (controller.signal.aborted) {
          setErrorCode("timeout");
          throw new Error("YouTube took too long to answer. Please try again in a moment.");
        }
        setErrorCode("network");
        throw reason;
      }
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const apiError: ApiError = payload?.error || payload;
        if (apiError.code === "bulk_source" && apiError.sourceType) {
          setBulkKind(apiError.sourceType);
          return;
        }
        setErrorCode(apiError.code || (response.status === 429 ? "rate_limited" : `http_${response.status}`));
        if (apiError.code === "out_of_credits") {
          throw new Error(
            "This connection has used its free transcript allowance. You can continue with a BulkTranscripts credit pack.",
          );
        }
        if (response.status === 429) {
          throw new Error(apiError.message || "Too many requests from this connection. Please wait a minute and try again.");
        }
        throw new Error(apiError.message || "We could not retrieve that transcript.");
      }
      const result = payload as Transcript;
      if (!VIDEO_ID.test(result.video_id || "")) {
        // Never trust an id we did not validate ourselves for the embed URL.
        result.video_id = classified.videoId || "";
      }
      setTranscript(result);
      setPlayerStart(0);
      setQuery("");
      track("yt2t_transcript_completed", payload.cached ? "cached" : "fresh");
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Something went wrong. Please try again.";
      setError(message);
      track("yt2t_transcript_failed", "video");
    } finally {
      window.clearTimeout(timer);
      setLoading(false);
    }
  }

  async function copyTranscript() {
    if (!transcript) return;
    // Copy what the panel shows: with the timestamps toggle on, each line
    // carries its clock time, exactly as rendered.
    const withTimestamps = timestamps && segments.length > 0;
    const content = withTimestamps
      ? segments.map((segment) => `[${formatClock(segment.start)}] ${segment.text}`).join("\n")
      : transcript.text;
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      setError("Copying was blocked by the browser. Select the transcript text and copy it manually.");
      return;
    }
    setCopied(true);
    track("yt2t_copy_clicked", withTimestamps ? "txt_timestamps" : "txt");
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
    <div className="tool-shell" id={id("tool")}>
      <form className="url-form" onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor={id("youtube-url")}>YouTube video URL</label>
        <div className="input-wrap">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
            <path d="M10.6 13.4a2 2 0 0 0 2.8 0l3-3a2 2 0 0 0-2.8-2.8l-1 1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M13.4 10.6a2 2 0 0 0-2.8 0l-3 3a2 2 0 1 0 2.8 2.8l1-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            id={id("youtube-url")}
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="Paste a YouTube video URL"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onPaste={() => track("yt2t_url_pasted", "video")}
            aria-describedby={id("tool-note")}
          />
        </div>
        <button className="button button-primary submit-button" type="submit" disabled={loading}>
          {loading ? <span className="spinner" aria-hidden="true" /> : null}
          {loading ? "Getting transcript…" : "Get transcript"}
        </button>
      </form>
      <p className="tool-note" id={id("tool-note")}>
        One video at a time · No signup · Copy or download instantly
      </p>

      <div className="tool-messages" aria-live="polite">
        {error ? (
          <div className="error-card">
            <strong>We couldn’t complete that request.</strong>
            <p>{error}</p>
            {errorCode === "out_of_credits" ? (
              <a className="text-link" href={`${BULKTRANSCRIPTS_URL}/app?${SOURCE}&upgrade=1&remaining=1&max=1&format=txt&url=${encodeURIComponent(lastVideoId ? `https://www.youtube.com/watch?v=${lastVideoId}` : url)}`} onClick={() => track("yt2t_wall_pricing_clicked", "out_of_credits")}>
                View one-time credit packs (from $4.99) <span aria-hidden="true">→</span>
              </a>
            ) : null}
            {errorCode === "rate_limited" ? (
              <a className="text-link" href={`${BULKTRANSCRIPTS_URL}/app?${SOURCE}${lastVideoId ? `&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${lastVideoId}`)}` : ""}`} onClick={() => track("yt2t_wall_pricing_clicked", "rate_limited")}>
                Doing this for many videos? BulkTranscripts does channels and playlists in one run <span aria-hidden="true">→</span>
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
                  src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(transcript.video_id)}?start=${playerStart}&autoplay=${playerStart ? 1 : 0}`}
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
              <ChannelUpsell channel={transcript.channel} channelUrl={transcript.channel_url} />
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
