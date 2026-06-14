#!/usr/bin/env bash
# Prepare a clean, validated publish environment inside the hadara-dev container,
# so the operator only has to `npm login` and run `manual-publish-rc.sh <TASK> --execute`.
#
# Why this script exists (the traps it removes):
# - The mounted /workspace (/mnt/f, DrvFs) cannot run `npm ci`/`npm run build`: the package
#   `.bin` symlinks (tsc, vitest) break on the Windows-backed filesystem. So the publish
#   helper must run from a clone on the container's native ext4 filesystem.
# - Cloning the mounted repo as root triggers git "dubious ownership"; this adds the
#   required `safe.directory` entries.
# - A container may have a stale global `hadara` on PATH. `manual-publish-rc.sh`
#   prefers the clone's freshly built `dist/cli/main.js` when it exists, but this script
#   still removes the stale global binary to keep diagnostics unambiguous.
# 
# Example flow:
# docker exec -it hadara-dev bash
# cd /root/hadara-publish
# npm login --registry=https://registry.npmjs.org     # whoami 안 되어 있으면
# bash scripts/release/manual-publish-rc.sh <TASK_ID> --execute   # 프롬프트에 publish
#
# Before running this script, the operator should have already:
# 1) Version and release docs already point at the intended package version.
#    For the current stable 0.3.0 path:
#    package.json "version": "0.3.0"
#    docs/RELEASE_READINESS.md:
#    - Current version is `0.3.0`.
# 2) Commit the readiness state. Fresh clones only contain committed content.
# git add -A && git commit -m "T-0315 Stable 0.3.0 Release Readiness Preparation"
#
#
# What it does:
#   1. Fresh `git clone /workspace` into a container ext4 path (+ safe.directory).
#   2. `npm ci` and `npm run build`; verify built dist version == package.json version.
#   3. Remove the stale global `hadara`.
#   4. Strict release-gate sanity check (no npm auth needed).
#   5. If npm is logged in: run the official helper dry-run, then re-clean the clone.
#      If not: skip it (the --execute run performs the full dry-run before publishing).
#   6. Print the exact container + folder + commands to finish the publish.
#
# This script never publishes. Registry mutation stays in `manual-publish-rc.sh --execute`,
# which the operator runs interactively after `npm login`.
#
# Usage:
#   scripts/release/prepare-publish-env.sh <TASK_ID> [options]
#
# Options:
#   --container <name>   Docker container name. Default: hadara-dev
#   --clone-dir <path>   Clone path inside the container. Default: /root/hadara-publish
#   --workspace <path>   Mounted repo path inside the container. Default: /workspace
#   --registry <url>     npm registry. Default: https://registry.npmjs.org
#   --skip-dry-run       Never run the helper dry-run, even if npm is logged in.
#   -h, --help           Show this help.
#
# Run it from the host repo root:
#   bash scripts/release/prepare-publish-env.sh T-0316

set -euo pipefail

TASK_ID=""
CONTAINER="${HADARA_DEV_CONTAINER:-hadara-dev}"
CLONE_DIR="/root/hadara-publish"
WORKSPACE="/workspace"
REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org}"
SKIP_DRY_RUN="0"

usage() { sed -n '2,45p' "$0"; }

if [[ $# -gt 0 && "$1" != --* ]]; then
  TASK_ID="$1"; shift
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --container) CONTAINER="${2:-}"; [[ -n "$CONTAINER" ]] || { echo "--container requires a value"; exit 1; }; shift 2;;
    --clone-dir) CLONE_DIR="${2:-}"; [[ -n "$CLONE_DIR" ]] || { echo "--clone-dir requires a value"; exit 1; }; shift 2;;
    --workspace) WORKSPACE="${2:-}"; [[ -n "$WORKSPACE" ]] || { echo "--workspace requires a value"; exit 1; }; shift 2;;
    --registry) REGISTRY="${2:-}"; [[ -n "$REGISTRY" ]] || { echo "--registry requires a value"; exit 1; }; shift 2;;
    --skip-dry-run) SKIP_DRY_RUN="1"; shift;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown argument: $1"; usage; exit 1;;
  esac
done

if [[ -z "$TASK_ID" ]]; then
  echo "TASK_ID is required (the release Task Capsule id, e.g. T-0316)."
  usage
  exit 1
fi

command -v docker >/dev/null 2>&1 || { echo "docker not found on host."; exit 1; }
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "Container '$CONTAINER' is not running. Start it (or pass --container <name>)."
  exit 1
fi

echo "== HADARA publish environment preparation =="
echo "Task:       $TASK_ID"
echo "Container:  $CONTAINER"
echo "Clone dir:  $CLONE_DIR (container ext4)"
echo "Workspace:  $WORKSPACE (mounted repo)"
echo "Registry:   $REGISTRY"
echo "Dry-run:    $([[ "$SKIP_DRY_RUN" == "1" ]] && echo "skipped" || echo "auto (only if npm is logged in)")"
echo

docker exec \
  -e HADARA_TASK_ID="$TASK_ID" \
  -e HADARA_CLONE_DIR="$CLONE_DIR" \
  -e HADARA_WORKSPACE_DIR="$WORKSPACE" \
  -e HADARA_REGISTRY="$REGISTRY" \
  -e HADARA_SKIP_DRY_RUN="$SKIP_DRY_RUN" \
  "$CONTAINER" bash -lc '
set -euo pipefail
TASK="$HADARA_TASK_ID"
CLONE="$HADARA_CLONE_DIR"
WORKSPACE="$HADARA_WORKSPACE_DIR"
REGISTRY="$HADARA_REGISTRY"
SKIP_DRY_RUN="$HADARA_SKIP_DRY_RUN"

echo "== 1. Fresh clone from the mounted repo =="
git config --global --add safe.directory "$WORKSPACE" >/dev/null 2>&1 || true
test -d "$WORKSPACE/.git" || { echo "ERROR: $WORKSPACE/.git not found; is the repo mounted?"; exit 1; }
rm -rf "$CLONE"
git clone "$WORKSPACE" "$CLONE"
git config --global --add safe.directory "$CLONE" >/dev/null 2>&1 || true
cd "$CLONE"
echo "HEAD: $(git log --oneline -1)"
DIRTY="$(git status --porcelain)"
[ -z "$DIRTY" ] || { echo "ERROR: fresh clone is unexpectedly dirty:"; echo "$DIRTY"; exit 1; }

echo
echo "== 2. Install dependencies and build (on ext4, where npm ci works) =="
npm ci
npm run build
PKG_VERSION="$(node -p "require(\"./package.json\").version")"
DIST_VERSION="$(node dist/cli/main.js version 2>/dev/null | head -1)"
echo "package.json version: $PKG_VERSION"
echo "built dist version:   $DIST_VERSION"
[ "$PKG_VERSION" = "$DIST_VERSION" ] || { echo "ERROR: built dist version != package.json version"; exit 1; }

echo
echo "== 3. Remove stale global hadara (force the helper to use this clone) =="
rm -f /usr/local/bin/hadara || true
if command -v hadara >/dev/null 2>&1; then
  echo "WARN: a global hadara is still on PATH: $(command -v hadara)"
  echo "      The helper may use it instead of this clone. Remove it before publishing."
else
  echo "global hadara not on PATH (good; helper will use ./dist/cli/main.js)"
fi

echo
echo "== 4. Strict release-gate sanity (no npm auth needed) =="
GATE_OK="$(node dist/cli/main.js release gate --mode strict --json 2>/dev/null \
  | node -e "let d=\"\";process.stdin.on(\"data\",c=>d+=c).on(\"end\",()=>{try{const r=JSON.parse(d);console.log(r.ok)}catch(e){console.log(\"parse-error\")}})")"
echo "release gate --mode strict ok: $GATE_OK"
if [ "$GATE_OK" != "true" ]; then
  echo "ERROR: strict release gate is not green. Inspect:"
  echo "  docker exec -it $HOSTNAME bash -lc \"cd $CLONE && node dist/cli/main.js release gate --mode strict --json\""
  exit 1
fi

echo
echo "== 5. Helper dry-run (optional; needs npm login) =="
if [ "$SKIP_DRY_RUN" = "1" ]; then
  echo "skipped (--skip-dry-run)."
elif npm whoami --registry="$REGISTRY" >/dev/null 2>&1; then
  echo "npm user: $(npm whoami --registry="$REGISTRY")"
  echo "Running: bash scripts/release/manual-publish-rc.sh $TASK   (dry-run, no --execute)"
  set +e
  bash scripts/release/manual-publish-rc.sh "$TASK"
  DRY_STATUS=$?
  set -e
  echo "helper dry-run exit status: $DRY_STATUS"
  echo "(a non-zero status here usually means the version is already published; see output above)"
  echo "Re-cleaning the clone so --execute starts from a clean worktree..."
  git checkout -- . 2>/dev/null || true
  git clean -fd >/dev/null 2>&1 || true
  rm -rf dist-release
else
  echo "npm is not logged in -> skipping the helper dry-run."
  echo "Readiness gates already passed; the --execute run performs the full dry-run before publishing."
fi

echo
echo "== 6. Final worktree state =="
FINAL_DIRTY="$(git status --porcelain)"
if [ -z "$FINAL_DIRTY" ]; then
  echo "clean worktree (ready for --execute)"
else
  echo "WARN: worktree is not clean:"; echo "$FINAL_DIRTY"
fi
'

echo
echo "============================================================"
echo "READY. The prepared clone is at $CLONE_DIR inside container '$CONTAINER'."
echo
echo "To publish hadara now:"
echo
echo "  docker exec -it $CONTAINER bash"
echo "  cd $CLONE_DIR"
echo "  npm login --registry=$REGISTRY        # if 'npm whoami' is not already set"
echo "  bash scripts/release/manual-publish-rc.sh $TASK_ID --execute"
echo "  # then type exactly: publish"
echo
echo "Notes:"
echo "  - Publish from this clone, not /workspace (the mounted host repo cannot build)."
echo "  - The 'Published ...' evidence lands in this clone's $TASK_ID capsule, not /workspace."
echo "  - Do not pass --github-draft here: the clone's origin is $WORKSPACE, not GitHub."
echo "============================================================"
