# Project instructions for OpenCode

<!-- Edit freely. OpenCode reads this file automatically; opencode.json also pulls in DESIGN.md, PRODUCT.md and docs/*.md -->

## Workflow

1. **Understand before editing.** Use `serena` symbol tools (`find_symbol`, `find_referencing_symbols`) and `/graphify .` on first contact with a codebase. Prefer `context7` for library docs instead of guessing APIs.
2. **Write less code.** The Ponytail plugin is active: prefer the smallest correct change; no speculative abstractions, no drive-by refactors.
3. **Review before shipping.** Run `/ocr-review` (local staged-change review) or `@reviewer` before committing. For anything auth/payment/PII-related, run `@security-auditor` (Cloudflare security-audit skill).
4. **Design work.** Follow `DESIGN.md` (brand tokens) and `PRODUCT.md` (from `/impeccable init`). Use `/design-taste-frontend` for new screens, `uipro` search for palettes/fonts, `21st` MCP for component scaffolds, `playwright` to screenshot and verify at 3 widths.
5. **Memory.** claude-mem records this project's sessions; ask "what did we decide about X" before re-deciding. The `brain` MCP (ai-second-brain) holds personal notes — search it with `brain_search` when the question is about past decisions outside this repo.

## Conventions

- Commits: conventional commits (`feat:`, `fix:`, `chore:`…), one logical change per commit.
- Never commit `.env`, API keys, or generated `graphify-out/` artefacts.
- Ask before: destructive git operations, deleting files, running anything that costs money (scraping APIs, paid MCPs).

## Stack

<!-- fill in: language/framework, package manager, test command, run command -->
- Run: `…`
- Test: `…`
- Lint: `…`
