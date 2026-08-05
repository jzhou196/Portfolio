import { ImageResponse } from "next/og";
import { getProject, projects } from "@/lib/projects";

export const alt = "Project case study — Jeff Zhou";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const title = project?.title ?? "Project";
  const tagline = project?.tagline ?? "";
  const index = project?.index ?? "";

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
        <div style={{ display: "flex", fontSize: 26, color: "#9099a7" }}>
          <span style={{ color: "#79b4a4" }}>jeff@portfolio</span>:~
          <span style={{ color: "#e3b34c" }}>$</span>
          <span style={{ marginLeft: 14 }}>cat ~/projects/{slug}.md</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 48, color: "#e3b34c" }}>
          {index} / case study
        </div>
        <div style={{ display: "flex", fontSize: 64, marginTop: 12, color: "#d8dbe2" }}>
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 20,
            color: "#9099a7",
            lineHeight: 1.4,
          }}
        >
          {tagline}
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 48, color: "#79b4a4" }}>
          Jeff Zhou — problem → approach → result → reflection
        </div>
      </div>
    ),
    { ...size },
  );
}
