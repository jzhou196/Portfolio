import embeddingsFile from "@/data/embeddings.json";
import { ragConfig } from "./config";

type Chunk = {
  id: string;
  source: string;
  heading: string;
  text: string;
  embedding: number[];
};

const corpus: Chunk[] = (embeddingsFile.chunks as Chunk[]) ?? [];

export function corpusReady(): boolean {
  return corpus.length > 0;
}

export async function retrieveContext(query: string): Promise<string> {
  if (!corpusReady()) return "";

  let ranked: { chunk: Chunk; score: number }[];
  const queryEmbedding = await embedQuery(query);
  if (queryEmbedding) {
    // Vectors are L2-normalized at build/query time, so cosine = dot product.
    ranked = corpus
      .map((chunk) => ({ chunk, score: dot(queryEmbedding, chunk.embedding) }))
      .filter((r) => r.score >= ragConfig.retrieval.minScore);
  } else {
    // Embedding endpoint down (e.g. Gemini outage while Groq still answers):
    // degrade to keyword-overlap scoring rather than taking the bot offline.
    ranked = corpus
      .map((chunk) => ({ chunk, score: lexicalScore(query, chunk.text) }))
      .filter((r) => r.score > 0);
  }

  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, ragConfig.retrieval.topK)
    .map((r) => r.chunk.text)
    .join("\n\n---\n\n");
}

async function embedQuery(query: string): Promise<number[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${ragConfig.embedding.model}:embedContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          content: { parts: [{ text: query }] },
          taskType: ragConfig.embedding.taskTypes.query,
          outputDimensionality: ragConfig.embedding.dimensions,
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { embedding?: { values?: number[] } };
    const values = data.embedding?.values;
    return values ? normalize(values) : null;
  } catch {
    return null;
  }
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) s += a[i] * b[i];
  return s;
}

function normalize(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

function lexicalScore(query: string, text: string): number {
  const stop = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "is", "are", "you", "your", "do", "does", "have", "has", "what", "how", "about", "me", "jeff"]);
  const terms = query.toLowerCase().match(/[a-z0-9]+/g)?.filter((t) => t.length > 2 && !stop.has(t)) ?? [];
  if (terms.length === 0) return 0;
  const haystack = text.toLowerCase();
  return terms.filter((t) => haystack.includes(t)).length / terms.length;
}
