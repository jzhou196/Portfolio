"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { useChat } from "./chat-context";

export const SUGGESTED_QUESTIONS = [
  "Do you have RAG / LLM experience?",
  "Tell me about the fraud detection project.",
  "What's your experience with credit risk and model governance?",
  "Are you open to new opportunities?",
];

export function ChatDock() {
  const { open, setOpen, messages, pending, send } = useChat();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const submit = () => {
    if (!draft.trim() || pending) return;
    send(draft);
    setDraft("");
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-[#eceae3] px-4 py-2.5 font-mono text-sm font-medium text-ink shadow-lg shadow-black/40 transition-colors hover:bg-amber"
          aria-label="Open the Ask AI about Jeff assistant"
        >
          Ask AI about Jeff
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Ask about Jeff — portfolio assistant"
          className="fixed z-50 flex flex-col overflow-hidden border border-line bg-panel shadow-2xl shadow-black/60 inset-x-0 bottom-0 h-[75dvh] rounded-t-lg sm:inset-x-auto sm:right-4 sm:bottom-4 sm:h-[560px] sm:w-[420px] sm:rounded-lg"
        >
          {/* title bar */}
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <p className="font-mono text-xs text-muted">
              <span className="text-sage">jeff@portfolio</span>
              <span>:~</span> <span className="text-amber">ask-about-me</span>
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-xs text-muted hover:text-amber px-1"
              aria-label="Close assistant"
            >
              [x]
            </button>
          </div>

          {/* transcript */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 font-mono text-sm">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-muted leading-relaxed">
                  Grounded on this site&apos;s content — resume, projects, FAQ. Ask anything about
                  Jeff&apos;s background, or start with one of these:
                </p>
                <ul className="space-y-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => send(q)}
                        className="w-full text-left border border-line rounded px-2.5 py-2 text-sage hover:border-sage hover:text-text transition-colors text-xs leading-snug"
                      >
                        <span className="text-amber">?</span> {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className="mb-3 leading-relaxed">
                {m.role === "user" ? (
                  <p className="text-text">
                    <span className="text-amber">$ </span>
                    {m.content}
                  </p>
                ) : m.content === "" && pending && i === messages.length - 1 ? (
                  <p className="flex items-center gap-2 text-muted" aria-label="The assistant is thinking">
                    <span className="thinking" aria-hidden>
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="text-xs text-muted/70">thinking…</span>
                  </p>
                ) : (
                  <p className="whitespace-pre-wrap text-muted">
                    {m.content}
                    {pending && i === messages.length - 1 && <span className="caret" aria-hidden />}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-2 border-t border-line px-3 py-2.5"
          >
            <span className="font-mono text-sm text-amber" aria-hidden>
              $
            </span>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="ask about Jeff…"
              maxLength={500}
              className="flex-1 bg-transparent font-mono text-sm text-text placeholder:text-muted/60 outline-none caret-amber"
              aria-label="Ask a question about Jeff"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="font-mono text-xs text-sage disabled:text-muted/50 hover:text-amber transition-colors"
            >
              [enter]
            </button>
          </form>
          <p className="border-t border-line px-3 py-1.5 font-mono text-[10px] text-muted/70">
            answers come only from site content · no assistant? email{" "}
            <a href={`mailto:${site.email}`} className="text-sage hover:text-amber">
              {site.email}
            </a>
          </p>
        </div>
      )}
    </>
  );
}
