# T-0598 0.4.5 brownfield adoption safety gap closure

## Identity

| Field | Value |
|---|---|
| ID | T-0598 |
| Title | 0.4.5 brownfield adoption safety gap closure |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close brownfield adoption safety blockers before 0.4.5 publication. | Fix explicit consent, partial-state fail-closed behavior, detector blind spots, symlink write boundaries, managed marker ownership, project-owned core docs, fresh createdWith, and task-id collision checks. |

## Scope

| Boundary | Items |
|---|---|
| In | `hadara init` brownfield detector/planner/writer safety, registry ownership for patched docs, fresh scaffold currentness, focused tests, and `/tmp` CLI safety fixtures. |
| Out | Installed-candidate multi-shape dogfood, release readiness recycle, npm/GitHub publication, post-publish recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Translate reviewer release blockers into concrete adoption invariants. | Done |
| 2 | Implement fail-closed safety and ownership fixes. | Done |
| 3 | Validate focused tests, build, Docker build, and direct CLI fixtures. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Brownfield execute requires explicit `--adopt` in addition to matching `--plan-hash`. | Done | `tests/unit/init.test.ts` | `src/init/adoption.ts` |
| AC-2 | Partial HADARA state, wrong path types, parent/target symlinks, malformed markers, foreign owners, and non-HADARA `tasks/T-*` collisions fail closed. | Done | `tests/unit/init.test.ts` | `src/init/adoption.ts` |
| AC-3 | Single-file and other meaningful-root projects are detected as brownfield and remain zero-write by default. | Done | `tests/unit/init.test.ts` | `src/init/adoption.ts` |
| AC-4 | Existing core docs patched by managed sections stay project-owned/project-authored in registry v3, and existing Task Board docs do not receive a second H1. | Done | `tests/unit/init.test.ts` | `src/init/adoption.ts` |
| AC-5 | Fresh scaffold `createdWith` reflects the current package version instead of hardcoded `hadara@0.4.0`. | Done | `tests/unit/init.test.ts` | `src/init/templates.ts` |
| AC-6 | Validation evidence is recorded. | Done | `EVIDENCE.md` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Init safety regression tests | Yes | Passed | ev:T-0598:fb26285cf9694d9db8108e45 |
| TypeScript build | Yes | Passed | ev:T-0598:7b83914e23c4437fbd528bf1 |
| Docker build | Yes | Passed | ev:T-0598:d5619e3b362d48fd9e96c6bc |
| Direct CLI safety fixtures | Yes | Passed | ev:T-0598:0f0db9fa78814ee3b6443004 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/home/ymin/.codex/attachments/d0fa37d9-a034-4125-aaf3-561f76c1ad7a/pasted-text-1.txt` | constraint | active | Reviewer release-blocker list for 0.4.5 brownfield adoption. |
| `docs/specs/0.4.5/brownfield-init-adoption.md` | reference | active | Brownfield safety contract. |
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | reference | active | Registry v3 ownership contract. |

## Changes

| Area | Summary |
|---|---|
| `src/init/adoption.ts` | Added explicit `--adopt` execute confirmation, partial-state blockers, meaningful root-entry detection, write-parent symlink/type checks, managed marker/owner collision checks, task collision checks, and action-aware registry ownership. |
| `src/init/templates.ts` | Replaced hardcoded fresh scaffold `createdWith` value with the current package version. |
| `src/init/project.ts`, `src/init/types.ts`, `src/schemas/init-adoption.schema.json` | Propagated adoption confirmation and root-entry signal schema. |
| `tests/unit/init.test.ts` | Added release-blocker regression coverage. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Run installed-candidate multi-shape brownfield dogfood before restoring 0.4.5 release readiness. | Open | `tasks/T-0599-*` |
| RF-2 | Follow-up | Recycle 0.4.5 release readiness evidence after this runtime change. | Open | `tasks/T-0600-*` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Implemented brownfield adoption safety blocker fixes and focused regressions. |
| 2026-07-13 | Done | Closed brownfield adoption safety blockers and queued installed-candidate dogfood before release readiness recycle. |
