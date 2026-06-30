# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Implemented shared legacy mutation boundary for missing/non-0.4 scaffold metadata and wired it into representative 0.4 mutation CLI surfaces. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| Added generic `.hadara/scaffold.json` for HADARA-dev dogfood so the repository follows the same supported-project rule as normal 0.4 projects. | ev:T-0440:ced75760191e43c8aa18b42a |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open T-04A14 Session Start Read-Map Integration. | T-04A13 legacy mutation blocking is implemented; next 0.4 budget item makes session start consume docs read-map and source-document drift. | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md; docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The legacy boundary is enforced at CLI mutation entry points, while some low-level service helpers still support isolated unit-test temp projects. | Internal test/helper callers can bypass the CLI boundary if used directly. | Keep user-facing mutation behavior on CLI paths; add service-level guards only if a future non-CLI write surface exposes these helpers. |
| `.hadara/scaffold.json` is now required for HADARA-dev to dogfood 0.4 mutation commands. | Removing it will block evidence append, task create, and other guarded mutations in this repo. | Treat scaffold metadata as committed project state, not local machine state. |
