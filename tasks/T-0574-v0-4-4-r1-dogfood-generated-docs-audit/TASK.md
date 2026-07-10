# T-0574 v0.4.4 R1 dogfood generated docs audit

## Identity

| Field | Value |
|---|---|
| ID | T-0574 |
| Title | v0.4.4 R1 dogfood generated docs audit |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Audit the R1 delegated dogfood generated docs and task capsules for stale placeholders, contradictory guidance, and validation blind spots. | This is read-only against the external dogfood project; fixes belong in follow-up implementation capsules. |

## Scope

| Boundary | Items |
|---|---|
| In | Read `/mnt/f/NowWorking/dev/hadara-r1-basic-dogfood/docs` and task capsule Markdown, compare manual findings with HADARA read models, and record actionable issues. |
| Out | Editing the external dogfood project, fixing HADARA code, or running R2/R3 external validation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Read global dogfood docs and scaffold anchors. | Done |
| 2 | Read all five dogfood Task Capsule docs and evidence projections. | Done |
| 3 | Compare manual findings with `docs doctor`, `session start`, `task status`, and `harness validate`. | Done |
| 4 | Record findings and validation evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | All dogfood `docs/*.md` and task capsule Markdown files are reviewed or explicitly scoped. | Done | `ev:T-0574:aed9f877ead44908920ec703` | `R1_GENERATED_DOCS_AUDIT.md` |
| AC-2 | Findings distinguish user-facing document issues from validation/read-model blind spots. | Done | `ev:T-0574:aed9f877ead44908920ec703` | `R1_GENERATED_DOCS_AUDIT.md` |
| AC-3 | Follow-up candidates are prioritized for v0.4.4 cleanup. | Done | `ev:T-0574:aed9f877ead44908920ec703` | `R1_GENERATED_DOCS_AUDIT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Manual doc audit plus HADARA read-model comparison | Yes | Passed | `ev:T-0574:aed9f877ead44908920ec703` |
| HADARA capsule validation | Yes | Passed | `ev:T-0574:e2ea51cdaca54cb09e1d99f4` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/mnt/f/NowWorking/dev/hadara-r1-basic-dogfood/docs` | reference | active | R1 basic-profile generated docs from installed `hadara@0.4.3`. |
| `/mnt/f/NowWorking/dev/hadara-r1-basic-dogfood/tasks/T-*` | reference | active | Five delegated dogfood capsules, all closed-valid by HADARA read models. |
| `tasks/T-0573-v0-4-4-r1-delegated-agent-basic-profile-dogfood-pilot/R1_DELEGATED_DOGFOOD_REPORT.md` | reference | active | Prior delegated-agent report and first-contact findings. |

## Changes

| Area | Summary |
|---|---|
| Audit report | Added a focused report of generated-doc and task-capsule quality gaps from the R1 dogfood project. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fix or triage stale global product metadata/current-state nextWork and validation blind spots before R2. | Open | `R1_GENERATED_DOCS_AUDIT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Audited R1 dogfood docs/tasks and compared manual findings with HADARA read models. |
| 2026-07-10 | Done | Recorded generated-doc audit findings and follow-up priorities. |
