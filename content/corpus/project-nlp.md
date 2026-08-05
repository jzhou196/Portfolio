# Sentiment Classification: Classical vs. Deep vs. Transformer

**A three-way benchmark on 100K+ Amazon reviews — TF-IDF + Logistic Regression, a Bi-LSTM, and fine-tuned DistilBERT — comparing not just accuracy, but the accuracy-per-dollar tradeoff that actually decides what ships.**

`Python` · `scikit-learn` · `PyTorch` · `Hugging Face Transformers` · `NLP`
Academic project on public Amazon review data — fully shareable.

---

## Problem

Product and CX teams sit on huge volumes of unstructured review text, but text is only useful once it's a signal you can act on. The task: classify review sentiment at scale. The real question, though, isn't "which model is most accurate?" — it's "which model is *right* once you factor in inference latency and serving cost?" A model that wins by a point but costs 20× to run isn't obviously the winner. So I built the comparison to answer the deployment question, not just the leaderboard question.

## Approach

I built three models spanning the complexity spectrum, on the same train/test split so the comparison is honest:

1. **TF-IDF + Logistic Regression — the strong, cheap baseline.** Fast to train, trivial to serve, and fully interpretable through its coefficients. This sets the bar every heavier model has to clear to justify its cost. (A Naive Bayes variant was also benchmarked on the classical side.)

2. **Bi-LSTM.** A bidirectional recurrent model, built and trained from scratch in PyTorch, captures word order and local context that the bag-of-words baseline discards — the natural next rung when sequence matters.

3. **Fine-tuned DistilBERT.** Chose DistilBERT over full BERT deliberately: it's ~40% smaller and retains most of the accuracy, which makes it far cheaper to fine-tune and to serve — directly relevant to the cost question the project is really about.

I started simple on purpose and only added complexity where it paid for itself. The baseline isn't a throwaway — it's the control the whole experiment is measured against.

## Result

The three models land in the expected accuracy order — DistilBERT strongest, then the Bi-LSTM, then the classical baseline — but the gap between the columns is the actual finding: the transformer's accuracy edge comes with a steep multiple in inference latency and serving cost over the near-free baseline. Accuracy alone hides that tradeoff; putting cost next to it is what makes the comparison a decision tool instead of a scoreboard.

## Reflection — which one actually ships

The most accurate model isn't automatically the right one. For a high-volume, latency-sensitive pipeline where the accuracy delta is small, the TF-IDF baseline can be the correct production choice — it's cheap, fast, and interpretable. The transformer earns its keep when the domain is nuanced and misclassifications are expensive enough to pay for the extra compute.

Honest limitation: the benchmark ran only on Amazon review text, so domain shift to other review styles or channels is untested. If I extended this, I'd add calibration and a confidence-thresholded routing layer so the cheap model handles the easy cases and the transformer only sees the hard ones — turning the tradeoff into a system instead of a single choice.

---

*This project is public and built on open data.*
