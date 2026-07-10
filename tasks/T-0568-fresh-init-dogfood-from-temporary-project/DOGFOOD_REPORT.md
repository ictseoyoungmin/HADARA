# T-0568 Fresh Init Dogfood Report

## Scope

Dogfooded the current workspace-built CLI from `/tmp` using:

| Profile | Path | Result |
|---|---|---|
| basic | `/tmp/hadara-t0568-basic` | `init`, `task status --json`, and `session start --json` passed. |
| standard | `/tmp/hadara-t0568-standard` | `init`, `task status --json`, and `session start --json` passed. |
| governed | `/tmp/hadara-t0568-governed` | `init`, docs doctor, task create, context pack, validation, and finalize lifecycle completed. |

The governed toy project implemented a dependency-free tiny notes CLI with `src/notes.js`, `package.json`, and `test/notes.test.js`, then closed `T-0001` through `task finalize --execute --auto`.

## Good Results

| Area | Observation |
|---|---|
| Profile-aware required reading | Fresh basic/standard projects did not recommend absent `docs/AGENT_HANDOFF.md`; governed did include it. |
| Generated workflow docs | No generated doc instructed agents to use removed `task finish`, `task ready`, `task close`, `task audit-close`, `task complete`, `task next`, `task show`, `handoff update`, or `node dist/cli/main.js`. |
| First task selection | `task status --json` was fast and recommended `hadara task create 'Create first Task Capsule'` from structured `nextWork`. |
| Docs registry | Governed `docs doctor --json` returned healthy/clean immediately after init and after the toy capsule closed. |
| Validation recovery | `validation run` hit `spawnSync npm EPERM`, then gave correct direct-result recovery commands. Direct `npm test` passed, and `validation run --direct-result passed --update-task` resolved the blocked evidence. |
| Finalize auto | `task finalize --execute --auto` closed the toy capsule with readiness evidence, close proof, Task Board sync, and clean post-close `task status --task`. |

## Findings

| Severity | Finding | Evidence / Repro | Suggested Fix |
|---|---|---|---|
| High | `nextWork` remains `Create first Task Capsule` after the first capsule is closed, so `task status --json` recommends creating another "first" capsule even though `latestCompletedTask` is T-0001 and Task Board has one row. | Governed toy project after closed-valid: `.hadara/state/current.json.nextWork.title` stayed `Create first Task Capsule`; `task status --json` emitted `hadara task create 'Create first Task Capsule'`. | On first task create/finish/close, either clear the scaffold bootstrap `nextWork` or suppress it when Task Board has any row and no explicit new next work exists. |
| Medium | `context pack --task` in a fresh toy project suggested a HADARA-dev-specific validation command: `npm run test:focused -- tests/unit/context-graph-builder.test.ts`. | Governed toy `context pack --task T-0001 --json` included that command under `validateWith`. | Remove hardcoded HADARA-dev validation heuristics from generic context pack, or only emit project-local validation commands discovered from package scripts/task docs. |
| Medium | `context pack --task` generated a read-first agent action for `TASK.md` using `--from 1 --to 1`, which only reads the first heading of the task contract. | Governed toy `agent-action:read-first:1` suggested `hadara context slice --path tasks/T-0001-.../TASK.md --from 1 --to 1 --json`. | For active Task Capsule docs, point to the full relevant section range or omit the raw slice command when the item is already the primary task document. |
| Medium | Selected-task `task status --task T-0001 --detail full` chose `continue-implementation-or-docs` when the only blocker was Task Board finish bookkeeping. `task finalize --json` then correctly recommended `task finalize --execute --auto`. | After task docs and validation were current, `task status` reported one blocker `HARNESS_TASK_BOARD_STATUS_NOT_DONE` but primary action was generic continue/docs. | When blockers are finish-only bookkeeping, selected-task status should surface the finalize-auto action directly or mention `task finalize --json` as the next loop boundary. |
| Low | `session start --json` on a normal bounded no-live path returns `ok:true` with `degraded:true` and a warning. Technically correct, but a fresh user may read this as unhealthy. | All three profiles reported `CONTEXT_PACK_TASK_NOT_FOUND`; governed `session start --task` reported `CONTEXT_PACK_DEGRADED` for bounded no-live. | Consider using `bounded:true`/`liveSkipped:true` as normal metadata and reserve degraded warnings for missing/stale inputs. |
| Low | Validation wrapper still cannot spawn `npm` in this tool host, although direct `npm test` works. Recovery UX is now good. | `validation run -- npm test` produced blocked evidence with `VALIDATION_COMMAND_PERMISSION_DENIED`; direct `npm test` passed. | Keep direct-result path; investigate spawn restrictions separately if host-side wrapper reliability is in scope. |

## Commands Exercised

| Command | Result |
|---|---|
| `init --profile basic --json` | Passed |
| `init --profile standard --json` | Passed |
| `init --profile governed --json` | Passed |
| `task status --json` | Passed, but stale bootstrap `nextWork` after first close is a bug. |
| `session start --json` | Passed with bounded/degraded warning. |
| `session start --task T-0001 --json` | Passed with bounded/degraded warning. |
| `context pack --task T-0001 --json` | Passed, but emitted stale project-specific validation and weak TASK.md slice. |
| `docs read-map --task T-0001 --json` | Passed |
| `docs doctor --json` | Passed before and after close. |
| `validation run --task T-0001 --check "npm test" -- npm test` | Blocked by wrapper EPERM, recorded blocked evidence. |
| `npm test` | Passed directly. |
| `validation run --direct-result passed --update-task` | Passed, resolved blocked evidence. |
| `task finalize --task T-0001 --json` | Correctly recommended `--execute --auto`. |
| `task finalize --task T-0001 --execute --auto --json` | Passed, closed-valid. |
