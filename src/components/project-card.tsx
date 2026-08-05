import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <ViewTransition name={`card-${project.slug}`} share="morph" default="none">
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col rounded-lg border border-line bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-lg hover:shadow-black/30 focus-visible:border-amber"
      >
        <span className="absolute top-4 right-4 flex h-10 w-16 items-center justify-center rounded border border-line bg-white p-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- static local SVGs, no optimization needed */}
          <img src={project.logo.src} alt={project.logo.alt} className="max-h-full max-w-full object-contain" />
        </span>
        <p className="font-mono text-xs text-muted mb-3 pr-20">
          <span className="text-amber">{project.index}</span>
          <span className="mx-2 text-line">/</span>
          {project.org}
        </p>
        <h3 className="font-mono text-lg text-text group-hover:text-amber transition-colors pr-20">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted flex-1">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <li
              key={tag}
              className="font-mono text-[11px] text-sage border border-line rounded px-1.5 py-0.5"
            >
              {tag}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-xs text-muted group-hover:text-amber transition-all group-hover:translate-x-1">
          cat {project.slug}.md →
        </p>
      </Link>
    </ViewTransition>
  );
}
