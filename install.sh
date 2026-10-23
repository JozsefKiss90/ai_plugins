#!/usr/bin/env bash
# One-shot installer for macOS/Linux:  ./install.sh [--profile coding] [--yes]
set -euo pipefail
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Node.js 22+ is required: https://nodejs.org"; exit 1; }
command -v git  >/dev/null || { echo "git is required"; exit 1; }
command -v uv   >/dev/null || { echo "Installing uv..."; curl -LsSf https://astral.sh/uv/install.sh | sh; export PATH="$HOME/.local/bin:$PATH"; uv tool update-shell; }
command -v pipx >/dev/null || { echo "Installing pipx..."; python3 -m pip install --user pipx && python3 -m pipx ensurepath; export PATH="$HOME/.local/bin:$PATH"; }
command -v opencode >/dev/null || { echo "Installing OpenCode..."; npm install -g opencode-ai@latest; }
[ -f .env ] || { cp .env.example .env; echo "Created .env — fill in the API keys you have (optional)."; }
node scripts/install.mjs "$@"
