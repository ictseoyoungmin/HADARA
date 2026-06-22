# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | PatternForge findings and stable decision input are copied into the capsule. | Met | `tasks/T-0404-0-3-3-dogfood-findings-release-hardening/artifacts/patternforge/` |
| AC-2 | PF-F-012 has a regression fix for cached Task Board node classification. | Met | `src/context/state-projection.ts`, `tests/unit/context-state-projection.test.ts` |
| AC-3 | PF-F-010 has a regression fix for warning-only post-close handoff next actions. | Met | `src/services/workbench-next-actions.ts`, `tests/unit/workbench-next-actions.test.ts` |
| AC-4 | Focused validation passes and evidence is attached. | Met | `ev:T-0404:b6deb46e7b9d4a3283f88d57` |
| AC-5 | Shared state docs and handoff are updated before finalize. | Met | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md` |
