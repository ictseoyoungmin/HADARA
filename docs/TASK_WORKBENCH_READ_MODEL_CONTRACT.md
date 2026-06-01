# TASK_WORKBENCH_READ_MODEL_CONTRACT

## Purpose

`hadara.task.workbench.v1` is the Phase 3 task-facing read model for future dashboard, TUI, MCP, and external-agent task detail views.

Consumers should prefer this report when they need task readiness, evidence health, close/audit state, protocol summaries, and next actions for one task.

## Source Command

| Surface | Command / Service | Writes |
|---|---|---|
| CLI JSON | `hadara task status --task <task-id> --json` | None |
| TypeScript service | `createTaskWorkbenchReport(projectRoot, taskId)` | None |

## Consumer Guidance

| Consumer | Guidance |
|---|---|
| Dashboard | Use workbench JSON for a selected task detail panel instead of parsing Task Capsule Markdown directly; dashboard controls should remain read-again or copy-command only. |
| TUI | Use the service report for selected-task detail, close readiness, and next actions; keep full raw document viewing as a separate detail tab. |
| MCP | If a future read-only MCP task-workbench tool is added, wrap this report as JSON text and preserve `schemaVersion`, `command`, `ok`, `issues`, and `nextActions`. |
| External agents | Prefer `task status --json` before stitching together task show, evidence list, evidence lint, protocol doctor, ready, close, and harness reports manually. |

## Field Use

| Field | Intended Use |
|---|---|
| `task` | Identity, capsule path, `TASK.md` status, true Task Board row status/path/presence from `docs/TASK_BOARD.md`. |
| `state` | Quick readiness, close evidence presence, valid closure, and auditability flags. |
| `summary` | Dashboard cards, badges, and compact TUI rows. |
| `sources` | Source-level health; useful for drill-down links to existing commands. |
| `issues` | Blocking/warning details; consumers should not infer blockers from text. |
| `nextActions` | Copyable commands and review/edit/remediation/audit guidance. |

For `task.status`, top-level `ok` means report generation succeeded for an existing task. It is not a readiness gate. Consumers should use `state.ready`, `summary.blockers`, and `issues` for readiness or closeability.

Task Board consumers should use `task.taskBoardPresent` before displaying `task.taskBoardStatus`. If `task.taskBoardPresent` is false, `task.taskBoardStatus` is a sentinel and the corresponding issue will include `WORKBENCH_TASK_BOARD_ROW_MISSING`. Status and capsule mismatches are surfaced as `WORKBENCH_TASK_BOARD_STATUS_DRIFT` and `WORKBENCH_TASK_BOARD_CAPSULE_DRIFT`.

Close-state consumers should prefer `state.closedValid` over the legacy `state.closed` alias. `state.closeEvidenceFound` means a close evidence-like record exists; `state.closedValid` means a passed canonical close evidence record exists. `state.closeState` may be `not-closed`, `closed-valid`, `close-evidence-found-invalid`, or `close-evidence-malformed`.

Phase 4 evidence semantics appear through shared evidence semantic services. Workbench consumers should not infer proof strength by parsing `evidence.jsonl` directly. Current selected-task consumers should combine `hadara.task.workbench.v1` for task state/readiness with `hadara.evidence.lint.v1` for `summary.semantics` and semantic `issues[]`. A future additive workbench field may inline the same semantic summary, issue list, and compact proof status, but it must reuse the same analyzer rather than inventing a workbench-only taxonomy.

Dashboard Phase 5 selected-task work should treat this report as a read model, not a command surface. A dashboard refresh for selected-task state may re-read the workbench and evidence semantic reports, but it must not run readiness checks, append evidence, call `task finish`, call `task close`, update handoff, or synchronize Task Board state. Any suggested remediation should be presented as copyable command guidance.

## Evidence Semantic Consumer Contract

| Consumer Need | Current Source | Future Additive Workbench Field | Notes |
|---|---|---|---|
| Semantic counts | `hadara evidence lint --task <id> --json` `summary.semantics` | `sources.evidenceSemantics.summary` | Counts include `byStrength`, `byCategory`, `byOutcome`, public/private counts, legacy record count, and latest substantive evidence id. |
| Semantic issues | Evidence lint `issues[]` and protocol doctor evidence issues | `sources.evidenceSemantics.issues` | Consumers should key on issue `code`, not human text. |
| Compact proof status | Derived by consumer from semantic summary/issues | `sources.evidenceSemantics.proofStatus` | Allowed values: `sufficient`, `weak`, `failed`, `blocked`, `private-only`, `unknown`. |
| Evidence row tone | Evidence lint/list normalized semantics | Future additive row semantics | Do not infer resolution or proof tone from human summary wording; use exact semantic markers and normalized analyzer output only. |

Proof status derivation should use this priority order:

| Priority | Status | Signal |
|---|---|---|
| 1 | `failed` | `TASK_DONE_WITH_FAILED_EVIDENCE`. |
| 2 | `blocked` | `TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE`. |
| 3 | `weak` | `TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE` or `TASK_DONE_WITH_ONLY_WEAK_EVIDENCE`. |
| 4 | `private-only` | `TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE`; treat as an auditability warning, not a Done blocker. |
| 5 | `sufficient` | At least one `substantive-positive` record and no semantic error. |
| 6 | `unknown` | No semantic summary, no records, or unavailable evidence source. |

The workbench contract remains read-only. It must not append evidence, rewrite `EVIDENCE.md`, migrate `evidence.jsonl`, expose private raw artifact paths, trigger Dashboard/TUI writes, execute release/package commands, or expand MCP write behavior.

## Boundaries

| Boundary | Requirement |
|---|---|
| Read-only | The report must not append evidence, mutate Task Capsules, update project docs, call providers, run shell commands, or invoke MCP writes. |
| No new source of truth | Consumers must treat Task Capsule files, Task Board, evidence, and protocol doctors as the authoritative sources. |
| No duplicate expensive validation | Workbench uses task close dry-run as the done-level validation source; consumers should not immediately rerun harness validation unless the operator asks. |
| Additive schema | `hadara.task.workbench.v1` is fixture-level and additive; breaking field changes require a new schema id. |

## Follow-up Surface Policy

| Surface | Current Status | Rule |
|---|---|---|
| Dashboard live selected-task panel | Deferred | Must remain read-only and use the workbench report or service. |
| TUI selected-task summary | Deferred | Must remain read-only and avoid shell/provider/MCP calls. |
| MCP `hadara.task.workbench` | Deferred | Read-only only; no evidence attach or remediation execution. |
| Evidence semantic proof status | Contracted for future additive workbench exposure | Must be produced by shared evidence semantics, remain additive, and avoid evidence writer or migration behavior. |
