# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0156 references. | Done | AGENTS instructions, project handoff, task board, SOP, development slices, Phase 2 plan. |
| 2 | Add profile-scope diagnostics and remediation guide generation. | Done | `src/services/protocol-profile.ts`, `src/services/protocol-remediation.ts`, `src/services/protocol-consistency.ts`. |
| 3 | Wire `hadara protocol doctor --scope profile`. | Done | `src/cli/protocol.ts`, `src/cli/main.ts`. |
| 4 | Add unit and CLI regression coverage. | Done | Protocol consistency and CLI tests. |
| 5 | Run Docker validation, refresh built CLI, and capture evidence. | Done | Focused tests, full check, built CLI smokes. |
| 6 | Update tracked project docs and handoff. | Done | Task Board, Project State, Development Slices, AGENT_HANDOFF. |
