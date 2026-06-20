# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `timeout 300 docker exec hadara-dev bash -lc 'set -euo pipefail; workdir=/tmp/hadara-t0391-focused-2; rm -rf "$workdir"; mkdir -p "$workdir"; tar --exclude=.git --exclude=.hadara --exclude=node_modules --exclude=dist -cf - -C /workspace . \| tar -xf - -C "$workdir"; cd "$workdir"; npm ci --progress=false; npm run test:focused -- tests/unit/task-next.test.ts tests/unit/session-start.test.ts'` | Focused parser and adjacent Session Start validation. | Yes | Passed: 2 files / 12 tests. | `ev:T-0391:cc5750565e7149598bd68683` |
| `npm run dev:docker-sync-build` | Full Docker suite and dist refresh. | Yes | Passed: 138 files / 911 tests; built version smoke reported `distLooksStale:false`. | `ev:T-0391:ce4b816c3ef64b6eb1154083` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not applicable. |
| Dogfood scenario | Yes | `session start --json` followed by `task next --json` exposed the self-referential recommendation and legacy Partial fallback issue. | Built CLI passed: self-referential guidance ignored, T-0391 Draft primary, T-0006 Partial backlog. | `ev:T-0391:d22ebea228d34e9b966efe53` |
