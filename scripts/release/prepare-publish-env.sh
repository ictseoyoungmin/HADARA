#!/usr/bin/env bash
# Prepare a clean publish environment inside the hadara-dev container,
# so the operator can `npm login` and then run `manual-publish-rc.sh <TASK> --execute`.
# This script does not run the manual publish helper by default; the helper owns
# the end-to-end dry-run, release evidence, npm dry-run, and npm publish boundary.
# The optional GitHub Release step is still operator-controlled, but this helper
# prepares a public release note artifact so npm and GitHub publication can stay
# in the same release capsule when the operator chooses `--github-draft`.
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
# gh release edit vX.Y.Z --repo <owner/name> --draft=false   # optional, after review
#
# Before running this script, the operator should have already:
# 1) Version and release docs already point at the intended package version.
#    For the current 0.4.6 stable path:
#    package.json "version": "0.4.6"
#    docs/RELEASE_READINESS.md:
#    - Current version is `0.4.6`.
# 2) Commit the readiness state. Fresh clones only contain committed content.
# git add -A && git commit -m "T-0629 0.4.6 stable release readiness and publish preparation"
#
#
# What it does:
#   1. Fresh `git clone /workspace` into a container ext4 path (+ safe.directory).
#   2. `npm ci` and `npm run build`; verify built dist version == package.json version.
#   3. Remove the stale global `hadara`.
#   4. Strict release-gate sanity check (no npm auth needed).
#   5. Skip the manual helper by default and print the exact command the operator runs next.
#      An explicit --run-helper-dry-run option is available for manual preview only.
#   6. Ensure a public GITHUB_RELEASE_NOTE.md exists in the task capsule.
#   7. Print the exact container + folder + commands to finish npm publish and optional GitHub release handling.
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
#   --github-repo <owner/name>
#                        Explicit GitHub repository for tag/release publication.
#                        Default: ictseoyoungmin/HADARA.
#   --git-remote-url <url>
#                        Explicit Git remote for tag publication. Defaults to the
#                        HTTPS remote derived from --github-repo.
#   --retained-artifact-dir <path>
#                        Container-visible directory containing the exact .tgz, .sha256,
#                        .manifest.json, and release-artifact-report.json to publish.
#                        When supplied, the publish helper never regenerates bytes.
#   --retained-artifact-report <path>
#                        Optional explicit retained release artifact report path.
#   --run-helper-dry-run Run `manual-publish-rc.sh <TASK>` dry-run after prepare.
#                        Off by default so --execute remains the end-to-end boundary.
#   --skip-dry-run       Compatibility no-op; helper dry-run is already skipped by default.
#   -h, --help           Show this help.
#
# Run it from the host repo root:
#   bash scripts/release/prepare-publish-env.sh T-0629

set -euo pipefail

TASK_ID=""
CONTAINER="${HADARA_DEV_CONTAINER:-hadara-dev}"
CLONE_DIR="/root/hadara-publish"
WORKSPACE="/workspace"
REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org}"
GITHUB_REPO="${HADARA_GITHUB_REPO:-ictseoyoungmin/HADARA}"
GIT_REMOTE_URL="${HADARA_GIT_REMOTE_URL:-}"
RETAINED_ARTIFACT_DIR="${HADARA_RETAINED_ARTIFACT_DIR:-}"
RETAINED_ARTIFACT_REPORT="${HADARA_RETAINED_ARTIFACT_REPORT:-}"
RUN_HELPER_DRY_RUN="${HADARA_RUN_HELPER_DRY_RUN:-0}"

usage() { sed -n '2,64p' "$0"; }

if [[ $# -gt 0 && "$1" != --* ]]; then
  TASK_ID="$1"; shift
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --container) CONTAINER="${2:-}"; [[ -n "$CONTAINER" ]] || { echo "--container requires a value"; exit 1; }; shift 2;;
    --clone-dir) CLONE_DIR="${2:-}"; [[ -n "$CLONE_DIR" ]] || { echo "--clone-dir requires a value"; exit 1; }; shift 2;;
    --workspace) WORKSPACE="${2:-}"; [[ -n "$WORKSPACE" ]] || { echo "--workspace requires a value"; exit 1; }; shift 2;;
    --registry) REGISTRY="${2:-}"; [[ -n "$REGISTRY" ]] || { echo "--registry requires a value"; exit 1; }; shift 2;;
    --github-repo) GITHUB_REPO="${2:-}"; [[ -n "$GITHUB_REPO" ]] || { echo "--github-repo requires a value"; exit 1; }; shift 2;;
    --git-remote-url) GIT_REMOTE_URL="${2:-}"; [[ -n "$GIT_REMOTE_URL" ]] || { echo "--git-remote-url requires a value"; exit 1; }; shift 2;;
    --retained-artifact-dir) RETAINED_ARTIFACT_DIR="${2:-}"; [[ -n "$RETAINED_ARTIFACT_DIR" ]] || { echo "--retained-artifact-dir requires a value"; exit 1; }; shift 2;;
    --retained-artifact-report) RETAINED_ARTIFACT_REPORT="${2:-}"; [[ -n "$RETAINED_ARTIFACT_REPORT" ]] || { echo "--retained-artifact-report requires a value"; exit 1; }; shift 2;;
    --run-helper-dry-run) RUN_HELPER_DRY_RUN="1"; shift;;
    --skip-dry-run) RUN_HELPER_DRY_RUN="0"; shift;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown argument: $1"; usage; exit 1;;
  esac
done

if [[ -z "$TASK_ID" ]]; then
  echo "TASK_ID is required (the release Task Capsule id, e.g. T-0597)."
  usage
  exit 1
fi
[[ "$GITHUB_REPO" =~ ^[^/]+/[^/]+$ ]] || { echo "--github-repo must be owner/name"; exit 1; }
if [[ -z "$GIT_REMOTE_URL" ]]; then
  GIT_REMOTE_URL="https://github.com/${GITHUB_REPO}.git"
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
echo "GitHub repo: $GITHUB_REPO"
echo "Git remote:  $GIT_REMOTE_URL"
echo "Retained artifact: $([[ -n "$RETAINED_ARTIFACT_DIR" ]] && echo "$RETAINED_ARTIFACT_DIR" || echo "not supplied; helper regeneration mode")"
if [[ -n "$RETAINED_ARTIFACT_REPORT" ]]; then echo "Retained report:   $RETAINED_ARTIFACT_REPORT"; fi
echo "Helper dry-run: $([[ "$RUN_HELPER_DRY_RUN" == "1" ]] && echo "opt-in enabled" || echo "skipped by default")"
echo

docker exec \
  -e HADARA_TASK_ID="$TASK_ID" \
  -e HADARA_CLONE_DIR="$CLONE_DIR" \
  -e HADARA_WORKSPACE_DIR="$WORKSPACE" \
  -e HADARA_REGISTRY="$REGISTRY" \
  -e HADARA_GITHUB_REPO="$GITHUB_REPO" \
  -e HADARA_GIT_REMOTE_URL="$GIT_REMOTE_URL" \
  -e HADARA_RETAINED_ARTIFACT_DIR="$RETAINED_ARTIFACT_DIR" \
  -e HADARA_RETAINED_ARTIFACT_REPORT="$RETAINED_ARTIFACT_REPORT" \
  -e HADARA_RUN_HELPER_DRY_RUN="$RUN_HELPER_DRY_RUN" \
  "$CONTAINER" bash -lc '
set -euo pipefail
TASK="$HADARA_TASK_ID"
CLONE="$HADARA_CLONE_DIR"
WORKSPACE="$HADARA_WORKSPACE_DIR"
REGISTRY="$HADARA_REGISTRY"
GITHUB_REPO="$HADARA_GITHUB_REPO"
GIT_REMOTE_URL="$HADARA_GIT_REMOTE_URL"
RETAINED_ARTIFACT_DIR="$HADARA_RETAINED_ARTIFACT_DIR"
RETAINED_ARTIFACT_REPORT="$HADARA_RETAINED_ARTIFACT_REPORT"
RUN_HELPER_DRY_RUN="$HADARA_RUN_HELPER_DRY_RUN"

echo "== 1. Fresh clone from the mounted repo =="
add_git_safe_directory() {
  local directory="$1"
  git config --global --get-all safe.directory 2>/dev/null | grep -Fxq "$directory" \
    || git config --global --add safe.directory "$directory" >/dev/null 2>&1 \
    || true
}

add_git_safe_directory "$WORKSPACE"
add_git_safe_directory "$WORKSPACE/.git"
test -d "$WORKSPACE/.git" || { echo "ERROR: $WORKSPACE/.git not found; is the repo mounted?"; exit 1; }
rm -rf "$CLONE"
git clone "$WORKSPACE" "$CLONE"
add_git_safe_directory "$CLONE"
cd "$CLONE"
git remote set-url origin "$GIT_REMOTE_URL"
[ "$(git remote get-url origin)" = "$GIT_REMOTE_URL" ] || { echo "ERROR: publish clone origin is not the explicit GitHub remote: $(git remote get-url origin)"; exit 1; }
echo "HEAD: $(git log --oneline -1)"
echo "Publish origin: $(git remote get-url origin)"
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
echo "== 2b. Ensure public GitHub Release note artifact =="
RELEASE_NOTE=""
TASK_DIR="$(find tasks -maxdepth 1 -type d -name "$TASK-*" | sort | head -1 || true)"
if [ -z "$TASK_DIR" ]; then
  echo "WARN: task capsule not found for $TASK; cannot prepare GITHUB_RELEASE_NOTE.md."
else
  RELEASE_NOTE=".hadara/local/release-notes/$TASK.md"
  mkdir -p "$(dirname "$RELEASE_NOTE")"
  if [ -f "$RELEASE_NOTE" ]; then
    echo "GitHub Release note already exists: $RELEASE_NOTE"
  else
    cat > "$RELEASE_NOTE" <<EOF
# HADARA $PKG_VERSION

HADARA $PKG_VERSION is a release-candidate build of the HADARA CLI and project protocol.

## Install

\`\`\`bash
npm install -g hadara@next
hadara version --json
\`\`\`

## Validation

- Release readiness evidence is recorded in the $TASK Task Capsule.
- npm publication should be verified with \`npm view hadara@$PKG_VERSION version\`.
- Post-publish installed-package recycle should verify \`hadara@next\` resolves to $PKG_VERSION from a disposable consumer project.

## Notes

This note is intended for GitHub Release readers. Internal operator logs, local paths, tokens, and review-only debugging details must stay out of this file.
EOF
    echo "Created GitHub Release note: $RELEASE_NOTE"
  fi
fi

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
GATE_OK="$(node --import tsx tools/dev-surfaces.ts release gate --mode strict --json 2>/dev/null \
  | node -e "let d=\"\";process.stdin.on(\"data\",c=>d+=c).on(\"end\",()=>{try{const r=JSON.parse(d);console.log(r.ok)}catch(e){console.log(\"parse-error\")}})")"
echo "release gate --mode strict ok: $GATE_OK"
if [ "$GATE_OK" != "true" ]; then
  echo "ERROR: strict release gate is not green. Inspect:"
  echo "  docker exec -it $HOSTNAME bash -lc \"cd $CLONE && node --import tsx tools/dev-surfaces.ts release gate --mode strict --json\""
  exit 1
fi

echo
echo "== 5. Manual helper dry-run boundary =="
HELPER_ARGS=("$TASK")
HELPER_ARGS+=(--registry "$REGISTRY")
HELPER_ARGS+=(--github-repo "$GITHUB_REPO" --git-remote-url "$GIT_REMOTE_URL")
if [ -n "$RETAINED_ARTIFACT_DIR" ]; then HELPER_ARGS+=(--retained-artifact-dir "$RETAINED_ARTIFACT_DIR"); fi
if [ -n "$RETAINED_ARTIFACT_REPORT" ]; then HELPER_ARGS+=(--retained-artifact-report "$RETAINED_ARTIFACT_REPORT"); fi
if [ -n "$RELEASE_NOTE" ]; then HELPER_ARGS+=(--github-release-note "$RELEASE_NOTE"); fi
if [ "$RUN_HELPER_DRY_RUN" != "1" ]; then
  echo "skipped by default."
  echo "The end-to-end dry-run, release evidence, npm dry-run, and npm publish stay in:"
  printf "  bash scripts/release/manual-publish-rc.sh"; printf " %q" "${HELPER_ARGS[@]}"; printf " --execute\\n"
elif npm whoami --registry="$REGISTRY" >/dev/null 2>&1; then
  echo "npm user: $(npm whoami --registry="$REGISTRY")"
  printf "Running: bash scripts/release/manual-publish-rc.sh"; printf " %q" "${HELPER_ARGS[@]}"; printf " (dry-run, no --execute)\\n"
  set +e
  bash scripts/release/manual-publish-rc.sh "${HELPER_ARGS[@]}"
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
  echo "The --execute run performs the full dry-run before publishing."
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
if [[ -n "$RETAINED_ARTIFACT_DIR" ]]; then
  echo "  bash scripts/release/manual-publish-rc.sh $TASK_ID --registry $REGISTRY --retained-artifact-dir $RETAINED_ARTIFACT_DIR --execute --github-draft \\"
else
  echo "  bash scripts/release/manual-publish-rc.sh $TASK_ID --registry $REGISTRY --execute --github-draft \\"
fi
echo "    --github-repo $GITHUB_REPO --git-remote-url $GIT_REMOTE_URL \\\"
if [[ -n "$RETAINED_ARTIFACT_REPORT" ]]; then
  echo "    --retained-artifact-report $RETAINED_ARTIFACT_REPORT \\"
fi
echo "    --github-release-note .hadara/local/release-notes/$TASK_ID.md"
echo "  # then type exactly: publish"
echo "  # then type exactly: github-draft"
echo
echo "If npm was already published and only the GitHub Release remains:"
echo
echo "  # If a draft already exists and has been reviewed:"
echo "  gh release edit v\$(node -p \"require('./package.json').version\") --repo $GITHUB_REPO --draft=false --prerelease  # for RC versions"
echo
echo "  # Or create a draft from the source/workspace repo, then review and publish:"
echo "  gh release create v\$(node -p \"require('./package.json').version\") --repo $GITHUB_REPO \\"
echo "    --target \$(git rev-parse HEAD) --title \"HADARA \$(node -p \"require('./package.json').version\")\" \\"
echo "    --notes-file .hadara/local/release-notes/$TASK_ID.md --draft --prerelease  # for RC versions"
echo "  gh release edit v\$(node -p \"require('./package.json').version\") --repo $GITHUB_REPO --draft=false --prerelease  # for RC versions"
echo
echo "Notes:"
echo "  - Publish from this clone, not /workspace (the mounted host repo cannot build)."
echo "  - This helper creates tasks/$TASK_ID-*/GITHUB_RELEASE_NOTE.md if it is missing."
echo "  - If evidence is generated inside this clone, copy or replay it into /workspace canon before closing."
echo "  - Review the GitHub draft content and tag target before publishing it publicly."
echo "============================================================"
