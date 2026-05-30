# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 2 plan. | Done | AGENT_HANDOFF, DEVELOPMENT_SLICES, IMPLEMENTATION_SOP, Phase 2 spec. |
| 2 | Implement bounded remediation service. | Done | `src/services/protocol-remediation.ts`. |
| 3 | Wire `hadara protocol remediate`. | Done | `src/cli/protocol.ts`, `src/cli/main.ts`. |
| 4 | Add dry-run/execute regression tests. | Done | `tests/unit/protocol-remediation.test.ts`, `tests/unit/protocol-cli.test.ts`. |
| 5 | Run Docker validation and built CLI smokes. | Done | Focused tests, full check, dist refresh, command smokes. |
| 6 | Attach evidence and update handoff/project docs. | Done | Task Capsule and project tracking docs. |
