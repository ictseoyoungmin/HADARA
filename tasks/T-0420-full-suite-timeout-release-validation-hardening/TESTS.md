# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run build && npm test -- --run tests/unit/dashboard-bootstrap.test.ts tests/unit/dashboard-static.test.ts tests/harness/dogfooding-e2e-fixture.test.ts tests/unit/evidence-parallel-append.test.ts tests/unit/release-dry-run.test.ts tests/unit/schema-fixtures.test.ts'` | Run the failure set from the publish-clone timeout log. | Yes | Passed: 6 files / 34 tests. | `ev:T-0420:6fc1e031e0d243c3971bc44d` |
| `docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm test -- --run'` | Run full Vitest suite from ext4 validation copy. | Yes | Passed: 144 files / 947 tests in 19.61s. | `ev:T-0420:80ee3d2f4d09409c9c3651b9` |
| `docker exec hadara-dev bash -lc 'cp -R /tmp/hadara/dist/. /workspace/dist/'` | Refresh workspace `dist` after changes. | Yes | Passed. | `ev:T-0420:68733ec5e4d24f3f8e43de31` |
| `git diff --check` | Check whitespace before finalize/commit. | Yes | Passed. | `ev:T-0420:83a365b861bf4336ba5f2b09` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Publish execution | No | T-0418 owns approval-gated npm publish. | Not Run. | Boundary note |
