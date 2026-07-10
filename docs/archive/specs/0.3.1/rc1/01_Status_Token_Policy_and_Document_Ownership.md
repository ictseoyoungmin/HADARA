# rc1 Capsule 1 - Status Token Policy and Document Ownership

## Capsule Goal

Publish the canonical token and ownership policy that all later Phase 8 validators and projections use.

## Scope

| In Scope | Notes |
|---|---|
| Document TaskStatus and CloseState separation in current workflow docs. | Persistent versus derived state must be unambiguous. |
| Document DocStatus and EvidenceOutcome token families. | Reuse existing docs registry and evidence v2 vocabulary. |
| Document ownership and write boundaries for task capsule and root docs. | Workers need direct-edit guidance. |
| Add or adjust generated scaffold guidance if needed. | New projects should not learn ambiguous status language. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| State projection. | Capsule 4. |
| Handoff validator implementation. | Capsule 2. |
| Historical migration. | Requires separate dry-run-first task. |
| Publish/release work. | Separate release capsule. |

## Files Likely to Change

```text
docs/IMPLEMENTATION_SOP.md
docs/TASK_WORKFLOW_COMMANDS.md
docs/AGENT_HANDOFF.md
src/cli/init.ts or template files, only if generated docs need wording changes
tests/unit/init.test.ts or task-create tests, only if templates change
```

## Tests

```bash
git diff --check
npm run test:focused -- tests/unit/init.test.ts tests/unit/task-create.test.ts
```

Use Docker sync-build if source or templates change.

## Done Criteria

| ID | Criterion |
|---|---|
| DC-1 | TaskStatus allowed/reserved tokens are documented. |
| DC-2 | CloseState is documented as audit-derived. |
| DC-3 | Document ownership and write boundaries are documented. |
| DC-4 | Generated guidance no longer encourages reserved persistent status tokens. |
