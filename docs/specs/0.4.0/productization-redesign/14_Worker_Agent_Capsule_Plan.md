# 14 Worker Agent Capsule Plan

## Goal

Define an implementation sequence for the 0.4 breaking productization redesign.

This plan intentionally does not include legacy migration or dual-layout support.

## Budget

The post-acceptance 0.4 implementation budget is 24 capsules:

```text
T-04A1 through T-04A24
```

T-0424 / T-04A0, T-0425 / T-04A0b, and T-0426 / T-04A0c are design-finalization capsules that precede this budget.

Release readiness, publish, package recycle, and stable release work are not included in this 24-capsule implementation budget. They require a later release-line budget after the 0.4 implementation and final review are accepted.

## Capsule Sequence

| Task | Title | Purpose |
|---|---|---|
| T-0424 / T-04A0 | 0.4 Spec Finalization and Canonicalization | Finalize productized 0.4 specs, remove nested spec-package layout, and keep registration deferred until implementation starts. |
| T-0425 / T-04A0b | 0.4 Workflow Template Clarification | Keep compact Required Reading in `AGENTS.md`, expand `HADARA_WORKFLOW.md` with project start/lifecycle/document timing, and remove standalone workflow release-boundary wording before registration. |
| T-0426 / T-04A0c | 0.4 Template Final Review Hold Open | Keep final template review open until operator acceptance; clarify context/Required Reading roles, simplify TASK defaults, and add workflow failure-mode guardrails. |
| T-04A1 | 0.4 Breaking Productization Spec Registration | Register this redesign line, docs registry metadata, and read-map policy. |
| T-04A2 | 0.4 Init Scaffold Model | Generate basic/standard/governed 0.4 scaffold metadata, registries, and default docs without legacy SOP/task-workflow files. |
| T-04A3 | Agent Entry and Workflow Templates | Generate `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, and `docs/HADARA_WORKFLOW.md` with non-overlapping responsibilities. |
| T-04A4 | Docs Registry Storage and Register Surface | Implement `.hadara/docs-registry.json`, `docs register`, compatibility boundaries for `init register-doc`, and optional registry projection rules. |
| T-04A5 | Docs Read Map and Drift Diagnostics | Add read-map report, document metadata axes, read tiers, and drift diagnostics over registered docs. |
| T-04A6 | Task Capsule Create Path | Make `task create "title"` generate the 0.4 Task Capsule files. |
| T-04A7 | TASK.md Table Schema and Controlled Values | Validate TaskStatus, acceptance, validation, plan, source documents, and change summary. |
| T-04A8 | Source Document Hash and Drift Link | Record source document hashes in `TASK.md` and report changed or missing source documents. |
| T-04A9 | Managed Slot v2 Registry Hash | Add slot registry schema, table schema metadata, and close proof slot registry hash. |
| T-04A10 | Evidence Projection | Keep `EVIDENCE.md` as generated projection over canonical `evidence.jsonl` without rewriting evidence outcomes. |
| T-04A11 | Close Proof Placement | Keep close proof out of `TASK.md` and `HANDOFF.md`, and project close proof through evidence surfaces. |
| T-04A12 | Close Source Contract | Implement `hadara.closeSource.v1`, evidence readiness snapshot, and task-board consistency boundary. |
| T-04A13 | Legacy Project Boundary | Detect old protocol scaffolds and block 0.4 mutation commands. |
| T-04A14 | Session Start Read-Map Integration | Make session start consume docs read-map and source document drift. |
| T-04A15 | Context Pack Read-Map Integration | Make context pack consume read-map policy and avoid unrelated implemented/superseded specs. |
| T-04A16 | Authoring Guidance Read Models | Make `task status`, lifecycle, and finalize guidance tell agents what to write next without silently mutating agent-owned prose. |
| T-04A17 | Init Doctor and Profile Diagnostics | Harden scaffold/profile diagnostics, duplicate-doc detection, and product-default checks. |
| T-04A18 | Command Registry, Help, and Schema Alignment | Align command registry, structured help, JSON schemas, and proposed/current CLI labels. |
| T-04A19 | Product Default Cleanup | Remove HADARA-dev-specific defaults from generated docs and add static tests against Node/npm/Docker/release leakage. |
| T-04A20 | Basic Profile Dogfood | Validate a fresh basic 0.4 project from init through a finalized task. |
| T-04A21 | Governed Profile Dogfood | Validate governed profile behavior, docs registry routing, handoff, and task lifecycle. |
| T-04A22 | Self-Review Hardening Batch | Use dogfood and focused review findings to fix bounded correctness, safety, or UX issues. |
| T-04A23 | Polish and Cleanup Batch | Apply small polish, cleanup, docs consistency, and residual-risk fixes found during self-review. |
| T-04A24 | Final Review and Documentation Cleanup | Review the whole 0.4 implementation line, reconcile docs/specs/read maps, and prepare the separate release-line decision input. |

## Implementation Rules

```text
One capsule per bounded behavior.
No release readiness, publish, package recycle, or stable release work inside this implementation budget.
No migration work in 0.4.0.
No task-layout option.
No close proof in close-source docs.
No task-local HANDOFF raw hash in default close-source.
No direct evidence.jsonl editing.
No broad docs/specs default reading.
No HADARA-dev-specific scaffold defaults.
No lifecycle/finalize before the Task Capsule entry gate is satisfied.
No fabricated or assumed evidence.
Hardening, polish, and cleanup are allowed when they come from dogfood or self-review findings and remain bounded to one capsule.
```

## Done Criteria Per Implementation Capsule

Each implementation capsule should include:

```text
source documents with hashes
TASK.md controlled values valid
final-state line ranges in Change Summary
focused validation evidence
registry updates if command/docs/schema surfaces change
handoff update
finalize/audit close proof
```

T-0424 / T-04A0, T-0425 / T-04A0b, and T-0426 / T-04A0c are design-only and intentionally do not register Required Reading or mutate CLI behavior. T-0426 remains open until the operator accepts the spec set. Registration starts at T-04A1 only after that acceptance.

T-04A24 is the final implementation-budget capsule. It does not publish or prepare release artifacts; it reconciles implementation docs, final dogfood findings, registry/read-map state, and release-line decision input.

## Deferred Release Line

Release work is intentionally outside this 24-capsule implementation budget.

Future release capsules may include:

```text
0.4.0-rc.0 readiness
0.4.0-rc.0 approval-gated publish
0.4.0-rc.0 installed-package recycle
0.4.0 stable decision
0.4.0 stable readiness
0.4.0 stable approval-gated publish
0.4.0 stable installed-package recycle
```

Do not open those capsules until T-04A24 is accepted and the operator explicitly starts release-line work.

## Review Risks

| Risk | Mitigation |
|---|---|
| Agents still read all docs/specs | Read-map test fixtures and context pack exclusions. |
| AGENTS drifts into command cookbook | Static doc tests for forbidden command recipe patterns. |
| Status reappears in HANDOFF | Harness validation blocker. |
| Close proof written into TASK.md | Harness validation blocker. |
| Task-local HANDOFF edits stale closed tasks | Default close-source excludes raw HANDOFF and uses at most a normalized snapshot. |
| HADARA-dev practices leak into product scaffold | Product-default tests reject generated Node/npm/Docker/repository-specific workflow text. |
| CLI silently writes task-specific prose | Authoring guidance stays read-only unless a future reviewed write command is explicitly designed. |
| 0.4 mutates 0.3 project | Legacy boundary mutation tests. |
| Proposed CLI confused with existing CLI | Current/proposed CLI audit doc and command registry tests. |
| Agent over-reads raw docs | Read Authority Rules and context-pack next-action tests. |
| Agent enters lifecycle with an incomplete task contract | Lifecycle Entry Gate validation and workflow docs tests. |
| Handoff next step points at same-capsule chores | Handoff template/spec guidance and dogfood review. |
| Hardening or polish becomes unbounded scope creep | T-04A22 and T-04A23 accept only bounded self-review or dogfood findings with explicit evidence. |
| Release work leaks into implementation capsules | T-04A24 prepares decision input only; release readiness/publish/recycle require later explicit release capsules. |
