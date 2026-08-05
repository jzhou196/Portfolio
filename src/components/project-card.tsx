import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col rounded-lg border border-line bg-panel p-5 transition-colors hover:border-amber/60 focus-visible:border-amber"
    >
      <span
        aria-hidden
        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded border border-line bg-ink font-mono text-[11px] font-semibold text-sage group-hover:border-sage transition-colors"
      >
        {project.badge}
      </span>
      <p className="font-mono text-xs text-muted mb-3 pr-12">
        <span className="text-amber">{project.index}</span>
        <span className="mx-2 text-line">/</span>
        {project.org}
      </p>
      <h3 className="font-mono text-lg text-text group-hover:text-amber transition-colors">
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
      <p className="mt-4 font-mono text-xs text-muted group-hover:text-amber transition-colors">
        cat {project.slug}.md →
      </p>
    </Link>
  );
}
