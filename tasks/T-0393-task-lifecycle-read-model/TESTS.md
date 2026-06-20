# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `timeout 300 docker exec hadara-dev bash -lc 'set -euo pipefail; workdir=/tmp/hadara-t0393-focused-4; rm -rf "$workdir"; mkdir -p "$workdir"; tar --exclude=.git --exclude=.hadara --exclude=node_modules --exclude=dist -cf - -C /workspace . \| tar -xf - -C "$workdir"; cd "$workdir"; npm ci --progress=false; npm run test:focused -- tests/unit/task-lifecycle.test.ts tests/unit/task-complete-flow.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts'` | Focused lifecycle/adjacent/registry/schema tests. | Yes | Passed: 4 files / 20 tests. | `ev:T-0393:bc944ecc2c894e869dd7e557` |
| `npm run dev:docker-sync-build` | Full Docker validation and dist refresh for CLI source changes. | Yes | Passed: 139 test files / 915 tests; workspace `dist` refreshed. | `ev:T-0393:5ec89716142c4e19b7e3abe0` |
| `node dist/cli/main.js task lifecycle --task T-0393 --json` | Built CLI smoke for new command. | Yes | Passed: `ok:true`, `readOnly:true`, `phase:"finish-required"`, one `primaryNextAction`. | `ev:T-0393:03d977cfde444c83862cfd3c` |
| `git diff --check` | Whitespace cleanliness after source/docs/capsule updates. | Yes | Passed. | `ev:T-0393:1d249ff2caf745f6bba117bd` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission, secret, raw-read, or storage boundary changed. | Not Run | N/A |
| Close repair stale/invalid fixtures | No | Dedicated follow-up scope for T-0394. | Not Run | Deferred |
| Mounted performance benchmark | No | T-0393 composes existing lifecycle reports; performance optimization is not in scope. | Not Run | Finding recorded in `FINDINGS.md` |
