// Model IDs live here, in ordered fallback lists — free providers rotate
// model names without notice, so nothing else in the codebase hardcodes one.
export const ragConfig = {
  embedding: {
    model: "gemini-embedding-001",
    dimensions: 768,
    taskTypes: { document: "RETRIEVAL_DOCUMENT", query: "RETRIEVAL_QUERY" },
  },
  // Tried in order; first provider/model that answers wins.
  // Verified live 2026-08-29 — free providers retire model IDs without notice,
  // so if the bot starts returning 503, re-probe this list first (the previous
  // Gemini 2.x and Llama 3.x entries were retired out from under us).
  chatModels: [
    { provider: "gemini", model: "gemini-3.6-flash" },
    { provider: "gemini", model: "gemini-3.5-flash" },
    { provider: "gemini", model: "gemini-3.5-flash-lite" },
    { provider: "gemini", model: "gemini-flash-latest" },
    { provider: "groq", model: "openai/gpt-oss-120b" },
    { provider: "groq", model: "openai/gpt-oss-20b" },
  ] as const,
  retrieval: {
    topK: 6,
    minScore: 0.3, // cosine floor — below this a chunk is noise, not context
  },
  limits: {
    maxMessageChars: 500,
    maxHistoryMessages: 8,
    maxOutputTokens: 1024,
    requestTimeoutMs: 25_000,
  },
} as const;

export type ChatProviderName = (typeof ragConfig.chatModels)[number]["provider"];
