---
name: client-pitch
description: End-to-end client pitch for a greenfield software project — discovery questions, scoping, proposal document (docx), pitch deck (pptx) and follow-up email. Use when asked to pitch, propose, quote, scope or present a project to a prospective client.
metadata:
  opencode/slash: "true"
---
# Client pitch workflow

Output lives in `pitch/`. Work in this order; stop and ask when a step needs information you don't have.

## 1. Discovery (if no notes exist)
Ask at most 8 questions, grouped: business goal & success metric · users & current workaround · must-have vs nice-to-have · constraints (budget range, deadline, stack, compliance) · decision maker & timeline · what happens if they do nothing.
Save answers to `pitch/discovery.md`.

Before scoping, run `firecrawl-lead-research` on the prospect (site, recent news, job posts) and `firecrawl-competitive-intel` on 2–3 competitors; save to `pitch/research.md`.

## 2. Scope & options
Write `pitch/scope.md`: problem statement (2 sentences) · 3 options (Minimal / Recommended / Extended) with scope, timeline, price or price range, risks · explicit out-of-scope list · assumptions to confirm.
Pricing: use the `pricing` and `offers` skills from marketingskills; anchor on outcome value, present Recommended as the default.

## 3. Proposal (docx)
Load the `docx` skill. Structure: cover · summary (half page) · understanding of their situation (mirror their words) · proposed solution & options table · timeline/milestones · team & process (weekly demo, staging, acceptance) · investment · next steps & validity date · appendix (assumptions, out-of-scope).
Tone: plain, confident, no buzzwords. Save as `pitch/proposal.docx`.

## 4. Deck (pptx)
Load the `pptx` skill. 8–12 slides: title · their problem (with their numbers) · what success looks like · solution overview (one diagram) · how it works for the user (2–3 screens/mockups — ask @designer if none exist) · plan & milestones · why us (relevant case studies from the portfolio) · investment · risks & how we handle them · next step.
Use `DESIGN.md` tokens if present, otherwise the `frontend-design` skill's guidance on type and colour. Save `pitch/deck.pptx`.

## 5. Follow-up
Load `cold-email` / `emails` skill. Write `pitch/follow-up.md`: a 120-word recap email with the one decision you need and a proposed call slot; plus a 2-line nudge for day +5.

## Rules
- Never invent client names, logos, testimonials or numbers; label assumptions.
- Prices are ranges until scope is confirmed.
- Use `brain_search` (ai-second-brain) for past proposals and rates before drafting.
