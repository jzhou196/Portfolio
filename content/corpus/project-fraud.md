# Credit-Card Fraud Detection & Organized-Fraud Rings

**A five-phase, all-SAS-Viya pipeline that turns 4,224 raw accounts into a short, ranked, *explained* list of suspicious nodes — the seed accounts an investigator connects into organized-fraud rings. Built with ruthless data-leakage discipline, a fairness audit, and an auditable reason on every decision.**

`SAS Viya / CAS` · `Gradient Boosting` · `Random Forest` · `SHAP` · `Fraud / Credit Risk` · `Model Governance`
Rotman Crime Lab · client project for Scotiabank · repo private (client work)

---

## Problem

The bank needs to automatically flag which credit-card accounts are fraudulent (third-party FRAUD) or abusive (first-party ABUSE) so it can freeze, review, or decline them. But the real mission goes further: organized fraud isn't a set of isolated bad accounts — it's *rings* of accounts opened, cashed out, and funded through each other on a coordinated timeline. You can't map a network before you can (a) identify which nodes are suspicious and (b) explain *why*, in terms an investigator can act on. This project builds that detection-and-explanation layer — the instrument that produces trustworthy seed nodes for the network hunt.

## Approach

Five phases, each independently validated, on 12 raw Scotiabank tables (1.17M transactions, a 27-month account panel):

- **Account-level framing, dictated by the data.** Labels live at the account level, so that's the only supervised-trainable granularity — and it matches the bank's real unit of action. A `Bronze → Silver → Gold` pipeline cleaned 12 messy tables into 4 master tables, then a 4,224-row × ~40-feature account matrix, with explicit data contracts and coverage flags. **Missingness is treated as signal, never silently imputed.**
- **Ruthless leakage control — the discipline that decides prod success.** Built a formal Data Leakage Register: the single strongest raw feature (`client_status_code=DR`, Cramér's V=0.49) was *excluded* because it's a status assigned *after* fraud is discovered — a model that used it would look brilliant on history and collapse in production. Write-off, dispute, and post-hoc delinquency fields were carried separately for audit only.
- **Two independent, recall-first binaries.** FRAUD and ABUSE modeled separately (they have different fingerprints). Models were *selected* by ranking quality — FRAUD = Gradient Boosting (AUC 0.907), ABUSE = Random Forest (0.801) — but *operated* by risk-percentile with the review cutoff chosen via F-β, not a fixed probability.
- **Per-account explainability for the mission.** True SHAP (Shapley) values via SAS Viya's `shapleyExplainer` give each flagged account a *signed reason* ("flagged because near-zero repayment + high cash-out + maxed in month 1"). That lets analysts cluster accounts by *shared reason* — a candidate ring, not a coincidence — and makes every escalation fair-lending defensible.
- **A three-tier rule engine with a human in the loop.** Model scores + 7 interpretable rules → `ESCALATE / MANUAL_REVIEW / PASS`, each with a plain-language `decision_reason`, plus a fairness patch. No auto-decline: the system ranks and advises; a human decides.

## Result

- **Operating headline:** reviewing **43.5% of accounts catches 90.4% of fraud** (and 92% of abuse). The ESCALATE lane is **51.4% fraud-dense** (vs an 18% base rate); the PASS lane is clean at 3.1%.
- **Model discrimination:** FRAUD GB **AUC 0.907**, ABUSE RF 0.801.
- **A precision dial for cost asymmetry:** because flagging a good customer is expensive, tightening the FRAUD cutoff from top-30% to top-15% cuts false positives **−74%** and lifts precision 48.9% → **73.7%** (recall trades down to 61.4%) — a business lever, not a fixed setting.
- **Every decision is auditable:** one sentence explains why an account was blocked or passed, ready for a review-queue ticket or compliance audit.

## Reflection — the judgment calls behind the numbers

Four decisions I'd defend in an interview, all of which are really about *model governance*:

- **Resisting the best-looking feature.** The strongest raw signal was leakage. Excluding it costs backtest accuracy but is the only thing that makes the model survive production — the whole point of the leakage register.
- **Diagnosing a calibration trap.** An absolute probability threshold picked on TRAIN gave only **42.5% recall on TEST**, because the boosting model's TRAIN AUC is 1.0 and its probability scale doesn't transfer. The fix was to operate on population percentiles (ventiles), not raw probabilities.
- **Honest negative results.** I tested three "fancier" designs — a hierarchical cascade, a merged universal binary, and a single 3-class classifier — and kept the *simpler* two independent binaries, with the statistics to back it (on ~103 abuse positives, an AUC gain of 0.848 vs 0.850 is within noise). Choosing the simpler model when the complex one doesn't actually beat it is the harder call.
- **Owning a fairness problem.** The FRAUD model's false-positive rate for customers with prior bankruptcy was **12× higher** than for others — a disparate-impact risk. The rule engine caps bankrupt accounts out of ESCALATE (0% escalate rate), and the report records the *residual* honestly rather than declaring it solved.

And the most honest finding of all: the rule engine's recall (90.4%) does **not** beat the pure model (91.2%). The rules earn their place through explainability, the fairness patch, and cold-start coverage for ghost accounts — not extra catches. Model provides accuracy; rules provide auditability. Knowing which is which is the point.

---

*This is my strongest evidence for credit-risk, fraud, and model-governance / audit-AI roles: it's a full lifecycle — data engineering, leakage control, modeling, explainability, fairness, and an operating policy — not just a model.*
