# Phase 8.1 - Status Token and Document Ownership Governance

## Status

Planned implementation specification.

## Problem

HADARA uses status language in several places:

```text
TASK.md
docs/TASK_BOARD.md
task-local HANDOFF.md
docs/PROJECT_STATE.md
docs/AGENT_HANDOFF.md
docs registry entries
evidence records
close/audit reports
```

These surfaces currently mix persistent state, derived proof state, and human summary language. That makes drift easy to miss.

## Goal

Define and publish a canonical status-token and document-ownership policy that workers and validators can use before state projection is implemented.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Rewrite every historical capsule. | Existing history should remain valid unless a future migration is approved. |
| Add automatic repair. | This phase establishes policy and tests. |
| Change close evidence semantics. | Close proof already exists and remains evidence-derived. |
| Add context graph. | Graph work depends on this policy. |

## Existing Surface Integration

| Surface | Integration |
|---|---|
| `docs/IMPLEMENTATION_SOP.md` | Add a compact status/ownership policy section or link to a dedicated doc. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Clarify persistent TaskStatus versus derived CloseState in the lifecycle section. |
| `docs/COMMAND_SURFACE.md` | No change unless command metadata is updated. |
| `docs/DOC_REGISTRY.md` / `.hadara/docs-registry.json` | Treat registry statuses as DocStatus, not TaskStatus. |
| `src/services/capability-registry.ts` | No command change required unless adding report metadata. |

## Type / Schema Model

Canonical token families:

```ts
export type TaskStatus =
  | 'Draft'
  | 'In Progress'
  | 'Blocked'
  | 'Done'
  | 'Partial'
  | 'Superseded'
  | 'Archived';

export type CloseState =
  | 'not-closed'
  | 'closed-valid'
  | 'closed-stale'
  | 'closed-invalid'
  | 'unknown';

export type DocStatus =
  | 'canonical'
  | 'active'
  | 'reference'
  | 'historical'
  | 'superseded'
  | 'archived';

export type EvidenceOutcome =
  | 'passed'
  | 'failed'
  | 'blocked'
  | 'unknown'
  | 'recorded'
  | 'not-applicable';
```

Reserved persistent TaskStatus tokens:

```text
Ready
Closed
Complete
Validated
```

## Document Ownership Model

| Ownership | Meaning |
|---|---|
| `cli-owned` | Normal writes must go through CLI commands. |
| `agent-owned` | Agent may edit directly inside task scope. |
| `mixed-managed` | CLI owns managed sections; agent owns freeform sections. |
| `derived` | Regenerable projection; direct edits discouraged. |
| `historical` | Preserved record; edit only with evidence. |

## Worker Ergonomics

Workers should not need to infer status semantics from prose.

Each implementation task should include a short table:

| Question | Answer |
|---|---|
| What is persistent task state? | `TaskStatus`. |
| What is close proof state? | `CloseState`, derived by audit. |
| Who may update the current-state managed section? | CLI or managed patch by default. |
| Can a worker edit freeform task docs? | Yes, before close, with evidence. |

## CLI Behavior

No new public command is required for the minimal implementation.

Candidate additive behavior:

```bash
hadara docs required-reading --json
hadara task status --task T-XXXX --json
```

may include status policy metadata later, but the first capsule can be docs and validation only.

## Tests

Focused tests should cover:

```text
status token policy docs are present in generated or current docs
reserved TaskStatus tokens are not used in generated task scaffolds
docs doctor or harness validation can report obvious reserved-token misuse if implemented
```

Recommended commands:

```bash
npm run test:focused -- tests/unit/task-create.test.ts tests/unit/task-finish.test.ts tests/unit/docs-required-reading.test.ts
git diff --check
```

Use Docker validation if runtime code changes.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | TaskStatus, CloseState, DocStatus, and EvidenceOutcome are documented in current project guidance. |
| AC-2 | CloseState is documented as derived from evidence/audit, not persistent task status. |
| AC-3 | Document ownership and write-boundary rules are documented. |
| AC-4 | Generated or current task scaffolds do not encourage reserved TaskStatus tokens. |
| AC-5 | No historical task rewrite occurs. |
