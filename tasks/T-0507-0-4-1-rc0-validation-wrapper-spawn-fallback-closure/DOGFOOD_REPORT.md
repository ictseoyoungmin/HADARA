# T-0507 Direct-Result Validation Dogfood Report

## Scope

| Field | Value |
|---|---|
| Source finding | T-0505 F-5 `validation run` child-process launch friction |
| Previous state | T-0506 mitigated the issue with generated fallback guidance, but left RF-1 open because `validation run` could still hit `spawnSync node EPERM` in this tool environment. |
| New behavior | `validation run --direct-result passed / failed / blocked --direct-summary "..."` records an already-run direct validation result without spawning a child process. |
| Dogfood project | `/tmp/hadara-t0507-toy-WBaZoH` |
| Toy task | `T-0001 Implement direct-result calculator smoke` |
| Toy result | `closed-valid` |

## Finding Closure

| Finding | Result | Evidence |
|---|---|---|
| F-5 wrapper launch friction | Closed for workflow recovery. When child-process launch is blocked by the tool environment, agents can run the command directly, then record the result through the same `validation run` surface with `--direct-result`; this preserves validation-check tags, automatic resolution behavior, evidence append, and optional TASK.md Validation row sync. | Fresh toy command `validation run --task T-0001 --check "node tests/calculator.test.mjs" --update-task --direct-result passed --direct-summary ... --json -- node tests/calculator.test.mjs` returned `ok:true`, `execution.directResult:true`, `commandStarted:false`, and `taskValidationRow.appended:false`. |

## Fresh Dogfood

| Step | Result |
|---|---|
| `init --profile governed` | Created generated docs; `docs/HADARA_WORKFLOW.md` includes `validation run --direct-result` fallback guidance. |
| `task create` | Created `T-0001 Implement direct-result calculator smoke`. |
| Direct command | `node tests/calculator.test.mjs` printed `calculator smoke passed`. |
| Direct-result recording | `validation run --direct-result passed --update-task` recorded evidence `ev:T-0001:2dcc882e8827472da760b245` and updated the existing Validation row without appending a duplicate. |
| Finalize | `task finalize --execute --auto` closed the toy capsule as `closed-valid`; compact status reports `ready:true`, `closeProofValid:true`, and no issues. |
| State verify | `state verify --json` reports `consistent:true`, 0 errors, 0 warnings, and optional missing slices/release-readiness as info only. |

## Validation

| Check | Result |
|---|---|
| Docker focused validation | `npm run build` plus `npx vitest run tests/unit/validation-run.test.ts tests/unit/init.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/command-registry.test.ts --reporter=dot` passed 4 files / 37 tests. |
| Host reproduction note | Host `npx vitest ... validation-run.test.ts ...` still reproduced child-process `EPERM` for ordinary spawned commands, confirming the environment class that direct-result mode is meant to recover from. |

## Residuals

| ID | Summary | Disposition |
|---|---|---|
| RF-1 | Node `child_process.spawnSync` may remain denied by the host/tool environment for ordinary execution. | Accepted as environment policy. The HADARA workflow no longer requires a separate `evidence add-command` escape hatch for validation evidence; use `validation run --direct-result` after a direct command run. |
