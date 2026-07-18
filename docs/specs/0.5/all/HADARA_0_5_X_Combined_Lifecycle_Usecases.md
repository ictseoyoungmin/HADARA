# HADARA 0.5.x Combined Lifecycle and Use Cases

**Document status:** Draft / local planning only  
**Target:** HADARA 0.5.0 through 0.5.x  
**Baseline:** HADARA 0.4.6 stable  
**Companion:** `HADARA_0_5_X_Combined_Agent_Loop_Plan.md`  
**Registry status:** Registered as reference-only. This remains a proposed planning input, not a committed product spec.

---

## 1. Purpose

This document describes the lifecycle behavior of the combined 0.5.x agent loop.

The core loop is:

```text
hadara status --json
  -> route global project/session state to one next surface

hadara task status --json
  -> select or create a bounded Task Capsule

hadara task status --task T-XXXX --json
  -> decide one Task Capsule lifecycle phase, readiness, and local next action

hadara task close --task T-XXXX --json
  -> close a clean Task Capsule in one guarded write command
```

The document intentionally avoids introducing `hadara brief` as a new public command. The product idea previously called "brief" is expressed as lifecycle-aware `hadara status --json`.

`hadara session start` is treated as an agent-runtime remnant and should be removed from public routing and generated guidance. Session/context facts that still matter move into `status`.

---

## 2. Actors

| Actor | Description | Needs |
|---|---|---|
| Human operator | Supervises project state, release, and consequential writes | compact state, trust boundary, reviewable evidence |
| Agent worker | Performs one bounded task | exact next action, required reading, close path |
| Agent coordinator | Chooses or delegates the next task | task selection, active/latest state, no duplicated work |
| Release operator | Handles version, publish, recycle, release notes | release gate, package verification, post-publish evidence |
| Dashboard/TUI | Displays state without writing | stable read model, provenance, freshness |
| External automation | Consumes JSON in scripts/CI | stable fields, exit codes, skipped-check semantics |

---

## 3. Command Responsibilities

| Command | Responsibility | Write boundary | Primary user |
|---|---|---|---|
| `hadara status --json` | project/session ingress, active/next task identification, global routing | `read-only` | human, agent, dashboard |
| `hadara task status --json` | task selection and create/resume guidance | `read-only` | agent coordinator |
| `hadara task status --task T --json` | selected task lifecycle cockpit and local next-action decision | `read-only` | agent worker |
| `hadara task close --task T --json` | guarded one-command clean close | `task-close-transaction` | agent worker |
| `hadara task close --task T --dry-run --json` | review/debug/recovery preview | `read-only` | operator, CI |
| `hadara task finalize ...` | compatibility close route during migration | `task-close-transaction` or `read-only`, depending on flags | legacy workflows |

Rule:

```text
Status routes globally.
Task status decides locally.
Task close commits.
```

---

## 4. Evaluation Semantics

Every optional check exposed by status-like commands must state whether it was evaluated.

```ts
type EvaluationState =
  | 'evaluated'
  | 'not-evaluated'
  | 'unavailable'
  | 'stale'
  | 'invalid'
  | 'partial';
```

`ok` means the report was generated. It does not mean the project is healthy.

Operational health is separate:

```ts
type Health = 'ok' | 'attention' | 'blocked' | 'degraded' | 'unknown';
```

Examples:

```json
{
  "ok": true,
  "health": "blocked",
  "phase": "author-task"
}
```

```json
{
  "evaluation": "not-evaluated",
  "reason": "Compact status skips close proof checks unless a task is selected."
}
```

Skipped checks must not be represented as empty successful results.

## 4.1 Evidence Locality

Task evidence remains task-local canonical state:

```text
tasks/T-*/evidence.jsonl
```

Central state may expose evidence indexes, summaries, caches, or projections, but those are rebuildable derivatives. They must not replace task-local audit evidence.

## 4.2 Intent Readiness

Phase does not prove that the current agent is ready to act.

For example, all of the following are valid:

```text
phase = implement, readiness = ready
phase = implement, readiness = needs-context
phase = implement, readiness = blocked
phase = closed-valid, readiness = terminal
```

Compact task and project reports should expose a separate readiness axis.

```ts
interface IntentReadiness {
  intent:
    | 'orient'
    | 'plan'
    | 'edit'
    | 'validate'
    | 'close'
    | 'release';

  status:
    | 'ready'
    | 'needs-context'
    | 'needs-review'
    | 'not-evaluated'
    | 'blocked'
    | 'terminal';

  reason: string;
}
```

`status` is orientation and routing. `task status` is local lifecycle and context-readiness. Neither command proves that an agent semantically understands every source file.

---

## 5. Project Lifecycle

## P0. Uninitialized

### Entry conditions

- no valid HADARA scaffold;
- no current-state canon;
- required HADARA markers absent.

### Primary action

```bash
hadara init --profile <profile> --json
```

### Compact output

```json
{
  "scope": "project",
  "phase": "uninitialized",
  "health": "blocked",
  "readiness": {
    "intent": "orient",
    "status": "blocked",
    "reason": "HADARA is not initialized."
  },
  "primaryNextAction": {
    "kind": "command",
    "writeBoundary": "read-only",
    "command": "hadara init --profile <profile> --json",
    "message": "Initialize or review HADARA adoption before selecting work."
  }
}
```

### Exit

Initialization or adoption review begins.

---

## P1. Adoption Review

### Entry conditions

- repository already contains source/docs;
- HADARA init would create or touch files;
- existing docs need ownership classification;
- brownfield contract requires reviewed execution.

### Primary action

Review the adoption plan. No default write.

```bash
hadara init --profile standard --json
```

### Execute boundary

```bash
hadara init --profile standard --adopt --execute --plan-hash <hash> --json
```

Brownfield adoption remains reviewed because it touches project-owned files.

### Required output

- planned files;
- preserved paths;
- conflicts;
- ownership classification;
- plan hash;
- explicit zero-write result before execute.

### Exit

Adoption executes, is deferred, or is rejected.

---

## P2. Upgrade Required

### Entry conditions

- scaffold version is behind supported baseline;
- removed command guidance is still present;
- docs registry/projection is stale;
- generated block marker contract changed.

### Primary action

Run the appropriate doctor or guarded upgrade preview.

### Health

- `attention` for optional remediation;
- `blocked` when current lifecycle commands would be unsafe.

### Exit

Upgrade/remediation completes or operator defers it with evidence.

---

## P3. Select Work

### Entry conditions

- project is initialized;
- no active task should be resumed;
- actionable next work exists or a first task should be created.

### Command

```bash
hadara task status --json
```

### Recommendation precedence

```text
valid active task
→ structured next work
→ current-state candidate task
→ task board open row
→ slice/backlog candidate
→ create first task
→ idle
```

### Compact output

```json
{
  "scope": "task-selection",
  "phase": "select-work",
  "health": "ok",
  "primaryNextAction": {
    "kind": "command",
    "writeBoundary": "read-only",
    "command": "hadara task status --task T-0123 --json",
    "message": "Inspect the recommended Task Capsule."
  }
}
```

### Exit

Task selected or created.

---

## P4. Active Work

### Entry conditions

- structured current state names an active task;
- task capsule exists;
- no higher-priority project/adoption/release blocker dominates.

### Command

```bash
hadara task status --task T-XXXX --json
```

### Projection

Project status should route into task scope and avoid dumping unrelated project diagnostics.

### Exit

Task reaches validate, close, blocked, or closed-valid phase.

---

## P5. Release Preparation

### Entry conditions

- structured current state or explicit task identifies release work;
- release notes, version sync, package smoke, publish, or recycle remain.

### Primary action examples

- author release notes;
- run release readiness;
- execute publish helper;
- publish GitHub release;
- run installed-package recycle.

### Status behavior

`hadara status --json` may resolve release scope only when release work is explicit in current state or active task title/category. It should not infer release scope from arbitrary version files alone.

### Exit

Published release and post-publish recycle evidence are complete.

---

## P6. Integration Setup

### Entry conditions

- explicit integration intent exists;
- MCP/Hermes/provider setup is selected;
- config or policy approval is pending.

### Status behavior

Generic status should not always include integration details. It should show integration scope only when selected or degraded.

### Exit

Integration is configured, deferred, or rejected.

---

## P7. Idle

### Entry conditions

- project initialized;
- no active task;
- no next work;
- no release/integration intent;
- no blocking drift.

### Compact output

```json
{
  "scope": "project",
  "phase": "idle",
  "health": "ok",
  "primaryNextAction": null,
  "summary": {
    "message": "No active or recommended work is recorded."
  }
}
```

Optional actions may be listed only as optional.

---

## P8. Degraded Project

### Entry conditions

- malformed required state;
- Task Board and current state conflict;
- generated block drift blocks safe projection;
- required docs registry entry points to missing canonical file;
- active-run state contradicts task state.

### Primary action

Repair the highest-priority source inconsistency.

### Rule

Malformed optional state must not erase valid facts from canonical state. Degrade locally and preserve usable guidance.

---

## 6. Task Lifecycle

## T0. Task Missing

### Entry conditions

- explicit task id has no matching capsule.

### Primary action

```bash
hadara task status --json
```

or create a task when allowed.

### Exit

Valid task selected or created.

---

## T1. Author Task

### Entry conditions

Required task contract is missing or scaffold-like:

- Goal missing;
- Scope missing;
- Acceptance missing/generic;
- Validation missing;
- Inputs/Constraints unresolved;
- Handoff absent where required.

### Primary action

Edit the first blocking task-owned document.

### Compact output

```json
{
  "scope": "task",
  "phase": "author-task",
  "health": "blocked",
  "subject": {
    "kind": "task",
    "id": "T-0123"
  },
  "primaryNextAction": {
    "kind": "edit",
    "writeBoundary": "task-owned-prose-edit",
    "path": "tasks/T-0123-example/TASK.md",
    "message": "Replace placeholder acceptance criteria."
  }
}
```

### Exit

Task contract is complete enough to implement or validate.

---

## T2. Plan Work

### Entry conditions

- task contract is authored;
- plan is required by task size/risk;
- explicit plan state indicates review or decomposition is needed.

### Primary action

Complete or review the task plan.

### Rule

Do not infer `plan-work` only from an empty code diff. There must be a task-local or state-local signal.

---

## T3. Implement

### Entry conditions

- task contract is current;
- no unresolved validation failure dominates;
- implementation/documentation work remains.

### Primary action

Continue the bounded implementation step.

### Important correction

The presence of one evidence record must not automatically advance a task to close review.

---

## T4. Validate

### Entry conditions

- implementation is ready for proof;
- required validation has not run;
- acceptance has no evidence;
- validation evidence is stale or insufficient.

### Primary action

Run the most important unresolved validation.

Example:

```json
{
  "phase": "validate",
  "primaryNextAction": {
    "kind": "command",
    "writeBoundary": "evidence-append",
    "command": "hadara validation run --task T-0123 --check \"Focused tests\" -- npm test",
    "message": "Run the focused validation and attach evidence."
  }
}
```

### Exit

Evidence proves acceptance, validation fails, or task returns to implementation.

---

## T5. Repair Evidence

### Entry conditions

- failed validation is unresolved;
- evidence id referenced in TASK.md is missing/invalid;
- evidence category/outcome is incompatible;
- evidence append was partially recorded.

### Primary action

Resolve the evidence problem before close.

### Exit

Evidence is valid or task remains blocked.

---

## T6. Close Ready

### Entry conditions

- task contract complete;
- acceptance satisfied;
- validation evidence valid;
- Task Board identity/status/path coherent for the selected task;
- task-specific required generated projections current;
- explicit close-source docs named by the task contract are current;
- no blocking drift.

Advisory shared state such as project handoff, roadmap, slices, release notes, or broader known problems should not block every close by default. It becomes a blocker only when this task's acceptance criteria or explicit close-source set requires it.

### Primary action

```bash
hadara task close --task T-0123 --json
```

This is a write action. The command name itself is the write boundary.

### Clean path requirement

The agent should not need to run:

```bash
hadara task close --task T-0123 --dry-run --json
hadara task close --task T-0123 --execute --plan-hash <hash> --json
```

for the ordinary clean case.

---

## T7. Closing

### Entry conditions

`task close` is executing after all preflight checks pass.

### Internal sequence

```text
acquire locks in fixed order
→ read task sources
→ evaluate task readiness
→ collect close-source snapshot
→ compute write set
→ compute internal plan hash
→ re-read close sources
→ verify snapshot unchanged
→ apply lifecycle-owned writes
→ verify final source state
→ append close proof last
→ return closed-valid report
```

### Lock ordering

Every close route must use the same lock order.

Recommended order:

```text
1. project lifecycle lock
2. Task Board lock
3. task-scoped lock
4. evidence append lock
```

The exact implementation may differ, but inconsistent lock order is not acceptable.

### Idempotency

The same close request must be safe to retry.

Suggested key:

```text
idempotencyKey = hash(taskId + closeSourceHash + intendedFinalState)
```

If the same close already completed, rerun should report the existing closed-valid state or a no-op completion.

### Write-ahead recovery record

If partial execution can occur, the close engine needs a machine-owned recovery record.

```json
{
  "taskId": "T-0123",
  "operation": "task-close",
  "planHash": "sha256:...",
  "completedSteps": ["task-status", "task-board"],
  "pendingSteps": ["current-state", "close-proof"]
}
```

Preferred recovery is rerunning the same command:

```bash
hadara task close --task T-0123 --json
```

### User-facing behavior

The user sees one command and one report.

### Safety rule

If any close-source changes between evaluation and write, abort before mutation.

Close proof must be recorded only after all lifecycle-owned mutations succeed and final source state is verified.

### State rev vs close snapshot

State store rev/CAS prevents lost updates in `.hadara/state/*.json`. It does not prove that the close-source world is unchanged.

Close safety remains snapshot-based. If state files are close sources, their content hashes are included in the close snapshot.

---

## T8. Blocked Close

### Entry conditions

`task close` cannot safely write.

### Required output

- `ok: false`;
- `health: blocked`;
- no lifecycle-owned writes;
- blocker list;
- one primary recovery action;
- whether partial execution occurred;
- whether manual recovery is allowed or prohibited.

### Example

```json
{
  "ok": false,
  "health": "blocked",
  "phase": "blocked",
  "writeSummary": {
    "writesApplied": 0
  },
  "primaryNextAction": {
    "kind": "edit",
    "writeBoundary": "task-owned-prose-edit",
    "path": "tasks/T-0123-example/TASK.md",
    "message": "Replace the placeholder validation row before closing."
  }
}
```

### Rule

Do not tell agents to hand-edit lifecycle-owned status fields unless the report explicitly labels it as manual recovery and no machine-owned recovery path exists.

---

## T9. Closed Valid

### Entry conditions

- close proof exists;
- close proof matches current close-source hashes;
- Task Board/current state/projections agree enough for the close contract.

### Compact output

```json
{
  "scope": "task",
  "phase": "closed-valid",
  "health": "ok",
  "primaryNextAction": null,
  "summary": {
    "message": "Valid close proof exists. No lifecycle action is required."
  }
}
```

### Rule

Do not emit irrelevant authoring/validation/close sections in compact output.

---

## T10. Closed Stale

### Entry conditions

- close proof exists;
- close-source hash no longer matches;
- task-owned close-source docs changed after close.

### Primary action

Re-run close review or intentionally reopen/repair the task.

### Rule

Closed stale is not the same as open work. It means existing close proof no longer certifies the current source state.

---

## 7. Session Lifecycle

## S0. Fresh Conversation

### Entry condition

A human or agent starts a new conversation/work session with unknown local context.

### Command

```bash
hadara status --json
```

### Required output

- scope;
- phase;
- active/latest task;
- current trusted validation baseline;
- required reading pointers;
- primary next action.

---

## S1. Resume Active Task

### Entry conditions

- current state has active task;
- task exists;
- no higher-priority drift blocks resume.

### Primary action

```bash
hadara task status --task T-XXXX --json
```

---

## S2. Recover Stale Session

### Entry conditions

- active-run or handoff points to stale task;
- task board/current state disagree;
- local cache is stale or malformed.

### Primary action

Repair or ignore the stale local session artifact without losing canonical project state.

### Rule

Local session artifacts are not canonical. Canonical current state and Task Board dominate unless they are invalid.

---

## S3. Context Degraded

### Entry conditions

- context cache manifest stale;
- required reading map references missing optional docs;
- profile-specific docs were assumed but not scaffolded.

### Primary action

Rebuild bounded context or continue with reduced confidence.

---

## 8. Release Lifecycle

## R0. No Release Work

Generic status should not emit release diagnostics unless release work is selected or degraded.

## R1. Release Authoring

Release notes, version metadata, docs, or package files need authoring.

Primary action is an edit, not publish.

## R2. Release Validation

Tests, build, package smoke, release gate, or clean publish clone evidence are pending.

Primary action is a validation command.

## R3. Publish Required

Release is validated and waiting for policy-controlled publish.

Primary action may be a human/operator command or CI trigger, depending on project policy.

## R4. Post-Publish Recycle

Package or release is public, but installed-package recycle evidence is missing.

Primary action is package recycle.

## R5. Release Closed

Publish, GitHub release, registry observation, and installed-package recycle are recorded.

---

## 9. Use Cases

## UC-1. Greenfield first task

```bash
hadara init --profile standard --json
hadara status --json
hadara task create "Build first feature" --json
hadara task status --task T-0001 --json
# edit and validate
hadara task close --task T-0001 --json
```

Success:

- no optional docs are required unless added;
- first task closes without manual Task Board edits;
- status after close recommends next work or idle.

---

## UC-2. Brownfield safe adoption

```bash
hadara init --profile governed --json
hadara init --profile governed --adopt --execute --plan-hash <hash> --json
hadara status --json
```

Success:

- initial command writes nothing;
- execute uses reviewed plan;
- existing project docs remain project-owned;
- docs registry records provenance and ownership.

---

## UC-3. Delegated external agent onboarding

User installs HADARA and initializes project. Then the user gives a generic instruction to an external agent.

Required generated guidance:

```text
Start with `hadara status --json`.
Follow `primaryNextAction`.
Use `task status` before editing.
Use `task close` when acceptance and validation are complete.
Do not hand-edit lifecycle-owned status fields.
```

Success:

- external agent does not need HADARA-dev private knowledge;
- external agent can close baseline task;
- failures produce actionable recovery reports.

---

## UC-4. Failed validation then repair

Flow:

```text
implement
→ validation fails
→ evidence recorded as failed
→ task status phase = repair-evidence or implement
→ agent fixes code
→ validation passes
→ task close
```

Success:

- failed evidence is not hidden;
- close refuses unresolved failed evidence;
- repaired evidence resolves the blocker.

---

## UC-5. Partial close recovery

Flow:

```text
task close starts
→ one lifecycle-owned write succeeds
→ later write fails
→ report marks partial execution
→ task status shows recovery path
→ recovery command repairs without manual guessing
```

Success:

- no ambiguous instruction to hand-edit `TASK_BOARD.md`;
- recovery is explicit and machine-owned when possible;
- final close proof is regenerated after recovery.

---

## UC-6. Multi-agent task allocation

Flow:

```text
agent A creates task
agent B creates task concurrently
```

Success:

- task allocation lock serializes numbering;
- Task Board writes are serialized;
- no duplicate task ids;
- both agents receive deterministic reports.

---

## UC-7. Minimal docs plus optional docs growth

Flow:

```bash
hadara init --profile standard --json
hadara docs add decisions --execute --json
hadara docs add roadmap --execute --json
```

Success:

- default scaffold stays minimal;
- optional docs are registered;
- status required reading only references docs that exist and are relevant;
- agents are instructed to update scaffold docs and add/register new docs when needed.

---

## UC-8. Release with CI or manual publish

HADARA does not force manual publish.

Supported patterns:

| Pattern | HADARA role |
|---|---|
| manual publish | produce readiness evidence and post-publish recycle |
| CI publish | produce fail-closed gate reports and machine-readable evidence |
| hybrid approval | record approval boundary and release evidence |

Success:

- release status identifies the next release action;
- publish mechanism is policy-controlled;
- installed-package recycle closes the release loop.

---

## 10. Output Requirements by Phase

| Phase | Must include | Must hide by default |
|---|---|---|
| uninitialized | init/adoption action | task close detail |
| adoption-review | no-write plan and conflicts | close proof |
| select-work | one recommendation and source | full debt/protocol scans |
| active-work | selected task route | unrelated release/integration detail |
| author-task | first blocking authoring edit | evidence/protocol dumps |
| implement | concrete continuation | close plan |
| validate | validation command | unrelated optional diagnostics |
| repair-evidence | failed/missing evidence and repair | broad project scans |
| close-ready | `task close` command | dry-run ceremony |
| blocked-close | blockers and recovery | optimistic close commands |
| closed-valid | terminal summary | authoring/validation sections |
| degraded | source inconsistency and repair | hallucinated next work |

---

## 11. Acceptance Gates

| ID | Gate |
|---|---|
| AC-1 | A new agent can start with `hadara status --json` and follow one primary action. |
| AC-2 | A clean task closes with one `hadara task close --task T --json` call. |
| AC-3 | A blocked task close writes nothing and returns one concrete recovery action. |
| AC-4 | Compact status distinguishes evaluated/not-evaluated/unavailable/stale/invalid/partial. |
| AC-5 | Closed-valid compact output is short and terminal. |
| AC-6 | `session start` is absent from README, init scaffold guidance, workflow docs, default help, and public routing. |
| AC-7 | Generated docs never require hand-editing lifecycle-owned status fields to recover normal close. |
| AC-8 | Installed-package dogfood covers greenfield, brownfield, delegated agent, failed validation repair, clean close, blocked close, and release recycle. |
| AC-9 | Generated/structured-state expansion proves no-op render diff 0, drift detection, close-proof stability, and measured manual-sync reduction before promotion. |

---

## 12. Open Questions

| ID | Question | Default |
|---|---|---|
| OQ-1 | Should `task close` support a no-flag human mode that writes? | Yes. The command name is the write boundary. |
| OQ-2 | Should `task close --dry-run` exist? | Yes, but not required for clean path. |
| OQ-3 | Should `status --task T` alias `task status --task T`? | No for 0.5.0. |
| OQ-4 | Should `session start` remain as compatibility? | No for public routing. Remove it as an agent-runtime remnant and move useful context fields to `status`. |
| OQ-5 | Should acceptance/validation state become structured in 0.5.0? | No. Start with close/status contracts, migrate later. |
| OQ-6 | Should release scope auto-detect from package version changes? | No. Require explicit current-state/task signal. |

---

## 13. Working Conclusion

The 0.5.x lifecycle is successful when an ordinary agent can do this without private HADARA knowledge:

```bash
hadara status --json
hadara task status --task T-XXXX --json
# work and validate
hadara task close --task T-XXXX --json
```

The clean path should not require manual dry-run/hash ceremony. The safety model remains internal and fail-closed.

`0.5.0-rc.0` shipped the status-ingress half of this loop. `0.5.0 stable` is not complete until the `task close` half also passes installed-package and delegated-agent dogfood for clean close, blocked close, recovery, and failed-validation repair.
