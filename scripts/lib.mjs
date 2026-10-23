// Shared helpers for the OpenCode toolkit scripts. Node >= 18, no dependencies.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const IS_WIN = process.platform === "win32";
export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};
export const log = {
  info: (m) => console.log(`${c.cyan("•")} ${m}`),
  ok: (m) => console.log(`${c.green("✓")} ${m}`),
  warn: (m) => console.log(`${c.yellow("!")} ${m}`),
  err: (m) => console.log(`${c.red("✗")} ${m}`),
  head: (m) => console.log(`\n${c.bold(m)}`),
};

/** OpenCode's global config dir (~/.config/opencode, honouring OPENCODE_CONFIG_DIR / XDG_CONFIG_HOME). */
export function opencodeConfigDir() {
  if (process.env.OPENCODE_CONFIG_DIR) return process.env.OPENCODE_CONFIG_DIR;
  const xdg = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
  return path.join(xdg, "opencode");
}
export const globalConfigPath = () => path.join(opencodeConfigDir(), "opencode.json");
export const globalSkillsDir = () => path.join(opencodeConfigDir(), "skills");
export const globalAgentsDir = () => path.join(opencodeConfigDir(), "agents");
export const globalCommandsDir = () => path.join(opencodeConfigDir(), "commands");
export const vendorDir = () => path.join(REPO_ROOT, "vendor");

// Strip line and block comments and trailing commas so we can read opencode.jsonc-style files.
export function parseJsonc(text) {
  let out = "", inStr = false, esc = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], nx = text[i + 1];
    if (inStr) { out += ch; if (esc) esc = false; else if (ch === "\\") esc = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') { inStr = true; out += ch; continue; }
    if (ch === "/" && nx === "/") { while (i < text.length && text[i] !== "\n") i++; out += "\n"; continue; }
    if (ch === "/" && nx === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i++; continue; }
    out += ch;
  }
  out = out.replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(out);
}

export function readJson(file, fallback = undefined) {
  if (!fs.existsSync(file)) return fallback;
  return parseJsonc(fs.readFileSync(file, "utf8"));
}
export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

/** Deep merge b into a. Objects merge recursively, arrays union (by JSON identity), scalars: b wins. */
export function deepMerge(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    const seen = new Set(a.map((x) => JSON.stringify(x)));
    return [...a, ...b.filter((x) => !seen.has(JSON.stringify(x)))];
  }
  if (isObj(a) && isObj(b)) {
    const out = { ...a };
    for (const k of Object.keys(b)) out[k] = k in out ? deepMerge(out[k], b[k]) : b[k];
    return out;
  }
  return b === undefined ? a : b;
}
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

/** PATH with uv/pipx tool dirs (~/.local/bin, ~/.cargo/bin) prepended so freshly installed tools are found. */
export function toolPath() {
  const extra = [path.join(os.homedir(), ".local", "bin"), path.join(os.homedir(), ".cargo", "bin")];
  const sep = IS_WIN ? ";" : ":";
  const cur = process.env.PATH || process.env.Path || "";
  return [...extra.filter((d) => !cur.split(sep).includes(d)), cur].join(sep);
}

export function which(bin) {
  const r = spawnSync(IS_WIN ? "where" : "which", [bin], { encoding: "utf8", shell: false, env: { ...process.env, PATH: toolPath(), Path: toolPath() } });
  if (r.status === 0) return r.stdout.split(/\r?\n/).find(Boolean) || null;
  if (bin === "python") return which("python3");
  return null;
}

export function run(cmd, { cwd = REPO_ROOT, dry = false, env = {} } = {}) {
  log.info(`${c.dim("$")} ${cmd}${cwd !== REPO_ROOT ? c.dim(`   (in ${cwd})`) : ""}`);
  if (dry) return { status: 0 };
  const r = spawnSync(cmd, { cwd, stdio: "inherit", shell: true, env: { ...process.env, ...env, PATH: toolPath() } });
  return r;
}

export function loadCatalog() {
  const cat = readJson(path.join(REPO_ROOT, "catalog.json"));
  for (const t of cat.tools) if (!t.group) t.group = "misc";
  return cat;
}

/** Read KEY=value lines from .env (ignores comments/blank lines, strips quotes). */
export function readDotEnv(file = path.join(REPO_ROOT, ".env")) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v !== "") out[m[1]] = v;
  }
  return out;
}

export function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  fs.cpSync(src, dst, { recursive: true, force: true });
}

export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      if (v !== undefined) out[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith("--")) out[k] = argv[++i];
      else out[k] = true;
    } else out._.push(a);
  }
  return out;
}

export function nodeMajor() {
  return Number(process.versions.node.split(".")[0]);
}
