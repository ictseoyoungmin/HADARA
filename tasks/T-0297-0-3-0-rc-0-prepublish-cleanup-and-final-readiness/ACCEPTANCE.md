# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | README package-facing release status and install/npx examples target `hadara@0.3.0-rc.0`. | Done | `README.md`, focused tests. |
| AC-2 | `package.json` includes accurate npm discovery metadata without overclaiming runtime scope. | Done | `package.json`, release artifact tests. |
| AC-3 | README primary lifecycle excludes `task complete`; `task complete` is documented separately as optional read-only workflow compression. | Done | `README.md`, focused tests. |
| AC-4 | T-0296 task-local handoff reflects Done / closed and points to operator publish helper as the next step. | Done | `tasks/T-0296.../HANDOFF.md`, T-0296 ready/close/audit. |
| AC-5 | Duplicate Phase 7 bundle specs are removed; canonical specs remain under `docs/specs/0.3.0/`. | Done | `.gitignore`, deleted `docs/specs/phase7_surface_refactor/`. |
| AC-6 | Final readiness checks pass without npm publish, GitHub Release, Docker image publish, registry mutation, or token value capture. | Done | T-0297 focused/Docker/package/clean-checkout/release evidence records. |
| AC-7 | Operator publish instructions identify the repo root and exact npm login/helper commands. | Done | T-0297 handoff and final response. |
| AC-8 | Post-publish npm registry verification confirms `hadara@0.3.0-rc.0` exists. | Done | `npm view hadara@0.3.0-rc.0 version` returned `0.3.0-rc.0`; registry time/dist-tag check returned publish time and latest tag. |
