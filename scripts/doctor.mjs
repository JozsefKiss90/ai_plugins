#!/usr/bin/env node
// Health check: prerequisites, API keys, installed skills, MCP entries in the global opencode.json.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { c, log, which, loadCatalog, readJson, globalConfigPath, globalSkillsDir, readDotEnv, nodeMajor } from "./lib.mjs";

const catalog = loadCatalog();
// OpenCode reads global skills from all three of these
const skillDirs = [globalSkillsDir(), path.join(os.homedir(), ".agents", "skills"), path.join(os.homedir(), ".claude", "skills")];
const env = { ...readDotEnv(), ...process.env };
const cfg = readJson(globalConfigPath(), {});
const mcp = cfg.mcp?.servers || cfg.mcp || {};
const plugins = [...(cfg.plugin || []), ...(cfg.plugins || [])].map((p) => (typeof p === "string" ? p : p.package || p[0]));

log.head("Binaries");
for (const bin of ["opencode", "git", "node", "npx", "bun", "uv", "uvx", "python", "python3", "pipx", "docker", "gh"]) {
  const p = which(bin);
  console.log(`  ${p ? c.green("✓") : c.dim("–")} ${bin.padEnd(10)} ${c.dim(p || "")}`);
}
console.log(`  node ${process.versions.node} ${nodeMajor() >= 22 ? c.green("ok") : c.yellow("(22+ recommended)")}`);

log.head(`Config  ${c.dim(globalConfigPath())}`);
if (!fs.existsSync(globalConfigPath())) log.warn("no global opencode.json yet — run the installer");

let problems = 0;
for (const t of catalog.tools) {
  const parts = [];
  // mcp entries
  for (const name of Object.keys(t.config?.mcp || {})) parts.push(mcp[name] ? c.green(`mcp:${name}`) : c.red(`mcp:${name} missing`)), mcp[name] || problems++;
  // plugins
  for (const p of t.config?.plugin || []) parts.push(plugins.includes(p) ? c.green(`plugin:${p}`) : c.red(`plugin:${p} missing`)), plugins.includes(p) || problems++;
  // skills
  for (const name of [...Object.keys(t.skills || {}), ...(t.skillsInstalled || [])]) {
    const ok = skillDirs.some((d) => fs.existsSync(path.join(d, name, "SKILL.md")));
    parts.push(ok ? c.green(`skill:${name}`) : c.red(`skill:${name} missing`)); ok || problems++;
  }
  // env
  for (const e of t.env || []) {
    const ok = !!env[e.name];
    parts.push(ok ? c.green(e.name) : e.required ? c.red(`${e.name} unset`) : c.yellow(`${e.name} unset (optional)`));
    if (!ok && e.required) problems++;
  }
  // binaries
  for (const r of t.requires || []) if (!which(r)) { parts.push(c.red(`needs ${r}`)); problems++; }
  if (parts.length) console.log(`  ${t.id.padEnd(22)} ${parts.join("  ")}`);
}
console.log();
problems ? log.warn(`${problems} issue(s). Fix .env / prerequisites and re-run: node scripts/install.mjs`) : log.ok("everything the catalog expects is in place");
