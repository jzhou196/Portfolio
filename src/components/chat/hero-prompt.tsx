"use client";

import { useState } from "react";
import { useChat } from "./chat-context";
import { SUGGESTED_QUESTIONS } from "./chat-dock";

// The signature element (§5): the hero "Ask AI about me" entry point.
// Search-bar style: a clean centered pill input, with a bold title so
// visitors immediately see the portfolio is AI-integrated.
export function HeroPrompt() {
  const { send } = useChat();
  const [draft, setDraft] = useState("");

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-mono text-2xl sm:text-3xl text-text">
        Ask <span className="text-amber">AI</span> about me!
      </h2>
      <p className="mt-2 font-mono text-xs text-muted">
        a built-in RAG assistant — it answers only from this site&apos;s content
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) {
            send(draft);
            setDraft("");
          }
        }}
        className="mt-6 flex items-center gap-3 rounded-full border border-line bg-panel px-5 py-3.5 shadow-lg shadow-black/30 transition-colors focus-within:border-amber hover:border-amber/60"
      >
        <label htmlFor="hero-ask" className="shrink-0 select-none font-mono text-amber" aria-hidden>
          $
        </label>
        <input
          id="hero-ask"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={500}
          className="w-full bg-transparent font-mono text-sm sm:text-base text-text outline-none caret-amber placeholder:text-muted/70"
          placeholder="Ask anything about Jeff — projects, skills, experience…"
          aria-label="Ask the AI assistant about Jeff"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-xs text-sage transition-colors hover:border-sage hover:text-text disabled:opacity-50"
        >
          ask →
        </button>
      </form>

      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-sage transition-colors hover:border-sage hover:text-text"
            >
              {q}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
