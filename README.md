# jeff-zhou-portfolio

Personal portfolio + "Ask about me" RAG chatbot for Jeff Zhou — data scientist (finance undergrad + Rotman MMA), focused on applied ML in financial services.

**Stack:** Next.js (App Router) · TypeScript · Tailwind v4 · Vercel · Gemini (primary LLM + embeddings) · Groq (fallback LLM) · Upstash Redis (rate limiting). Runs entirely on free tiers.

## Architecture

- The static site is complete on its own — every project write-up, the about page, and the resume are plain crawlable HTML. The chatbot is additive; if it's down, nothing else breaks.
- **RAG pipeline:** `content/corpus/*.md` → build-time paragraph-aware chunking + Gemini embeddings → `src/data/embeddings.json` (committed). At runtime the chat route embeds the query, ranks chunks by in-memory cosine similarity, and streams a grounded answer.
- **Why no vector DB:** the corpus is a few dozen chunks. A managed vector store would be over-engineering; a lean, correct in-memory pipeline is the right size — and explaining that judgment is part of the point.
- **Resilience:** ordered model fallback (Gemini models → Groq models, `src/lib/rag/config.ts`), lexical-retrieval fallback if the embedding endpoint is down, canned handling for prompt-injection attempts, IP rate limits (burst + daily) protecting the free LLM quota, and a graceful contact-info fallback if every provider fails.

## Develop

```bash
npm install
cp .env.example .env.local   # fill in keys (all free tiers)
npm run embed                # regenerate embeddings after editing content/corpus/
npm run dev
```

Without any keys the site runs fully; the chat widget shows its contact fallback.

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel (framework auto-detects Next.js).
2. Add env vars in Vercel → Project → Settings → Environment Variables: `GEMINI_API_KEY`, `GROQ_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
3. `npm run build` re-embeds the corpus automatically when `GEMINI_API_KEY` is present (and skips gracefully when it isn't).
4. After the first deploy, set the production URL in `src/lib/site.ts`.

## Content

- `content/corpus/` — the chatbot's knowledge: resume, about, skills, FAQ, and the four sanitized project write-ups. Also the source of truth for site copy.
- `src/lib/projects.ts` — the case-study content rendered on the project pages (problem → approach → result → reflection).
- Confidential work (CLV, fraud) is abstracted: methodology only, no client data, metrics framed as illustrative methodology results.
