# PROJECT_STATE

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.checkpoint-projection","kind":"single-block","mode":"replace","version":1,"required":false,"closeSourceRole":"included"} -->
## Compatibility State Checkpoint

This command-owned projection keeps older 0.5.x readers compatible. It is not Required Reading or the human source of project intent; Task Board, Task Capsules, and project-authored Markdown take precedence.

| Field | Value |
|---|---|
| Current Release | 0.5.0-rc.1 |
| Latest Completed Task | T-0727 Complete Close Transaction Fault Matrix |
| Latest Completed Task Basis | highest-done-task-id |
| Active Task | None |
| Next Work | None |
| Next Work State | none |
| Operator Guidance | No next work selected. Run `hadara task status --json` for current task-selection guidance. |
| Current Trusted Validation Baseline | T-0702 trust-boundary baseline: clean npm ci (0 vulnerabilities), source build, tools type-check, 140 public files/1094 tests, 16 HADARA-dev files/129 tests, built CLI 0.5.0-rc.1, verified 261-file release artifact, dependency metadata, and diff hygiene passed. |

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

v0.4.6 is published and recycled. The `0.5.0-rc.0` and `0.5.0-rc.1` line proved the status/continuation design but also exposed pre-stable product complexity. T-0679 completed the single adaptive `task status` lifecycle and terminal close contract; T-0680 completed Markdown-first task selection and demoted `current.json` to a compatibility checkpoint; T-0681 made the three fresh profile scaffolds materially distinct, portable, and doctor-clean. T-0682 completed current-build autonomous dogfood across basic, standard, and governed: nine capsules closed and six fresh-session continuations succeeded without coordinator implementation. T-0683 resolved every actionable dogfood finding, including stale Basic profile diagnostics, continuation-title coupling, terminal-close ambiguity, evidence guidance, docs-register metadata loss, close-owned blocker display, HANDOFF table validation, and help exit status. T-0684 removes redundant lifecycle prose from new TASK scaffolds and makes `T-XXXX Task Title` the explicit capsule commit convention. T-0685 fixes the reviewer-identified stale handoff precedence gap so open work wins before project handoff/continuation suggestions, and confirms strict release gate compatibility with the current release artifact evidence flow. T-0686 restored `5b62e35` and documented a staged RC2 reduction boundary: preserve the compact Capsule, evidence/close integrity, task-create safety, non-overwrite init, release safeguards, and package trust signals before any removal resumes. T-0687 corrected continuation/docs drift and narrowed the active RC2 path to HADARA-dev-only developer surfaces. T-0688 completes the first extraction step: public CLI routing/help/tools projection no longer exposes developer-only `debt`, `dev`, `release`, `smoke`, or `package recycle` roots, while repo-local `tools/dev-surfaces.ts` and release helper scripts preserve those workflows for HADARA-dev maintenance. T-0689 splits the test surface the same way: default/public `npm test` now excludes HADARA-dev-only release/debt/dev/package-smoke coverage, while explicit `test:hadara-dev` and `test:all` paths keep full repo maintenance coverage available. T-0690 narrows the read-only integration surface further by removing `hadara.debt.list/show` from the default MCP bridge while leaving repo-local debt/release workflows intact. T-0691 removes the browser dashboard surface entirely and leaves the read-only terminal TUI as the remaining shipped UI boundary. T-0692 fixes the stale post-close continuation path that kept a closed capsule selected as the next action. T-0693 removes the remaining developer-only release/smoke/package/dev wrapper entrypoints from the shipped `src/cli`/`src/dev` tree by relocating them into repo-local `tools/`. T-0694 completes the deeper cleanup: the remaining debt/release/smoke implementations and debt handler now live under `tools/dev-surface/`, the shipped `src` copies are gone, and shipped TUI/status debt and release-gate projections are placeholder-only. T-0695 finishes the live metadata follow-through: repo-local release/developer command entries now expose their `tools/` implementation/test ownership, release/smoke schemas point at the moved `tools/dev-surface/*` files, current docs no longer mention the removed `src/services` paths, and release-readiness context extraction once again resolves repo-local command references. T-0696 closes the remaining RC2 reviewer trust gaps on current HEAD: repo-local `tools/` code is explicitly type-checked, shipped status/TUI placeholder debt and release-gate surfaces now report `repo-local-only` or `deferred` state instead of healthy zero values, current public docs and package metadata stop advertising removed developer-only/public surfaces, and current-head validation now passes through `npm run check`. T-0697 restores the release build freshness boundary by making `check` emit current `dist`, forcing the manual RC helper to rebuild and version-check `dist` before artifacts, regenerating the lockfile without removed Dashboard direct dependencies, and removing `context pack` from the public surface. T-0698 starts the human-prioritized Init v1 redesign: the frozen acceptance contract and design source are now the program authority, the legacy profile/scaffold behavior is characterized, and all acceptance areas are assigned across eight total capsules ending in installed-package dogfood. T-0699 completes the canonical Init v1 preset/artifact/config/registry/TargetRef model and deterministic zero-write planner with strict option/preset errors. T-0700 completes reviewed safe apply for greenfield and conflict-free brownfield projects with exact ownership actions, stale/hash guards, lock/journal recovery, rollback, root/symlink/nested/case safety, runtime cleanup, and interactive confirmation; re-init and upgrade ownership are the next program boundary. Fresh-session RC2 dogfood and release promotion remain deferred until this explicit Init v1 program completes. DAG/status redesign is still intentionally out of scope.

T-0701 hardens failed-apply rollback against concurrent external edits. T-0702 restores the release/evidence/Docker/task-state trust baseline: release artifact execution owns source build and built-version verification; acceptance evidence is outcome-consistent; tracked `.hadara` reaches Docker validation without machine-local state; HANDOFF sync is idempotent; rollback and TUI debt branches are covered; dependency metadata is clean. Docker passed 140 public files/1094 tests and 16 HADARA-dev files/129 tests with zero npm vulnerabilities, and the executed `0.5.0-rc.1` artifact verified 261 packaged files. Re-init and Upgrade Ownership remains the next Init v1 boundary.

T-0703 completes Re-init and Upgrade Ownership. Base init is now checksum-preserving on complete v1 projects, rejects explicit configuration expansion, and leaves partial repair to `init upgrade`. Upgrade reuses reviewed plan/hash/lock/journal apply, changes only managed core artifacts, preserves canonical configuration, existing registry bytes, Task Board content, and optional user documents, and fails closed on invalid authority or malformed AGENTS markers. Clean Docker passed 141 public files/1098 tests plus 16 HADARA-dev files/129 tests, and built CLI end-to-end init/re-init/upgrade/no-op smoke passed. The next ordered Init v1 boundary is Task Board and Close Projection; RC2 release promotion remains deferred.

T-0704 completes Init v1 Task Board and Close Projection. Fresh v1 task creation now uses the frozen `ID | Title | Status | Targets | Capsule | Result` Board contract, persists project-default or explicit ordered TargetRefs in the Task Capsule, and projects only the exact optional `Close Summary` into Result after valid lifecycle bookkeeping. The shared Board model keeps legacy Notes and extra cells intact, and the close-source/read-model consumers no longer assume fixed legacy columns. Corrected serial Docker validation passed all 142 public files/1102 tests and 16 HADARA-dev files/129 tests; refreshed built CLI create and read-only close smokes passed. The next ordered Init v1 boundary is Document Routing; legacy isolation, installed acceptance, and RC2 promotion remain deferred.

T-0705 makes ordinary lifecycle output materially smaller. Default task status now returns a bounded summary with the selected capsule, phase/readiness, one focused read/edit route, compact issues, and the next action; default task close returns only its transaction summary and suppresses phase progress. Complete v2 diagnostics remain available through `--detail full --json`. Full validation passed 142 public files/1102 tests and 16 HADARA-dev files/129 tests in the home-directory ext4 clone. The next user-prioritized boundary separates Validation state tokens from explanatory detail, followed by shared-state projection automation, official serial/low-resource Docker validation, failure classification, and live-document archival.

T-0706 connects Init v1 to the existing mutation lifecycle. The shared mutation guard now accepts schema-valid `.hadara/project.json` plus `.hadara/documents.json`, rejects partial or invalid authority before writes, and retains `hadaraProtocol: 0.4` only as a legacy compatibility fallback. Built CLI standard init followed by task creation passed without generating `.hadara/scaffold.json`; full validation passed 142 public files/1104 tests and 16 HADARA-dev files/129 tests. Validation state/detail separation remains next.

T-0707 separates Validation state from explanation. `validation run` now exposes canonical `status: Passed|Failed|Blocked` plus bounded `detail`; deprecated `result` remains for compatibility. New Task Capsules use `Status | Detail`, while legacy Result tables remain valid. Full validation passed 142 public files/1104 tests and 16 HADARA-dev files/129 tests. Registered existing shared-document projection is next; fresh Init must not gain optional global prose files.

T-0709 removes redundant default targeting from Task Capsule identity. New default tasks omit `Targets | project` from TASK.md, explicit non-project targets remain visible, and Task Board continues to persist all targets. Full validation passed 142 public files/1104 tests and 16 HADARA-dev files/129 tests. Resume the already-created T-0708 registered shared close projection next.

T-0708 makes shared close projection registry-aware and bounded. Existing registered Project State and Agent Handoff managed checkpoints are projected automatically, absent optional documents are neither requested nor created, and Development Slices participates only when it already links the task. Full validation passed 142 public files/1106 tests and 16 HADARA-dev files/129 tests. HADARA-dev-only low-resource Docker validation under `tools/` is next.

T-0710 adds official HADARA-dev-only `--serial` and `--low-resource` Docker validation modes under `tools/` and `scripts/`, with no shipped `src/` implementation change. Low-resource mode implies one Vitest worker, disabled file parallelism, a 1024 MiB Node heap cap, and one npm job. Full validation passed 142 public files/1107 tests and 16 HADARA-dev files/131 tests; a real home-mounted Docker smoke passed. Automatic failure classification is next.

T-0711 adds controlled automatic failure classification. `validation run` and repo-local Docker reports now expose `assertion`, `timeout`, or `environment-setup` from execution signals while preserving low-level `failureKind` or Docker step detail and keeping raw child output private. Full validation passed 142 public files/1108 tests and 16 HADARA-dev files/132 tests; a built CLI smoke proved all three classes. Live-doc selection and archival is next.

T-0723 enforces the rc2 physical proof-last ordering for required-bookkeeping task closes. The close plan no longer appends proof against a virtual post-bookkeeping snapshot before lifecycle writes; it writes bookkeeping first, refreshes actual close state, then appends proof only if the real final source still passes. Focused close tests, TypeScript build, and full check passed. Remaining rc2 transaction hardening should target marker persistence counts, broader fault injection, and installed-package dogfood.

T-0724 exposes close marker persistence counts and rc2 write-summary aliases in the public v3 task-close transaction report. Clean close reports zero progress persistence writes and marker content writes within the rc2 budget, while preserving compatibility fields. Focused close tests, schema/workflow docs tests, TypeScript build, and full check passed. Remaining rc2 transaction work should focus on proof-pending/partial recovery fault injection, blocked-preflight marker tightening, and installed-package dogfood.

T-0725 adds internal task-close fault hooks and recovery tests for interruption after close proof append and before terminal cleanup. Retrying both scenarios returns `closed-valid`, cleans the local operation marker, and does not duplicate close proof. T-0726 completed installed-package close transaction dogfood for governed init, task create, blocked close, clean close, and identical retry after fixing done-level harness validation to parse Init v1 Task Board rows through the shared parser. T-0727 completes remaining rc2 fault-matrix hardening: `Residual` risk-state token acceptance, broader internal fault hooks, guarded write fsync boundaries, lock/write/proof-pending tests, and stale fixed-capsule guidance cleanup. Focused tests, TypeScript build, and full check passed.

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
| Context | Status-first session ingress, explicit context slice, graph/code index diagnostics, bounded cache-backed reads. |
| Documents | Registry/read maps, required-reading tiers, docs doctor, managed sections, safe dry-run-first patches. |
| Operations UI | Read-only TUI over shared status/task/evidence read models. |
| Integrations | Read-only MCP by default; narrow approval-recorded evidence attach; Hermes context export. |
| Release | Package/clean-checkout smoke, artifact, gate, dry-run, and approval-gated publish planning. |
| Deferred | Full agent controller, real provider default execution, broad MCP writes/shell, cloud workers, private evidence encryption. |

## Historical Index

| History Type | Path | Use |
|---|---|---|
| Pre-P1 project state snapshot | `docs/archive/retired-2026-07-26/history/PROJECT_STATE_PRE_T0558.md` | Full pre-compaction project narrative through T-0557. |
| Pre-P1 handoff snapshot | `docs/archive/retired-2026-07-26/history/AGENT_HANDOFF_PRE_T0558.md` | Full pre-compaction handoff, known-problem, and validation tables. |
| Documentation archive map | `docs/archive/README.md` | Completed specs, historical logs, and old-to-new path mapping. |
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
| Primary lifecycle growth/invocation budget | `docs/archive/retired-2026-07-26/PRIMARY_WORKFLOW_BUDGET.md` |
