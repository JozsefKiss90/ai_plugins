#!/usr/bin/env sh
# Launches the ai-second-brain MCP server from the toolkit's vendored checkout.
ROOT="$(cd "$(dirname "$0")/.." && pwd)/vendor/ai-second-brain"
PY="$ROOT/.venv/bin/python"
[ -x "$PY" ] || { echo "ai-second-brain is not set up. Run: node scripts/install.mjs --only ai-second-brain" >&2; exit 1; }
exec "$PY" -m second_brain.cli mcp
