# T-0700 Init v1 Safe Apply Transaction

## Identity

| Field | Value |
|---|---|
| ID | T-0700 |
| Title | Init v1 Safe Apply Transaction |
| Status | Done |
| Created | 2026-07-24T21:02 |
| Updated | 2026-07-24T21:32 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Apply a reviewed Init v1 plan exactly once through a recoverable project-local transaction. | Reuse T-0699's plan/files result so greenfield and conflict-free brownfield writes are hash-guarded, root-contained, serialized, rollback-capable, accurately reported, and free of persistent runtime debris after success. |

## Scope

| Boundary | Items |
|---|---|
| In | Greenfield and conflict-free brownfield apply; required plan hash and adoption confirmation; source-staleness checks; exact create/managed-block/append/preserve execution; project lock and recoverable journal; rollback and partial-failure reporting; stale lock/journal recovery; path, symlink, ancestor/descendant nested-root, and case-collision checks; runtime cleanup; CLI execute/plain interactive confirmation; plan/apply parity and concurrency tests. |
| Out | Re-init and upgrade behavior; Task Board parser/close migration; document resolver/commands; destructive legacy cleanup; release/package acceptance. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define apply result, lock/journal, path-safety, recovery, and CLI confirmation boundaries from the frozen spec. | Done |
| 2 | Implement the transaction over the existing deterministic plan/files result without a second artifact source. | Done |
| 3 | Validate greenfield/brownfield parity, stale/hash/symlink/nested/case failure, rollback, concurrency, cleanup, and compiled CLI behavior. | Done |
| 4 | Refresh `dist`, run full regression, update capsule/shared docs, and close proof-last. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Reviewed greenfield apply creates exactly the planned artifact set with valid config/registry, accurate counts, an empty tasks root, and no final `.hadara/local` or legacy artifacts. | Met | `ev:T-0700:9eafabc40c284ae3ae99f9c9`; `ev:T-0700:0acc6b142d594c3e927e63d7` | B-003, B-005, I-002, I-004 |
| AC-2 | Conflict-free brownfield apply preserves user content, inserts only the AGENTS managed block, appends only the missing ignore line, preserves scaffold-once files, and refuses conflicting canonical paths. | Met | `ev:T-0700:9eafabc40c284ae3ae99f9c9`; `ev:T-0700:0acc6b142d594c3e927e63d7` | B-004, C-001~C-003, J-001~J-005 |
| AC-3 | Apply requires a matching reviewed hash and brownfield confirmation, rejects changed sources before writes, and is deterministic/idempotent. | Met | `ev:T-0700:9eafabc40c284ae3ae99f9c9` | J-006, N-002, NF-001, NF-002 |
| AC-4 | Project lock serializes concurrent apply; stale lock/journal recovery, rollback, partial failure reports, and success cleanup prevent corrupted or duplicate runtime artifacts. | Met | `ev:T-0700:9eafabc40c284ae3ae99f9c9`; `ev:T-0700:0acc6b142d594c3e927e63d7` | N-001, N-003~N-005 |
| AC-5 | Root traversal, symlink ancestors, nested HADARA roots, and case-colliding paths fail closed without writes; standalone non-Git roots remain supported. | Met | `ev:T-0700:9eafabc40c284ae3ae99f9c9` | P-001~P-006 |
| AC-6 | Non-interactive/JSON execution remains two-step while an interactive TTY can accept or decline the displayed plan in the same process. | Met | `ev:T-0700:0acc6b142d594c3e927e63d7` | I-003, NF-004~NF-006 |
| AC-7 | `dist` is current and focused/full validation evidence makes the capsule close-ready. | Met | `ev:T-0700:0acc6b142d594c3e927e63d7`; `ev:T-0700:13935fef7baa4c06bcc2e72c` | User instruction |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Init v1 apply transaction focused tests | Yes | Passed | ev:T-0700:9eafabc40c284ae3ae99f9c9 |
| Built CLI greenfield/brownfield/concurrency/failure smokes | Yes | Passed | ev:T-0700:0acc6b142d594c3e927e63d7 |
| Full source and HADARA-dev Docker regression | Yes | Passed | ev:T-0700:13935fef7baa4c06bcc2e72c |
| Dist refresh/parity | Yes | Passed | ev:T-0700:0acc6b142d594c3e927e63d7 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | decision | active | Sections 19~28 define plan/apply, transaction, runtime, output, and error contracts. |
| `docs/specs/0.5/redesign/HADARA_INIT_V1_ACCEPTANCE.md` | constraint | active | B-003~005, C-001~003, I-002~004, J, N, P, and relevant NF acceptance. |
| `tasks/T-0699-init-v1-core-model-and-planner/TASK.md` | reference | active | Closed-valid prerequisite model/plan/files/report contract. |
| `docs/ARCHITECTURE.md` | reference | active | Local-first and project-store boundary. |
| `docs/SECURITY_MODEL.md` | constraint | active | Root containment, symlink, non-destructive, and local-state requirements. |
| `docs/TEST_STRATEGY.md` | constraint | active | Docker, concurrency, failure, and dist validation. |

## Changes

| Area | Summary |
|---|---|
| Apply transaction | Added reviewed-hash apply over the planner's exact artifacts, brownfield adoption confirmation, lock-scoped replan, journal-before-write mutation, atomic rename, post-apply model validation, reverse rollback, and actionable partial-failure reports. |
| Ownership | Added exact create, AGENTS managed-block insertion, `.gitignore` append, scaffold-once preserve, conflict-wide refusal, idempotent initialized no-op, and accurate result/count reporting. |
| Safety and recovery | Added root containment, symlink-segment, nested-project, and case-collision checks plus stale lock/incomplete journal recovery and runtime-state cleanup. |
| CLI | Added non-interactive two-step execute and same-process plain TTY confirmation/decline paths while retaining JSON determinism. |
| Architecture/tests/build | Documented the Init transaction/security boundary, added 9 focused transaction tests, exercised compiled greenfield/brownfield/concurrency/TTY paths, refreshed `dist`, and passed the full Docker check. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Re-init/upgrade ownership and migration remain the next capsule and must consume the same transaction primitives without turning preset into runtime authority. | Deferred | Init v1 Re-init and Upgrade Ownership |
| RF-2 | Risk | The transaction is synchronous and uses a bounded 5-second lock wait. | Mitigated | Contention is serialized, dead owners are reclaimed, and timeout fails closed without project writes. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-24 | Draft | Initial task scaffold. |
| 2026-07-24 | In Progress | Authored the reviewed safe-apply transaction contract. |
| 2026-07-24 | In Progress | Implemented and corrected safe apply, recovery ordering, compiled CLI paths, and current `dist`; all focused and full validation passed. |
| 2026-07-24 | Done | Finished the Init v1 safe apply transaction with recorded acceptance evidence. |
