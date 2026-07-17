# HADARA 0.5.x Combined Agent Loop Plan

**Document status:** Final-candidate draft / local planning only  
**Target:** HADARA 0.5.0 through 0.5.x  
**Baseline:** HADARA 0.4.6 stable  
**Inputs:** task-close plan, task-close technical design, lifecycle-aware status redesign, reviewer feedback  
**Registry status:** Registered as reference-only. This remains a proposed planning input, not a committed product spec.

---

## 1. Summary

HADARA 0.5.x should reduce lifecycle ambiguity without adding another broad command surface.

The combined agent loop is:

```text
status routes globally.
task status decides locally.
task close commits.
```

Meaning:

| Command | Ownership |
|---|---|
| `hadara status --json` | project/session ingress, active/next task identification, global routing |
| `hadara task status --json` | next task selection when no task is selected |
| `hadara task status --task T-XXXX --json` | Task Capsule phase, readiness, blockers, and local next action |
| `hadara task close --task T-XXXX --json` | guarded lifecycle mutation for a clean close |

`status` must not duplicate selected-task lifecycle evaluation. When it detects active work, it should route to `task status --task T`, not compute `author-task`, `implement`, `validate`, or `close-ready` itself.

0.5.x is a lifecycle-loop cleanup. It is not a full state-first rewrite.

---

## 2. Command Surface Decisions

### 2.1 No new `brief` command

Do not introduce `hadara brief`.

The product need previously described as "brief" is served by:

```bash
hadara status --json
```

### 2.2 Remove `session start`

`hadara session start` is an agent-runtime design remnant.

0.5.x should remove it from:

- README;
- init scaffold guidance;
- workflow docs;
- default help;
- public routing.

Replacement:

```bash
hadara status --json
```

Any context/session facts worth preserving should move into the project/session section of status output or an explicit detail mode. Do not keep teaching both `session start` and `status` as entry points.

### 2.3 One primary close surface per release

0.4.6 primary close surface:

```bash
hadara task finalize ...
```

0.5.x target primary close surface:

```bash
hadara task close --task T-XXXX --json
```

Migration rule:

```text
At any given release, public workflow docs must teach only one primary close command.
```

Recommended rollout:

| Stage | Public primary | `task close` | `finalize` |
|---|---|---|---|
| 0.5.0 | `task finalize` unless task-close dogfood is complete | hidden/experimental or internal engine | stable primary |
| 0.5.1 | depends on dogfood | visible candidate if clean/blocked/recovery flows pass | compatibility |
| 0.5.2+ | `task close` | default primary | compatibility/deprecated |

The product target remains one-command `task close`; the release sequence must avoid teaching two primary close paths at once.

---

## 3. Problem Statement

0.4.x made Task Capsules reliable, but lifecycle decisions are still split across:

| Concern | Current surface |
|---|---|
| project overview | `hadara status` |
| next task selection | `hadara task status` |
| selected task lifecycle | `hadara task status --task` |
| session/bootstrap context | `hadara session start` |
| close execution | `task finalize --execute --auto` |
| human-readable state | Markdown tables/projections |

The repeated friction is not lack of data. The problem is that global routing, local task phase, readiness, close mutation, and context freshness are not expressed as one coherent agent loop.

---

## 4. Product Principles

### 4.1 Global routing vs local decision

Top-level status answers:

```text
Where is the project, and which bounded surface should the agent inspect next?
```

Selected-task status answers:

```text
What phase is this capsule in, is the agent ready to act, and what is the local next action?
```

### 4.2 Phase is not readiness

Lifecycle phase and action readiness are separate axes.

Example:

```json
{
  "scope": "task",
  "phase": "implement",
  "health": "ok",
  "readiness": {
    "intent": "edit",
    "status": "needs-context",
    "reason": "The task contract is current, but required source context has not been proven fresh."
  }
}
```

Recommended shape:

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

This prevents `phase = implement` from implying that the current agent already has enough context to edit files.

### 4.3 `ok` is not health

`ok` means the report was generated.

`health` means operational state:

- `ok`;
- `attention`;
- `blocked`;
- `degraded`;
- `unknown`.

A report may be:

```json
{ "ok": true, "health": "blocked" }
```

### 4.4 Not evaluated is not healthy

Skipped, stale, unavailable, invalid, and partial checks must be represented explicitly.

```ts
type EvaluationState =
  | 'evaluated'
  | 'not-evaluated'
  | 'unavailable'
  | 'stale'
  | 'invalid'
  | 'partial';
```

Skipped checks must not be encoded as zero counts or `ok: true` subreports.

### 4.5 Write boundary is not a boolean

Actions should expose `writeBoundary`, not only `writes: true`.

Example:

```json
{
  "kind": "command",
  "command": "hadara task close --task T-0123 --json",
  "writeBoundary": "task-close-transaction",
  "risk": "medium",
  "requiresReview": false,
  "message": "Close the clean Task Capsule through a guarded lifecycle transaction."
}
```

`writes` may exist as a convenience field, but canonical routing should use `writeBoundary`.

### 4.6 Clean close is one command

The 0.5.x UX budget is:

```text
Clean close: hadara task close 1회로 종료
```

The clean happy path is:

```bash
hadara task close --task T-XXXX --json
```

The user should not copy a plan hash in the normal clean case.

Dry-run and plan-hash remain for review, CI preview, debugging, and recovery.

### 4.7 Evidence locality is invariant

Task evidence remains task-local canonical state:

```text
tasks/T-*/evidence.jsonl
```

Central state may contain only indexes, caches, summaries, or projections derived from task-local evidence. It must be rebuildable and must not replace the capsule-local audit record.

### 4.8 Projection safety requires ownership contract

No-ceremony generated updates are valid only when all conditions hold:

1. the file or block is a complete projection;
2. canonical state can regenerate it at any time;
3. humans and agents are contractually forbidden from direct edits.

Without this contract, automatic rendering repeats the old handoff-overwrite failure mode at block scale.

---

## 5. Public Schemas

Use a shared internal evaluator, but do not force every public status command into one permissive schema.

Internal:

```text
hadara.statusEvaluation.v1
```

Public projections:

```text
hadara.project.status.v2
hadara.taskSelection.status.v2
hadara.task.status.v2
hadara.release.status.v2       # when release scope exists
dashboard-specific wrapper     # if needed
```

Shared envelope fields are fine:

```json
{
  "ok": true,
  "scope": "task",
  "phase": "implement",
  "health": "ok",
  "readiness": {},
  "primaryNextAction": {},
  "issues": []
}
```

But scope-specific schemas should remain separate so external consumers do not have to handle a giant optional-field union.

---

## 6. Status Behavior

### 6.1 Project/session ingress

Command:

```bash
hadara status --json
```

Responsibilities:

- detect initialized/adoption/upgrade/degraded state;
- identify active task or next task;
- summarize freshness of global routing inputs;
- return one global primary action;
- point to `task status --task T` when selected task details are needed.

Example:

```json
{
  "schemaVersion": "hadara.project.status.v2",
  "command": "status",
  "ok": true,
  "scope": "project",
  "phase": "active-work",
  "health": "ok",
  "activeTask": {
    "id": "T-0123",
    "title": "Implement lifecycle-aware status"
  },
  "readiness": {
    "intent": "orient",
    "status": "ready",
    "reason": "An active task is recorded and the task capsule exists."
  },
  "primaryNextAction": {
    "kind": "command",
    "command": "hadara task status --task T-0123 --json",
    "writeBoundary": "read-only",
    "message": "Inspect the active Task Capsule before editing."
  }
}
```

`hadara status` should not calculate the selected task's final local phase unless the status request explicitly asks for diagnostic/full task detail.

### 6.2 Task selection

Command:

```bash
hadara task status --json
```

Responsibilities:

- select existing work or suggest task creation;
- explain recommendation source;
- include required reading pointers;
- avoid broad project diagnostics.

### 6.3 Selected-task cockpit

Command:

```bash
hadara task status --task T-XXXX --json
```

Responsibilities:

- resolve local task phase;
- expose intent readiness;
- surface blockers and recovery;
- recommend one local next action;
- keep compact output phase-relevant.

---

## 7. Task Close Transaction

`task close` is not a simple rename of `finalize`. It is a product change to the close UX and command portfolio.

### 7.0 Two safety domains

Do not collapse state-store concurrency and close safety into one mechanism.

| Domain | Mechanism | Owns | Does not own |
|---|---|---|---|
| Domain A | state store rev/CAS | lost-update prevention for `.hadara/state/*.json` writes | close proof safety |
| Domain B | close-source snapshot hashes | the world that justified closing a task | generic state write concurrency |

`rev` never replaces the close-source snapshot.

If state files become close sources, their content hashes are added to the close-source snapshot. Their rev values are not a substitute for the snapshot.

### 7.1 Clean path

```bash
hadara task close --task T-XXXX --json
```

Internal sequence:

```text
acquire locks in fixed order
→ evaluate task readiness
→ collect close-source snapshot
→ compute write set
→ compute internal plan hash
→ re-read/revalidate close sources
→ apply lifecycle-owned mutations
→ verify final source state
→ append close proof last
→ return closed-valid report
```

### 7.2 Lock ordering

All close paths must use one fixed lock order.

Recommended order:

```text
1. project lifecycle lock
2. Task Board lock
3. task-scoped lock
4. evidence append lock
```

The implementation may choose a different order, but every close route must share it.

### 7.3 Idempotency

Close must be safe to retry.

Suggested key:

```text
idempotencyKey = hash(taskId + closeSourceHash + intendedFinalState)
```

If the same close already completed, a rerun should return the existing closed-valid result or explicitly state that no mutation is needed.

### 7.4 Write-ahead recovery record

If partial execution is possible, the close engine needs a machine-owned recovery record.

Example:

```json
{
  "taskId": "T-0123",
  "operation": "task-close",
  "planHash": "sha256:...",
  "completedSteps": ["task-status", "task-board"],
  "pendingSteps": ["current-state", "close-proof"]
}
```

Preferred recovery UX:

```bash
hadara task close --task T-0123 --json
```

The same command should recover idempotently when possible. Add a separate `recover` command only if this proves insufficient.

### 7.5 Proof last

Close proof must be appended after all lifecycle-owned state mutations succeed and the final source state is verified.

Never record close proof before a possible failing write.

### 7.6 Blocked close

When blocked, close must:

- write nothing unless reporting an explicit machine-owned recovery record;
- return `health: blocked`;
- include one primary recovery action;
- avoid advising hand-edit of lifecycle-owned status fields unless no machine-owned recovery path exists and the report labels it as manual recovery.

---

## 8. Close-Ready Scope

Do not make every shared project document a hard close blocker.

Required close sources:

- `TASK.md` task contract;
- task-local acceptance/validation rows;
- task-local canonical evidence;
- Task Board identity/status/path for the selected task;
- task-specific required generated projections;
- close-source docs explicitly named by the task contract.

Advisory shared state:

- project handoff;
- roadmap;
- slices;
- release state;
- broader known problems.

Advisory shared state becomes a blocker only when:

- the task acceptance criteria require it;
- the task's explicit close-source set includes it;
- drift would make the selected close mutation unsafe.

Otherwise:

```text
close succeeds + follow-up recommendation
```

is preferable to forcing global documentation chores onto small capsules.

---

## 9. Structured State Direction

0.5.x should move machine-owned facts out of Markdown where it removes real lifecycle friction.

Do not attempt full migration in 0.5.0.

### 9.1 Ownership tiers

Use the state-first RFC tier model as the migration guardrail.

| Tier | Model | Examples | Rule |
|---|---|---|---|
| Tier 1 | full projection | `docs/TASK_BOARD.md`, `docs/DEVELOPMENT_SLICES.md`, `tasks/T-*/EVIDENCE.md` | edit only through HADARA/state API |
| Tier 2 | human-owned doc + generated blocks | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, selected structured blocks in `TASK.md` | marker outside prose is human-owned; marker inside is generated |
| Tier 3 | managed patch | `.gitignore` block, `AGENTS.md` insertion, brownfield managed snippets | before-hash protection remains required |

TASK.md is a long-term Tier 2 candidate. Goal/Scope/Change prose remain human-owned. Plan/Acceptance/Validation/Risks structural columns may migrate later, but not in 0.5.0.

### 9.2 First candidates

| Candidate | Reason |
|---|---|
| current state | already drives status and task selection |
| status evaluation semantics | reduces skipped-check ambiguity |
| task close plan/proof | machine-owned and hash-sensitive |
| Task Board projection inputs | repeated drift source |

### 9.3 Later candidates

| Candidate | Reason |
|---|---|
| slices/backlog | mostly structured |
| acceptance criteria state | needs evidence linkage |
| validation result state | agent-readable close gates |
| release state | release readiness/recycle workflow |

### 9.4 Keep in Markdown

- Goal/Scope prose;
- design notes;
- risks/follow-up narrative;
- handoff commentary.

### 9.5 Expansion gates

Generated or structured-state expansion must pass measurable gates before promotion.

| Gate | Requirement |
|---|---|
| no-op render | rerender without state changes produces diff 0 |
| round trip | import/render preserves existing structured data or reports every loss |
| close proof | adding the state/projection source does not regress close proof validation |
| drift detection | direct edits inside generated regions are detected and fail closed |
| manual sync reduction | dogfood shows the target workflow no longer needs manual doc synchronization |

---

## 10. Release Scope

Recommended 0.5.x sequencing:

### 0.5.0

Focus:

- remove `session start` public guidance/routing;
- add shared evaluation semantics;
- make `hadara status --json` lifecycle-aware for project/session ingress;
- adapt task selection and selected-task status enough to expose phase/readiness/primary action cleanly;
- keep `finalize` as the primary close surface unless `task close` has already passed delegated dogfood.

### 0.5.1

Focus:

- implement task-close internal engine;
- add hidden or experimental `task close` route;
- prove lock ordering, idempotency, recovery record, and proof-last behavior;
- dogfood clean close and blocked close.

### 0.5.2+

Focus:

- promote `task close` to public primary if dogfood passes;
- move `finalize` to compatibility/deprecated route;
- continue generated block and structured-state migration.

This sequencing avoids coupling lower-risk status cleanup to higher-risk close transaction work.

---

## 11. Non-Goals

0.5.x should not:

- introduce `hadara brief`;
- keep `session start` as a taught public entry point;
- centralize task evidence;
- migrate all `TASK.md` state in one release;
- make status mutate project state;
- infer semantic completion from code diffs alone;
- require a specific CI/CD or publish platform;
- introduce a cloud/controller runtime.

---

## 12. Acceptance Gates

| ID | Criterion |
|---|---|
| AC-1 | New agent starts with `hadara status --json` and receives one global routing action. |
| AC-2 | Active work in top-level status routes to `task status --task T`, not duplicated task phase logic. |
| AC-3 | Selected task status exposes phase, health, readiness, and one local action. |
| AC-4 | Status output distinguishes evaluated, not-evaluated, unavailable, stale, invalid, and partial checks. |
| AC-5 | Public status schemas remain scope-specific, backed by shared internal evaluation semantics. |
| AC-6 | `session start` is absent from README, init scaffold guidance, workflow docs, default help, and public routing. |
| AC-7 | `task close` clean path is one command once promoted. |
| AC-8 | `task close` transaction proves lock ordering, idempotency, write-ahead recovery, and proof-last behavior before primary promotion. |
| AC-9 | Close-ready blockers are limited to task-local and explicitly required close sources; unrelated shared docs remain advisory. |
| AC-10 | Installed-package delegated dogfood covers status ingress, task status local decision, clean close, blocked close, and recovery. |

---

## 13. Working Conclusion

The final combined direction is:

```text
No new brief command.
Remove session start as a public agent-runtime remnant.
Make status route globally.
Make task status decide locally.
Promote task close only after transaction/recovery dogfood proves it.
Keep Markdown readable and evidence task-local.
Move structured state only where it removes real synchronization friction.
```

This keeps HADARA's 0.4.x safety model while targeting the highest-value 0.5.x improvement: a deterministic agent loop with less ceremony and clearer boundaries.
