# 12 CLI JSON Contracts and Diagnostics

## Goal

Define current baseline commands and proposed 0.4 reports without inventing unsupported options.

## Current Baseline Commands to Preserve

These are the command shapes the redesign should preserve where possible:

```bash
hadara init --json
hadara init --profile basic --json
hadara init --profile standard --json
hadara init --profile governed --json

hadara init doctor --json
hadara init upgrade --profile governed --json
hadara init register-doc --path docs/specs/example.md --when "..." --purpose "..." --json
hadara init enable-integration --integration mcp --json

hadara session start --json
hadara session start --task T-XXXX --json

hadara task next --json
hadara task create "task title" --json
hadara task status --task T-XXXX --json
hadara task lifecycle --task T-XXXX --json
hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
hadara task close-repair-plan --task T-XXXX --json

hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --json
hadara evidence list --task T-XXXX --json
hadara evidence summary --task T-XXXX --json

hadara context pack --task T-XXXX --json
hadara context slice --path <path> --from <line> --to <line> --json
hadara context cache status --json
hadara context cache warm --json

hadara docs list --json
hadara docs doctor --json
hadara docs explain --path <path> --json
hadara docs required-reading --json
hadara docs managed list --json
hadara docs managed explain --path <path> --json
```

## Removed / Not Proposed

The 0.4 redesign does not include:

```bash
hadara task create "task title" --layout compact --json
hadara task create "task title" --capsule-layout compact-v1 --json
hadara task layout --task T-XXXX --json
hadara task migrate-layout --task T-XXXX --to compact-v1 --json
hadara init upgrade --target 0.4.0 --json
```

## Proposed 0.4 Commands

```bash
hadara docs read-map --task T-XXXX --json
hadara docs inbox --json
hadara docs register --path <path> --json
hadara docs complete-spec --path <path> --implemented-by T-XXXX --json
hadara docs mark-drift --path <path> --risk high --reason "..." --json
hadara evidence project --task T-XXXX --json
hadara evidence project --task T-XXXX --execute --json
```

These are proposed commands. Implementation must add command registry entries, schemas, focused tests, docs, and help text.

`hadara init register-doc` is the preserved 0.3.x/current-baseline compatibility surface. The 0.4 productized surface is `hadara docs register`; it writes canonical metadata to `.hadara/docs-registry.json` and may refresh a generated human projection such as `docs/DOC_REGISTRY.md`. It must not mutate `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, or `docs/HADARA_WORKFLOW.md` to append per-document rows.

## `task create` 0.4 Report

```json
{
  "ok": true,
  "schemaVersion": "hadara.task.create.v1",
  "taskId": "T-0001",
  "capsulePath": "tasks/T-0001-add-dashboard-action-busy-guard",
  "hadaraProtocol": "0.4",
  "taskCapsuleSchema": "hadara.taskCapsule.v1",
  "createdFiles": [
    "TASK.md",
    "HANDOFF.md",
    "evidence.jsonl",
    "EVIDENCE.md"
  ]
}
```

## `task status` Additive Fields

```json
{
  "taskCapsuleSchema": "hadara.taskCapsule.v1",
  "sourceDocuments": {
    "current": true,
    "changed": [],
    "warnings": []
  },
  "controlledValues": {
    "valid": true,
    "issues": []
  },
  "authoringGuidance": {
    "missingSections": [],
    "suggestedNextEdits": [],
    "cliOwnedFields": [],
    "agentOwnedSections": []
  }
}
```

`authoringGuidance` is read-only. It tells agents what to write or repair, but it does not silently generate task-specific prose into `TASK.md`.

## `task finalize` Additive Fields

```json
{
  "closeSource": {
    "schemaVersion": "hadara.closeSource.v1",
    "sourceUnits": []
  },
  "evidenceSnapshot": {
    "schemaVersion": "hadara.evidence.readinessSnapshot.v1"
  },
  "slotRegistryHash": "sha256:..."
}
```

## Proposed `evidence project` Report

```json
{
  "ok": true,
  "schemaVersion": "hadara.evidence.projection.v1",
  "taskId": "T-0001",
  "mode": "dry-run",
  "source": "tasks/T-0001-add-dashboard-action-busy-guard/evidence.jsonl",
  "target": "tasks/T-0001-add-dashboard-action-busy-guard/EVIDENCE.md",
  "wouldChange": true,
  "generatedSlots": [
    "evidence.validation-summary",
    "evidence.close-proof",
    "evidence.residuals"
  ],
  "issues": []
}
```

`--execute` may rewrite only generated projection slots in `EVIDENCE.md`. It must not rewrite `evidence.jsonl` or change evidence outcomes.

## Proposed `docs read-map` Report

```json
{
  "ok": true,
  "schemaVersion": "hadara.docs.readMap.v1",
  "taskId": "T-0001",
  "readFirst": [],
  "readIfNeeded": [],
  "doNotReadByDefault": [],
  "driftWarnings": []
}
```

## Diagnostics Catalog

```text
HADARA_LEGACY_PROJECT_UNSUPPORTED
HADARA_LEGACY_PROJECT_MUTATION_BLOCKED
TASK_SOURCE_DOCUMENT_CHANGED
TASK_SOURCE_DOCUMENT_MISSING_HASH
TASK_STATUS_DUPLICATE_OWNER
TASK_CLOSE_PROOF_IN_CLOSE_SOURCE
HANDOFF_TASK_STATUS_PERSISTED
HANDOFF_CLOSE_STATE_PERSISTED
TASK_BOARD_WHOLE_FILE_CLOSE_SOURCE
SPEC_UNREGISTERED
SPEC_ACTIVE_AFTER_IMPLEMENTED
SPEC_DRIFT_RISK_WITHOUT_REVIEW
DOC_READ_TIER_INVALID_TOKEN
DOC_AUTHORITY_INVALID_TOKEN
SLOT_REGISTRY_HASH_MISSING_IN_CLOSE_PROOF
EVIDENCE_SNAPSHOT_MISSING
EVIDENCE_PROJECTION_DRIFT
EVIDENCE_PROJECTION_EXECUTE_SCOPE_INVALID
CHANGE_SUMMARY_LINE_RANGE_MISSING
```
