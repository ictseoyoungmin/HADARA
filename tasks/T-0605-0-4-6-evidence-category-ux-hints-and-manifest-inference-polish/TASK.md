# T-0605 0.4.6 evidence category UX hints and manifest inference polish

## Identity

| Field | Value |
|---|---|
| ID | T-0605 |
| Title | 0.4.6 evidence category UX hints and manifest inference polish |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Reduce first-user evidence category friction while preserving canonical evidence schema. | Also close the small Go module `/vN` brownfield inference edge left after T-0604. |

## Scope

| Boundary | Items |
|---|---|
| In | `evidence add-command --category test/tests` CLI aliases, unsupported category diagnostics, schema vocabulary lookup, Go module `/vN` name inference. |
| Out | Persisted evidence schema expansion, raw JSON alias acceptance, full TOML parsing, release publishing. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add CLI-only category normalization and structured unsupported-category diagnostics. | Done |
| 2 | Expose evidence category/outcome tokens through `hadara schema`. | Done |
| 3 | Patch Go module semantic import version inference. | Done |
| 4 | Validate focused tests, build, and Docker build before close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `--category test` and `--category tests` append evidence with persisted `category=validation` and JSON alias metadata. | Done | `ev:T-0605:af322c3ca9b74660b779a72c`, `ev:T-0605:5f11394fd2054660bb82a227` | `src/cli/evidence.ts` |
| AC-2 | Unsupported category input fails with nonzero structured diagnostics including allowed tokens, aliases, and schema hint. | Done | `ev:T-0605:af322c3ca9b74660b779a72c`, `ev:T-0605:1b0fb3e455914aaead83d486` | `src/cli/evidence.ts` |
| AC-3 | Raw persisted `category=test` remains invalid; canonical schema vocabulary does not include the alias. | Done | `ev:T-0605:af322c3ca9b74660b779a72c` | `src/services/controlled-vocabulary.ts` |
| AC-4 | Go module paths ending in semantic import version suffix such as `/v2` infer the previous segment as project name. | Done | `ev:T-0605:af322c3ca9b74660b779a72c` | `src/init/adoption.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests | Yes | Passed | `ev:T-0605:af322c3ca9b74660b779a72c` |
| Host TypeScript build | Yes | Passed | `ev:T-0605:7f55c4f94bd14f8abc1875ce` |
| Docker workspace TypeScript build | Yes | Passed | `ev:T-0605:fd5bde394aab4b578533ef98` |
| Built CLI category alias smoke | Yes | Passed | `ev:T-0605:5f11394fd2054660bb82a227` |
| Built CLI invalid-category diagnostics smoke | Yes | Passed | `ev:T-0605:1b0fb3e455914aaead83d486` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/feedback/T-0604-evidence-category-token-friction.md` | reference | active | First-user friction from `--category test`. |
| Reviewer residual feedback | reference | active | Go module `/v2`, shallow TOML parser boundary, focused-validation scope. |

## Changes

| Area | Summary |
|---|---|
| Evidence CLI | CLI-only alias normalization and structured category diagnostics. |
| Schema vocabulary | Evidence category/outcome domains exposed for lookup. |
| Init adoption | Go module semantic import version suffix handling. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | TOML parsing remains best-effort and line-based by design. | Accepted | `docs/RELEASE_NOTES.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Implemented evidence category UX hints and Go `/vN` inference polish. |
| 2026-07-14 | Done | Focused tests, host/Docker builds, and built CLI smokes passed. |
