---
name: portfolio-site
description: Design and build a case-study-driven portfolio or agency site that wins client work. Use when asked for a portfolio, personal/agency website, case study page or "show my work" site.
metadata:
  opencode/slash: "true"
---
# Portfolio site workflow

## 1. Content first
Collect 3–6 projects. For each write `content/case-studies/<slug>.md`: client & context (1 line) · problem · constraints · what we built (3 bullets) · result with a number · 2–4 visuals (screenshots via `playwright-cli` on the live product if available) · stack · your role.
Position statement (hero): who you help + what outcome + proof. Use the `copywriting` and `product-marketing` skills; avoid "passionate", "innovative", "solutions".

## 2. Design direction
If no `DESIGN.md`: run `uipro` (`uipro search "<industry> portfolio"`) for style, palette and font pairing, or pick a DESIGN.md from awesome-design-md (`node scripts/list-designs.mjs`) and adapt it. Write `DESIGN.md`. Then load `design-taste-frontend` and `frontend-design`; run `/impeccable init` to produce `PRODUCT.md`.

## 3. Build
Static site unless told otherwise (Astro or plain HTML + Tailwind). Pages: home (hero, 3 featured cases, process, CTA) · work index · case study template · about · contact (form → Resend). Performance budget: LCP < 2 s, no layout shift, images optimised.
Include: Open Graph image per page, sitemap, `robots.txt`, analytics placeholder.

## 4. Verify
`playwright-cli` screenshots at 390 / 820 / 1440 px; run `/impeccable audit` and `/impeccable polish`; fix contrast and focus states; check all links.

## 5. Ship
Deploy target as instructed (Vercel/Netlify/Cloudflare Pages). Produce `docs/launch-checklist.md` from the `launch` skill.
