import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "Jeff Zhou — Data Scientist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#14161b",
          color: "#d8dbe2",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#9099a7" }}>
          <span style={{ color: "#79b4a4" }}>jeff@portfolio</span>:~
          <span style={{ color: "#e3b34c" }}>$</span>
          <span style={{ marginLeft: 16 }}>whoami</span>
        </div>
        <div style={{ display: "flex", fontSize: 84, marginTop: 32, color: "#d8dbe2" }}>
          Jeff Zhou
        </div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 16, color: "#9099a7" }}>
          Data scientist — applied ML that ships a decision.
        </div>
        <div style={{ display: "flex", fontSize: 26, marginTop: 48, color: "#e3b34c" }}>
          fraud &amp; credit risk · model governance · CLV · LLM/RAG systems
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 24, color: "#79b4a4" }}>
          {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
