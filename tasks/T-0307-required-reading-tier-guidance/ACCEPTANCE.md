# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Root docs describe semantic required-reading tiers: `current-state`, `task-work`, `conditional-reference`, `historical`, and `excluded`. | Done | `AGENTS.md` and `docs/IMPLEMENTATION_SOP.md` tier tables. |
| AC-2 | Root docs make `.hadara/context/HADARA_CONTEXT.md` the compact current-state entry point and clarify that full historical `PROJECT_STATE` review is not mandatory every session. | Done | Root tier guidance text. |
| AC-3 | Root docs state historical/superseded docs are never default required reading. | Done | Root tier guidance text. |
| AC-4 | Generated init docs include the same semantic tier guidance. | Done | `src/cli/init.ts` generated `AGENTS.md`, SOP, and workflow docs. |
| AC-5 | Focused tests prove root/generated docs include the tier guidance. | Done | `ev:T-0307:e734ee5805dd4a63a0fb1e73` |
| AC-6 | Evidence is attached and handoff/state docs are updated before close. | Done | `ev:T-0307:e734ee5805dd4a63a0fb1e73`; shared docs updated for T-0307/T-0308 handoff. |
