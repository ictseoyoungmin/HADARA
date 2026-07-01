# Command Deprecation Plan

## Decision

`task next` and `task lifecycle` are no longer primary agent-loop commands.

They remain callable compatibility surfaces while `task status` absorbs their normal read-only duties.

## Registry Classification

| Command | Canonical | Requiredness | Default Help | Replacement |
|---|---:|---|---:|---|
| `task.status` | Yes | `primary` | Yes | N/A |
| `task.next` | No | `advanced` | No | `task status --json` |
| `task.lifecycle` | No | `advanced` | No | `task status --task T-XXXX --json` |

## Removal Criteria

Removal should not happen in the same capsule as deprecation. A later capsule may remove the commands only after:

| Gate | Requirement |
|---|---|
| Docs | Init scaffold, workflow docs, README, and AGENTS guidance no longer teach the deprecated commands as primary. |
| Tests | Registry/help/status tests assert status-first routing. |
| Compatibility | At least one release notes entry names the replacements. |
| Dogfood | HADARA-dev task loop works through `task status` without ordinary calls to `task next` or `task lifecycle`. |

## Special-Case CLI Use

The following commands are not removed and remain normal special-case tools inside the lifecycle:

| Command | Use Only When |
|---|---|
| `task finish` | Debugging finish bookkeeping or implementing finish/finalize internals. |
| `task ready` | Debugging done-level readiness blockers. |
| `task close` | Debugging close-evidence append behavior. |
| `task audit-close` | Debugging or repairing close proof after finalize did not already return `closed-valid`. |
| `task close-repair-plan` | Classifying stale or invalid close proof. |
| `evidence lint/list/summary` | Inspecting evidence ids, metadata, or alignment. |
| `protocol doctor/remediate` | Repairing protocol drift with dry-run-first guards. |
