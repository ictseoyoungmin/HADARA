# T-0671 Release Artifact Evidence Journal

## Identity

| Field | Value |
|---|---|
| ID | T-0671 |
| Title | Release Artifact Evidence Journal |
| Status | Done |
| Created | 2026-07-21T22:12 |
| Updated | 2026-07-21T22:22 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0671 --json`.

## Goal

| Goal | Notes |
|---|---|
| Prevent release artifact evidence from dirtying the clean source tree it just validated. | `release artifact` must support clean sourceRoot + separate evidenceRoot + journal-first attach so release artifact preflight does not invalidate itself. |

## Scope

| Boundary | Items |
|---|---|
| In | `release artifact` source/evidence root roles, self-invalidation risk report, fail-closed same-root attach guard, journal write/read attach path, schema/registry/docs/tests. |
| Out | Artifact signing, GitHub Release upload, npm publish mutation, package smoke timeout policy, broader release runbook. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the journal-first release artifact evidence contract. | Done |
| 2 | Implement sourceRoot/evidenceRoot handling and same-root clean preflight fail-closed behavior. | Done |
| 3 | Implement journal JSON write/read and attach-from-journal path. | Done |
| 4 | Update schemas, registry/docs, and tests. | Done |
| 5 | Validate with focused tests, build, Docker build/dist refresh, built CLI smoke, and docs doctor. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Clean sourceRoot release artifact generation can attach evidence without dirtying sourceRoot when evidenceRoot is separate. | Done | ev:T-0671:ab1f6210270546fc889c2e74 | `tests/unit/release-artifact.test.ts` |
| AC-2 | `sourceRoot == evidenceRoot` with `--attach-evidence` and clean preflight conflict fail-closes unless explicitly overridden. | Done | ev:T-0671:ab1f6210270546fc889c2e74 | `RELEASE_ARTIFACT_SELF_INVALIDATION_RISK` |
| AC-3 | A release artifact journal JSON can later be attached as evidence without rebuilding artifacts. | Done | ev:T-0671:ab1f6210270546fc889c2e74 | `--journal`, `--from-journal` |
| AC-4 | Dirty preflight failure evidence can be handled through journal/evidenceRoot instead of repeating sourceRoot evidence writes. | Done | ev:T-0671:ab1f6210270546fc889c2e74 | `src/cli/release-artifact.ts`, `src/services/release-artifact-evidence.ts` |
| AC-5 | Public schemas/docs/registry expose root roles, self-invalidation risk, and journal-first release artifact guidance. | Done | ev:T-0671:ab1f6210270546fc889c2e74 | `docs/CLI_JSON_CONTRACT.md`, `docs/RELEASE_READINESS.md`, `src/schemas/release-artifact.schema.json` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run test:focused -- tests/unit/release-artifact.test.ts tests/unit/schema-runtime.test.ts tests/unit/tools-list.test.ts` | Yes | Passed | ev:T-0671:ab1f6210270546fc889c2e74 |
| `npm run build` | Yes | Passed | ev:T-0671:324879edc6c74a3eb8312b51 |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0671:991aa7227760421d9c700e43 |
| Built CLI release artifact journal/self-invalidation smoke | Yes | Passed | ev:T-0671:758e82217e4d4ac99cdad97d |
| `hadara docs doctor --scope all --json` | Yes | Passed | ev:T-0671:787c10c8f97d4fa4af9e8865 |
| `hadara task close --task T-0671 --json` | Yes | Not Applicable | Proof-last close evidence is appended by the close transaction after validation. |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer release recycle plan | reference | active | Defines T-0671 journal-first release artifact evidence requirements. |
| T-0670 root separation contract | background | active | Source/evidence root separation is the prerequisite for release artifact journal handling. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | JSON report fields and command shape must match implementation. |

## Changes

| Area | Summary |
|---|---|
| Release artifact service | Added rootRoles, source git metadata, selfInvalidationRisk, and fail-closed same-root clean preflight attach guard. |
| Release artifact CLI | Added `--source-root`, `--evidence-root`, `--journal`, `--from-journal`, and `--allow-source-evidence-write`. |
| Evidence attachment | Supports journal read/write and uses evidenceRoot for attach while preserving source git commit metadata from the journal report. |
| Contract/docs | Updated schema, command registry, CLI JSON contract, release readiness guidance, and tools-list fixture. |
| Tests | Added same-root fail-closed and separate evidenceRoot/journal attach regression coverage. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Package smoke timeout/isolation policy remains separate. | Open | T-0672 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Implemented journal-first release artifact evidence contract and began validation. |
| 2026-07-21 | Done | Release artifact evidence journal contract is implemented, validated, and ready for proof-last close. |
