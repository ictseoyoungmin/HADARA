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
| finish | `task.finish` | Preview/apply bounded status bookkeeping. | `task-status-bookkeeping` | It syncs close-source task status before readiness. |
| ready | `task.ready` | Run done-level readiness checks. | `read-only` | It is the primary readiness gate. |
| close | `task.close` | Preview/append close proof. | `close-evidence-append` | It records the readiness proof after review. |
| audit | `task.audit-close` | Verify appended close proof. | `read-only` | It proves the close record still matches the source hash. |
| handoff | `handoff.update` | Update next-session handoff state. | `shared-doc-write` | Work should not stop without current handoff state. |

## Diagnostic Commands

| Command ID | Looks Similar To | Diagnostic Role | Not Primary Because |
|---|---|---|---|
| `harness.validate` | `task.ready` | Direct done-level capsule validation. | It explains/isolates blockers; `task ready` is the primary gate. |
| `evidence.lint` | `task.ready` | Evidence syntax and semantic proof diagnostics. | It checks one subsystem, not full readiness. |
| `proof.status` | `task.ready`, `task.close` | Compact task proof/readiness read model. | It does not append close proof or run the close loop. |
| `proof.explain` | `proof.status` | Detailed proof blocker explanation. | It is explanatory and does not change lifecycle state. |
| `ci.gate` | `task.ready`, `release.gate` | Aggregated advisory/strict task/project gate. | It is a diagnostic gate, not a capsule close command. |
| `protocol.doctor` | `doctor`, `task.ready` | Protocol consistency diagnostics. | It reports drift and does not substitute for readiness/close. |

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
| Task inspection is separate from readiness. | `task.status`, `task.ready`, `harness.validate` | `task status` report generation success is not readiness; readiness lives in readiness/proof fields and `task ready`. | Phase 7.2 non-overlap rules. |
| Completion guidance is read-only, finish is bookkeeping. | `task.complete`, `task.finish` | `task complete` is a read-only workflow compressor; `task finish` may update only bounded task status bookkeeping. | Phase 7.2 confusable command audit. |
| Close appends proof, audit verifies proof. | `task.close`, `task.audit-close` | `task close --execute` appends close evidence only; `task audit-close` is read-only post-close verification. | Phase 7.2 non-overlap rules. |
| Proof and CI gates diagnose, they do not replace close. | `proof.status`, `proof.explain`, `ci.gate`, `task.close` | Proof and CI reports explain readiness; they do not append close proof or substitute for audit. | Phase 7.2 non-overlap rules. |
| Handoff suggestion is read-only, handoff update writes shared docs. | `handoff.suggest`, `handoff.update` | `handoff suggest` is a coordinator suggestion surface; `handoff update` writes bounded handoff text. | Phase 7.2 confusable command audit. |
| Release and dev validation are not ordinary capsule lifecycle steps. | `release.gate`, `task.ready`, `dev.docker-check` | Release/dev commands are operator or HADARA-dev validation surfaces and stay hidden from primary lifecycle help. | Phase 7.2 advanced family boundary. |

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
