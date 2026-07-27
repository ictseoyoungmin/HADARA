# HADARA 0.5.1 Task Close Transaction Development Plan

> Status update, 2026-07-18: this plan is no longer a separate post-0.5.0 release boundary. Its task-close transaction work is folded into the **0.5.0 stable** scope after `0.5.0-rc.0`. Keep this document as the detailed transaction design module referenced by 0.5.0 C07.

## Release objective

Build and fault-test a one-command task-close transaction for 0.5.0 stable. The engine must preserve the 0.4.x close proof model while adding fixed lock ordering, snapshot revalidation, idempotent retry, partial-execution recovery, and proof-last behavior.

## Entry and exit contracts

| Boundary | Contract |
|---|---|
| Baseline | 0.5.0 status/readiness schemas are stable. |
| Public primary close | `task close --task T-XXXX --json` is required before 0.5.0 stable promotion. |
| Candidate route | `task close --task T-XXXX --json`, initially guarded behind implementation tests until public migration passes. |
| Clean UX | One invocation; internal review/hash ceremony is not exposed in the happy path. |
| Exit | Clean, blocked, race, retry, and partial-recovery flows pass delegated dogfood. |

## Capsule budget

Release ceiling: **6 capsules**, at most **4 L**, total planned source ceiling **45 files / 5,400 net LOC**.

| Plan ID | Capsule | Size | Depends on | Deliverable |
|---|---|---:|---|---|
| 051-C01 | Close transaction schema and state machine | M | 0.5.0 C01/C04 | Stable internal operation states and report schema |
| 051-C02 | Fixed lock coordinator and source snapshot | L | C01 | Ordered multi-lock acquisition and hash revalidation |
| 051-C03 | Write-set planner and recovery journal | L | C01-C02 | Deterministic plan, guarded writes, durable partial state |
| 051-C04 | Mutation executor, idempotency, and proof-last append | L | C02-C03 | Safe retry and final proof semantics |
| 051-C05 | Experimental CLI route and status recovery projection | M | C01-C04 | One-command clean path and actionable blocked/recovery output |
| 051-C06 | Concurrency, fault-injection, and installed dogfood | L | C02-C05 | Race/failure matrix and promotion evidence |

Split triggers:

- Split C02 if Task Board and project lifecycle locks require independent reusable services.
- Split C03 if recovery persistence needs a migration/versioning subsystem.
- Split C06 by deterministic fault tests versus installed dogfood if execution time exceeds the full validation budget.

## Safety domains

| Domain | Mechanism | Protects | Must not substitute for |
|---|---|---|---|
| State concurrency | State file `rev` plus compare-and-swap | Lost updates to `.hadara/state/*.json` | Close-source integrity |
| Close integrity | Content-hash snapshot of required close sources | The world that justified closing | Generic state write concurrency |
| Evidence serialization | Task evidence append lock | Append races and duplicate durable records | Project/Task Board mutation ordering |

Required lock order for every close route:

```text
project lifecycle → Task Board → task-scoped → evidence append
```

An implementation may refine lock names, but no route may acquire the same locks in a different order.

## Schema plan

### Operation state

Proposed machine-owned schema: `hadara.task_close.operation.v1`.

```ts
type CloseOperationPhase =
  | 'preflight'
  | 'planned'
  | 'applying'
  | 'verifying'
  | 'proof-pending'
  | 'closed-valid'
  | 'blocked'
  | 'recovery-required';

interface CloseOperationV1 {
  operationId: string;
  taskId: string;
  idempotencyKey: string;
  phase: CloseOperationPhase;
  closeSourceHash: string;
  planHash: string;
  intendedFinalState: string;
  completedSteps: string[];
  pendingSteps: string[];
  expectedWrites: GuardedWriteV1[];
  createdAt: string;
  updatedAt: string;
}
```

Idempotency key:

```text
hash(taskId + closeSourceHash + intendedFinalState)
```

Candidate public report: `hadara.task.close.v2`. It uses the 0.5.0 envelope and includes `writeSummary`, `recovery`, and close state. A blocked preflight returns `health: blocked`, zero lifecycle writes, and one primary recovery action. `ok` follows the command-specific contract; it must not be used as the only close verdict.

## Transaction algorithm

```text
acquire locks in fixed order
→ evaluate readiness
→ collect explicit close-source snapshot
→ compute guarded write set and internal plan hash
→ persist operation/recovery intent when partial execution is possible
→ re-read and revalidate every close source
→ apply lifecycle-owned writes with before-hash checks
→ verify final source state
→ append close proof last
→ mark operation closed-valid or remove completed recovery state
→ release locks in reverse order
```

Required close sources are task-local contract/evidence, selected Task Board identity/status/path, task-specific required projections, and sources explicitly named by the capsule. Project handoff, roadmap, slices, release state, and broader known problems remain advisory unless the task contract makes them required.

## Implementation details by capsule

### 051-C01 — state machine

- Separate readiness, operation phase, and derived close state.
- Define legal transitions and terminal/no-op retry behavior.
- Version operation and report schemas before persistence begins.

### 051-C02 — locking and snapshot

- Reuse or consolidate existing task-allocation and evidence locks where contracts match.
- Add timeout/contended diagnostics without leaking machine-local paths in public JSON.
- Hash file existence, normalized relative path, and content; do not substitute state `rev` for content hashes.
- Abort before mutation if the snapshot changes.

### 051-C03 — plan and recovery

- Compute all expected writes before the first lifecycle mutation.
- Store completed/pending steps only in a machine-owned local/project-safe location defined by the security model.
- Guard each write with expected existence and before hash.
- Make stale or malformed recovery state fail closed while retaining valid canonical task facts.

### 051-C04 — execution and proof

- Apply lifecycle-owned status, Task Board, and managed current-state writes serially.
- Reverify final source state after mutation.
- Append close proof only after all writes and verification pass.
- Return the existing closed-valid proof for an identical retry; never append duplicate proof.

### 051-C05 — experimental route

- The command name is the clean-path write boundary.
- Keep explicit dry-run/plan-hash modes for review, CI preview, and debugging.
- Project/task status surfaces recovery-required without instructing manual lifecycle-field edits.
- Preserve `finalize` as a compatibility route only after the public migration lands; do not teach it as a co-primary command.

### 051-C06 — fault matrix

Test failure immediately before and after each planned write, close-source mutation during the race window, lock timeout, process interruption, duplicate retry, stale recovery record, evidence append failure, and final verification mismatch.

## Validation and acceptance

| Gate | Required proof |
|---|---|
| Clean close | One candidate command reaches closed-valid with no caller-supplied plan hash. |
| Blocked close | Zero lifecycle-owned writes and one concrete recovery action. |
| Race | Any close-source change before mutation aborts; any guarded-write mismatch stops safely. |
| Proof-last | Fault injection demonstrates no valid close proof exists when an earlier write or verification fails. |
| Idempotency | Identical retry is a no-op/existing-result response with no duplicate proof. |
| Recovery | Every injected partial step can be resumed by the same close command or yields an explicit machine-owned recovery action. |
| Locality | Canonical evidence remains in the task capsule; central records are rebuildable indexes/operation state only. |
| Compatibility | Existing `task finalize` behavior and close audit remain valid. |

## Promotion and rollback

0.5.0 stable does not promote the route merely because the clean path passes. Promotion requires clean, blocked, concurrency, and partial-recovery dogfood from an installed package. If recovery cannot be made deterministic, keep the engine internal and do not ship 0.5.0 stable with split primary close guidance.
