# 10 Context Routing and Session Start Integration

## Goal

Make session startup and task context discovery follow the 0.4 document model.

Agents should not manually read broad docs or all specs by default.

## Current Baseline Commands

The redesign should preserve the current command shape where possible:

```bash
hadara session start --json
hadara session start --task T-XXXX --json
hadara context pack --task T-XXXX --json
hadara context slice --path <path> --from <line> --to <line> --json
hadara context slice --task T-XXXX --candidate <candidate-id> --json
hadara context cache status --json
hadara context cache warm --json
hadara context cache warm --execute --json
```

## Session Start Behavior

`session start` should compose:

```text
current project state
task selection guidance
docs read map summary
known problems
primary action
avoid-for-now actions
context pack guidance
cache/degraded metadata
```

It should not:

```text
fetch raw slices
warm cache by default
append evidence
run validation
mutate project state
```

## Context Pack Behavior

`context pack --task T-XXXX --json` should rank:

```text
active task docs
source documents recorded in TASK.md
active design source docs from docs registry
implementation/test files relevant to the task
conditional references only when task scope requires them
```

It should not read:

```text
historical specs by default
superseded specs by default
archived docs by default
unregistered docs/specs by default
implemented specs unrelated to the task
```

## Design Source Hash Drift

If `TASK.md` records a source document hash and the current source document hash differs, context pack should report a drift warning and recommend re-interpretation before finalize.

Example warning:

```json
{
  "code": "TASK_SOURCE_DOCUMENT_CHANGED",
  "path": "docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md",
  "severity": "warning",
  "suggestedAction": "Review the changed source document and update derived task docs before finalize."
}
```

## Context Slice Behavior

Use `context slice` only after a context pack or task report points to a specific path/range.

It must preserve existing safety boundaries:

```text
project-root containment
ignored/private/generated/local-state deny rules
binary-looking file rejection
explicit range or candidate-based reads
byte budget failure without raw slices
```

## Proposed Read Map Integration

`docs read-map --task T-XXXX --json` is proposed. If implemented, session start and context pack should consume it rather than independently reconstructing docs policy.

## Diagnostics

```text
SESSION_START_READ_MAP_MISSING
CONTEXT_PACK_UNREGISTERED_SPEC_INCLUDED
CONTEXT_PACK_SUPERSEDED_SPEC_INCLUDED
CONTEXT_PACK_DRIFT_RISK_UNWARNED
CONTEXT_PACK_SOURCE_DOCUMENT_HASH_STALE
CONTEXT_SLICE_UNSAFE_PATH
CONTEXT_CACHE_WARM_USED_AS_DEFAULT_STEP
```
