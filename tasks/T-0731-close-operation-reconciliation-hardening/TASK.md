# T-0731 Close Operation Reconciliation Hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0731 |
| Title | Close Operation Reconciliation Hardening |
| Status | Done |
| Created | 2026-07-28T21:52 |
| Updated | 2026-07-28T22:55 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Harden task-close operation recovery against reviewer P1/P2 gaps. | Implement actual task-local write reconciliation and stricter marker validation/continuation, expose actionable recovery details, and register the active rc2 task-close spec. |

## Scope

| Boundary | Items |
|---|---|
| In | `task close` operation marker reconciliation, recovery continuation safety, runtime marker shape validation, proof-pending resume semantics where feasible, v3 recovery report/schema detail, and docs registry registration for the active rc2 spec. |
| Out | Removing the legacy bookkeeping implementation/domain wholesale, broad close-source basis refactoring beyond fields needed for recovery safety, release promotion, and installed-package dogfood. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define reviewer feedback as acceptance and read close transaction sources. | Done |
| 2 | Implement actual expected-write reconciliation and stricter marker validation/continuation. | Done |
| 3 | Update recovery report/schema and active spec registry coverage. | Done |
| 4 | Add focused regression tests for partial, conflict, schema-invalid, and proof-pending recovery. | Done |
| 5 | Validate, record evidence, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `reconcileCloseOperationMarker()` reads each persisted task-local expected write and classifies it as `before`, `after`, `conflict`, or `missing-conflict`; all-before starts cleanly, prefix partial resumes at the remaining write, all-after skips to verification/proof, and non-prefix requires recovery. | Met | ev:T-0731:f2fa72bcf96f4507b2678f26 | Reviewer P1-1 |
| AC-2 | Recovery-required continuation cannot reuse an operation across close-source drift or unverifiable write state, and operation identity/hash fields stay internally consistent on continuation. | Met | ev:T-0731:f2fa72bcf96f4507b2678f26 | Reviewer P1-2 |
| AC-3 | Runtime marker validation rejects malformed attempts, negative mutation counts, malformed journal entries, invalid completed/pending steps, invalid attempt phases/numbers, invalid `finalSourceHash`, and unknown operation properties. | Met | ev:T-0731:f2fa72bcf96f4507b2678f26 | Reviewer P1-3 |
| AC-4 | Retrying a `proof-pending` marker resumes at proof append/final proof verification instead of rewriting the marker back through applying or replaying completed task-local writes. | Met | ev:T-0731:f2fa72bcf96f4507b2678f26 | Reviewer P1-4 |
| AC-5 | Recovery reports expose operation id, phase, resumability, completed/pending/conflicting writes, and primary action in both TypeScript output and the v3 schema. | Met | ev:T-0731:f2fa72bcf96f4507b2678f26 | Reviewer P2 |
| AC-6 | The active rc2 Task Close Transaction Specification is registered so registry/read-map based agents can discover it as an active normative source. | Met | ev:T-0731:f2fa72bcf96f4507b2678f26 | Reviewer P2 |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused task-close/schema/docs tests | Yes | Passed | `npx vitest run tests/unit/task-close.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts tests/unit/docs-registry.test.ts` passed: 4 files, 88 tests. | ev:T-0731:f2fa72bcf96f4507b2678f26 |
| TypeScript source no-emit | Yes | Passed | `./node_modules/.bin/tsc -p tsconfig.json --noEmit` passed. | ev:T-0731:49b30291be29432fa7c76edf |
| Tools typecheck | Yes | Passed | `npm run typecheck:tools` passed. | ev:T-0731:76426b74e7b2449fbed24010 |
| Public unit suite | Yes | Passed | `npm test` passed: 136 files passed, 1 skipped; 1082 tests passed, 8 skipped. | ev:T-0731:8b72de4f958f42f496ffbdf3 |
| Source build | No | Failed | `npm run build` could not write `dist/` outputs in this workspace due EACCES before TypeScript diagnostics; resolved as environment output-permission issue by no-emit/type/test evidence. | ev:T-0731:5a70cd0a5c4a42439bb96b79; ev:T-0731:76426b74e7b2449fbed24010 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User reviewer notes | constraint | active | P1/P2 gaps define this capsule's acceptance. |
| `docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md` | constraint | active | Defines expected reconciliation, marker, proof-last, and recovery contract. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Defines task close command behavior and lifecycle document timing. |
| `docs/ARCHITECTURE.md` | reference | active | Defines task close projection and project store boundary. |
| `docs/SECURITY_MODEL.md` | constraint | active | Defines guarded writes and path/store invariants. |
| `docs/SCHEMAS.md` | reference | active | Defines schema fixture/runtime posture. |
| `docs/DOC_REGISTRY.md` | implementation-source | active | Current human registry projection missing the rc2 spec row. |

## Changes

| Area | Summary |
|---|---|
| task close | Added file-hash reconciliation for persisted task-local expected writes, stricter source-drift continuation checks, proof-pending phase preservation, and recovery detail reporting. |
| schemas/docs | Extended `hadara.task.close.v3` recovery schema and registered the active rc2 task-close specification in the docs registry and Markdown projection. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full legacy `bookkeeping` domain removal remains out of this capsule unless needed by P1 fixes. | Open | Reviewer P2 |
| RF-2 | Follow-up | Full close-basis/final-source hash separation remains deferred; this capsule preserved existing hash fields while preventing unsafe marker continuation. | Open | Reviewer P2 |

## Close Summary

Implemented reviewer P1 hardening for close operation recovery: persisted task-local writes are reconciled against actual file hashes, non-prefix/conflict/source-drift marker continuations fail closed, proof-pending retries preserve the proof phase, marker shape validation is stricter, recovery reports are more actionable, and the active rc2 task-close spec is discoverable through the docs registry.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Accepted reviewer P1/P2 close-operation hardening feedback as task acceptance. |
| 2026-07-28 | Done | Implemented and validated close operation reconciliation hardening. |
