# One-shot installer for Windows. Right-click > Run with PowerShell, or:  powershell -ExecutionPolicy Bypass -File .\install.ps1 [--profile coding] [--yes]
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "Node.js 22+ is required: https://nodejs.org (or: winget install OpenJS.NodeJS.LTS)"; exit 1 }
if (-not (Get-Command git -ErrorAction SilentlyContinue))  { Write-Host "Git is required: winget install Git.Git"; exit 1 }
if (-not (Get-Command uv -ErrorAction SilentlyContinue))   { Write-Host "Installing uv (Python tool manager)..."; powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"; $env:Path = "$env:USERPROFILE\.local\bin;$env:Path" }
if (-not (Get-Command pipx -ErrorAction SilentlyContinue)) { Write-Host "Installing pipx..."; python -m pip install --user pipx; python -m pipx ensurepath; $env:Path = "$env:USERPROFILE\.local\bin;$env:Path" }
if (-not (Get-Command opencode -ErrorAction SilentlyContinue)) { Write-Host "Installing OpenCode..."; npm install -g opencode-ai@latest }
if (-not (Test-Path .env)) { Copy-Item .env.example .env; Write-Host "Created .env — fill in the API keys you have (optional), then re-run to export them." }
node scripts/install.mjs @args
