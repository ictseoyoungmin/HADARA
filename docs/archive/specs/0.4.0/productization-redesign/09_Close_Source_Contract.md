# 09 Close Source Contract

## Goal

Define the HADARA 0.4 close-source contract without legacy layout compatibility.

## Close-Source Inputs

For a normal task close, close-source input includes:

```text
tasks/T-XXXX/TASK.md
slot registry version/hash
normalized task-board consistency check
normalized evidence readiness snapshot
optional normalized handoff summary snapshot
```

It does not include:

```text
tasks/T-XXXX/HANDOFF.md raw file hash by default
tasks/T-XXXX/EVIDENCE.md raw file hash
tasks/T-XXXX/evidence.jsonl raw file hash
docs/TASK_BOARD.md whole-file hash
docs/PROJECT_STATE.md whole-file hash by default
docs/AGENT_HANDOFF.md whole-file hash by default
```

Shared state docs may be included only when the task explicitly changes project-level state and the close plan declares them as expected close-source inputs.

## Close Source Payload

```json
{
  "schemaVersion": "hadara.closeSource.v1",
  "taskId": "T-0001",
  "protocol": "0.4",
  "sourceUnits": [
    {
      "kind": "file",
      "path": "tasks/T-0001-add-dashboard-action-busy-guard/TASK.md",
      "sha256": "sha256:...",
      "closeSourceRole": "included"
    },
    {
      "kind": "registry",
      "path": ".hadara/slot-registry.json",
      "sha256": "sha256:...",
      "closeSourceRole": "included"
    },
    {
      "kind": "derived-projection",
      "path": "docs/TASK_BOARD.md",
      "selector": "task:T-0001:command-owned-cells",
      "sha256": "sha256:...",
      "closeSourceRole": "consistency-check"
    },
    {
      "kind": "derived-projection",
      "path": "tasks/T-0001-add-dashboard-action-busy-guard/evidence.jsonl",
      "selector": "readiness-summary",
      "sha256": "sha256:...",
      "closeSourceRole": "snapshot"
    },
    {
      "kind": "derived-projection",
      "path": "tasks/T-0001-add-dashboard-action-busy-guard/HANDOFF.md",
      "selector": "handoff-summary",
      "sha256": "sha256:...",
      "closeSourceRole": "snapshot"
    }
  ]
}
```

## Why Not Whole Task Board Hash

Whole-file `docs/TASK_BOARD.md` hashing makes old closed tasks stale when unrelated tasks are added, reordered, or edited. 0.4 avoids that failure mode.

## Why Not Raw Evidence Hash

Close proof appends evidence after readiness checks. If raw evidence files were close-source, close would create fixed-point drift. 0.4 records a normalized evidence readiness snapshot instead.

## Close Proof Result

`closed-valid`, `closed-stale`, and related close states are derived read-model results, not persistent TaskStatus values.

## Post-Close Writes

Post-close writes to `TASK.md` intentionally invalidate close proof. Post-close projection updates to `EVIDENCE.md` and clarification-only updates to `HANDOFF.md` do not.

If a post-close `HANDOFF.md` edit changes the actual task contract, acceptance, validation meaning, or unresolved risk posture, the agent must update `TASK.md` and rerun finalize. Handoff is not an escape hatch for changing the closed task contract.

## Diagnostics

```text
CLOSE_SOURCE_TASK_MISSING
CLOSE_SOURCE_HANDOFF_RAW_HASH
CLOSE_SOURCE_SLOT_REGISTRY_HASH_MISSING
CLOSE_SOURCE_TASK_BOARD_WHOLE_FILE
CLOSE_SOURCE_EVIDENCE_RAW_HASH
CLOSE_SOURCE_SHARED_DOC_UNDECLARED
CLOSE_SOURCE_CHANGED_AFTER_CLOSE
CLOSE_EVIDENCE_SNAPSHOT_MISSING
CLOSE_PROOF_WRITTEN_TO_CLOSE_SOURCE
```
