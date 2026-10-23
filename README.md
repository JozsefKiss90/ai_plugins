# OpenCode toolkit

One repository, one command: installs a curated set of **plugins, skills, MCP servers and agents** into [OpenCode](https://opencode.ai) so every new project starts fully equipped — coding, design, security, web research, and marketing/sales for client work.

```
git clone <this repo> ~/opencode-toolkit && cd ~/opencode-toolkit
cp .env.example .env            # fill in the keys you have (all optional at first)
./install.sh                    # macOS / Linux
powershell -ExecutionPolicy Bypass -File .\install.ps1     # Windows
```

Then open a **new terminal** (env vars), `node scripts/doctor.mjs` to verify, and `node scripts/new-project.mjs ~/code/my-app --design stripe` to scaffold a project.

## What you get

`catalog.json` is the single source of truth; `node scripts/install.mjs` reads it. Everything below is installed **globally** (`~/.config/opencode/`), so it is available in every project.

### Coding
| Tool | Kind | What it does |
|---|---|---|
| [Graphify](https://github.com/safishamsi/graphify) | CLI + skill | `/graphify .` builds a knowledge graph of the codebase |
| [Serena](https://github.com/oraios/serena) | MCP | LSP-backed symbol search/edit tools (40+ languages) |
| [Context7](https://github.com/upstash/context7) | MCP | Current library docs in context |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | plugin | Makes the agent write less code; `/ponytail-review` |
| [opencode-code-review](https://github.com/MetalbolicX/opencode-code-review) | plugin | `/ocr-review` of staged changes (+ our `@reviewer` agent and `/review`) |
| [claude-mem](https://github.com/thedotmack/claude-mem) | plugin | Persistent memory across sessions |
| [CodeBurn](https://github.com/getagentseal/codeburn) | CLI + MCP | Token/cost tracking per project |
| [Superpowers](https://github.com/obra/superpowers) | plugin | TDD, debugging, planning, brainstorming skills |
| [Matt Pocock skills](https://github.com/mattpocock/skills) | 27 skills | Spec-driven flow: `/grill-me` → `/to-spec` → `/to-tickets` → `/implement`, plus tdd, diagnosing-bugs, research, handoff, writing-for-agents |
| [Dynamic Context Pruning](https://github.com/Tarquinen/opencode-dynamic-context-pruning) | plugin | Prunes stale tool output → fewer tokens |
| [GitHub MCP](https://github.com/github/github-mcp-server) | MCP | Issues/PRs/Actions |
| [Sequential Thinking + Memory](https://github.com/modelcontextprotocol/servers) | MCP | Reference reasoning + knowledge-graph memory |
| [AI Second Brain](https://github.com/JozsefKiss90/ai-second-brain) | MCP | Your notes as `brain_search` / `brain_read` |
| [Exa](https://github.com/exa-labs/exa-mcp-server) | MCP | Neural web search |
| optional: [Repomix](https://github.com/yamadashy/repomix), [GitNexus](https://github.com/abhigyanpatwari/GitNexus), [oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim) | | `--only repomix,gitnexus,omo-slim` |

### Design
[Taste](https://github.com/Leonxlnx/taste-skill) · [Impeccable](https://github.com/pbakaus/impeccable) · [Playwright CLI + MCP](https://github.com/microsoft/playwright-cli) · [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (73 DESIGN.md brand files) · [img2threejs](https://github.com/img2threejs/img2threejs) · [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · [Motion design](https://github.com/howseen-ai/claude-motion-design) · [Anthropic frontend-design](https://github.com/anthropics/claude-plugins-official) · [21st MCP](https://github.com/21st-dev/magic-mcp) · optional: [superdesign](https://github.com/superdesigndev/superdesign-skill), [Open Design](https://github.com/nexu-io/open-design) (desktop app)

### Security
[Strix](https://github.com/usestrix/strix) (AI pentest, needs Docker) · [Cloudflare security-audit skill](https://github.com/cloudflare/security-audit-skill) (+ `@security-auditor`) · [REA: Reverse Engineer Anything](https://github.com/morluto/rea)

### Web / scraping
[Scrapling](https://github.com/D4Vinci/Scrapling) · **[Firecrawl](https://github.com/firecrawl/cli)** (CLI + 22 skills: `firecrawl-search/scrape/crawl/map/interact`, `firecrawl-developer-index`, `firecrawl-deep-research`, `firecrawl-competitive-intel`, `firecrawl-lead-gen`, `firecrawl-seo-audit`, `firecrawl-website-design-clone`… + [MCP](https://github.com/firecrawl/firecrawl-mcp-server)) · [Exa](https://github.com/exa-labs/exa-mcp-server) · optional: [ScrapeGraphAI](https://github.com/ScrapeGraphAI/scrapegraph-mcp) (paid), [Agent Reach](https://github.com/Panniantong/Agent-Reach) (social platforms, cookie-based)

### Marketing, sales, portfolio, pitching (greenfield client work)
| Tool | What for |
|---|---|
| [marketingskills](https://github.com/coreyhaines31/marketingskills) (52 skills) | copywriting, cold email, SEO, ads, pricing, offers, launch, competitor profiling, prospecting |
| [Anthropic pptx/docx/pdf/xlsx skills](https://github.com/anthropics/skills) | pitch decks, proposals, SOWs, invoices |
| **`client-pitch`**, **`portfolio-site`**, **`outreach-campaign`** (this repo, `skills/`) | opinionated end-to-end workflows that chain the tools above; also `/pitch` in projects |
| [Apollo](https://github.com/apolloio/apollo-mcp-plugin) · [HubSpot](https://github.com/HubSpot/hubspot-mcp-plugins) · [Resend](https://github.com/resend/resend-skills) · [Canva](https://github.com/canva-sdks/canva-skills) · [Figma](https://developers.figma.com/docs/figma-mcp-server/) · [Notion](https://developers.notion.com/guides/mcp/get-started-with-mcp) | prospecting · CRM · email sending · graphics · design files · docs (all remote MCPs, OAuth on first use) |
| optional: [Apify](https://github.com/apify/apify-mcp-server), [Stripe](https://github.com/stripe/ai), [Hunter](https://github.com/hunter-io/claude-plugin) | lead scrapers (check ToS) · invoicing · email finding |

### Infra (optional)
[OmniRoute](https://github.com/diegosouzapw/OmniRoute) (LLM gateway as an OpenCode provider) · [awesome-free-llm-apis](https://github.com/mnfst/awesome-free-llm-apis) (reference) · [Laya](https://github.com/NandhaKishorM/laya) · [headroom](https://github.com/headroomlabs-ai/headroom) (unconfirmed match for "headspace")

### Agents & commands shipped here
`@reviewer`, `@security-auditor`, `@researcher`, `@designer`, `@marketer`, `@pitch-writer` (in `agents/`) and `/review` (global); `/pitch`, `/audit` in the project template.

## Using it as a template (keep this repo untouched)

This repo is a **template**: you clone it once per machine and never push project code to it.

```
~/opencode-toolkit/          ← this repo: catalog, installer, templates (read-only in day-to-day use)
~/.config/opencode/          ← what the installer writes: global config, skills, agents, commands
~/.agents/skills/            ← skills installed by the `skills` CLI
~/code/client-a/             ← a project: its own git repo, own remote
~/code/client-b/             ← another project
```

- `install.mjs` writes only to your user config. Third-party installers run in `vendor/_work/` (git-ignored), so nothing they drop lands in the repo.
- `new-project.mjs <dir>` **copies** `templates/project/` into `<dir>` and runs `git init` there. It refuses to scaffold inside the toolkit folder.
- Each project then gets its own remote: `cd ~/code/client-a && git remote add origin <url> && git push -u origin main`.
- Per-project tweaks (enable a gated MCP, extra instructions) go in that project's `opencode.json` / `AGENTS.md`. Project config overrides the global one; it never flows back here.
- `.env` and `vendor/` are git-ignored; `git status` in the toolkit should always be clean.
- To change the shared setup (add a tool, edit an agent), do it deliberately here, commit, push; your friend runs `git pull && node scripts/install.mjs`.
- On GitHub, mark the repo as a **Template repository** (Settings → General) if you'd rather start projects with "Use this template". The scaffold script is still the better route, because it keeps project repos free of the installer code.

## Usage

```
node scripts/install.mjs                       # default set (everything marked "default")
node scripts/install.mjs --profile coding      # minimal | coding | design | security | web | marketing | all
node scripts/install.mjs --only serena,context7
node scripts/install.mjs --skip claude-mem --yes
node scripts/install.mjs --dry-run             # show what would happen, print the merged config
node scripts/doctor.mjs                        # check binaries, keys, skills, MCP entries
node scripts/env.mjs                           # (re)export .env to your user environment
node scripts/new-project.mjs <dir> [--design <name>] [--no-impeccable] [--no-uipro]
node scripts/list-designs.mjs                  # DESIGN.md names available for --design
```

Re-running the installer is safe: it merges (never overwrites) `~/.config/opencode/opencode.json` (backup in `opencode.json.bak`), re-pulls vendored repos, and re-copies skills.

### Project scaffold (`templates/project/`)
`opencode.json` (instructions, permissions, tool gating), `AGENTS.md` (workflow conventions — edit it), `.opencode/commands/{pitch,audit}.md`. `new-project.mjs` also runs `npx impeccable install` and `uipro init --ai opencode` in the project. Then inside OpenCode: `/impeccable init` → `PRODUCT.md`.

### Token hygiene
MCP servers with large tool lists (playwright, scrapling, firecrawl, rea, apollo, hubspot, canva, figma, notion, resend…) are registered but **disabled globally** via `"tools": {"name*": false}` and enabled only for the agents that need them (`@researcher`, `@designer`). Enable one in a project with:

```json
{ "tools": { "canva*": true } }
```

## Prerequisites
Node 22+, git, Python 3.10+, [uv](https://docs.astral.sh/uv/) (installed by `install.sh`/`install.ps1` if missing), pipx (same), Docker (only for Strix). OpenCode itself: `npm i -g opencode-ai`.

## Updating
`git pull` in this repo, then `node scripts/install.mjs` again. Skills installed via the `skills` CLI update with `npx skills update`. Add a tool by adding an entry to `catalog.json` (see the `$comment` there).

## Notes & caveats
- Config uses OpenCode's documented v1 keys (`mcp`, `plugin`, `agent`, `permission`, `tools`), which OpenCode 2 still accepts. If you later migrate to the v2 shape (`mcp.servers`, `plugins`, `agents`, `permissions`), update `catalog.json` accordingly.
- Secrets never go into `opencode.json` — it references `{env:NAME}`; `.env` is git-ignored.
- claude-mem's installer is interactive (hosted sign-in or your own model key); run it with `--only claude-mem` if you skipped it.
- Anthropic's official `code-review` plugin is Claude-Code-only; `opencode-code-review` + `@reviewer` cover OpenCode.
- Scraping and lead tools: respect the target sites' ToS and GDPR; the `outreach-campaign` skill asks before sending or spending credits.
