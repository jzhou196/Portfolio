import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import { SectionLabel } from "@/components/section-label";
import { Inline } from "@/components/inline";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <ViewTransition name={`card-${project.slug}`} share="morph" default="none">
    <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 sm:pt-16">
      {/* header */}
      <p className="font-mono text-sm text-muted mb-6">
        <span className="text-amber">$</span> cat ~/projects/{project.slug}.md
      </p>
      <h1 className="font-mono text-2xl sm:text-4xl text-text leading-tight">{project.title}</h1>
      <p className="mt-4 text-lg text-muted leading-relaxed">{project.tagline}</p>
      <p className="mt-4 font-mono text-xs text-muted">{project.org}</p>

      {project.confidential && (
        <p className="mt-6 rounded border border-line bg-panel px-4 py-3 font-mono text-xs leading-relaxed text-muted">
          <span className="text-amber"># confidentiality</span> — {project.confidential}
        </p>
      )}

      {/* 01 problem */}
      <section className="mt-14">
        <SectionLabel n="01">problem</SectionLabel>
        <div className="space-y-4 leading-relaxed text-muted">
          {project.problem.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
        </div>
      </section>

      {/* 02 approach */}
      <section className="mt-14">
        <SectionLabel n="02">approach</SectionLabel>
        <ol className="space-y-6">
          {project.approach.map((step, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr] gap-x-4">
              <span className="font-mono text-sm text-amber pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="mt-1 leading-relaxed text-muted">
                  <Inline text={step.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 03 result */}
      <section className="mt-14">
        <SectionLabel n="03">result</SectionLabel>
        {project.metrics.length > 0 && (
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {project.metrics.map((m) => (
              <div key={m.label} className="flex flex-col rounded border border-line bg-panel p-3">
                <dd className="order-1 font-mono text-xl text-amber">{m.value}</dd>
                <dt className="order-2 font-mono text-[11px] leading-snug text-muted mt-1">
                  {m.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
        <ul className="space-y-4">
          {project.result.map((r, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr] gap-x-3 leading-relaxed text-muted">
              <span className="text-sage font-mono">·</span>
              <p>
                <Inline text={r} />
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 reflection */}
      <section className="mt-14">
        <SectionLabel n="04">reflection — the judgment calls</SectionLabel>
        <div className="space-y-6">
          {project.reflection.map((r, i) => (
            <div key={i} className="border-l-2 border-line pl-4">
              <h3 className="font-semibold text-text">{r.title}</h3>
              <p className="mt-1 leading-relaxed text-muted">
                <Inline text={r.body} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 stack */}
      <section className="mt-14">
        <SectionLabel n="05">stack &amp; links</SectionLabel>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="font-mono text-xs text-sage border border-line rounded px-2 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>
        {project.links.length > 0 && (
          <ul className="mt-4 space-y-1 font-mono text-sm">
            {project.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage hover:text-amber transition-colors"
                >
                  → {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {project.footnote && (
        <p className="mt-14 border-t border-line pt-6 text-sm italic leading-relaxed text-muted">
          <Inline text={project.footnote} />
        </p>
      )}

      {/* prev / next */}
      <nav className="mt-12 flex justify-between font-mono text-sm">
        <Link href="/#projects" className="text-muted hover:text-amber transition-colors">
          ← ls ~/projects
        </Link>
        <NextProject slug={project.slug} />
      </nav>
    </article>
    </ViewTransition>
  );
}

function NextProject({ slug }: { slug: string }) {
  const i = projects.findIndex((p) => p.slug === slug);
  const next = projects[(i + 1) % projects.length];
  return (
    <Link
      href={`/projects/${next.slug}`}
      className="text-sage hover:text-amber transition-colors text-right"
    >
      next: {next.slug} →
    </Link>
  );
}
