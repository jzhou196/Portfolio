# Sentiment Classification: Classical vs. Deep vs. Transformer

**A three-way benchmark on Amazon review data — TF-IDF + Logistic Regression, a Bi-LSTM, and fine-tuned DistilBERT — comparing not just accuracy, but the accuracy-per-dollar tradeoff that actually decides what ships.**

`Python` · `scikit-learn` · `PyTorch` · `Hugging Face Transformers` · `NLP`
[FILL: repo link]

---

## Problem

Product and CX teams sit on huge volumes of unstructured review text, but text is only useful once it's a signal you can act on. The task: classify review sentiment at scale. The real question, though, isn't "which model is most accurate?" — it's "which model is *right* once you factor in inference latency and serving cost?" A model that wins by a point but costs 20× to run isn't obviously the winner. So I built the comparison to answer the deployment question, not just the leaderboard question.

## Approach

I built three models spanning the complexity spectrum, on the same train/test split so the comparison is honest:

1. **TF-IDF + Logistic Regression — the strong, cheap baseline.** [FILL: preprocessing — e.g. lowercasing, n-gram range, stopword handling]. Fast to train, trivial to serve, and fully interpretable through its coefficients. This sets the bar every heavier model has to clear to justify its cost.

2. **Bi-LSTM.** [FILL: embedding choice + architecture — e.g. embedding dim, hidden units, dropout]. A bidirectional recurrent model captures word order and local context that the bag-of-words baseline discards — the natural next rung when sequence matters.

3. **Fine-tuned DistilBERT.** Chose DistilBERT over full BERT deliberately: it's ~40% smaller and retains most of the accuracy, which makes it far cheaper to fine-tune and to serve — directly relevant to the cost question the project is really about. [FILL: fine-tuning setup — epochs, learning rate, max sequence length].

I started simple on purpose and only added complexity where it paid for itself. The baseline isn't a throwaway — it's the control the whole experiment is measured against.

## Result

| Model | [FILL: Accuracy / F1] | Inference latency | Relative serving cost |
|---|---|---|---|
| TF-IDF + LogReg | [FILL] | [FILL: fastest] | 1× (baseline) |
| Bi-LSTM | [FILL] | [FILL] | [FILL] |
| DistilBERT | [FILL: best] | [FILL: slowest] | [FILL: highest] |

The gap between the columns is the actual finding: [FILL: e.g. "the transformer added ~X points of accuracy over the baseline, but at roughly Y× the inference cost."] Accuracy alone hides that tradeoff; putting cost next to it is what makes the table a decision tool instead of a scoreboard.

## Reflection — which one actually ships

The most accurate model isn't automatically the right one. For a high-volume, latency-sensitive pipeline where the accuracy delta is small, the TF-IDF baseline can be the correct production choice — it's cheap, fast, and interpretable. The transformer earns its keep when the domain is nuanced and misclassifications are expensive enough to pay for the extra compute. [FILL: state which you'd deploy for this use case and one sentence of why.]

Honest limitations: [FILL: pick one that's true — e.g. class imbalance in the review data, the transformer's advantage shrinking on very short reviews, or untested domain shift to non-Amazon text]. If I extended this, I'd [FILL: e.g. add calibration and a confidence-thresholded routing layer so cheap models handle the easy cases and the transformer only sees the hard ones — turning the tradeoff into a system instead of a single choice].

---

*This project is public and built on open data — the full code is in the repo above.*
