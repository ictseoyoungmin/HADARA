# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0154 changes. |
| Current Phase | Project Protocol Consistency Phase 2 | Phase 1 init scaffold/follow-up work is complete; T-0152 through T-0154 are complete. |
| Latest Completed Task | T-0154 Project Docs Consistency Doctor | Added read-only `hadara protocol doctor --scope docs --json` with docs-scope `hadara.protocol.consistency.v1` reports. |
| Active / Next Task | T-0155 Profile Drift Remediation Guide | Next Phase 2 slice should add profile drift guidance while keeping remediation writes deferred. |
| Validation Baseline | Docker full check passed | Latest Docker temp-copy `npm run check` passed with 60 files and 432 tests. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0152 Task Capsule Scaffold Frame Alignment | Assimilated Phase 2 plan into main docs, implemented Task Capsule v2 table frames, updated evidence/harness/operational-debt compatibility, preserved legacy capsule validation, and refreshed `/workspace/dist` for `package.json` bin usage. | T-0152 evidence: focused checks passed with 3 files / 50 tests; full check passed; done-level harness `ok: true`. |
| T-0153 Task Capsule Consistency Doctor | Implemented task-scoped protocol doctor reports for missing files, Task Board drift, Done with pending acceptance, evidence JSONL gaps, stale project handoff, and Done-state scaffold placeholders. | T-0153 evidence: focused protocol tests passed with 2 files / 7 tests; full Docker check passed with 60 files / 429 tests; built CLI smoke returned `ok: true`; done-level harness `ok: true`. |
| T-0154 Project Docs Consistency Doctor | Implemented docs-scope protocol doctor reports for required project docs, SOP Required Reading missing paths, Task Board versus capsule drift, and latest-completed handoff drift. | T-0154 evidence: focused protocol/error tests passed with 3 files / 13 tests; full Docker check passed with 60 files / 432 tests; built CLI smoke returned `ok: true`; done-level harness `ok: true`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| Profile drift remediation guidance is not implemented yet. | T-0154 reports docs-scope drift but does not produce remediation guidance or profile-specific repair plans. | Start T-0155 with the Phase 2 plan and current `hadara.protocol.consistency.v1` shape. |
| `hadara.protocol.consistency.v1` schema fixture is not registered yet. | T-0153/T-0154 emit the report shape, but broad schema/contract fixture work remains future scope. | Keep T-0155/T-0156 compatible with the current report shape; T-0157 owns schema registration. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift as a warning. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | T-0155/T-0156 can decide whether to guide or safely remediate this historical drift. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Create/start T-0155 Profile Drift Remediation Guide. | T-0154 completed docs-scope checks; the next Phase 2 slice should add profile drift diagnostics/remediation guidance without broad user-doc rewrites. | Stable profile drift fixtures and manual remediation objects; no write behavior unless explicitly deferred to T-0156. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused protocol checks | Docker temp-copy `npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts tests/unit/cli-errors.test.ts` passed with 3 files and 13 tests. | Covers task/docs scoped report shape, drift issue codes, JSON CLI output, text output warnings, and exit code behavior. |
| Full repository check | Docker temp-copy `npm run check` passed with 60 files and 432 tests. | Host dependencies were unavailable; Docker was used per SOP. |
| Built CLI smoke | Docker built CLI `protocol doctor --scope docs --json --project /workspace` returned `ok: true` with one warning for historical T-0073 Task Board drift; `protocol doctor --task T-0154 --json` returned `ok: true` with zero issues. | Run from `/tmp/hadara/dist` against `/workspace`. |
| Done-level harness | Docker built CLI `harness validate --task T-0154 --level done --json --project /workspace` returned `ok: true` with no issues. | Run after T-0154 docs/evidence updates. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
