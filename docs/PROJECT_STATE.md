# PROJECT_STATE

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.checkpoint-projection","kind":"single-block","mode":"replace","version":1,"required":false,"closeSourceRole":"included"} -->
## Compatibility State Checkpoint

This command-owned projection keeps older 0.5.x readers compatible. It is not Required Reading or the human source of project intent; Task Board, Task Capsules, and project-authored Markdown take precedence.

| Field | Value |
|---|---|
| Current Release | 0.5.0-rc.1 |
| Latest Completed Task | T-0685 Stable Readiness Review |
| Latest Completed Task Basis | highest-done-task-id |
| Active Task | None |
| Next Work | None |
| Next Work State | none |
| Operator Guidance | No next work selected. Run `hadara task status --json` for current task-selection guidance. |
| Current Trusted Validation Baseline | 0.5.0-rc.2 planning baseline preserves rollup evidence through T-0678: source validation and rc1 release-readiness recycle, npm publish record, GitHub Release publication, installed-package recycle/dogfood, reviewer remediation, structured continuation semantic fail-closed validation, and project status continuation-ready routing. This baseline carries T-0667 through T-0669 forward for session resume until a first-class validationBaseline.rollup schema is introduced. |

### Current Known Problems

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | watch | Prefer bounded status/session paths; revisit performance only with an explicit trust/cache design. |
| Explicit live graph and context reads remain filesystem-sensitive. | watch | Warm cache first and opt into broad live diagnostics deliberately. |
| Tool-host child process launch can return EPERM while direct commands pass. | active | Run the command directly, then record it through validation run --direct-result. |
| Release artifact git-status preflight and full dev Docker workspace copy can exceed useful latency or fail on mounted WSL workspace-local state. | watch | Use a clean ext4 clone for release artifacts; direct /workspace artifact attempts can fail if local-only untracked state such as .claude/ is present. |
| Historical HADARA-dev package smoke timeout incidents are mitigated by isolated smokeProjectRoot and per-step timeout reporting. | watch | Package smoke/recycle now default to 300s per step for npm/recycle paths and report timeoutStepIds; use explicit `--timeout` only for a reviewed release exception. |
<!-- hadara:managed:end current-state-canon -->

## Ownership

This document is the human source for product and phase context. Task identity and lifecycle state come from the Task Board and Task Capsules; completed history belongs in the Historical Index.

## Product

HADARA — Local-first evidence control plane for trustworthy agentic development

## Metadata

| Field | Value |
|---|---|
| HADARA Profile | governed |
| Branch | main |

## Current Phase

v0.4.6 is published and recycled. The `0.5.0-rc.0` and `0.5.0-rc.1` line proved the status/continuation design but also exposed pre-stable product complexity. T-0679 completed the single adaptive `task status` lifecycle and terminal close contract; T-0680 completed Markdown-first task selection and demoted `current.json` to a compatibility checkpoint; T-0681 made the three fresh profile scaffolds materially distinct, portable, and doctor-clean. T-0682 completed current-build autonomous dogfood across basic, standard, and governed: nine capsules closed and six fresh-session continuations succeeded without coordinator implementation. T-0683 resolved every actionable dogfood finding, including stale Basic profile diagnostics, continuation-title coupling, terminal-close ambiguity, evidence guidance, docs-register metadata loss, close-owned blocker display, HANDOFF table validation, and help exit status. T-0684 removes redundant lifecycle prose from new TASK scaffolds and makes `T-XXXX Task Title` the explicit capsule commit convention. T-0685 fixes the reviewer-identified stale handoff precedence gap so open work wins before project handoff/continuation suggestions, and confirms strict release gate compatibility with the current release artifact evidence flow. Dashboard remains deliberately outside this core-stability line.

| Stage | State | Purpose |
|---|---|---|
| P0 Currentness integrity | Done | Align next-work selection, active docs, and validation fixtures. |
| P1 Current-state ownership | Done | Separate compact current facts from historical narrative. |
| P2 Product compression | Done | Freeze capability growth and measure the primary workflow. |
| P3 Profile toy validation | Done | Dogfood all profiles and archive stale documents/specs; external/delegated validation was completed for v0.4.4. |

## Current Capabilities

| Area | Current State |
|---|---|
| Task lifecycle | Status-first Task Capsules with validation evidence and guarded task close to `closed-valid`. |
| Evidence | Canonical append-only `evidence.jsonl`, generated `EVIDENCE.md`, v2 durable ids, resolution and close proof. |
| Context | Status-first session ingress, task-scoped context pack/slice, graph/code index, bounded cache-backed reads. |
| Documents | Registry/read maps, required-reading tiers, docs doctor, managed sections, safe dry-run-first patches. |
| Operations UI | Read-only Dashboard and TUI over shared read models. |
| Integrations | Read-only MCP by default; narrow approval-recorded evidence attach; Hermes context export. |
| Release | Package/clean-checkout smoke, artifact, gate, dry-run, and approval-gated publish planning. |
| Deferred | Full agent controller, real provider default execution, broad MCP writes/shell, cloud workers, private evidence encryption. |

## Historical Index

| History Type | Path | Use |
|---|---|---|
| Pre-P1 project state snapshot | `docs/history/PROJECT_STATE_PRE_T0558.md` | Full pre-compaction project narrative through T-0557. |
| Pre-P1 handoff snapshot | `docs/history/AGENT_HANDOFF_PRE_T0558.md` | Full pre-compaction handoff, known-problem, and validation tables. |
| Documentation archive map | `docs/archive/README.md` | Completed specs, historical logs, and old-to-new path mapping. |
| Completed task handoff history | `docs/HANDOFF_HISTORY.md` | Older completed-task summaries. |
| Validation history | `docs/VALIDATION_HISTORY.md` | Older accumulated validation observations. |
| Task queue | `docs/TASK_BOARD.md` | Status and capsule path for every task. |
| Development sequence | `docs/DEVELOPMENT_SLICES.md` | Slice ordering and done evidence. |
| Per-task proof | `tasks/T-*/evidence.jsonl` | Canonical task evidence. |

## Single Source of Truth

| Concern | Source |
|---|---|
| Product phase, project intent, current problems | `docs/PROJECT_STATE.md` |
| Active and completed task lifecycle | `docs/TASK_BOARD.md` and `tasks/T-*/TASK.md` |
| Compatibility checkpoint for older 0.5.x readers | `.hadara/state/current.json` |
| Product and phase projection | `docs/PROJECT_STATE.md` |
| Next-agent continuity projection | `docs/AGENT_HANDOFF.md` |
| Task queue | `docs/TASK_BOARD.md` |
| Active task contract | `tasks/T-*/TASK.md` |
| Canonical task evidence | `tasks/T-*/evidence.jsonl` |
| Document classification and routing | `.hadara/docs-registry.json` |
| Primary lifecycle growth/invocation budget | `docs/PRIMARY_WORKFLOW_BUDGET.md` |
