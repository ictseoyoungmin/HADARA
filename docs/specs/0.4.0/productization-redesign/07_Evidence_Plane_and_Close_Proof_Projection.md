# 07 Evidence Plane and Close Proof Projection

## Goal

Keep evidence canonical, append-only, and separate from close-source Markdown.

## Files

```text
tasks/T-XXXX/evidence.jsonl
tasks/T-XXXX/EVIDENCE.md
```

## `evidence.jsonl`

`evidence.jsonl` is canonical append-only evidence.

Rules:

```text
Do not hand-edit.
Do not rewrite failed or blocked evidence.
Append newer evidence to resolve, supersede, or accept residuals.
Use durable `ev:` ids when referencing evidence.
```

## `EVIDENCE.md`

`EVIDENCE.md` is a human-readable projection. It is not close-source.

Recommended structure:

```md
# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
```

## Evidence Outcomes

```text
passed
failed
blocked
unknown
recorded
not-applicable
```

## Projection Refresh

`EVIDENCE.md` is refreshed by HADARA commands, not by agents.

Default 0.4 behavior:

```text
evidence add-command updates `evidence.jsonl` and refreshes `EVIDENCE.md` projection for that task.
task finalize refreshes close-proof and residual projection after close evidence is appended.
task audit-close reads canonical evidence and may report projection drift, but does not require projection freshness for close validity.
```

Proposed explicit repair surface:

```bash
hadara evidence project --task T-XXXX --json
hadara evidence project --task T-XXXX --execute --json
```

`evidence project --json` is a dry-run projection report. `--execute` rewrites only generated projection slots in `EVIDENCE.md` from `evidence.jsonl`; it must not rewrite `evidence.jsonl`, hide failed or blocked evidence, or invent evidence records.

## Evidence Categories

```text
validation
close-proof
implementation
docs
decision
risk
handoff
diagnostic
release
package
observation
```

## Close Proof Placement

Close proof must not be written into `TASK.md` or `HANDOFF.md`.

The canonical close evidence is appended to `evidence.jsonl`. `EVIDENCE.md` may project it for humans.

## Close Evidence Snapshot

Even though raw evidence files are not close-source, close proof should capture a normalized evidence readiness snapshot.

```json
{
  "closeEvidenceSnapshot": {
    "requiredAcceptanceIds": ["AC-1", "AC-2"],
    "evidenceRefsUsedForReadiness": ["ev:T-0001:..."],
    "latestFailedOrBlockedEvidenceRefs": [],
    "unresolvedEvidenceClassifications": [],
    "evidenceSummaryHash": "sha256:..."
  }
}
```

This prevents the close proof from becoming weakly tied to validation evidence while avoiding append-only evidence fixed-point loops.

## Projection Rule

Passed evidence may be compacted in projections. Unresolved failed or blocked evidence must remain visible.

Projection drift is not close-source drift. It is a documentation/projection issue because `evidence.jsonl` remains canonical.

## Diagnostics

```text
EVIDENCE_JSONL_HAND_EDIT_SUSPECTED
EVIDENCE_PROJECTION_HAND_EDIT_SUSPECTED
EVIDENCE_FAILED_OR_BLOCKED_HIDDEN
EVIDENCE_CLOSE_PROOF_IN_TASK
EVIDENCE_CLOSE_PROOF_IN_HANDOFF
EVIDENCE_SNAPSHOT_MISSING
EVIDENCE_REFERENCE_UNKNOWN
EVIDENCE_DISPOSITION_REFERENCE_MISSING
```
