# T-0604 0.4.6 brownfield trust polish residuals

## Identity

| Field | Value |
|---|---|
| ID | T-0604 |
| Title | 0.4.6 brownfield trust polish residuals |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the first 0.4.6 brownfield trust residuals found during 0.4.5 review. | Keep this capsule focused on small contract hardening, not a broad onboarding rewrite. |

## Scope

| Boundary | Items |
|---|---|
| In | `.gitignore` duplicate managed-block fail-closed checks, package-smoke empty-stdout fallback observability, project version inference wording or narrow inference hardening if local patterns support it. |
| Out | Full first-user onboarding rewrite, external validation campaign, provider/runtime work, or public contract freeze. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Inspect adoption/package-smoke/version inference code and tests. | Done |
| 2 | Implement duplicate `.gitignore` local-state managed block fail-closed behavior. | Done |
| 3 | Add package-smoke fallback telemetry for empty captured stdout paths. | Done |
| 4 | Align project version inference scope or release wording. | Done |
| 5 | Validate focused tests, build, Docker build, and built CLI smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Brownfield `.gitignore` with mismatched or duplicate `local-state` markers fails closed before adoption writes. | Done | `ev:T-0604:583168193c644e67a58be80c` | `src/init/adoption.ts` |
| AC-2 | Package smoke reports when an installed command passed through empty-stdout fallback instead of silently treating fallback as full evidence. | Done | `ev:T-0604:583168193c644e67a58be80c` | `src/services/package-smoke.ts` |
| AC-3 | Project version inference claims are not broader than implementation; any added inference has focused coverage. | Done | `ev:T-0604:583168193c644e67a58be80c` | `src/init/adoption.ts` |
| AC-4 | Focused tests and build pass from current source. | Done | `ev:T-0604:583168193c644e67a58be80c`; `ev:T-0604:ae3fe7b9f57d4a8b89828e92`; `ev:T-0604:c2ff2dd7b37d4729a64e4f8b` | `tests/unit/*` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused init adoption tests | Yes | Passed | ev:T-0604:583168193c644e67a58be80c |
| Focused package smoke tests | Yes | Passed | ev:T-0604:583168193c644e67a58be80c |
| TypeScript build | Yes | Passed | ev:T-0604:ae3fe7b9f57d4a8b89828e92 |
| Docker build | Yes | Passed | ev:T-0604:c2ff2dd7b37d4729a64e4f8b |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer residual feedback after 0.4.5 | constraint | active | Identified duplicate `.gitignore` marker gap, package-smoke empty-stdout evidence weakness, and package.json-centered version inference. |
| `tasks/T-0603-0-4-5-operator-publish-and-installed-package-recycle/DOGFOOD_REPORT.md` | reference | active | 0.4.5 stable is published and recycled; this begins the next improvement line. |

## Changes

| Area | Summary |
|---|---|
| `src/init/adoption.ts` | Added duplicate local-state `.gitignore` marker fail-closed detection and pyproject/Cargo/go.mod project identity/version inference. |
| `src/services/package-smoke.ts` | Added empty-stdout fallback warnings plus step-level `fallbackUsed` and `fallbackReason` metadata. |
| Tests/docs | Added focused regression coverage and recorded 0.4.6 residual-hardening notes. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Larger first-user onboarding and public contract freeze remain separate 0.4.x/0.5 work. | Open | `docs/PROJECT_STATE.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Started 0.4.6 residual hardening from reviewer feedback. |
| 2026-07-14 | Done | Implemented residual fixes and passed focused tests plus host/Docker builds. |
