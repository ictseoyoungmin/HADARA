# PROJECT_STATE

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Current State

This section is projected from `.hadara/state/current.json`. Edit the structured state, then use the existing init-upgrade projection path; do not hand-edit this block.

| Field | Value |
|---|---|
| Current Release | 0.5.0-rc.1 |
| Latest Completed Task | T-0670 Release root separation contract |
| Latest Completed Task Basis | highest-done-task-id |
| Active Task | None |
| Next Work | None |
| Next Work State | none |
| Operator Guidance | No next work selected. Run `hadara task status --json` for current task-selection guidance. |
| Current Trusted Validation Baseline | T-0658 through T-0666 hardened close action boundaries and blocked status precedence, added and fixed project-level continuation handling, implemented anyOf in the schema validator, fixed stale bootstrap nextWork retirement, classified no-work handoffs as terminal, bumped/promoted the version to 0.5.0-rc.1, and validated the source with full-suite evidence. T-0667 then recycled release readiness from a freshly pulled node:22-bookworm Docker image and newly recreated hadara-dev container. T-0668 records that the operator published hadara@0.5.0-rc.1 to npm on next, workspace registry verification returned version=0.5.0-rc.1/next=0.5.0-rc.1/latest=0.4.6, the GitHub Release note artifact exists with evidence, and installed-package recycle from hadara@next passed. T-0669 records public GitHub Release v0.5.0-rc.1 publication, independent npm/GitHub public-state verification, and Docker installed-package dogfood from public hadara@next across basic, standard, and governed fresh projects plus package recycle. |

### Current Known Problems

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | watch | Prefer bounded status/session paths; revisit performance only with an explicit trust/cache design. |
| Explicit live graph and context reads remain filesystem-sensitive. | watch | Warm cache first and opt into broad live diagnostics deliberately. |
| Tool-host child process launch can return EPERM while direct commands pass. | active | Run the command directly, then record it through validation run --direct-result. |
| Release artifact git-status preflight and full dev Docker workspace copy can exceed useful latency or fail on mounted WSL workspace-local state. | watch | Use a clean ext4 clone for release artifacts; direct /workspace artifact attempts can fail if local-only untracked state such as .claude/ is present. |
| HADARA-dev package smoke installed core smoke can exceed the default 120s timeout in the large source workspace. | watch | Use `--timeout 300` for release package smoke until the installed smoke path is optimized or decoupled from the large project root. |
<!-- hadara:managed:end current-state-canon -->

## Ownership

This document is the compact human projection for product and phase context.
The six current-state facts live in `.hadara/state/current.json`; this document is not their prose source or a completed-task log.

## Product

HADARA — Local-first evidence control plane for trustworthy agentic development

## Metadata

| Field | Value |
|---|---|
| HADARA Profile | governed |
| Branch | main |

## Current Phase

v0.4.6 is published and recycled. T-0634 through T-0649 produced and published the `0.5.0-rc.0` status-ingress release candidate on npm `next`. T-0658 through T-0666 promoted the source candidate to `0.5.0-rc.1` after close-boundary hardening, continuation fixes, schema-validator `anyOf` support, and external dogfood follow-up. T-0667 recycled release readiness evidence for `0.5.0-rc.1`; T-0668 records the completed npm `next` publish, GitHub Release note artifact, and installed-package recycle from `hadara@next`. T-0669 records public GitHub Release `v0.5.0-rc.1` publication and Docker installed-package dogfood from public `hadara@next`. T-0670 begins the reviewer-requested release-readiness recycle design fixes by separating source, evidence, and disposable smoke project roots in package smoke/recycle commands.

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
| Release/task continuity, next intent, current problems, validation baseline | `.hadara/state/current.json` |
| Product and phase projection | `docs/PROJECT_STATE.md` |
| Next-agent continuity projection | `docs/AGENT_HANDOFF.md` |
| Task queue | `docs/TASK_BOARD.md` |
| Active task contract | `tasks/T-*/TASK.md` |
| Canonical task evidence | `tasks/T-*/evidence.jsonl` |
| Document classification and routing | `.hadara/docs-registry.json` |
| Primary lifecycle growth/invocation budget | `docs/PRIMARY_WORKFLOW_BUDGET.md` |
