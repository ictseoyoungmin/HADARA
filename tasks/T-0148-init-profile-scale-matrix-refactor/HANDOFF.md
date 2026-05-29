# Handoff

## Last Completed

`hadara init` profiles were refactored into scale-based profiles:

- `basic`: core session docs only.
- `standard`: default; adds architecture, development slices, decisions, and test strategy.
- `governed`: adds security model, refactor log, and roadmap for long-lived operational projects.

Generated `docs/IMPLEMENTATION_SOP.md` and `AGENTS.md` are now profile-aware, so smaller profiles do not require missing optional docs. Unsupported profile names are rejected, and old init profile-name references were removed from code/docs outside excluded backlog files. Root `docs/IMPLEMENTATION_SOP.md` now uses the same generalized profile model and records HADARA-dev as governed.

Validation recorded:

- Focused Docker `npx vitest run tests/unit/init.test.ts` passed with 1 file and 8 tests.
- Docker `npm run check` passed with 57 files and 410 tests.
- Built CLI init smoke passed for `basic`, default `standard`, and `governed`.
- Built CLI smoke confirmed unsupported profile rejection.
- Docker grep check found no old init profile-name references outside excluded backlog files.
- Done-level harness validation passed for T-0148 with `ok: true` and no issues.
- Final clean-copy validation repeated full check, init smoke, grep check, and done-level harness after compatibility aliases were removed.

## Next Recommended Step

Consider a later docs-registration design if manually adding project-specific SOP required-reading rows becomes repetitive. Keep using the smallest init profile that matches the target project's actual scale.
