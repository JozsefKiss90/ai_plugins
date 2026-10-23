@echo off
rem Launches the ai-second-brain MCP server from the toolkit's vendored checkout (used by ~/.config/opencode/opencode.json).
set "ROOT=%~dp0..\vendor\ai-second-brain"
if not exist "%ROOT%\.venv\Scripts\python.exe" (
  echo ai-second-brain is not set up. Run: node scripts\install.mjs --only ai-second-brain 1>&2
  exit /b 1
)
"%ROOT%\.venv\Scripts\python.exe" -m second_brain.cli mcp
