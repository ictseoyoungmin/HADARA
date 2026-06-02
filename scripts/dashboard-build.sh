#!/usr/bin/env bash
# Build the HADARA Operator Console into a single self-contained static asset
# (docs/design/dashboard/index.html) using the reusable Docker workflow.
#
# Why Docker: the dashboard build needs esbuild + preact (devDependencies), and
# on NTFS-mounted workspaces npm cannot install them in place (EPERM). This
# installs them into a container-local node_modules and bundles from there,
# writing only the generated index.html back to the workspace.
#
# Usage: bash scripts/dashboard-build.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_IMAGE="${HADARA_NODE_IMAGE:-node:22-bookworm}"
ESBUILD_VERSION="${ESBUILD_VERSION:-0.25.0}"
PREACT_VERSION="${PREACT_VERSION:-10.29.2}"

echo "[dashboard-build] image=${NODE_IMAGE}"
docker run --rm \
  -v "${REPO_ROOT}":/repo \
  -w /repo \
  "${NODE_IMAGE}" \
  bash -lc "
    set -e
    mkdir -p /opt/deps && cd /opt/deps
    npm init -y >/dev/null 2>&1
    npm install --no-save esbuild@${ESBUILD_VERSION} preact@${PREACT_VERSION} >/dev/null 2>&1
    cd /repo
    DASH_DEPS=/opt/deps/node_modules node dashboard/build.mjs
  "
echo "[dashboard-build] done -> docs/design/dashboard/index.html"
