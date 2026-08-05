import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jeff Zhou — data scientist at the intersection of quantitative modeling and business communication. Finance undergrad + Rotman MMA, Toronto.",
};

const skills = [
  { area: "Core", items: "Python (pandas, NumPy, scikit-learn) · SQL · gradient boosting (LightGBM / XGBoost / CatBoost) · SHAP · data visualization & storytelling" },
  { area: "Strong", items: "Model validation & governance · quantile regression · causal inference & A/B testing · deep learning (PyTorch) · transformers (DistilBERT) · RAG / agentic systems · SAS Viya · Power BI (PL-300 certified) · segmentation · Streamlit · Git" },
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
          I&apos;m Jeff Zhou — a data scientist working at the intersection of quantitative modeling
          and business communication. My background pairs a finance undergrad (University of Ottawa)
          with a Rotman Master of Management Analytics (University of Toronto), which is why I care
          as much about the decision a model drives as the model itself.
        </p>
        <p>
          The through-line across my work is{" "}
          <strong className="text-text">applied ML that ships a decision</strong>, on both sides of
          the ledger:
        </p>
        <ul className="space-y-3">
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="text-sage font-mono">·</span>
            <span>
              <strong className="text-text">Managing risk</strong> — fraud and credit-risk models a
              bank can actually act on, built with the leakage discipline, calibration, fairness
              auditing, and explainability a regulated environment demands.
            </span>
          </li>
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="text-sage font-mono">·</span>
            <span>
              <strong className="text-text">Driving growth</strong> — customer-lifetime-value models
              that turn predictions into targeting and campaign-ROI decisions marketing can spend
              against.
            </span>
          </li>
        </ul>
        <p>
          That combination — quantitative depth plus the governance and communication to put a model
          into production responsibly — is what I bring to a team.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-mono text-sm tracking-wide text-muted mb-4">
          <span className="text-amber">$</span> status --current
        </h2>
        <div className="space-y-4 leading-relaxed text-muted max-w-2xl">
          <p>
            Analytics on the data science side at <strong className="text-text">BMO</strong>, moving
            into an Audit AI &amp; Analytics role.{" "}
            <strong className="text-text">I&apos;m openly open to new opportunities</strong> —
            applied ML / data science roles in financial services, especially credit &amp; fraud
            risk, model risk / monitoring / governance, audit AI &amp; analytics, and customer
            analytics where models drive targeting and ROI decisions.
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
