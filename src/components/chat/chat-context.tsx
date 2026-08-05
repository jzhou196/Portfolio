"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { site } from "@/lib/site";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: ChatMessage[];
  pending: boolean;
  send: (text: string) => void;
};

const ChatContext = createContext<ChatState | null>(null);

const FALLBACK = `The assistant is unavailable right now — but everything it knows is on this site, and Jeff is easy to reach directly: ${site.email}`;

const RATE_LIMITED =
  "You've hit the request limit for now — give it a minute and try again. (This site runs on free-tier quotas, so the limiter protects uptime for everyone.)";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy.current) return;
      busy.current = true;
      setOpen(true);
      setPending(true);

      const history = [...messages, { role: "user" as const, content: trimmed }];
      // Show the user line plus an empty assistant slot to stream into.
      setMessages([...history, { role: "assistant", content: "" }]);

      const patchLast = (content: string) =>
        setMessages((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { role: "assistant", content };
          return next;
        });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-8) }),
        });

        if (res.status === 429) {
          patchLast(RATE_LIMITED);
          return;
        }
        if (!res.ok || !res.body) {
          patchLast(FALLBACK);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          patchLast(acc);
        }
        if (!acc.trim()) patchLast(FALLBACK);
      } catch {
        patchLast(FALLBACK);
      } finally {
        busy.current = false;
        setPending(false);
      }
    },
    [messages],
  );

  return (
    <ChatContext.Provider value={{ open, setOpen, messages, pending, send }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatState {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}
