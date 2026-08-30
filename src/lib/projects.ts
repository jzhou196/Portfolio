// Case-study content for the four featured projects.
// Follows the fixed skeleton from the spec: problem → approach → result → reflection.
// Inline markup: **bold** and `code` are rendered by <Inline />.

export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  index: string; // display order marker, e.g. "01"
  logo: { src: string; alt: string; bg: string }; // org logo tile on the card corner (bg = tile color behind the mark)
  title: string;
  tagline: string; // one-line problem statement, business framing
  summary: string; // card copy for the home grid
  org: string;
  tags: string[];
  links: { label: string; href: string }[];
  confidential?: string; // shown when work is proprietary/abstracted
  problem: string[];
  approach: { title: string; body: string }[];
  metrics: Metric[];
  result: string[];
  reflection: { title: string; body: string }[];
  footnote?: string;
};

const allProjects: Project[] = [
  {
    slug: "fraud-detection",
    index: "04",
    logo: { src: "/logos/scotiabank.svg", alt: "Scotiabank", bg: "#ffffff" },
    title: "Credit-Card Fraud Detection",
    tagline:
      "Turn 4,224 raw accounts into a short, ranked, explained list of suspicious nodes an investigator can act on.",
    summary:
      "Rare-event classification done properly, end to end: a five-phase pipeline with a formal leakage register, per-record SHAP explanations, a fairness audit, and a three-tier decision engine. Reviewing 43.5% of accounts catches 90.4% of fraud.",
    org: "Rotman Crime Lab · client project for a major Canadian bank",
    tags: [
      "SAS Viya / CAS",
      "Gradient Boosting",
      "Random Forest",
      "SHAP",
      "Fraud / Credit Risk",
      "Model Governance",
    ],
    links: [],
    confidential:
      "Client work — methodology shown; no client data or institution-specific internals. Metrics are methodology results, not the client's reported business numbers.",
    problem: [
      "The bank needs to automatically flag which credit-card accounts are fraudulent (third-party FRAUD) or abusive (first-party ABUSE) so it can freeze, review, or decline them. But the real mission goes further: organized fraud isn't a set of isolated bad accounts — it's *rings* of accounts opened, cashed out, and funded through each other on a coordinated timeline.",
      "You can't map a network before you can (a) identify which nodes are suspicious and (b) explain **why**, in terms an investigator can act on. This project builds that detection-and-explanation layer — the instrument that produces trustworthy seed nodes for the network hunt.",
    ],
    approach: [
      {
        title: "Account-level framing, dictated by the data",
        body: "Labels live at the account level, so that's the only supervised-trainable granularity — and it matches the bank's real unit of action. A `Bronze → Silver → Gold` pipeline cleaned 12 messy tables (1.17M transactions, a 27-month panel) into a 4,224-row × ~40-feature account matrix with explicit data contracts and coverage flags. Missingness is treated as signal, never silently imputed.",
      },
      {
        title: "Ruthless leakage control",
        body: "A formal Data Leakage Register: the single strongest raw feature (`client_status_code=DR`, Cramér's V = 0.49) was **excluded** because it's assigned *after* fraud is discovered — a model using it would look brilliant on history and collapse in production. Write-off, dispute, and post-hoc delinquency fields were carried separately for audit only.",
      },
      {
        title: "Two independent, recall-first binaries",
        body: "FRAUD and ABUSE modeled separately — they have different fingerprints. Models were *selected* by ranking quality (FRAUD = Gradient Boosting, AUC 0.907; ABUSE = Random Forest, 0.801) but *operated* by risk percentile, with the review cutoff chosen via F-β rather than a fixed probability.",
      },
      {
        title: "Per-account explainability for the mission",
        body: "True Shapley values via SAS Viya's `shapleyExplainer` give each flagged account a *signed reason* — \"near-zero repayment + high cash-out + maxed in month 1.\" Analysts can cluster accounts by shared reason (a candidate ring, not a coincidence), and every escalation is fair-lending defensible.",
      },
      {
        title: "A three-tier rule engine with a human in the loop",
        body: "Model scores plus 7 interpretable rules produce `ESCALATE / MANUAL_REVIEW / PASS`, each with a plain-language decision reason, plus a fairness patch. No auto-decline: the system ranks and advises; a human decides.",
      },
    ],
    metrics: [
      { value: "90.4%", label: "of fraud caught reviewing 43.5% of accounts" },
      { value: "0.907", label: "FRAUD model AUC (Gradient Boosting)" },
      { value: "51.4%", label: "fraud density in the ESCALATE lane (18% base rate)" },
      { value: "−74%", label: "false positives when tightening cutoff to top-15%" },
    ],
    result: [
      "**Operating headline:** reviewing 43.5% of accounts catches **90.4% of fraud** (and 92% of abuse). The ESCALATE lane is 51.4% fraud-dense against an 18% base rate; the PASS lane is clean at 3.1%.",
      "**A precision dial for cost asymmetry:** tightening the FRAUD cutoff from top-30% to top-15% cuts false positives −74% and lifts precision 48.9% → 73.7% (recall trades down to 61.4%) — a business lever, not a fixed setting.",
      "**Every decision is auditable:** one sentence explains why an account was blocked or passed, ready for a review-queue ticket or a compliance audit.",
    ],
    reflection: [
      {
        title: "Resisting the best-looking feature",
        body: "The strongest raw signal was leakage. Excluding it costs backtest accuracy but is the only thing that makes the model survive production — the whole point of the leakage register.",
      },
      {
        title: "Diagnosing a calibration trap",
        body: "An absolute probability threshold picked on TRAIN gave only 42.5% recall on TEST — the boosting model's TRAIN AUC is 1.0 and its probability scale doesn't transfer. The fix: operate on population percentiles (ventiles), not raw probabilities.",
      },
      {
        title: "Honest negative results",
        body: "I tested three fancier designs — a hierarchical cascade, a merged universal binary, and a single 3-class classifier — and kept the *simpler* two independent binaries, with the statistics to back it (on ~103 abuse positives, 0.848 vs 0.850 AUC is noise). Choosing the simpler model when the complex one doesn't beat it is the harder call.",
      },
      {
        title: "Owning a fairness problem",
        body: "The FRAUD model's false-positive rate for customers with prior bankruptcy was 12× higher than for others — a disparate-impact risk. The rule engine caps bankrupt accounts out of ESCALATE (0% escalate rate), and the report records the residual honestly rather than declaring it solved.",
      },
      {
        title: "Knowing what the rules are for",
        body: "The rule engine's recall (90.4%) does **not** beat the pure model (91.2%). The rules earn their place through explainability, the fairness patch, and cold-start coverage — not extra catches. Model provides accuracy; rules provide auditability. Knowing which is which is the point.",
      },
    ],
    footnote:
      "My most complete end-to-end project: data engineering, leakage control, modeling, explainability, fairness auditing, and an operating policy — not just a model. The domain is fraud; the transferable part is building a rare-event classifier people will actually trust and act on.",
  },
  {
    slug: "clv-prediction",
    index: "02",

    logo: { src: "/logos/bmo.svg", alt: "BMO", bg: "#ffffff" },
    title: "Customer Lifetime Value → Campaign ROI",
    tagline:
      "Rank customers by expected lifetime value at two decision points, then turn predictions into a targeting decision marketing can spend against.",
    summary:
      "Large-scale predictive modeling on a 6M+ customer base: two models matched to two decision points, a heavy-tailed signed target, SHAP and quantile regression, wrapped in a counterfactual campaign-ROI simulation. ~6.2× lift @ top-10%.",
    org: "Retail bank · Advanced Data Science team",
    tags: [
      "Python",
      "LightGBM / XGBoost / CatBoost",
      "SHAP",
      "Quantile Regression",
      "Marketing Analytics",
    ],
    links: [],
    confidential:
      "Employer-internal work — methodology shown; no real data or proprietary feature strategy. Lift metrics are illustrative methodology results, not reported business numbers.",
    problem: [
      "Marketing can't profitably target everyone — it needs to rank customers by expected lifetime value and spend where the return is highest. The catch: the information you have depends on *when* you're deciding. At **acquisition** you know only demographics; once an account **opens** you also have day-1 signals.",
      "A single model can't serve both moments well — so the real problem is building the right model for each decision point, then translating predicted value into a targeting decision the business can act on.",
    ],
    approach: [
      {
        title: "Two models, matched to two decision points",
        body: "A **Pre-Join** model (demographics only) for acquisition targeting, and an **After-Join** model (day-1 account information) for early-life targeting. Different feature sets, different moments, different downstream campaigns.",
      },
      {
        title: "A target transform that fits the data",
        body: "CLV is heavy-tailed *and* can be negative — some customers are net-negative value. A **signed `log1p`** transform stabilizes the skew while preserving sign; a naive log would silently drop exactly the customers you can't ignore.",
      },
      {
        title: "A multi-model framework, not a single favorite",
        body: "LightGBM, XGBoost, and CatBoost competed on a shared evaluation harness, so model choice was evidence-based rather than habitual.",
      },
      {
        title: "Interpretability + uncertainty",
        body: "SHAP to expose which signals drive predicted value; **quantile regression** to model the *distribution* of CLV rather than a point estimate — because the money concentrates in a small high-value tail.",
      },
      {
        title: "From prediction to decision",
        body: "A **counterfactual campaign-ROI simulation** turns predicted CLV into \"if we target these customers, expected incremental return is X\" — the actual business deliverable, not a leaderboard score.",
      },
      {
        title: "Causal humility on entangled features",
        body: "Features like original amount and account-opening method are predictive but causally tangled — they inform *ranking* without being mis-read as levers to \"do more of X to raise CLV.\"",
      },
    ],
    metrics: [
      { value: "~3.18×", label: "lift @ top-20% — Pre-Join model, demographics only" },
      { value: "~6.2×", label: "lift @ top-10% — After-Join model, day-1 signals" },
      { value: "3", label: "boosting frameworks competing on one harness" },
    ],
    result: [
      "**Pre-Join model:** ~3.18× lift @ top-20% — the top quintile the model ranks captures roughly 3.2× the value density of random selection, from demographics alone.",
      "**After-Join model:** ~6.2× lift @ top-10% — day-1 account signals sharpen targeting dramatically, concentrating value in a much tighter top decile.",
      "**Delivered the campaign-ROI simulation plus business-facing materials** that defended the lift-based KPIs under management pushback — mapping the metric directly to marketing's targeting budget.",
    ],
    reflection: [
      {
        title: "Match the model to the decision, not the other way around",
        body: "The Pre-Join / After-Join split isn't cosmetic — it's about what information *exists* when the decision is made. One combined model would either discard day-1 signal or be useless for acquisition.",
      },
      {
        title: "Model the tail, not the mean",
        body: "Quantile regression because CLV concentrates in a small tail; a point estimate minimizing average error underweights precisely the customers who drive ROI.",
      },
      {
        title: "Pick the target transform on purpose",
        body: "Signed `log1p` because the target is both heavy-tailed and signed — the transform is a modeling decision, not a default.",
      },
      {
        title: "Defend the metric to non-technical stakeholders",
        body: "When managers questioned the KPIs, the work was framing lift@top-k as the number that maps to their budget. Communication is part of the modeling job, not an afterthought.",
      },
    ],
    footnote:
      "The pattern here generalizes well beyond banking: pick the model to match the decision point, model the tail rather than the mean, and translate a prediction into an expected-return decision someone can act on.",
  },
  {
    slug: "nlp-sentiment",
    index: "03",

    logo: { src: "/logos/rotman.svg", alt: "Rotman School of Management", bg: "#EC008C" },
    title: "Sentiment: Classical vs. Deep vs. Transformer",
    tagline:
      "Classify review sentiment at scale — and answer which model is right once latency and serving cost are on the table.",
    summary:
      "A three-way benchmark on 100K+ Amazon reviews — TF-IDF + Logistic Regression, a Bi-LSTM, and fine-tuned DistilBERT — comparing not just accuracy but the accuracy-per-dollar tradeoff that decides what ships.",
    org: "Academic project · public dataset · fully open",
    tags: ["Python", "scikit-learn", "PyTorch", "Hugging Face", "NLP"],
    links: [],
    problem: [
      "Product and CX teams sit on huge volumes of unstructured review text, but text is only useful once it's a signal you can act on. The task: classify review sentiment at scale.",
      "The real question isn't \"which model is most accurate?\" — it's \"which model is *right* once you factor in inference latency and serving cost?\" A model that wins by a point but costs 20× to run isn't obviously the winner. This comparison was built to answer the deployment question, not just the leaderboard question.",
    ],
    approach: [
      {
        title: "TF-IDF + Logistic Regression — the strong, cheap baseline",
        body: "Fast to train, trivial to serve, fully interpretable through its coefficients. This sets the bar every heavier model has to clear to justify its cost.",
      },
      {
        title: "Bi-LSTM — when sequence starts to matter",
        body: "A bidirectional recurrent model captures word order and local context that the bag-of-words baseline discards — the natural next rung on the complexity ladder, built and trained from scratch in PyTorch.",
      },
      {
        title: "Fine-tuned DistilBERT — the transformer, chosen deliberately",
        body: "DistilBERT over full BERT on purpose: ~40% smaller while retaining most of the accuracy, which makes it far cheaper to fine-tune and serve — directly relevant to the cost question the project is really about.",
      },
      {
        title: "One split, one harness",
        body: "All three models share the same train/test split so the comparison is honest. The baseline isn't a throwaway — it's the control the whole experiment is measured against.",
      },
    ],
    metrics: [
      { value: "100K+", label: "Amazon reviews in the benchmark" },
      { value: "3", label: "model families on one honest split" },
      { value: "~40%", label: "smaller than BERT (why DistilBERT was chosen)" },
    ],
    result: [
      "The gap between the columns is the actual finding: the transformer buys accuracy, but at a steep serving-cost multiple over the baseline. Accuracy alone hides that tradeoff — putting cost next to it turns the table into a decision tool instead of a scoreboard.",
      "For a high-volume, latency-sensitive pipeline where the accuracy delta is small, the TF-IDF baseline can be the correct production choice: cheap, fast, interpretable. The transformer earns its keep when the domain is nuanced and misclassifications are expensive.",
    ],
    reflection: [
      {
        title: "The most accurate model isn't automatically the right one",
        body: "Accuracy-per-dollar, not accuracy, is the production metric. The deployment answer depends on volume, latency budget, and the cost of a wrong call — which is why the benchmark reports all three axes.",
      },
      {
        title: "What I'd build next",
        body: "A confidence-thresholded routing layer: the cheap model handles the easy cases and the transformer only sees the hard ones — turning the tradeoff into a system instead of a single choice.",
      },
    ],
    footnote:
      "Built on public data — this is the raw, unredacted modeling work: full code, real metrics, no NDA abstractions.",
  },
  {
    slug: "cie-agent-rag",
    index: "01",
    logo: { src: "/logos/rotman.svg", alt: "Rotman School of Management", bg: "#EC008C" },
    title: "CIE Agent — Agentic RAG Assistant",
    tagline:
      "Answer international students' questions with sources, complete structured tasks, and never hallucinate immigration advice.",
    summary:
      "A production-style agentic RAG assistant — intent routing, hybrid retrieval, multi-turn tool actions, prompt-injection guardrails, and a real evaluation harness with context-precision metrics. The sibling of this site's own chatbot.",
    org: "University of Toronto · Centre for International Experience",
    tags: [
      "Python",
      "ChromaDB",
      "SentenceTransformers",
      "Pydantic",
      "Streamlit",
      "Agentic RAG",
    ],
    links: [
      {
        label: "github.com/Vickylin17/UofT-CIE-Conversational-Agent",
        href: "https://github.com/Vickylin17/UofT-CIE-Conversational-Agent",
      },
    ],
    problem: [
      "International students at UofT rely on the CIE Resource Hub for everything from health insurance (UHIP) to study permits, pre-arrival steps, and advising — but the information is spread across dozens of pages, and finding the right answer under time pressure is hard.",
      "A plain keyword search can't guide you; a plain chatbot either can't *do* anything or confidently makes things up. The goal: an assistant that answers grounded questions **with sources** and completes structured tasks — without hallucinating and without giving unsafe immigration advice.",
    ],
    approach: [
      {
        title: "Agentic, not a single RAG prompt",
        body: "Every message flows through the same controlled path: **guardrails → intent classification → one of three lanes** — Knowledge (RAG), Action (tools), or Out-of-scope (fallback). Routing intents into separate lanes is what keeps grounded answers grounded and makes structured actions reliable and testable.",
      },
      {
        title: "Knowledge lane — hybrid retrieval",
        body: "Semantic embeddings combined with lightweight lexical matching over a Chroma vector store, then grounded generation that cites source links — and falls back to an explicit \"I don't know\" when retrieval comes up empty.",
      },
      {
        title: "Action lane — tools with slot-filling",
        body: "A modular tool system — pre-arrival checklist, service routing, advising prep, booking intake, event recommendations — that collects parameters (student type, arrival status, booking details) across multiple turns.",
      },
      {
        title: "Guardrails",
        body: "Prompt-injection detection, out-of-scope filtering, and domain-specific **immigration disclaimers** so the assistant never oversteps into regulated advice.",
      },
      {
        title: "Offline indexing + reliability layer",
        body: "A repeatable scrape → extract → clean → chunk → embed → index pipeline keeps the knowledge base rebuildable; an LLM wrapper adds retries, structured JSON parsing, and fallbacks, with session memory across turns.",
      },
    ],
    metrics: [
      { value: "3", label: "routed lanes: knowledge / action / out-of-scope" },
      { value: "5", label: "multi-turn tools with slot-filling" },
      { value: "JSON", label: "defined eval cases with context-precision metrics" },
    ],
    result: [
      "**Deployed** as a Streamlit app with a chat UI that renders source links, saved sessions, and one-tap task buttons.",
      "Handles the full range end-to-end: cited Q&A, multi-turn booking and advising flows, checklists tailored to student type and arrival timing, and event recommendations — with memory across turns.",
      "**Evaluated with a real harness:** JSON-defined test cases plus keyword-coverage and context-precision metrics, run end-to-end for regression checks.",
    ],
    reflection: [
      {
        title: "The eval harness is the point",
        body: "The part most student RAG projects skip. Repeatable test cases with context-precision metrics mean changes get regression-tested instead of eyeballed — the difference between a demo and something you could maintain.",
      },
      {
        title: "Intent routing over one mega-prompt",
        body: "Separating knowledge, action, and out-of-scope into distinct lanes gives cleaner failure modes and far fewer hallucinations than a monolithic RAG chain, at the cost of more upfront structure. I'd defend that trade in any interview.",
      },
      {
        title: "Honest limitations",
        body: "Retrieval ran against a hosted course model endpoint; the hybrid weighting was hand-tuned rather than learned; the scraper is brittle to site changes. Next: faithfulness metrics on top of context precision, and automated re-indexing so the knowledge base can't silently go stale.",
      },
    ],
    footnote:
      "This project is the direct proof-of-work behind this site's own chatbot — the same retrieval-plus-grounding pattern, scaled down to a personal corpus. Try the \"Ask about me\" prompt and you're using it.",
  },
];

// Display order is driven by each project's `index`, so re-ordering the grid
// is a one-line change per project rather than a block move.
export const projects: Project[] = [...allProjects].sort((a, b) =>
  a.index.localeCompare(b.index),
);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
