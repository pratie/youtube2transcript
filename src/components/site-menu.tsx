"use client";

import { useEffect, useRef, useState } from "react";
import { BULKTRANSCRIPTS_URL } from "@/lib/constants";

export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="site-menu" ref={ref}>
      <button
        className="menu-button"
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span /><span /><span />
      </button>
      {open ? (
        <nav className="menu-panel" aria-label="More from BulkTranscripts">
          <a href={`${BULKTRANSCRIPTS_URL}/?source=youtube2transcript`}>
            <strong>BulkTranscripts <span aria-hidden="true">↗</span></strong>
            <small>Whole channels, playlists &amp; API — bulk extraction</small>
          </a>
          <a href={`${BULKTRANSCRIPTS_URL}/youtube-mcp-server`}>
            <strong>MCP for AI assistants <span aria-hidden="true">↗</span></strong>
            <small>Give Claude, ChatGPT &amp; Cursor YouTube transcripts</small>
          </a>
        </nav>
      ) : null}
    </div>
  );
}
