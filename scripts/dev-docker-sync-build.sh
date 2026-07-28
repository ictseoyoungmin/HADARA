#!/usr/bin/env bash
set -euo pipefail

CONTAINER="${HADARA_DEV_CONTAINER:-hadara-dev}"
WORKSPACE="${HADARA_WORKSPACE:-/workspace}"
TMP_WORKDIR="${HADARA_DOCKER_TMP_WORKDIR:-/tmp/hadara}"
SMOKE_COMMAND="${HADARA_DEV_SMOKE_COMMAND:-version --verbose --json}"
CHECK_ONLY=0
RUN_SMOKE=1
HADARA_TEST_SERIAL=0
HADARA_DEV_NODE_OPTIONS=""
HADARA_NPM_JOBS=""

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
    --serial)
      HADARA_TEST_SERIAL=1
      shift
      ;;
    --low-resource)
      HADARA_TEST_SERIAL=1
      HADARA_DEV_NODE_OPTIONS="--max-old-space-size=1024"
      HADARA_NPM_JOBS=1
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

# Captured before the long install/build steps run below; rechecked
# immediately before the destructive dist replace so any existence/content
# transition in workspace dist during that window is not silently overwritten.
if [[ -f "$WORKSPACE/dist/cli/main.js" ]]; then
  DIST_BEFORE_STATE="sha256:$(sha256sum "$WORKSPACE/dist/cli/main.js" | cut -d' ' -f1)"
else
  DIST_BEFORE_STATE="missing"
fi

docker exec \
  -e HADARA_WORKSPACE="$WORKSPACE" \
  -e HADARA_TMP_WORKDIR="$TMP_WORKDIR" \
  -e HADARA_CHECK_ONLY="$CHECK_ONLY" \
  -e HADARA_RUN_SMOKE="$RUN_SMOKE" \
  -e HADARA_SMOKE_COMMAND="$SMOKE_COMMAND" \
  -e HADARA_TEST_SERIAL="$HADARA_TEST_SERIAL" \
  -e HADARA_DEV_NODE_OPTIONS="$HADARA_DEV_NODE_OPTIONS" \
  -e HADARA_NPM_JOBS="$HADARA_NPM_JOBS" \
  -e HADARA_DIST_BEFORE_STATE="$DIST_BEFORE_STATE" \
  "$CONTAINER" bash -lc '
set -euo pipefail

if [[ -n "$HADARA_DEV_NODE_OPTIONS" ]]; then
  export NODE_OPTIONS="$HADARA_DEV_NODE_OPTIONS"
fi
if [[ -n "$HADARA_NPM_JOBS" ]]; then
  export npm_config_jobs="$HADARA_NPM_JOBS"
fi

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
  git -C "$HADARA_WORKSPACE" ls-files -z -- .hadara ":(exclude).hadara/local/**" |
    tar -C "$HADARA_WORKSPACE" --null --no-recursion -cf - -T - |
    tar -xf - -C "$HADARA_TMP_WORKDIR"
}

copy_build_workspace() {
  local item
  for item in package.json package-lock.json tsconfig.json src; do
    if [[ -e "$HADARA_WORKSPACE/$item" ]]; then
      tar -cf - -C "$HADARA_WORKSPACE" "$item" | tar -xf - -C "$HADARA_TMP_WORKDIR"
    fi
  done
}

run_full_check() {
  if [[ "$HADARA_TEST_SERIAL" == "1" ]]; then
    npm run build
    npm run typecheck:tools
    npm test -- --maxWorkers=1 --no-file-parallelism
    npm run test:hadara-dev -- --maxWorkers=1 --no-file-parallelism
  else
    npm run check
  fi
}

mkdir -p "$HADARA_TMP_WORKDIR"
HADARA_TMP_WORKDIR="$(mktemp -d "$HADARA_TMP_WORKDIR/run.XXXXXX")"
trap '"'"'rm -rf "$HADARA_TMP_WORKDIR"'"'"' EXIT
if [[ "$HADARA_CHECK_ONLY" == "1" ]]; then
  run_step "copy workspace for full check" copy_full_workspace
else
  run_step "copy minimal build workspace" copy_build_workspace
fi
cd "$HADARA_TMP_WORKDIR"
run_step "npm ci" npm ci
if [[ "$HADARA_CHECK_ONLY" == "1" ]]; then
  run_step "npm run check" run_full_check
else
  run_step "npm run build" npm run build
fi
if [[ "$HADARA_CHECK_ONLY" != "1" ]]; then
  if [[ -f "$HADARA_WORKSPACE/dist/cli/main.js" ]]; then
    DIST_CURRENT_STATE="sha256:$(sha256sum "$HADARA_WORKSPACE/dist/cli/main.js" | cut -d' ' -f1)"
  else
    DIST_CURRENT_STATE="missing"
  fi
  if [[ "$DIST_CURRENT_STATE" != "$HADARA_DIST_BEFORE_STATE" ]]; then
    echo "error: workspace dist/cli/main.js changed after this run started; refusing to overwrite it. Rerun the sync." >&2
    exit 1
  fi
  run_step "sync dist to mounted workspace" bash -lc '"'"'rm -rf "$HADARA_WORKSPACE/dist" && mkdir -p "$HADARA_WORKSPACE/dist" && cp -R dist/. "$HADARA_WORKSPACE/dist/"'"'"'
fi
if [[ "$HADARA_RUN_SMOKE" == "1" ]]; then
  # shellcheck disable=SC2086
  run_step "built CLI smoke" node "$HADARA_WORKSPACE/dist/cli/main.js" $HADARA_SMOKE_COMMAND --project "$HADARA_WORKSPACE"
fi
'
