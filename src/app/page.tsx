import Link from "next/link";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { HeroPrompt } from "@/components/chat/hero-prompt";
import { TypedCommand } from "@/components/typed-command";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* hero */}
      <section className="pt-16 sm:pt-24 pb-12">
        <p className="font-mono text-sm text-muted mb-4">
          <span className="text-amber">$</span> <TypedCommand text="whoami" />
        </p>
        <div className="hero-enter">
          <h1 className="font-mono text-3xl sm:text-5xl text-text leading-tight">
            Jiefu (Jeff) Zhou
            <span className="block mt-2 text-xl sm:text-2xl text-muted font-sans font-normal">
              Data scientist — end-to-end ML that ships a decision.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-muted leading-relaxed">
            Finance undergrad + Rotman MMA. I build models that make it into production: predictive
            systems on multi-million-row customer data, deep-learning and transformer models for
            text, and grounded LLM/RAG assistants that don&apos;t make things up — built at BMO,
            Scotiabank, and the University of Toronto.
          </p>
        </div>
        <div className="mt-10 hero-enter-late">
          <HeroPrompt />
        </div>
      </section>

      {/* projects */}
      <section id="projects" className="py-12 scroll-mt-16">
        <Reveal>
          <p className="font-mono text-sm text-muted mb-6">
            <span className="text-amber">$</span> ls ~/projects{" "}
            <span className="text-muted/60"># problem → approach → result → reflection</span>
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* about, short */}
      <section className="py-12">
        <Reveal>
        <p className="font-mono text-sm text-muted mb-6">
          <span className="text-amber">$</span> head about.md
        </p>
        <div className="max-w-2xl space-y-4 leading-relaxed text-muted">
          <p>
            The through-line across my work is <strong className="text-text">applied ML that
            reaches production</strong>: predictive modeling at scale, language and LLM systems, and
            the measurement discipline — experiment design, leakage control, honest benchmarking —
            that decides whether a model survives contact with real data.
          </p>
          <p>
            Currently on the data science side at BMO. Based in Toronto, open to roles across Canada
            — and openly open to new opportunities as a data scientist, ML / applied scientist, or
            in AI &amp; GenAI work.
          </p>
          <p className="font-mono text-sm">
            <Link href="/about" className="text-sage hover:text-amber transition-colors">
              cat about.md →
            </Link>
            <span className="mx-3 text-line">|</span>
            <a href={`mailto:${site.email}`} className="text-sage hover:text-amber transition-colors">
              mail {site.email} →
            </a>
          </p>
        </div>
        </Reveal>
      </section>
    </div>
  );
}
