import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jiefu (Jeff) Zhou — data scientist working across predictive modeling, NLP and transformers, and production LLM/RAG systems. Finance undergrad + Rotman MMA, Toronto.",
};

const skills = [
  { area: "Core", items: "Python (pandas, NumPy, scikit-learn) · SQL · gradient boosting (LightGBM / XGBoost / CatBoost) · SHAP · data visualization & storytelling" },
  { area: "Strong", items: "Deep learning (PyTorch) · transformers (DistilBERT) · RAG / agentic systems · causal inference & A/B testing · quantile regression · segmentation (K-Means / GMM / K-prototypes) · model validation & evaluation · SAS Viya · Power BI (PL-300 certified) · Streamlit · Git" },
  { area: "Working", items: "R · PySpark · TensorFlow · MLflow · AWS · Monte Carlo simulation" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 sm:pt-16">
      <p className="font-mono text-sm text-muted mb-6">
        <span className="text-amber">$</span> cat about.md
      </p>
      <h1 className="font-mono text-2xl sm:text-4xl text-text">About</h1>

      <div className="mt-8 space-y-5 leading-relaxed text-muted max-w-2xl">
        <p>
          I&apos;m Jeff Zhou — a data scientist working across the full arc of applied machine
          learning, from framing a problem to putting a model in front of a decision. My background
          pairs a finance undergrad (University of Ottawa) with a Rotman Master of Management
          Analytics (University of Toronto), which is why I care as much about the decision a model
          drives as the model itself.
        </p>
        <p>
          The through-line across my work is{" "}
          <strong className="text-text">applied ML that reaches production</strong>. It shows up in
          three ways:
        </p>
        <ul className="space-y-3">
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="text-sage font-mono">·</span>
            <span>
              <strong className="text-text">Predictive modeling at scale</strong> — gradient
              boosting, segmentation, and quantile methods on multi-million-row customer data, with
              SHAP explanations and the pipelines to make training and validation reproducible.
            </span>
          </li>
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="text-sage font-mono">·</span>
            <span>
              <strong className="text-text">Language &amp; AI systems</strong> — transformers
              fine-tuned and benchmarked against real baselines, and agentic RAG assistants with
              hybrid retrieval, tool use, guardrails, and an evaluation harness.
            </span>
          </li>
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="text-sage font-mono">·</span>
            <span>
              <strong className="text-text">Measurement that holds up</strong> — randomized
              experiments and incremental-lift measurement, leakage control, calibration checks, and
              honest benchmarking, including reporting when the simpler model wins.
            </span>
          </li>
        </ul>
        <p>
          That combination — modeling depth, the rigor to know when a result is real, and the
          communication to turn it into a decision — is what I bring to a team. My experience is
          concentrated in financial services, but the methods travel: the same work is customer
          analytics, rare-event detection, text classification, and AI assistants in any industry.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-mono text-sm tracking-wide text-muted mb-4">
          <span className="text-amber">$</span> status --current
        </h2>
        <div className="space-y-4 leading-relaxed text-muted max-w-2xl">
          <p>
            Analytics on the data science side at <strong className="text-text">BMO</strong>.{" "}
            <strong className="text-text">I&apos;m openly open to new opportunities</strong> —
            data scientist, machine learning / applied scientist, and AI &amp; GenAI roles
            (including AI enablement), across industries. Quantitative, risk, and model-governance
            roles are on the table too; they&apos;re one option among several rather than the focus.
          </p>
          <p>Based in Toronto — open to roles across Canada.</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-sm tracking-wide text-muted mb-4">
          <span className="text-amber">$</span> skills --depth
        </h2>
        <dl className="space-y-4 max-w-2xl">
          {skills.map((s) => (
            <div key={s.area} className="grid sm:grid-cols-[90px_1fr] gap-x-4 gap-y-1">
              <dt className="font-mono text-sm text-amber">{s.area}</dt>
              <dd className="leading-relaxed text-muted text-sm">{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-sm tracking-wide text-muted mb-4">
          <span className="text-amber">$</span> beyond --work
        </h2>
        <p className="leading-relaxed text-muted max-w-2xl">
          I play badminton (3rd place, BC high-school tournament as part of the school team), play
          chess (top 8% worldwide in rapid on chess.com), follow equity markets closely —
          first-principles, Sharpe-aware investing is a genuine hobby — and work fluidly in both
          English and Mandarin Chinese.
        </p>
      </section>

      <section className="mt-12 mb-4">
        <h2 className="font-mono text-sm tracking-wide text-muted mb-4">
          <span className="text-amber">$</span> contact
        </h2>
        <p className="leading-relaxed text-muted max-w-2xl">
          The fastest way to reach me is email:{" "}
          <a href={`mailto:${site.email}`} className="text-sage hover:text-amber transition-colors">
            {site.email}
          </a>
          . I&apos;m also on{" "}
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sage hover:text-amber transition-colors"
          >
            LinkedIn
          </a>{" "}
          and{" "}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sage hover:text-amber transition-colors"
          >
            GitHub
          </a>
          , and my{" "}
          <a href={site.resumePath} download className="text-sage hover:text-amber transition-colors">
            resume is downloadable here
          </a>
          .
        </p>
      </section>
    </div>
  );
}
