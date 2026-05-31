# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and reviewer close/evidence redesign. | Done | AGENTS/SOP/project state/handoff and attached review text were used. |
| 2 | Implement evidence lint report and CLI. | Done | `src/services/evidence-lint.ts`, `src/cli/evidence.ts`. |
| 3 | Surface lint failures in task protocol doctor. | Done | `src/services/protocol-consistency.ts`. |
| 4 | Register schema fixture and docs. | Done | `hadara.evidence.lint.v1`, schema docs, SOP, V1.0 planning notes. |
| 5 | Run validation and attach evidence. | Done | Focused Docker tests passed. |
