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
rm -rf "$HADARA_TMP_WORKDIR"
mkdir -p "$HADARA_TMP_WORKDIR"
tar --exclude=.git --exclude=.hadara --exclude=node_modules --exclude=dist -cf - -C "$HADARA_WORKSPACE" . | tar -xf - -C "$HADARA_TMP_WORKDIR"
cd "$HADARA_TMP_WORKDIR"
npm ci
npm run check
if [[ "$HADARA_CHECK_ONLY" != "1" ]]; then
  cp -R dist/. "$HADARA_WORKSPACE/dist/"
fi
if [[ "$HADARA_RUN_SMOKE" == "1" ]]; then
  # shellcheck disable=SC2086
  node "$HADARA_WORKSPACE/dist/cli/main.js" $HADARA_SMOKE_COMMAND --project "$HADARA_WORKSPACE"
fi
'
