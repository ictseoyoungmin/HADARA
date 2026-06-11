# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | README package-facing release status and install/npx examples target `hadara@0.3.0-rc.0`. | Pending | `README.md`, focused tests. |
| AC-2 | `package.json` includes accurate npm discovery metadata without overclaiming runtime scope. | Pending | `package.json`, release artifact tests. |
| AC-3 | README primary lifecycle excludes `task complete`; `task complete` is documented separately as optional read-only workflow compression. | Pending | `README.md`, focused tests. |
| AC-4 | T-0296 task-local handoff reflects Done / closed and points to operator publish helper as the next step. | Pending | `tasks/T-0296.../HANDOFF.md`, T-0296 ready/close/audit. |
| AC-5 | Duplicate Phase 7 bundle specs are removed; canonical specs remain under `docs/specs/0.3.0/`. | Pending | `git status`, `rg phase7_surface_refactor`. |
| AC-6 | Final readiness checks pass without npm publish, GitHub Release, Docker image publish, registry mutation, or token value capture. | Pending | T-0297 evidence records. |
| AC-7 | Operator publish instructions identify the repo root and exact npm login/helper commands. | Pending | T-0297 handoff/final response. |
