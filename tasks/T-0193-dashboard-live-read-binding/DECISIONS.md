# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep T-0193 in the existing static dashboard HTML rather than introducing a frontend build. | Accepted | The spec recommends static first, and the slice only needs live/fallback binding plus provenance. | `docs/specs/dashboard/HADARA_Dashboard_Phase5_Development_Plan.md` section 16. |
| D-2 | Label the manual refresh control `Refresh Status`. | Accepted | The control must read status again only and must not imply checks, sync, evidence refresh, or remediation. | `docs/DASHBOARD_READ_MODEL_CONTRACT.md` Phase 5 live binding section. |
