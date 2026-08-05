import { ragConfig } from "./config";

export type ChatTurn = { role: "user" | "assistant"; content: string };

// Try each configured provider/model in order and return the first live
// text stream. Direct REST + SSE parsing on purpose: two providers, one
// call shape each — an SDK would be more surface area than the problem.
export async function streamCompletion(
  system: string,
  messages: ChatTurn[],
): Promise<ReadableStream<Uint8Array> | null> {
  for (const { provider, model } of ragConfig.chatModels) {
    try {
      const stream =
        provider === "gemini"
          ? await streamGemini(model, system, messages)
          : await streamGroq(model, system, messages);
      if (stream) return stream;
    } catch {
      // fall through to the next candidate
    }
  }
  return null;
}

async function streamGemini(
  model: string,
  system: string,
  messages: ChatTurn[],
): Promise<ReadableStream<Uint8Array> | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: ragConfig.limits.maxOutputTokens,
        },
      }),
      signal: AbortSignal.timeout(ragConfig.limits.requestTimeoutMs),
    },
  );
  if (!res.ok || !res.body) return null;

  return sseToText(res.body, (json) => {
    const parts = json?.candidates?.[0]?.content?.parts;
    return Array.isArray(parts) ? parts.map((p: { text?: string }) => p.text ?? "").join("") : "";
  });
}

async function streamGroq(
  model: string,
  system: string,
  messages: ChatTurn[],
): Promise<ReadableStream<Uint8Array> | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.4,
      max_tokens: ragConfig.limits.maxOutputTokens,
      messages: [{ role: "system", content: system }, ...messages],
    }),
    signal: AbortSignal.timeout(ragConfig.limits.requestTimeoutMs),
  });
  if (!res.ok || !res.body) return null;

  return sseToText(res.body, (json) => json?.choices?.[0]?.delta?.content ?? "");
}

// Both providers speak server-sent events; this converts an SSE byte stream
// into a plain-text byte stream using the given per-event text extractor.
function sseToText(
  body: ReadableStream<Uint8Array>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extract: (json: any) => string,
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const text = extract(JSON.parse(payload));
          if (text) controller.enqueue(encoder.encode(text));
        } catch {
          // partial/malformed event — skip
        }
      }
    },
  });

  return body.pipeThrough(transform);
}
