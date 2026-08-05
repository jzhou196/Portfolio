"use client";

import { useState } from "react";
import { useChat } from "./chat-context";
import { SUGGESTED_QUESTIONS } from "./chat-dock";

// The signature element (§5): the hero "Ask about me" input styled as a
// real shell prompt. Submitting hands the question to the global chat dock.
export function HeroPrompt() {
  const { send } = useChat();
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div className="rounded-lg border border-line bg-panel p-4 sm:p-5">
      <p className="font-mono text-xs text-muted mb-3">
        # ask the assistant — it answers only from this site&apos;s content
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) {
            send(draft);
            setDraft("");
          }
        }}
        className="flex items-center gap-2 font-mono text-sm sm:text-base"
      >
        <label htmlFor="hero-ask" className="shrink-0 select-none">
          <span className="text-sage">jeff@portfolio</span>
          <span className="text-muted">:~</span>
          <span className="text-amber">$</span>
        </label>
        <span className="text-muted shrink-0">ask</span>
        <div className="relative flex-1">
          <input
            id="hero-ask"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={500}
            className="w-full bg-transparent text-text outline-none caret-amber placeholder:text-transparent"
            placeholder="type a question"
            autoComplete="off"
          />
          {!focused && !draft && <span className="caret absolute left-0 top-0.5" aria-hidden />}
        </div>
        <button
          type="submit"
          className="hidden sm:block font-mono text-xs text-sage hover:text-amber transition-colors"
        >
          [enter]
        </button>
      </form>
      <ul className="mt-4 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => send(q)}
              className="font-mono text-xs text-sage border border-line rounded px-2 py-1 hover:border-sage hover:text-text transition-colors"
            >
              {q}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
