# COMMAND_PORTFOLIO_AUDIT

## Purpose

This audit records why overlapping HADARA commands exist and which ones belong in the primary Task Capsule lifecycle. It documents command roles only; it does not remove commands or add runtime deprecation warnings.

## Primary Lifecycle Commands

| Stage | Command ID | Role | Write Boundary | Why Primary |
|---|---|---|---|---|
| discover | `task.next` | Find current or next work. | `read-only` | Session start needs one reliable entry point. |
| create | `task.create` | Create a Task Capsule when needed. | `task-capsule-create` | Implementation work must live in a capsule. |
| inspect | `task.status` | Read current capsule state. | `read-only` | It is the canonical task inspection surface. |
| evidence | `evidence.add-command` | Append command-log validation evidence. | `evidence-append` | Command evidence is the current primary proof path. |
| phase-check | `task.lifecycle` | Read normalized phase and next action. | `read-only` | Agents need one compact phase report before close work. |
| finalize | `task.finalize` | Review or execute the guarded close path. | `task-status-bookkeeping` | It composes finish, readiness, close, and audit while preserving their write boundaries. |
| handoff | `handoff.update` | Update next-session handoff state. | `shared-doc-write` | Work should not stop without current handoff state. |

Low-level `task.finish`, `task.ready`, `task.close`, and `task.audit-close` remain canonical proof-boundary commands for debugging, recovery, and command implementation work, but they are hidden from the 0.3.3 primary agent lifecycle.

## Diagnostic Commands

| Command ID | Looks Similar To | Diagnostic Role | Not Primary Because |
|---|---|---|---|
| `harness.validate` | `task.finalize`, `task.ready` | Direct done-level capsule validation. | It explains/isolates blockers; `task finalize` is the default close path. |
| `evidence.lint` | `task.finalize`, `task.ready` | Evidence syntax and semantic proof diagnostics. | It checks one subsystem, not full readiness. |
| `proof.status` | `task.finalize`, `task.ready`, `task.close` | Compact task proof/readiness read model. | It does not append close proof or run the close loop. |
| `proof.explain` | `proof.status` | Detailed proof blocker explanation. | It is explanatory and does not change lifecycle state. |
| `ci.gate` | `task.finalize`, `task.ready`, `release.gate` | Aggregated advisory/strict task/project gate. | It is a diagnostic gate, not a capsule close command. |
| `protocol.doctor` | `doctor`, `task.finalize`, `task.ready` | Protocol consistency diagnostics. | It reports drift and does not substitute for readiness/close. |

## Project/Release/Dev/UI/Integration Commands

| Family | Command IDs | Use Boundary | Hidden From Primary Lifecycle Because |
|---|---|---|---|
| `project-health` | `doctor`, `version`, `status`, `ops.status`, `debt.list`, `debt.show` | Project health and status reads. | They do not advance one capsule through close. |
| `release-package` | `release.dry-run`, `release.publish`, `release.artifact`, `release.gate`, `package.smoke` | Release/package operator work. | Release readiness is not ordinary task readiness. |
| `dev-validation` | `dev.docker-check`, `smoke.run`, `smoke.clean-checkout` | HADARA-dev validation. | They run broader external validation only when a task requires it. |
| `ui` | `dashboard.serve`, `tui` | Operator observation surfaces. | UI observation is not a task lifecycle mutation. |
| `integrations` | `hermes.detect`, `hermes.export-context`, `mcp.serve`, `tools.list`, `init.enable-integration` | Hermes/MCP/tool-discovery integration work. | Integrations are opt-in or discovery surfaces. |
| `agent-loop` | `run`, `run.scaffold`, `run-state.show`, `run-state.resume` | Deterministic harness and local run-state work. | Harness work is explicit task scope, not default lifecycle. |
| `install` | `install.plan` | Installer planning. | Installer plans are release/operator work. |
| `advanced` | `write.preflight`, `policy.*`, `evidence.migrate`, compatibility/remediation helpers | Low-level policy, migration, or compatibility work. | They require specific context and are hidden from default help. |

## Non-Overlap Decisions

| Decision | Commands | Rule | Evidence |
|---|---|---|---|
| Task inspection is separate from lifecycle phase and readiness. | `task.status`, `task.lifecycle`, `task.finalize`, `task.ready`, `harness.validate` | `task status` report generation success is not readiness; 0.3.3 agents use `task lifecycle` for phase and `task finalize` for guarded close execution, while low-level readiness remains in `task ready`. | 0.3.3 finalize-first lifecycle default. |
| Finalize is the default agent close path; finish is low-level bookkeeping. | `task.finalize`, `task.complete`, `task.finish` | `task finalize` is the default reviewed close path. `task complete` is a legacy read-only workflow compressor; low-level `task finish` may update only bounded task status bookkeeping. | 0.3.3 lifecycle convenience contract. |
| Close appends proof, audit verifies proof, finalize composes both. | `task.finalize`, `task.close`, `task.audit-close` | `task finalize --execute --plan-hash <hash>` preserves the underlying boundaries: low-level `task close --execute` appends close evidence only and `task audit-close` is read-only post-close verification. | 0.3.3 finalize-first lifecycle default. |
| Proof and CI gates diagnose, they do not replace close. | `proof.status`, `proof.explain`, `ci.gate`, `task.finalize`, `task.close` | Proof and CI reports explain readiness; they do not append close proof or substitute for finalize/audit. | Phase 7.2 non-overlap rules. |
| Handoff suggestion is read-only, handoff update writes shared docs. | `handoff.suggest`, `handoff.update` | `handoff suggest` is a coordinator suggestion surface; `handoff update` writes bounded handoff text. | Phase 7.2 confusable command audit. |
| Release and dev validation are not ordinary capsule lifecycle steps. | `release.gate`, `task.finalize`, `task.ready`, `dev.docker-check` | Release/dev commands are operator or HADARA-dev validation surfaces and stay hidden from primary lifecycle help. | Phase 7.2 advanced family boundary. |

## Deprecation Candidates

| Command ID | Reason | Decision | Follow-up |
|---|---|---|---|
| `task.show` | Overlaps `task.status`. | Keep executable; hide from primary lifecycle. | Future compatibility-window review. |
| `task.complete` | Read-only compressor can be confused with execution. | Keep executable; hide from primary lifecycle. | Consider `task status --view guide` only after accepted audit. |
| `evidence.collect` | Generic compatibility surface overlaps current command-log path. | Keep executable; hide from primary lifecycle. | Future `evidence add` design. |
| `policy.check-shell` | Overlaps `policy.preflight-shell`. | Keep executable; hide from primary lifecycle. | Future `policy preflight` naming. |
| `write.preflight` | Overlaps `policy.preflight-shell`. | Keep executable; hide from primary lifecycle. | Future policy/write-boundary consolidation. |
| `ops.status` | Overlaps `status`. | Keep executable; hide from primary lifecycle. | Future status family review. |
| `package.smoke` | Should eventually fit the `smoke` family shape. | Keep executable; release/package scope only. | Future release hardening. |
