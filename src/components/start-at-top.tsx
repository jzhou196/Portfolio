"use client";

import { useEffect } from "react";

// First impressions matter: a fresh visit to the home page should always land
// on the hero (name + Ask-AI bar), never mid-page. Two things can break that —
// a stale "#projects" hash in a shared link, and the browser restoring the
// previous scroll position on reload. This neutralizes both on mount only, so
// in-page anchor navigation still works normally once the visitor is here.
export function StartAtTop() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
