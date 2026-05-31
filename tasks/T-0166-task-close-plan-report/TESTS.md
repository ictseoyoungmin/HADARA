# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Focused Docker vitest | Validate task close, schema, and evidence lint integration. | Yes | Passed | `npx vitest run tests/unit/task-close.test.ts tests/unit/schema-fixtures.test.ts tests/unit/evidence-lint.test.ts` passed with 3 files / 7 tests. |
| npm run check | Run the full repository check when available. | Before final close sequence | Deferred | Full check will run after all close-model capsules are implemented. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI task close smoke | Yes | Verify executable report surface. | Passed | `task close --task T-0166 --json --project /workspace` returned `ok:true`, `mode:dry-run`, and `closeEvidence.appended:false`. |
| Done-level harness | Yes | Verify completed capsule. | Passed | `harness validate --task T-0166 --level done --json --project /workspace` returned `ok:true`. |
| Security smoke | No | T-0166 is read-only. | Not Run | Not applicable. |
| Integration smoke | No | No external integration changed. | Not Run | Not applicable. |
