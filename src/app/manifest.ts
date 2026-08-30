import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YouTube2Transcript",
    short_name: "YT2Transcript",
    description: "Turn one YouTube video into clean, timestamped text.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#e82f26",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
