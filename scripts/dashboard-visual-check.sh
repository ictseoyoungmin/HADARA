#!/usr/bin/env bash
# T-0214 — run the dashboard visual + accessibility gate in the Playwright image.
#
# Renders the BUILT docs/design/dashboard/index.html via file:// with the
# read-only aggregate APIs stubbed from dashboard/visual-fixtures/*, captures
# screenshot baselines (home/detail/empty/degraded), and runs axe-core.
# Read-only: no command execution, no project-state mutation.
#
# Usage: bash scripts/dashboard-visual-check.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PW_IMAGE="${PLAYWRIGHT_IMAGE:-mcr.microsoft.com/playwright:v1.60.0-noble}"
OUT_DIR="${DASH_OUT:-${REPO_ROOT}/.dashboard-visual}"

mkdir -p "${OUT_DIR}"
echo "[dashboard-visual] image=${PW_IMAGE}"
docker run --rm \
  -v "${REPO_ROOT}":/repo:ro \
  -v "${OUT_DIR}":/out \
  -w /work \
  "${PW_IMAGE}" \
  bash -lc "
    set -e
    npm i --no-save playwright@1.60.0 @axe-core/playwright@4.10.1 axe-core@4.10.2 >/dev/null 2>&1
    # ESM bare imports resolve from the script's dir, so run from the writable
    # workdir where node_modules lives; read inputs from the read-only repo.
    cp /repo/dashboard/visual-check.mjs /work/visual-check.mjs
    DASH_HTML=/repo/docs/design/dashboard/index.html \
    DASH_FIX=/repo/dashboard/visual-fixtures \
    DASH_OUT=/out \
    node /work/visual-check.mjs
  "
echo "[dashboard-visual] screenshots -> ${OUT_DIR}"
