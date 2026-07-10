# Proof Status / Explain / Freshness MVP

## Basis

The comparative dogfooding finding promoted proof status/explain/freshness because the with-HADARA arm produced a 42-record proof ledger and captured a Python 3.10-vs-3.11 runtime conformance gap that the without-HADARA arm could not show.

## Goals

- Explain whether a task has enough evidence to support a done/readiness claim.
- Keep unresolved failed or blocked evidence visible.
- Warn when substantive evidence is private-only.
- Surface stale or missing close proof where detectable.
- Provide compact JSON suitable for CI and future session bootstrap.

## Commands

```bash
hadara proof status --task T-XXXX --json
hadara proof explain --task T-XXXX --json
```

## MVP Status Model

```json
{
  "schemaVersion": "hadara.proof.status.v1",
  "command": "proof.status",
  "ok": true,
  "target": { "kind": "task", "taskId": "T-XXXX" },
  "claim": "task-readiness",
  "verdict": "sufficient",
  "freshness": {
    "status": "fresh",
    "checkedSources": ["tasks/T-XXXX/TASK.md", "tasks/T-XXXX/evidence.jsonl"]
  },
  "summary": {
    "passed": 3,
    "failed": 0,
    "blocked": 0,
    "privateOnlySubstantive": 0
  },
  "supportingEvidence": [],
  "blockers": [],
  "warnings": [],
  "nextActions": []
}
```

## MVP Verdict Rules

| Verdict | Meaning |
|---|---|
| `sufficient` | Task is Done or ready-like and has passed public evidence with no unresolved failed/blocked evidence. |
| `insufficient` | No passed substantive evidence supports the claim. |
| `blocked` | Latest substantive evidence includes unresolved failed or blocked records. |
| `warning` | Evidence exists, but private-only or freshness warnings reduce confidence. |
| `unknown` | Task/evidence state cannot be interpreted safely. |

## Deferred

- Tamper-evident seal
- External signature authority
- Full proof graph
- Release-target proof beyond existing release gate integration
