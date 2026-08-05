import { ragConfig } from "@/lib/rag/config";
import { corpusReady, retrieveContext } from "@/lib/rag/retrieval";
import { buildSystemPrompt } from "@/lib/rag/prompt";
import { streamCompletion, type ChatTurn } from "@/lib/rag/providers";
import { checkRateLimit, looksLikeInjection, INJECTION_REPLY } from "@/lib/rag/guardrails";

// The visitor-facing contract: 200 + text stream on success; 429 when rate
// limited; 503 when the assistant can't answer. Never a raw provider error.

export async function POST(req: Request): Promise<Response> {
  let messages: ChatTurn[];
  try {
    const body = (await req.json()) as { messages?: unknown };
    messages = sanitizeMessages(body.messages);
  } catch {
    return unavailable(400);
  }
  if (messages.length === 0) return unavailable(400);

  const ip = (req.headers.get("x-forwarded-for") ?? "anon").split(",")[0].trim();
  if (!(await checkRateLimit(ip))) {
    return new Response("rate_limited", { status: 429 });
  }

  const question = messages[messages.length - 1];
  if (question.role !== "user") return unavailable(400);

  if (looksLikeInjection(question.content)) {
    console.warn("[chat] injection attempt ignored:", question.content.slice(0, 120));
    return textResponse(INJECTION_REPLY);
  }

  if (!corpusReady()) return unavailable(503);

  const context = await retrieveContext(question.content);
  const system = buildSystemPrompt(context);
  const stream = await streamCompletion(system, messages);
  if (!stream) return unavailable(503);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function sanitizeMessages(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is { role: string; content: string } =>
        !!m &&
        typeof m === "object" &&
        (m as { role?: unknown }).role !== undefined &&
        typeof (m as { content?: unknown }).content === "string",
    )
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-ragConfig.limits.maxHistoryMessages)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, ragConfig.limits.maxMessageChars),
    }))
    .filter((m) => m.content.trim().length > 0);
}

function textResponse(text: string): Response {
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function unavailable(status: number): Response {
  return new Response("unavailable", { status });
}
