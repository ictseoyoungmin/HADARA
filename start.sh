#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [ ! -d "node_modules" ]; then
  echo "[HADARA] node_modules not found. Running npm install..."
  npm install
fi

npm run dev -- "$@"
