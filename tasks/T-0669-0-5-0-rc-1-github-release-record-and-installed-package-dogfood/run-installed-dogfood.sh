#!/usr/bin/env bash
set -euo pipefail

ROOT="$(mktemp -d /tmp/hadara-050rc1-dogfood-XXXXXX)"
TOOLS="$ROOT/tools"
PROJECTS="$ROOT/projects"
REGISTRY="${NPM_CONFIG_REGISTRY:-https://registry.npmjs.org}"

mkdir -p "$PROJECTS"

echo "root=$ROOT"
echo "installing hadara@next from $REGISTRY"
npm install --prefix "$TOOLS" --no-bin-links --registry="$REGISTRY" hadara@next

CLI="$TOOLS/node_modules/hadara/dist/cli/main.js"

echo "installed-version"
node "$CLI" version --verbose --json

echo "registry-state"
npm view hadara@0.5.0-rc.1 version dist-tags --json --registry="$REGISTRY"

for profile in basic standard governed; do
  project="$PROJECTS/$profile"
  mkdir -p "$project"
  echo "scenario=$profile init"
  (cd "$project" && node "$CLI" init --profile "$profile" --execute --json)

  echo "scenario=$profile status"
  (cd "$project" && node "$CLI" task status --json)

  echo "scenario=$profile task-create"
  (cd "$project" && node "$CLI" task create "Installed package $profile smoke" --json)

  echo "scenario=$profile context-pack"
  (cd "$project" && node "$CLI" context pack --task T-0001 --json)

  echo "scenario=$profile docs-doctor"
  (cd "$project" && node "$CLI" docs doctor --scope all --json)
done

echo "package-recycle"
cd "$ROOT"
node "$CLI" package recycle --execute --package hadara@next --expected-version 0.5.0-rc.1 --json

echo "dogfood-root=$ROOT"
