# 14 Worker Agent Capsule Plan

## Goal

Define an implementation sequence for the 0.4 breaking productization redesign.

This plan intentionally does not include legacy migration or dual-layout support.

## Capsule Sequence

| Task | Title | Purpose |
|---|---|---|
| T-0424 / T-04A0 | 0.4 Spec Finalization and Canonicalization | Finalize productized 0.4 specs, remove nested spec-package layout, and keep registration deferred until implementation starts. |
| T-0425 / T-04A0b | 0.4 Workflow Template Clarification | Keep compact Required Reading in `AGENTS.md`, expand `HADARA_WORKFLOW.md` with project start/lifecycle/document timing, and remove standalone workflow release-boundary wording before registration. |
| T-0426 / T-04A0c | 0.4 Template Final Review Hold Open | Keep final template review open until operator acceptance; clarify context/Required Reading roles, simplify TASK defaults, and add workflow failure-mode guardrails. |
| T-04A1 | 0.4 Breaking Productization Spec Registration | Register this redesign line, docs registry metadata, and read-map policy. |
| T-04A2 | 0.4 Init Scaffold Model | Generate basic/standard/governed 0.4 scaffold with merged docs and registries. |
| T-04A3 | AGENTS / HADARA_WORKFLOW Split | Remove command cookbook from AGENTS and centralize workflow guidance. |
| T-04A4 | Design Source Registry and Read Map | Add document metadata axes, read-map report, drift diagnostics. |
| T-04A5 | Task Capsule Schema Create Path | Make `task create "title"` generate the 0.4 Task Capsule files. |
| T-04A6 | TASK.md Table Schema and Controlled Values | Validate TaskStatus, acceptance, validation, plan, source documents, and change summary. |
| T-04A7 | Managed Slot v2 Registry Hash | Add slot registry schema, table schema metadata, and close proof slot registry hash. |
| T-04A8 | Evidence Projection and Close Proof Placement | Keep close proof out of TASK/HANDOFF and project it through EVIDENCE.md. |
| T-04A9 | Close Source Contract | Implement `hadara.closeSource.v1`, evidence readiness snapshot, and task-board consistency boundary. |
| T-04A10 | Legacy Project Boundary | Detect old protocol scaffolds and block 0.4 mutation commands. |
| T-04A11 | Context Routing Integration | Make session start/context pack consume read-map and source document drift. |
| T-04A12 | Product Dogfood Capsule | Validate new project from init through finalized task. |
| T-04A13 | 0.4.0-rc.0 Readiness | Refresh release docs/evidence without publish mutation. |
| T-04A14 | 0.4.0-rc.0 Approval-Gated Publish | Publish rc with explicit approval. |
| T-04A15 | 0.4.0-rc.0 Installed Recycle | Verify installed package from consumer path. |
| T-04A16 | Stable 0.4.0 Decision and Readiness | Decide stable, refresh readiness. |
| T-04A17 | Stable 0.4.0 Publish and Recycle | Approval-gated stable publish and installed recycle. |

## Implementation Rules

```text
One capsule per bounded behavior.
No publish mutation in readiness capsules.
No migration work in 0.4.0.
No task-layout option.
No close proof in close-source docs.
No task-local HANDOFF raw hash in default close-source.
No direct evidence.jsonl editing.
No broad docs/specs default reading.
No HADARA-dev-specific scaffold defaults.
No lifecycle/finalize before the Task Capsule entry gate is satisfied.
No fabricated or assumed evidence.
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
