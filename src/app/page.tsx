import Link from "next/link";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { HeroPrompt } from "@/components/chat/hero-prompt";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* hero */}
      <section className="pt-16 sm:pt-24 pb-12">
        <p className="font-mono text-sm text-muted mb-4">
          <span className="text-amber">$</span> whoami
        </p>
        <h1 className="font-mono text-3xl sm:text-5xl text-text leading-tight">
          Jeff Zhou
          <span className="block mt-2 text-xl sm:text-2xl text-muted font-sans font-normal">
            Data scientist — applied ML that ships a decision.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-muted leading-relaxed">
          Finance undergrad + Rotman MMA. I build models banks can act on — fraud and credit-risk
          systems with the governance a regulated environment demands, customer-lifetime-value
          models marketing can spend against, and grounded LLM/RAG assistants that don&apos;t make
          things up.
        </p>
        <div className="mt-10">
          <HeroPrompt />
        </div>
      </section>

      {/* projects */}
      <section id="projects" className="py-12 scroll-mt-16">
        <p className="font-mono text-sm text-muted mb-6">
          <span className="text-amber">$</span> ls ~/projects{" "}
          <span className="text-muted/60"># problem → approach → result → reflection</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* about, short */}
      <section className="py-12">
        <p className="font-mono text-sm text-muted mb-6">
          <span className="text-amber">$</span> head about.md
        </p>
        <div className="max-w-2xl space-y-4 leading-relaxed text-muted">
          <p>
            The through-line across my work is applied ML on both sides of a bank&apos;s ledger:{" "}
            <strong className="text-text">managing risk</strong> — fraud and credit models built
            with leakage discipline, calibration, fairness auditing, and explainability — and{" "}
            <strong className="text-text">driving growth</strong> — CLV models that turn predictions
            into targeting and campaign-ROI decisions.
          </p>
          <p>
            Currently on the data science side at BMO, moving into Audit AI &amp; Analytics. Based
            in Toronto, open to roles across Canada — and openly open to new opportunities.
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
      </section>
    </div>
  );
}
