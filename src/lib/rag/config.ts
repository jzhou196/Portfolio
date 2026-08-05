// Model IDs live here, in ordered fallback lists — free providers rotate
// model names without notice, so nothing else in the codebase hardcodes one.
export const ragConfig = {
  embedding: {
    model: "gemini-embedding-001",
    dimensions: 768,
    taskTypes: { document: "RETRIEVAL_DOCUMENT", query: "RETRIEVAL_QUERY" },
  },
  // Tried in order; first provider/model that answers wins.
  chatModels: [
    { provider: "gemini", model: "gemini-2.5-flash" },
    { provider: "gemini", model: "gemini-2.0-flash" },
    { provider: "gemini", model: "gemini-flash-latest" },
    { provider: "groq", model: "llama-3.3-70b-versatile" },
    { provider: "groq", model: "llama-3.1-8b-instant" },
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
