# T-0595 0.4.5 adoption doctor and idempotency cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0595 |
| Title | 0.4.5 adoption doctor and idempotency cleanup |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make adopted brownfield projects doctor-clean. | `init doctor` must respect v3 registry origin metadata so project-authored files are not judged as scaffold templates. |

## Scope

| Boundary | Items |
|---|---|
| In | Origin-aware `init doctor` table-frame/profile checks, adopted-project regression tests, build/Docker build, and `/tmp` adopted project doctor smoke. |
| Out | Full external dogfood, release readiness, docs registry policy redesign, and command portfolio cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce adopted brownfield doctor warnings after T-0594 writer. | Done |
| 2 | Make init doctor use v3 registry project/profile/origin metadata before scaffold-shape checks. | Done |
| 3 | Validate focused tests, build/Docker build, and adopted-project doctor smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `init doctor` does not require scaffold table frames for registry entries owned by the project or marked `origin.type=project-authored`. | Done | `ev:T-0595:46a89fc5fa184cfca3d9f2f8` | `src/init/doctor.ts`; `tests/unit/init.test.ts` |
| AC-2 | Adopted v3 registries use `project.hadaraProfile` for profile inference instead of treating project-authored docs as generated scaffold evidence. | Done | `ev:T-0595:46a89fc5fa184cfca3d9f2f8` | `src/init/doctor.ts` |
| AC-3 | A `/tmp` brownfield project adopted through the dist CLI passes both `init doctor` and `docs doctor --scope all` with zero issues. | Done | `ev:T-0595:51be57dcef9347bc8826d9f1` | dist CLI smoke |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Init doctor adoption tests | Yes | Passed | `ev:T-0595:46a89fc5fa184cfca3d9f2f8` |
| Build and Docker build | Yes | Passed | `ev:T-0595:7f73392d738548a5a2222c19` |
| Adopted project doctor smoke | Yes | Passed | `ev:T-0595:51be57dcef9347bc8826d9f1` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/brownfield-init-adoption.md` | reference | active | Requires doctor cleanup after brownfield adoption. |
| T-0594 writer output | implementation-source | active | T-0595 validates the exact v3 registry/project-authored output shape from the writer. |
| `/tmp` adopted project reproduction | constraint | active | Initial reproduction showed `init doctor` table-frame/profile warnings after successful adoption. |

## Changes

| Area | Summary |
|---|---|
| Init doctor | Added registry-aware project-authored document skipping for scaffold table-frame checks. |
| Profile inference | Prefer v3 `registry.project.hadaraProfile`, v2 `projectProfile`, and scaffold profile before guessing from document presence. |
| Tests/smoke | Added adopted-project doctor-clean regression through unit tests and dist CLI smoke. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full external brownfield dogfood remains before 0.4.5 release readiness. | Open | T-0596 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | Done | Made adopted brownfield projects init-doctor and docs-doctor clean. |
