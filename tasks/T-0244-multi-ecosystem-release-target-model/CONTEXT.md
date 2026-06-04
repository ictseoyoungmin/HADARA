# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and release/package boundaries. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and release evidence refresh warning. | Read |
| docs/TASK_BOARD.md | Task queue and T-0244 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation preference. | Read |
| docs/RELEASE_READINESS.md | Release target decisions, publish/deploy boundary, and evidence freshness contract. | Read |
| docs/SCHEMAS.md | Runtime schema documentation for package-smoke and release dry-run reports. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| HADARA's only executable package smoke provider today is npm. | Current `package-smoke` implementation runs `npm pack` and `npm install -g --prefix`. | Overstating Python/Rust/Docker support would mislead operators. |
| Python support should be read-only preview only in this capsule. | Reviewer feedback and current release mutation boundary. | Adding build/publish behavior would expand risk without provider-specific design. |
| Existing release target compatibility fields should remain. | `hadara.releaseDryRun.v1` consumers already know `primary`, `secondary`, and `dockerImage`. | Removing them would break downstream tools while adding descriptors. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No registry, GitHub, Docker, or PyPI mutation. | Release readiness boundary. | This capsule only changes read models, schema, tests, and docs. |
| Keep historical package-smoke evidence compatible. | Evidence v2 compatibility and release proof readers. | New provider metadata must not invalidate existing evidence records. |
| Prefer Docker validation and refresh `dist`. | AGENTS.md workflow. | Use `npm run dev:docker-check` and `npm run dev:docker-sync-build`. |
