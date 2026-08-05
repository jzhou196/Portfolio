# CIE Resource Hub — Agentic RAG Assistant

**A production-style agentic RAG assistant for the University of Toronto Centre for International Experience — not just retrieval, but intent routing, multi-turn tool actions, safety guardrails, and a real evaluation harness. This is the same class of system powering the "Ask about me" assistant on this site.**

`Python` · `ChromaDB` · `SentenceTransformers` · `Pydantic` · `Streamlit` · `Agentic RAG`
Repo: https://github.com/Vickylin17/UofT-CIE-Conversational-Agent

---

## Problem

International students at UofT rely on the CIE Resource Hub for everything from health insurance (UHIP) to study permits, pre-arrival steps, and advising — but the information is spread across dozens of pages, and finding the right answer under time pressure is hard. A plain keyword search can't guide you; a plain chatbot either can't *do* anything or confidently makes things up. The goal was an assistant that does both jobs well: answer grounded questions **with sources**, and complete structured tasks (checklists, booking intake, routing) — without hallucinating and without giving unsafe immigration advice.

## Approach

The core design choice is that this is **agentic**, not a single RAG prompt. Every message flows through the same controlled path:

**Guardrails → Intent classification → one of three lanes: Knowledge (RAG) · Action (Tools) · Out-of-scope (Fallback).**

- **Knowledge lane (RAG).** Hybrid retrieval combining semantic embeddings with lightweight lexical matching over a Chroma vector store, then grounded answer generation that cites source links and falls back to an explicit "I don't know" when retrieval comes up empty.
- **Action lane (Tools).** A modular tool system — pre-arrival checklist, service routing, advising prep, booking intake, event recommendations — with **slot-filling** that collects parameters (student type, arrival status, booking details) across multiple turns.
- **Guardrails.** Prompt-injection detection, out-of-scope filtering, and domain-specific **immigration disclaimers** so the assistant never oversteps into regulated advice.
- **Offline indexing pipeline.** A repeatable scrape → extract → clean → chunk → embed → index flow, so retrieval is fast and the knowledge base is rebuildable when the site changes.
- **Reliability layer.** An LLM wrapper with retries, structured JSON parsing, and fallback behavior; session memory that persists context across turns.

Routing intents into separate lanes — instead of stuffing everything into one prompt — is what keeps grounded answers grounded and makes the structured actions reliable and testable.

## Result

- **Deployed** as a Streamlit app with a chat UI that renders source links, saved sessions, and one-tap task buttons.
- Handles the full range end-to-end: cited Q&A, multi-turn booking and advising flows, checklists tailored to student type and arrival timing, and event recommendations — with memory across turns in a session.
- **Evaluated with a real harness:** JSON-defined test cases plus metrics for keyword coverage and context precision, run end-to-end for regression checks.

## Reflection — what makes this more than a demo

The part most student RAG projects skip is the **evaluation harness**. Building repeatable test cases with context-precision and coverage metrics means changes can be regression-tested instead of eyeballed — that's the difference between a demo and something you could actually maintain. The second decision I'd defend in an interview is the **intent-routing architecture**: separating knowledge, action, and out-of-scope into distinct lanes gives cleaner failure modes and far fewer hallucinations than a monolithic RAG chain, at the cost of more upfront structure.

Honest limitations: retrieval ran against a hosted course model endpoint, and the semantic/lexical hybrid weighting was hand-tuned rather than learned; the scraper is also brittle to CIE site changes. If I extended it, I'd add faithfulness/answer-quality metrics on top of context precision, and automate re-indexing so the knowledge base can't silently go stale.

---

*This project is the direct proof-of-work behind this site's own chatbot — same retrieval-plus-grounding pattern, scaled down to a personal corpus.*
