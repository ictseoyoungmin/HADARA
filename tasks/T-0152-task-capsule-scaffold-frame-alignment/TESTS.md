# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run build` | Compile source into the actual package bin target under `dist/`. | Yes | Passed | Built in `/tmp/hadara` and copied compiled output into `/workspace/dist`; `dist/task/task-capsule.js` contains v2 scaffold frames. |
| `npm run test:unit -- tests/unit/task-capsule.test.ts` | Verify unit-level scaffold frame coverage. | Yes | Passed | Docker temp-copy command passed with 46 files / 345 tests, including `tests/unit/task-capsule.test.ts`. |
| `npx vitest run tests/harness/task-capsule.test.ts tests/harness/harness-validate.test.ts` | Verify scaffold generation, evidence Markdown shape, and harness compatibility. | Yes | Passed | Docker focused run passed with 2 files and 24 tests. |
| `npm run check` | Full repository validation. | Yes | Passed | Docker temp-copy full check passed with 58 files and 422 tests after adding unit scaffold coverage. |
| `node dist/cli/main.js task create "Task Capsule Scaffold Smoke" --project <tmp>` | Verify the real package bin path generates v2 frames. | Yes | Passed | hadara-dev and hadara-recycle both generated v2 `TASK`, `PLAN`, `ACCEPTANCE`, `TESTS`, `HANDOFF`, `EVIDENCE`, and empty `evidence.jsonl`. |
| `node dist/cli/main.js harness validate --task T-0152 --level done --json --project /workspace` | Done-level capsule validation. | Yes | Passed | Docker built CLI returned `ok: true` with no issues. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Protocol doctor smoke | No | Protocol doctor is future T-0153/T-0154 work. | Not Run | Not applicable. |
| Schema contract validation | No | Protocol schema fixtures are future T-0157 work. | Not Run | Not applicable. |
