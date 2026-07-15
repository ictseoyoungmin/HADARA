#!/usr/bin/env bash
set -euo pipefail

CONTAINER="${HADARA_DEV_CONTAINER:-hadara-dev}"
WORKSPACE="${HADARA_WORKSPACE:-/workspace}"
TMP_WORKDIR="${HADARA_DOCKER_TMP_WORKDIR:-/tmp/hadara}"
SMOKE_COMMAND="${HADARA_DEV_SMOKE_COMMAND:-version --verbose --json}"
CHECK_ONLY=0
RUN_SMOKE=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check-only)
      CHECK_ONLY=1
      shift
      ;;
    --no-smoke)
      RUN_SMOKE=0
      shift
      ;;
    --smoke-command)
      SMOKE_COMMAND="${2:-}"
      if [[ -z "$SMOKE_COMMAND" ]]; then
        echo "error: --smoke-command requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    *)
      echo "error: unsupported argument: $1" >&2
      exit 2
      ;;
  esac
done

docker exec \
  -e HADARA_WORKSPACE="$WORKSPACE" \
  -e HADARA_TMP_WORKDIR="$TMP_WORKDIR" \
  -e HADARA_CHECK_ONLY="$CHECK_ONLY" \
  -e HADARA_RUN_SMOKE="$RUN_SMOKE" \
  -e HADARA_SMOKE_COMMAND="$SMOKE_COMMAND" \
  "$CONTAINER" bash -lc '
set -euo pipefail

log_step() {
  printf "[dev-docker-sync-build] %s %s\n" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$1"
}

run_step() {
  local label="$1"
  shift
  local start end
  start="$(date +%s)"
  log_step "start: ${label}"
  "$@"
  end="$(date +%s)"
  log_step "done: ${label} ($((end-start))s)"
}

copy_full_workspace() {
  tar \
    --exclude=.git \
    --exclude=.hadara \
    --exclude=node_modules \
    --exclude=dist \
    -cf - -C "$HADARA_WORKSPACE" . | tar -xf - -C "$HADARA_TMP_WORKDIR"
}

copy_build_workspace() {
  local item
  for item in package.json package-lock.json tsconfig.json src; do
    if [[ -e "$HADARA_WORKSPACE/$item" ]]; then
      tar -cf - -C "$HADARA_WORKSPACE" "$item" | tar -xf - -C "$HADARA_TMP_WORKDIR"
    fi
  done
}

rm -rf "$HADARA_TMP_WORKDIR"
mkdir -p "$HADARA_TMP_WORKDIR"
if [[ "$HADARA_CHECK_ONLY" == "1" ]]; then
  run_step "copy workspace for full check" copy_full_workspace
else
  run_step "copy minimal build workspace" copy_build_workspace
fi
cd "$HADARA_TMP_WORKDIR"
run_step "npm ci" npm ci
if [[ "$HADARA_CHECK_ONLY" == "1" ]]; then
  run_step "npm run check" npm run check
else
  run_step "npm run build" npm run build
fi
if [[ "$HADARA_CHECK_ONLY" != "1" ]]; then
  run_step "sync dist to mounted workspace" bash -lc '"'"'rm -rf "$HADARA_WORKSPACE/dist" && mkdir -p "$HADARA_WORKSPACE/dist" && cp -R dist/. "$HADARA_WORKSPACE/dist/"'"'"'
fi
if [[ "$HADARA_RUN_SMOKE" == "1" ]]; then
  # shellcheck disable=SC2086
  run_step "built CLI smoke" node "$HADARA_WORKSPACE/dist/cli/main.js" $HADARA_SMOKE_COMMAND --project "$HADARA_WORKSPACE"
fi
'
