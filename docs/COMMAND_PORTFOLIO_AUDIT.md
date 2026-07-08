# COMMAND_PORTFOLIO_AUDIT

## Purpose

This audit records why overlapping HADARA commands exist and which ones belong in the primary Task Capsule lifecycle. It documents command roles only.

## Primary Lifecycle Commands

| Stage | Command ID | Role | Write Boundary | Why Primary |
|---|---|---|---|---|
| create | `task.create` | Create a Task Capsule when needed. | `task-capsule-create` | Implementation work must live in a capsule. |
| inspect | `task.status` | Select next work or read current capsule state. | `read-only` | It is the canonical task cockpit. |
| evidence | `evidence.add-command` | Append command-log validation evidence. | `evidence-append` | Command evidence is the current primary proof path. |
| finalize | `task.finalize` | Review or execute the guarded close path. | `task-status-bookkeeping` | It composes finish, readiness, close, and audit while preserving their write boundaries. |

Low-level `task.finish`, `task.ready`, `task.close`, `task.audit-close`, `task.complete`, and `task.lifecycle` were removed from the public command surface in 0.4.1-rc.0 behind structured redirect stubs. `task.next` and `task.show` were removed the same way after T-0505 dogfood showed the extra compatibility surface was still leaking into guidance.

## Diagnostic Commands

| Command ID | Looks Similar To | Diagnostic Role | Not Primary Because |
|---|---|---|---|
| `harness.validate` | `task.finalize`, `task.ready` | Direct done-level capsule validation. | It explains/isolates blockers; `task finalize` is the default close path. |
| `evidence.lint` | `task.finalize`, `task.ready` | Evidence syntax and semantic proof diagnostics. | It checks one subsystem, not full readiness. |
| `protocol.doctor` | `doctor`, `task.finalize`, `task.ready` | Protocol consistency diagnostics. | It reports drift and does not substitute for readiness/close. |

## Project/Release/Dev/UI/Integration Commands

| Family | Command IDs | Use Boundary | Hidden From Primary Lifecycle Because |
|---|---|---|---|
| `project-health` | `doctor`, `version`, `status`, `debt.list`, `debt.show` | Project health and status reads. | They do not advance one capsule through close. |
| `release-package` | `release.dry-run`, `release.publish`, `release.artifact`, `release.gate`, `smoke.package`, `package.recycle` | Release/package operator work. | Release readiness is not ordinary task readiness. |
| `dev-validation` | `dev.docker-check`, `smoke.run`, `smoke.clean-checkout` | HADARA-dev validation. | They run broader external validation only when a task requires it. |
| `ui` | `dashboard.serve`, `tui` | Operator observation surfaces. | UI observation is not a task lifecycle mutation. |
| `integrations` | `hermes.detect`, `hermes.export-context`, `mcp.serve`, `tools.list`, `init.enable-integration` | Hermes/MCP/tool-discovery integration work. | Integrations are opt-in or discovery surfaces. |
| `agent-loop` | Removed public CLI family; internal deterministic harness helpers remain for tests. | Deterministic harness and local run-state experiments. | Ordinary task work uses `validation run`, `evidence add-command`, and `status`. |
| `install` | `install.plan` | Installer planning. | Installer plans are release/operator work. |
| `advanced` | `policy.preflight-shell`, `evidence.migrate`, compatibility/remediation helpers | Low-level policy, migration, or compatibility work. | They require specific context and are hidden from default help. |

## Non-Overlap Decisions

| Decision | Commands | Rule | Evidence |
|---|---|---|---|
| Task status is the default lifecycle cockpit. | `task.status`, `task.finalize`, `task.ready`, `harness.validate` | `task status` without `--task` owns next-work selection; `task status --task` owns phase and next-action guidance. Removed lifecycle and next-work compatibility surfaces return structured redirect stubs. | 0.4 agent UX lifecycle cockpit refactor. |
| Finalize is the default agent close path. | `task.finalize`, `task.complete`, `task.finish` | `task finalize --execute --auto` is the ordinary guarded close path. Removed low-level lifecycle command surfaces return structured redirect stubs. | FD-010 and FD-013 0.4.1-rc.0 lifecycle surface consolidation. |
| Close appends proof, audit verifies proof, finalize composes both. | `task.finalize`, `task.close`, `task.audit-close` | `task finalize` preserves the proof boundaries internally: finish bookkeeping, done readiness, close evidence append, and post-close audit. | 0.4.1-rc.0 finalize-first lifecycle default. |
| Status and finalize diagnose readiness; they do not replace close execution. | `task.status`, `task.finalize`, `task.close` | Status and finalize dry-run reports explain readiness; close proof is appended only through guarded finalize execute. | T-0522 command-surface reduction. |
| Shared handoff edits are manual reviewed docs work. | `task.status`, `task.finalize` | No current CLI command writes or generates handoff fragments; use task status/finalize diagnostics and edit shared handoff docs deliberately before close. | T-0496 removed the broken handoff update write surface; T-0506 removed the stale handoff suggestion surface. |
| Release and dev validation are not ordinary capsule lifecycle steps. | `release.gate`, `task.finalize`, `task.ready`, `dev.docker-check` | Release/dev commands are operator or HADARA-dev validation surfaces and stay hidden from primary lifecycle help. | Phase 7.2 advanced family boundary. |

## Deprecation Candidates

| Command ID | Reason | Decision | Follow-up |
|---|---|---|---|
| `task.show` | Overlaps `task.status`. | Removed redirect stub. | Replacement: `task status --task <task-id> --json`. |
| `task.next` | Overlaps `task status --json`. | Removed redirect stub. | Replacement: `task status --json`. |
| `task.complete` | Read-only compressor can be confused with execution. | Removed redirect stub. | Replacement: `task status` + `task finalize`. |
| `evidence.collect` | Generic compatibility surface overlaps current command-log path. | Removed redirect stub. | Replacement: `validation run` or `evidence add-command`. |
| `policy.check-shell` | Overlaps `policy.preflight-shell`. | Removed redirect stub. | Replacement: `policy preflight-shell`. |
| `write.preflight` | Overlaps `policy.preflight-shell`. | Removed redirect stub. | Replacement: `policy preflight-shell`. |
| `ops.status` | Overlaps `status`. | Removed redirect stub. | Replacement: `status --json` for fast project status, `status --detail full --json` for the former broad operations payload. |
| `handoff.suggest` / `handoff.stale-problems` | Stale generated fragments and niche handoff diagnostics. | Removed redirect stubs. | Replacement: `task status`, `task finalize --json`, `status --json`, and manual handoff edits. |
| `init.register-doc` | Overlaps `docs.register`. | Removed redirect stub. | Replacement: `docs register`. |
| `task.upgrade-scaffold` | Overlaps `protocol doctor/remediate`. | Removed redirect stub. | Replacement: `protocol remediate`. |
| `docs.archive` | Archive candidate inspection overlaps docs list/doctor/mark flows. | Removed redirect stub. | Replacement: `docs list --status ...` and `docs doctor`. |
| `harness.replay` | Deterministic replay was a development harness surface, not ordinary validation. | Removed redirect stub. | Replacement: `validation run` plus direct service tests where needed. |
| `run` / `run.scaffold` | Agent-loop harness duplicated validation/evidence workflows for public users. | Removed redirect stubs. | Replacement: `validation run` / `evidence add-command`. |
| `run-state.show` / `run-state.resume` | Active-run state is visible through project status and internal/MCP read models. | Removed redirect stubs. | Replacement: `status --json`. |
| `package.smoke` | Moved into the `smoke` family shape. | Removed redirect stub. | Replacement: `smoke package`. |
