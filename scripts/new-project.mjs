#!/usr/bin/env node
// Scaffold OpenCode config into a (new or existing) project directory.
// Usage: node scripts/new-project.mjs <dir> [--kind web|api|client] [--design <DESIGN.md name>] [--no-impeccable] [--no-uipro]
//   Copies templates/project/* (opencode.json, AGENTS.md, .opencode/{agents,commands}), optionally a DESIGN.md
//   from awesome-design-md, then runs the per-project installers (impeccable, ui-ux-pro-max).
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, c, log, run, parseArgs, vendorDir, which } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const target = args._[0];
if (!target) { console.log("usage: node scripts/new-project.mjs <dir> [--design <name>] [--no-impeccable] [--no-uipro]"); process.exit(1); }
const dir = path.resolve(target);
fs.mkdirSync(dir, { recursive: true });
log.head(`Scaffolding ${dir}`);

const tpl = path.join(REPO_ROOT, "templates", "project");
for (const entry of fs.readdirSync(tpl, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const rel = path.relative(tpl, path.join(entry.parentPath ?? entry.path, entry.name));
  const dst = path.join(dir, rel);
  if (fs.existsSync(dst)) { log.warn(`exists, kept: ${rel}`); continue; }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(path.join(tpl, rel), dst);
  log.ok(rel);
}

// DESIGN.md from awesome-design-md (vendor/awesome-design-md/<name>/DESIGN.md or designs/<name>/DESIGN.md)
if (args.design) {
  const root = path.join(vendorDir(), "awesome-design-md");
  const candidates = [path.join(root, args.design, "DESIGN.md"), path.join(root, "designs", args.design, "DESIGN.md")];
  const found = candidates.find((p) => fs.existsSync(p)) || findDesign(root, args.design);
  if (found) { fs.copyFileSync(found, path.join(dir, "DESIGN.md")); log.ok(`DESIGN.md ← ${path.relative(root, found)}`); }
  else log.warn(`DESIGN.md "${args.design}" not found under ${root} (run the installer first; list with: node scripts/list-designs.mjs)`);
}

if (!fs.existsSync(path.join(dir, ".git"))) run("git init -q", { cwd: dir });

if (!args["no-impeccable"]) run("npx -y impeccable install", { cwd: dir });
if (!args["no-uipro"] && which("uipro")) run("uipro init --ai opencode", { cwd: dir });
else if (!args["no-uipro"]) run("npx -y ui-ux-pro-max-cli init --ai opencode", { cwd: dir });

console.log(`\n${c.green("Ready.")} cd "${dir}" && opencode\n  First prompts to try: ${c.cyan("/impeccable init")}, ${c.cyan("/graphify .")}, ${c.cyan("/design-taste-frontend")}`);

function findDesign(root, name) {
  if (!fs.existsSync(root)) return null;
  const want = name.toLowerCase();
  for (const e of fs.readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (e.isFile() && e.name === "DESIGN.md" && path.basename(e.parentPath ?? e.path).toLowerCase() === want) return path.join(e.parentPath ?? e.path, e.name);
  }
  return null;
}
