// Build-time corpus embedding: content/corpus/*.md → src/data/embeddings.json
//
// Chunking is paragraph-aware with heading context and one-paragraph overlap —
// not fixed-size — so retrieval boundaries follow the document's own structure.
// Run: npm run embed   (requires GEMINI_API_KEY in .env.local or the environment)
//
// If no key is present the script exits 0 without touching the existing
// embeddings.json, so `npm run build` never breaks on a missing secret.

import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const CORPUS_DIR = path.join(ROOT, "content", "corpus");
const OUT_FILE = path.join(ROOT, "src", "data", "embeddings.json");

const EMBED_MODEL = "gemini-embedding-001";
const DIMENSIONS = 768;
const TARGET_CHUNK_CHARS = 1400;

loadEnvLocal();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("[embed] GEMINI_API_KEY not set — skipping embedding build, keeping existing embeddings.json");
  process.exit(0);
}

const files = readdirSync(CORPUS_DIR).filter((f) => f.endsWith(".md"));
const chunks = [];
for (const file of files) {
  const text = readFileSync(path.join(CORPUS_DIR, file), "utf8");
  for (const chunk of chunkMarkdown(text, file)) chunks.push(chunk);
}
console.log(`[embed] ${files.length} files → ${chunks.length} chunks`);

const out = { model: EMBED_MODEL, dimensions: DIMENSIONS, createdAt: new Date().toISOString(), chunks: [] };
for (const [i, chunk] of chunks.entries()) {
  const embedding = await embed(chunk.text);
  out.chunks.push({ id: `${chunk.source}#${chunk.n}`, source: chunk.source, heading: chunk.heading, text: chunk.text, embedding });
  process.stdout.write(`\r[embed] ${i + 1}/${chunks.length}`);
  await sleep(150); // stay well inside the free-tier request rate
}
process.stdout.write("\n");

writeFileSync(OUT_FILE, JSON.stringify(out));
console.log(`[embed] wrote ${OUT_FILE}`);

// --- helpers ---------------------------------------------------------------

function chunkMarkdown(text, source) {
  // Split into heading-scoped paragraph groups, then pack paragraphs into
  // chunks of ~TARGET_CHUNK_CHARS with a one-paragraph overlap between chunks.
  const lines = text.split(/\r?\n/);
  let heading = source;
  const paragraphs = []; // { heading, text }
  let buf = [];
  const flush = () => {
    const t = buf.join("\n").trim();
    if (t) paragraphs.push({ heading, text: t });
    buf = [];
  };
  for (const line of lines) {
    const h = line.match(/^(#{1,3})\s+(.*)/);
    if (h) {
      flush();
      heading = h[2].trim();
      continue;
    }
    if (line.trim() === "") flush();
    else buf.push(line);
  }
  flush();

  const chunks = [];
  let cur = [];
  let curLen = 0;
  let n = 0;
  const emit = () => {
    if (cur.length === 0) return;
    const head = cur[0].heading;
    const body = cur.map((p) => p.text).join("\n\n");
    chunks.push({ source, n: n++, heading: head, text: `[${source} — ${head}]\n${body}` });
    // one-paragraph overlap into the next chunk
    cur = cur.length > 1 ? [cur[cur.length - 1]] : [];
    curLen = cur.reduce((s, p) => s + p.text.length, 0);
  };
  for (const p of paragraphs) {
    if (curLen + p.text.length > TARGET_CHUNK_CHARS && curLen > 0) emit();
    cur.push(p);
    curLen += p.text.length;
  }
  emit();
  return chunks;
}

async function embed(text, attempt = 0) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: DIMENSIONS,
      }),
    },
  );
  if (res.status === 429 && attempt < 5) {
    await sleep(2000 * (attempt + 1));
    return embed(text, attempt + 1);
  }
  if (!res.ok) throw new Error(`embedContent failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return normalize(data.embedding.values);
}

// Truncated Gemini embeddings aren't unit-length; normalizing lets runtime
// cosine similarity be a plain dot product.
function normalize(v) {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => Number((x / norm).toPrecision(8)));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
