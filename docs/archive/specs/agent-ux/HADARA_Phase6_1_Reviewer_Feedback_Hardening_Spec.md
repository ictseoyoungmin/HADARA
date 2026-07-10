# HADARA Phase 6.1 Reviewer Feedback Hardening Spec

> Phase: **Phase 6.1 - Reviewer Feedback Hardening**
> Baseline: Phase 6 planned range T-0253 through T-0260 is complete.
> Purpose: Convert reviewer feedback from Phase 6 into bounded hardening capsules without expanding HADARA into a full multi-agent runtime.

## Goal

Harden Phase 6 workflow-compression surfaces where reviewer feedback identified multi-agent compatibility gaps, while preserving dry-run-first governance, explicit write boundaries, and no hidden orchestration.

## Immediate Fix Already Accepted

T-0261 should clarify `hadara dev docker-check --sync-dist --json` mutation metadata:

- `execution.projectMutation` remains a compatibility alias for no project source mutation.
- `execution.projectSourceMutation` explicitly reports source-file mutation as false.
- `execution.outputMutation` reports true when workspace `dist` is copied.
- `distSync.beforeHashAvailable`, `distSync.outputChanged`, and `distSync.requiresBeforeHash` make current sync safety explicit.
- Missing pre-sync `dist` hash is surfaced through `distSync.conflictDetected:true`.

This does not make `--sync-dist` fully lock-safe. Phase 6.1 must decide whether to require a reviewed before-hash before output sync.

## Deferred Capsules

### T-0262 Actor Context CLI Option Plumbing

Add optional actor/run CLI metadata for Phase 6 reports.

Scope:

- Parse `--agent-id`, `--run-id`, `--actor-role`, and `--parent-run-id`.
- Thread actor context through task finish/ready/close/audit-close/complete, handoff suggest, and dev docker-check.
- Preserve current defaults when options are absent.
- Report defaulted actor fields as warnings only where the report already has issue capacity.

Out of scope:

- No scheduler.
- No task assignment service.
- No automatic coordinator/worker routing.

Acceptance:

- Reports preserve existing schemas additively.
- Focused task lifecycle, handoff, dev docker-check, and schema tests pass.

### T-0263 Dev Docker Sync Dist Before-Hash Guard

Make workspace `dist` sync reviewed-plan aware.

Scope:

- Add dry-run or reviewed metadata for `--sync-dist` output writes.
- Require a matching before-hash for workspace `dist` sync, or introduce an explicit `--allow-missing-before-hash` escape hatch for first-time sync.
- Detect when workspace `dist` changed between review and sync.
- Keep raw Docker/npm logs and private paths out of JSON.

Out of scope:

- No source-file writes beyond `dist`.
- No package publish or release artifact mutation.

Acceptance:

- Concurrent or stale output baseline attempts fail closed before copying `dist`.
- Existing non-sync Docker validation remains unchanged.

### T-0264 Close Evidence Append Race Recheck

Strengthen close evidence idempotency for parallel agents.

Scope:

- Re-read task evidence immediately before close evidence append.
- No-op if the same idempotency key was appended after the plan was created.
- Consider a task-local advisory lock or atomic append guard if needed.
- Preserve existing supersedes behavior for changed close proofs.

Out of scope:

- No global lock service.
- No background scheduler.
- No broad evidence migration.

Acceptance:

- Two same-hash close execute attempts cannot append duplicate close evidence in normal local execution.
- Audit-close still reports latest/superseded/duplicate metadata.

### T-0265 Task Create Collision Guard

Make task id allocation safer for parallel `task create` users.

Scope:

- Detect mkdir/task-board collision after candidate task id selection.
- Re-scan and retry bounded times when the task directory already exists.
- Fail with a clear issue code when retries are exhausted.
- Preserve template behavior and Draft-only boundaries.

Out of scope:

- No task assignment service.
- No durable global id allocator.
- No random id format migration unless a later v2 task id decision is made.

Acceptance:

- Simulated create collision produces a retry or explicit failure instead of silent duplicate id behavior.
- Task Board row remains single-source and done-level validation catches drift.

### T-0266 Handoff Suggestion Fragment Polish

Make handoff suggestion fragments more directly usable by a coordinator.

Scope:

- Replace generic fragment language with exact current target hash, section title, and suggested replacement text.
- Keep `handoff suggest` read-only.
- Preserve before-hash metadata and `--execute` refusal.

Out of scope:

- No automatic handoff writes.
- No shared-doc mutation from worker reports.

Acceptance:

- Suggestion text is precise enough for manual patch review.
- Existing coordinator/shared-doc boundary remains explicit.

## Non-Goals

- No full multi-agent runtime.
- No hidden shared-doc writes.
- No `task complete --execute`.
- No release publish automation.
- No MCP write expansion.
- No provider or shell execution expansion.

## Validation Strategy

Each Phase 6.1 capsule should include:

- Focused tests for the touched workflow surface.
- Schema/runtime compatibility tests when report fields change.
- Docker validation using `hadara dev docker-check` or the reusable Docker sync-build.
- Built CLI smoke for public CLI behavior.
- Task evidence and close/audit workflow before commit.
