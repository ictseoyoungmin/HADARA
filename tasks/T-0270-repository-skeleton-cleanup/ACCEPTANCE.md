# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Root bootstrap launchers `START.bat`, `start.sh`, `hadara`, and `hadara.cmd` are removed. | Done | File deletion diff. |
| AC-2 | Hermes/.hadara context files and examples remain in place. | Done | `.hermes.md`, `HERMES.md`, `.hadara/context/HADARA_CONTEXT.md`, and `examples/*` inventory check passed. |
| AC-3 | Active README/runtime/package references do not depend on the deleted root launchers. | Done | Focused reference search found only portable/historical references outside T-0270 docs. |
| AC-4 | Package publish surface remains unchanged by the cleanup. | Done | Package metadata check and `/tmp` cache `npm pack --dry-run --json` passed. |
| AC-5 | Evidence and handoff/state updates are recorded. | Done | `ev:T-0270:96f9665807e542c28b2a462b`; docs updated. |
