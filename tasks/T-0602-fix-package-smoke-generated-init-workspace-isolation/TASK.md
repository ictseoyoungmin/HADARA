# T-0602 Fix package smoke generated-init workspace isolation

## Identity

| Field | Value |
|---|---|
| ID | T-0602 |
| Title | Fix package smoke generated-init workspace isolation |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix package smoke so the generated init docs check runs in a clean project workspace. | Packaging artifacts in the smoke workspace must not force `hadara init` into brownfield zero-write mode. |

## Scope

| Boundary | Items |
|---|---|
| In | `generated-init-docs` package-smoke workspace isolation, focused package-smoke regression coverage, release docs/readiness updates. |
| Out | npm publish, GitHub Release publication, and installed-package recycle after publication. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce the publish-helper package smoke failure and isolate the cause. | Done |
| 2 | Run installed `hadara init` docs check in an empty `init-docs-project` subworkspace. | Done |
| 3 | Validate package smoke and strict release gate with updated evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `generated-init-docs` no longer runs in the packaging workspace root that contains tarballs/prefix artifacts. | Done | `tests/unit/package-smoke-dry-run.test.ts` | `src/services/package-smoke.ts` |
| AC-2 | `smoke package --execute --timeout 300 --attach-evidence` passes and reports `generated-init-docs` as passed. | Done | `ev:T-0602:2d9fd4b10da44a9294931163`; `ev:T-0602:4d6cb16158b8456187b1856b` | `EVIDENCE.md` |
| AC-3 | The previous failed package-smoke attempt is explicitly resolved. | Done | `ev:T-0602:cd431aa3b28541b5a93706c7` | `EVIDENCE.md` |
| AC-4 | Strict release gate passes against the latest T-0602 package-smoke evidence. | Done | `ev:T-0602:1915a8a924d34fb99f14290c` | `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Package smoke regression tests | Yes | Passed | ev:T-0602:07de22930b074abcaaa6ae6c |
| TypeScript build | Yes | Passed | ev:T-0602:3cb6ad5f2ee14d86bacdd9f5 |
| Docker build | Yes | Passed | ev:T-0602:8d13919a682141f6b4c335ea |
| Package smoke | Yes | Passed | ev:T-0602:4d6cb16158b8456187b1856b |
| Release gate | Yes | Passed | ev:T-0602:1915a8a924d34fb99f14290c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User-provided package smoke failure log | constraint | active | `generated-init-docs` failed because generated `docs/HADARA_WORKFLOW.md` was missing after installed init. |
| `tasks/T-0601-fix-0-4-5-clean-clone-test-regressions/HANDOFF.md` | constraint | active | T-0601 made packaging artifacts/root entries correctly trigger brownfield adoption; package smoke needed an isolated greenfield init docs fixture. |

## Changes

| Area | Summary |
|---|---|
| `src/services/package-smoke.ts` | Run installed init docs validation in `init-docs-project` instead of the package-smoke workspace root. |
| `tests/unit/package-smoke-dry-run.test.ts` | Assert the init docs check uses an isolated subworkspace. |
| Release docs | Record T-0602 as the final package-smoke/readiness fix before operator publish. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Operator publish and post-publish installed-package recycle remain separate. | Open | `scripts/release/manual-publish-rc.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Isolated package-smoke generated-init docs workspace and reran package smoke. |
| 2026-07-14 | Done | Package smoke and strict release gate passed with T-0602 evidence. |
