# Customer Lifetime Value — Prediction to Campaign ROI

**Two CLV models for two decision points — before a customer joins (acquisition targeting) and on day one (early-life targeting) — turned into a campaign-ROI engine that tells marketing *who* to target for *what* expected return. Built on a heavy-tailed, signed target with a multi-model framework, SHAP, and counterfactual ROI simulation.**

`Python` · `LightGBM / XGBoost / CatBoost` · `SHAP` · `Quantile Regression` · `Marketing Analytics`
Built on a retail bank's Advanced Data Science team · internal work — no public repo

---

## Problem

Marketing can't profitably target everyone — it needs to rank customers by expected lifetime value and spend where the return is highest. The catch: the information you have depends on *when* you're deciding. At **acquisition** you know only demographics; once an account **opens** you also have day-1 account signals. A single model can't serve both moments well — so the real problem is building the right model for each decision point, then translating predicted value into a targeting decision the business can act on.

## Approach

- **Two models, matched to two decision points.** A **Pre-Join** model (demographics only) for acquisition targeting, and an **After-Join** model (day-1 account information) for early-life targeting. Different feature sets, different moments, different downstream campaigns.
- **A target transform that fits the data.** CLV is heavy-tailed *and* can be negative (some customers are net-negative value), so a **signed `log1p`** transform stabilizes the skew while preserving sign — a naive log would silently drop exactly the customers you can't ignore.
- **A multi-model framework, not a single favorite.** LightGBM, XGBoost, and CatBoost competed on a shared, comprehensive evaluation harness so model choice was evidence-based rather than habitual.
- **Interpretability + uncertainty.** SHAP to expose which signals drive predicted value; **quantile regression** to model the *distribution* of CLV, not just a point estimate — because the money concentrates in a small high-value tail.
- **From prediction to decision.** A **counterfactual campaign-ROI simulation** turns predicted CLV into "if we target these customers, expected incremental return is X" — the actual business deliverable, not a leaderboard score.
- **Causal humility on entangled features.** Features like original amount and account-opening method are predictive but causally tangled, so they inform *ranking* without being mis-read as levers to "do more of X to raise CLV."

## Result

*(Metrics shown as illustrative methodology results.)*

- **Pre-Join model:** ~**3.18× lift @ top-20%** — targeting the top quintile the model ranks captures roughly 3.2× the value density of random selection, using demographics alone.
- **After-Join model:** ~**6.2× lift @ top-10%** — day-1 account signals sharpen targeting dramatically, concentrating value in a much tighter top decile.
- **Delivered a campaign-ROI simulation plus business-facing materials** that defended the lift-based KPIs against management pushback — mapping the metric directly to marketing's targeting budget.

## Reflection — the judgment calls behind the numbers

- **Match the model to the decision, not the other way around.** The Pre-Join / After-Join split isn't cosmetic — it's about what information *exists* when the decision is made. One combined model would have forced you to either discard day-1 signal or make it useless for acquisition.
- **Model the tail, not the mean.** Quantile regression because CLV value concentrates in a small tail; a point estimate that minimizes average error underweights precisely the customers who drive ROI.
- **Pick the target transform on purpose.** Signed `log1p` because the target is both heavy-tailed and signed — the transform is a modeling decision, not a default.
- **Defend the metric to non-technical stakeholders.** When managers questioned the KPIs, the work was framing lift@top-k as the number that maps to their budget — communication is part of the modeling job, not an afterthought.

---

*This is my strongest evidence for marketing-analytics and applied-ML roles where the job is turning predictions into decisions (targeting, ROI) — and it pairs with the fraud project's model-governance depth to show both the "make money" and "manage risk" sides of applied ML.*
