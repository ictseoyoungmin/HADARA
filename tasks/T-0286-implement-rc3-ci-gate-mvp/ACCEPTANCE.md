# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `ci gate --mode advisory --json` emits `hadara.ci.gate.v1` without mutation. | Met | Built CLI smoke passed. |
| AC-2 | Strict mode reports `ok:false` on blockers while advisory mode keeps `ok:true`. | Met | Focused CI gate tests passed. |
| AC-3 | Gate aggregates protocol, evidence, proof, and deferred release checks. | Met | Focused CI gate tests passed. |
| AC-4 | Evidence and handoff/state docs are updated before close. | Met | T-0286 evidence records appended; state docs updated before close. |
