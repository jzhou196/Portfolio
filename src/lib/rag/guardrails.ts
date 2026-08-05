import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// --- prompt-injection screen ------------------------------------------------
// A light pre-LLM check for obvious override attempts (the system prompt is
// the real defense). Matches get a canned polite reply and never reach a model.
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all|any|the|previous|prior|above|earlier)\s+(instructions|rules|prompts?)/i,
  /disregard\s+(all|any|the|previous|prior|above|your)/i,
  /(reveal|show|print|repeat|output)\s+(the\s+|your\s+)?(system\s+)?(prompt|instructions|rules)/i,
  /you\s+are\s+now\s+/i,
  /pretend\s+(to\s+be|you('| a)?re)/i,
  /act\s+as\s+(if|a|an)\s+/i,
  /jailbreak|DAN\s+mode|developer\s+mode/i,
  /\bnew\s+(system\s+)?instructions?\b/i,
];

export function looksLikeInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(text));
}

export const INJECTION_REPLY =
  "Nice try — but I only talk about my background, skills, and projects. Ask me about my fraud detection pipeline, my CLV work, or my RAG systems.";

// --- rate limiting ----------------------------------------------------------
// Upstash sliding windows: a per-minute burst limit plus a daily ceiling per
// IP. On a $0 stack this protects the free LLM quota — i.e. uptime. If the
// Upstash env vars aren't configured, the limiter no-ops instead of failing.
let limiters: { minute: Ratelimit; day: Ratelimit } | null | undefined;

function getLimiters() {
  if (limiters !== undefined) return limiters;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    limiters = null;
    return limiters;
  }
  const redis = new Redis({ url, token });
  limiters = {
    minute: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "1 m"),
      prefix: "chat:min",
    }),
    day: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(80, "1 d"),
      prefix: "chat:day",
    }),
  };
  return limiters;
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const l = getLimiters();
  if (!l) return true;
  try {
    const [minute, day] = await Promise.all([l.minute.limit(ip), l.day.limit(ip)]);
    return minute.success && day.success;
  } catch {
    // Redis down should degrade to "allowed", not take the bot offline.
    return true;
  }
}
