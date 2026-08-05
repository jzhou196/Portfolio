"use client";

import { useEffect, useState } from "react";

// Types out a shell command character by character on first load.
// Server-renders the full text (SEO/no-JS safe); the typing effect only
// runs client-side and is skipped under prefers-reduced-motion.
export function TypedCommand({ text, speed = 75 }: { text: string; speed?: number }) {
  const [visible, setVisible] = useState(text.length);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval: number | undefined;
    const raf = requestAnimationFrame(() => {
      setVisible(0);
      setAnimating(true);
      let i = 0;
      interval = window.setInterval(() => {
        i += 1;
        setVisible(i);
        if (i >= text.length) {
          window.clearInterval(interval);
          setAnimating(false);
        }
      }, speed);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [text, speed]);

  return (
    <span>
      {text.slice(0, visible)}
      {animating && <span className="caret" aria-hidden />}
    </span>
  );
}
