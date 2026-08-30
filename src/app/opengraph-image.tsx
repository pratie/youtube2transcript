import { ImageResponse } from "next/og";

export const alt = "YouTube to Transcript — paste one video and get clean, timestamped text";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 70px", background: "#fffdf8", color: "#171512", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -90, top: -120, width: 420, height: 420, borderRadius: 999, background: "#ded9ff" }} />
      <div style={{ position: "absolute", left: -130, bottom: -210, width: 480, height: 480, borderRadius: 999, background: "#ffd9b7" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, fontWeight: 700, letterSpacing: "-1px" }}>
        <div style={{ width: 50, height: 50, borderRadius: 13, background: "#e82f26", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <div style={{ width: 26, height: 3, borderRadius: 9, background: "white" }} />
          <div style={{ width: 20, height: 3, borderRadius: 9, background: "white" }} />
          <div style={{ width: 13, height: 3, borderRadius: 9, background: "white" }} />
        </div>
        YouTube<span style={{ color: "#e82f26" }}>2</span>Transcript
      </div>
      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ color: "#e82f26", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 22 }}>Free single-video tool</div>
        <div style={{ maxWidth: 940, fontSize: 78, lineHeight: .98, fontWeight: 760, letterSpacing: "-5px" }}>YouTube to transcript, without the busywork.</div>
        <div style={{ marginTop: 26, fontSize: 27, color: "#6d6860" }}>Copy clean text · Click timestamps · Download TXT, SRT and VTT</div>
      </div>
    </div>,
    size,
  );
}
