---
name: outreach-campaign
description: Plan and run a B2B client-acquisition outreach campaign — ICP, lead list, personalised cold email sequence, sending via Resend, tracking in HubSpot/Notion. Use when asked to find clients, do outreach, prospect, or build a lead list.
metadata:
  opencode/slash: "true"
---
# Outreach campaign workflow

Keep everything under `outreach/<campaign-name>/`.

## 1. ICP & offer
Load `customer-research` and `offers` skills. Write `icp.md`: segment, company size, trigger events (hiring, funding, new product, bad reviews), decision-maker titles, the single painful problem, your offer and proof.

## 2. Lead list
Options, cheapest first: `firecrawl-lead-gen` / `firecrawl-company-directories` skills (or `exa` search + `firecrawl-scrape` on company sites) → `apollo` MCP (people search + enrichment; uses credits) → Hunter for emails → `apify` actors only if the target platform's ToS allows it. Write `leads.csv` with: company, website, person, title, email, trigger, source URL, personalisation note. Verify emails before sending (Hunter/Apollo verify). Never scrape or store personal data beyond business contact info; respect GDPR — include an opt-out line and your business address.

## 3. Sequence copy
Load `cold-email`. Write `sequence.md`: 3–4 touches over 14 days. Each email ≤ 90 words, one specific observation about them (the trigger), one line on outcome, one soft CTA. Variants A/B for the first email's subject line.

## 4. Send
Use the `resend` skill + MCP (from a verified sending domain, warmed up; ≤ 50/day per mailbox at first). Merge fields from `leads.csv`. Log sends to `log.csv`.

## 5. Track & iterate
Create/update deals in `hubspot` (or a Notion database via `notion`). Weekly: reply rate, meetings booked; rewrite the weakest touch using the `copywriting` skill. Report in `weekly.md`.

Ask before: sending any email, spending Apollo/Apify credits, or exceeding 200 contacts.
