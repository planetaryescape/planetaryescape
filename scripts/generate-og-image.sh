#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
session="planetaryescape-og-image"
trap 'agent-browser --session "$session" close >/dev/null 2>&1 || true' EXIT

agent-browser --session "$session" open "file://$root/scripts/og-image.html"
agent-browser --session "$session" set viewport 1200 630
agent-browser --session "$session" eval 'document.fonts.load("88px Basement").then(fonts => { if (fonts.length === 0 || !document.fonts.check("88px Basement")) throw new Error("Basement font failed to load; check the @font-face src path"); })'
agent-browser --session "$session" screenshot "$root/public/og-image.png"
