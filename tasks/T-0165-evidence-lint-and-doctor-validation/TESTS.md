# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Focused Docker vitest | Validate lint/schema/protocol behavior. | Yes | Passed | `npx vitest run tests/unit/evidence-lint.test.ts tests/unit/schema-fixtures.test.ts tests/unit/protocol-consistency.test.ts` passed with 3 files / 22 tests. |
| npm run check | Run the full repository check when available. | Before final close sequence | Deferred | Later close capsules will run full check after all planned surfaces are implemented. |
| Built CLI evidence lint smoke | Verify executable lint surface. | Yes | Passed | `evidence lint --task T-0165 --json --project /workspace` returned `ok: true`. |
| Done-level harness | Verify completed capsule. | Yes | Passed | `harness validate --task T-0165 --level done --json --project /workspace` returned `ok: true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Read-only lint surface; no secret or permission boundary changes. | Not Run | Not applicable. |
| Integration smoke | No | No external integration surface changed. | Not Run | Not applicable. |
