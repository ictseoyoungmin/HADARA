# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused unit tests | Run package-smoke/release/schema focused tests. | Yes | Passed | `docker exec hadara-dev bash -lc 'cd /tmp/hadara-t0249-clean && npm run test:focused -- tests/unit/package-smoke-dry-run.test.ts tests/unit/release-dry-run.test.ts tests/unit/package-smoke-schema.test.ts'` passed 3 files / 32 tests. |
| npm run check | Run the full repository check in the reusable Docker workflow. | Yes | Passed | `docker exec hadara-dev bash -lc 'cd /tmp/hadara-t0249-clean && npm run check'` passed 92 files / 623 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI Python offline dry-run smoke | Yes | Confirms report shape and planned offline commands through the CLI surface. | Passed | `node dist/cli/main.js package smoke --provider python --network-policy offline --json --project /tmp/hadara-cli-python-smoke-t0249` emitted `offline-best-effort`, `enforced:false`, `python -m build --no-isolation`, and `pip install --no-index --no-deps wheel`. |
| Security smoke | No | No secrets, token handling, or publish mutation added. | Not Run | TBD |
| Integration smoke | No | No external provider/registry integration added. | Not Run | TBD |
