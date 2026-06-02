# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_6_UIUX_Reset_Proposal.md | Phase 5.6 UI/UX reset scope and capsule sequence. | Read |
| docs/DASHBOARD_DESIGN_LANGUAGE.md | Design tokens, scales, components, states. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard read-only/cache/provenance contract. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 5.5 aggregate read models (bootstrap/task-detail/timeline) are stable and authoritative. | T-0197–T-0206 (Done). | A UI-only rebuild would need backend changes it must not make. |
| The UI layer consumes those read models and adds no backend authority or mutation. | Phase 5.6 proposal, governance boundaries. | Any new authority would break the read-only contract. |
| Build deps (esbuild/preact) run via Docker / off-mount node_modules because the NTFS workspace cannot host an npm install. | Observed EPERM on /mnt/f. | In-place `npm install` fails; build must resolve deps via DASH_DEPS/Docker. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Dashboard remains read-only; commands are copy-only. | docs/DASHBOARD_READ_MODEL_CONTRACT.md | The UI never executes anything. |
| No browser-persisted project state. | Phase 5.5/5.6 boundaries. | No localStorage/sessionStorage/indexedDB/cookies. |
| Single self-contained asset under existing CSP. | src/cli/dashboard.ts security headers. | All JS/CSS inline; no external/CDN resources. |
| Use Docker for build and validation. | AGENTS.md / docs/IMPLEMENTATION_SOP.md | scripts/dashboard-build.sh and Docker npm ci/build/vitest. |
