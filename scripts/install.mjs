#!/usr/bin/env node
// OpenCode toolkit installer. Usage: node scripts/install.mjs [options]
//   --profile <all|coding|design|security|web|marketing|minimal>   (default: all tools marked "default")
//   --only a,b,c      install only these tool ids
//   --skip a,b,c      skip these tool ids
//   --yes             don't ask, just do it
//   --dry-run         print what would happen
//   --no-env          don't export .env values to your user environment
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import {
  REPO_ROOT, IS_WIN, c, log, which, run, loadCatalog, readJson, writeJson, deepMerge,
  globalConfigPath, globalSkillsDir, globalAgentsDir, globalCommandsDir, vendorDir, copyDir,
  readDotEnv, parseArgs, nodeMajor, opencodeConfigDir,
} from "./lib.mjs";
import { applyEnv } from "./env.mjs";

const args = parseArgs(process.argv.slice(2));
const DRY = !!args["dry-run"];
const catalog = loadCatalog();

// ---------- 1. choose tools ----------
function select() {
  let tools = catalog.tools;
  if (args.only) {
    const ids = new Set(String(args.only).split(","));
    tools = tools.filter((t) => ids.has(t.id));
  } else if (args.profile && args.profile !== "all") {
    const prof = catalog.profiles[args.profile];
    if (!prof) { log.err(`Unknown profile "${args.profile}". Known: ${Object.keys(catalog.profiles).join(", ")}`); process.exit(1); }
    const ids = new Set(prof);
    tools = tools.filter((t) => ids.has(t.id));
  } else if (args.profile === "all") {
    tools = tools.filter((t) => t.kind !== "reference");
  } else {
    tools = tools.filter((t) => t.default);
  }
  if (args.skip) {
    const ids = new Set(String(args.skip).split(","));
    tools = tools.filter((t) => !ids.has(t.id));
  }
  return tools;
}

// ---------- 2. prerequisites ----------
function checkPrereqs(tools) {
  log.head("Prerequisites");
  const need = new Set(["git", "node", "npx"]);
  for (const t of tools) for (const r of t.requires || []) need.add(r);
  const missing = [];
  for (const bin of need) {
    const p = which(bin);
    if (p) log.ok(`${bin} ${c.dim(p)}`);
    else { log.err(`${bin} not found`); missing.push(bin); }
  }
  if (nodeMajor() < 18) { log.err(`Node ${process.versions.node} is too old; need >= 18 (22+ recommended)`); missing.push("node>=18"); }
  if (!which("opencode")) log.warn("opencode itself is not on PATH yet — install it: https://opencode.ai/docs  (npm i -g opencode-ai)");
  return missing;
}

// ---------- 3. install one tool ----------
async function installTool(t, env) {
  log.head(`${t.name}  ${c.dim(`[${t.kind}] ${t.repo || ""}`)}`);
  // Third-party installers often write into their current directory. Run them in a git-ignored
  // scratch dir so the toolkit repo itself stays untouched.
  const scratch = path.join(vendorDir(), "_work");
  if (!DRY) fs.mkdirSync(scratch, { recursive: true });
  const tcwd = t.cwd ? path.resolve(REPO_ROOT, t.cwd) : scratch;

  // 3a. vendored git repos (skills, sources)
  if (t.git) {
    const dest = path.join(vendorDir(), t.id);
    if (fs.existsSync(path.join(dest, ".git"))) {
      run(`git -C "${dest}" pull --ff-only --quiet`, { dry: DRY });
    } else {
      fs.mkdirSync(vendorDir(), { recursive: true });
      const ref = t.git.ref ? `--branch ${t.git.ref}` : "";
      run(`git clone --depth 1 ${ref} ${t.git.repo} "${dest}"`, { dry: DRY });
    }
  }

  // 3b. shell steps
  for (const s of t.steps || []) {
    if (s.os && s.os !== process.platform) continue;
    if (s.optional && !args.yes && !(await ask(`Run optional step "${s.run}"?`))) continue;
    const cwd = s.cwd ? path.resolve(REPO_ROOT, s.cwd) : tcwd;
    const r = run(s.run, { cwd, dry: DRY, env });
    if (r.status !== 0) log.warn(`step failed (exit ${r.status}) — continuing: ${s.run}`);
  }

  // 3c. skills -> ~/.config/opencode/skills/<name>
  for (const [name, rel] of Object.entries(t.skills || {})) {
    const src = rel.startsWith("vendor:") ? path.join(vendorDir(), t.id, rel.slice(7)) : path.resolve(REPO_ROOT, rel);
    const dst = path.join(globalSkillsDir(), name);
    if (!fs.existsSync(path.join(src, "SKILL.md"))) { log.warn(`skill source missing: ${src}`); continue; }
    log.info(`skill ${c.bold(name)} ← ${c.dim(src)}`);
    if (!DRY) copyDir(src, dst);
  }

  // 3d. agents / commands shipped in this repo
  for (const [kind, dir] of [["agents", globalAgentsDir()], ["commands", globalCommandsDir()]]) {
    for (const rel of t[kind] || []) {
      const src = path.resolve(REPO_ROOT, rel);
      log.info(`${kind.slice(0, -1)} ${c.bold(path.basename(src))}`);
      if (!DRY) { fs.mkdirSync(dir, { recursive: true }); fs.copyFileSync(src, path.join(dir, path.basename(src))); }
    }
  }

  // 3e. config fragment (merged later)
  return t.config || {};
}

// ---------- 4. merge global opencode.json ----------
function mergeGlobalConfig(fragments) {
  log.head(`Global config  ${c.dim(globalConfigPath())}`);
  const file = globalConfigPath();
  let current = readJson(file, { "$schema": "https://opencode.ai/config.json" });
  let merged = current;
  for (const f of fragments) merged = deepMerge(merged, f);
  // placeholders: {{TOOLKIT}} = this repo's absolute path, {{SH}} = cmd on Windows / sh elsewhere
  merged = JSON.parse(JSON.stringify(merged)
    .replaceAll("{{TOOLKIT}}", REPO_ROOT.replace(/\\/g, "/"))
    .replaceAll("{{SH}}", IS_WIN ? "cmd" : "sh"));
  if (DRY) { console.log(JSON.stringify(merged, null, 2)); return; }
  if (fs.existsSync(file)) fs.copyFileSync(file, file + ".bak");
  writeJson(file, merged);
  log.ok(`written (backup: opencode.json.bak)`);
}

function ask(q) {
  if (args.yes) return Promise.resolve(true);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(`${q} [Y/n] `, (a) => { rl.close(); res(!/^n/i.test(a.trim())); }));
}

// ---------- main ----------
(async () => {
  console.log(c.bold(`\nOpenCode toolkit installer ${DRY ? c.yellow("(dry run)") : ""}`));
  console.log(c.dim(`repo: ${REPO_ROOT}\nopencode config dir: ${opencodeConfigDir()}`));
  const tools = select();
  log.head("Selected tools");
  for (const t of tools) console.log(`  ${c.green("+")} ${t.id.padEnd(22)} ${c.dim(t.summary)}`);
  const missing = checkPrereqs(tools);
  if (missing.length) {
    log.warn(`Missing: ${missing.join(", ")}. See README → Prerequisites. Tools needing them will be skipped.`);
  }
  const env = readDotEnv();
  const missingEnv = [];
  for (const t of tools) for (const e of t.env || []) if (e.required && !env[e.name] && !process.env[e.name]) missingEnv.push(`${e.name} (${t.name})`);
  if (missingEnv.length) log.warn(`Required keys not set in .env: ${missingEnv.join(", ")} — those tools will load but fail until you add them.`);
  if (!(await ask("\nProceed?"))) process.exit(0);

  const fragments = [];
  const skipped = [];
  for (const t of tools) {
    const unmet = (t.requires || []).filter((r) => !which(r));
    if (unmet.length) { skipped.push(`${t.id} (needs ${unmet.join(", ")})`); continue; }
    try { fragments.push(await installTool(t, env)); }
    catch (e) { log.err(`${t.id}: ${e.message}`); skipped.push(`${t.id} (error)`); }
  }
  mergeGlobalConfig(fragments);

  if (!args["no-env"]) { log.head("Environment variables"); applyEnv(env, { dry: DRY }); }

  log.head("Done");
  if (skipped.length) log.warn(`Skipped: ${skipped.join("; ")}`);
  const notes = tools.filter((t) => t.notes);
  if (notes.length) { console.log("\nPost-install notes:"); for (const t of notes) console.log(`  ${c.bold(t.name)}: ${t.notes}`); }
  console.log(`\nNext: ${c.cyan("node scripts/doctor.mjs")} to verify, ${c.cyan("node scripts/new-project.mjs <dir>")} to scaffold a project, then open a new terminal and run ${c.cyan("opencode")}.`);
})();
