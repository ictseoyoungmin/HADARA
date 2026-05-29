# Files

| Path | Action | Reason |
|---|---|---|
| `src/cli/init.ts` | Modified | Replace primary init profiles with scale-based `basic`, `standard`, and `governed`; generate docs/SOP/AGENTS by profile. |
| `src/cli/main.ts` | Modified | Update CLI help profile names. |
| `src/services/capability-registry.ts` | Modified | Update tools/capability surface profile names. |
| `tests/unit/init.test.ts` | Modified | Cover scale profiles, unsupported profile rejection, profile-aware SOP/AGENTS generation, and root SOP alignment. |
| `docs/IMPLEMENTATION_SOP.md` | Modified | Generalize profile matrix and classify HADARA-dev as governed. |
| `docs/PROJECT_STATE.md` | Modified | Record new profile model and compatibility aliases. |
| `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` | Modified | Update v1.0 checklist to prefer governed profile. |
| `docs/TASK_BOARD.md` | Modified | Track T-0148 status. |
| `docs/DEVELOPMENT_SLICES.md` | Modified | Track T-0148 slice completion. |
| `docs/AGENT_HANDOFF.md` | Modified | Refresh handoff and validation baseline before stopping. |
| `tasks/T-0148-init-profile-scale-matrix-refactor/*` | Added/Modified | Capture task scope, decisions, risks, evidence, and handoff. |
