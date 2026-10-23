#!/usr/bin/env node
// Lists the DESIGN.md brand files vendored from awesome-design-md (run the installer first).
import fs from "node:fs";
import path from "node:path";
import { vendorDir, log } from "./lib.mjs";
const root = path.join(vendorDir(), "awesome-design-md");
if (!fs.existsSync(root)) { log.warn(`not vendored yet: node scripts/install.mjs --only awesome-design-md`); process.exit(1); }
const names = [];
for (const e of fs.readdirSync(root, { recursive: true, withFileTypes: true }))
  if (e.isFile() && e.name === "DESIGN.md") names.push(path.basename(e.parentPath ?? e.path));
console.log(names.sort().join("\n"));
console.log(`\n${names.length} designs. Use: node scripts/new-project.mjs <dir> --design <name>`);
