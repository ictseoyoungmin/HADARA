# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Make root README package-facing for `hadara@0.3.0-rc.0`. | Accepted | npm includes root README, so the package page should not tell users to install the previous RC. | `README.md`, focused tests |
| D-2 | Add accurate npm discovery metadata to root package and release artifact staging. | Accepted | npm package search/page metadata comes from `package.json`; release artifact staging writes a whitelisted package.json and must preserve the same discovery fields. | `package.json`, `src/services/release-artifact.ts`, release artifact tests |
| D-3 | Remove the duplicate Phase 7 bundle tree and keep `docs/specs/0.3.0/` canonical. | Accepted | The bundle duplicated canonical specs and implementation guides; release-facing docs should avoid two active-looking Phase 7 locations. | Deleted `docs/specs/phase7_surface_refactor/`, `.gitignore` |
