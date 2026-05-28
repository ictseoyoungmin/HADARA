# Context

Required reading completed:

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/TEST_STRATEGY.md`
- `docs/RELEASE_READINESS.md`
- Local supporting plan section `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` for T-0135

Current baseline:

- T-0134 added explicit local package smoke execution with isolated prefix install and reduced reports.
- T-0135 is source-checkout smoke, not installed CLI/package smoke.
- Source-checkout validation may use `node dist/cli/main.js` as an internal fallback until installer/package surfaces exist.

User constraints acknowledged:

- Keep user-facing language as "isolated prefix install" for T-0134 package smoke; `npm install -g --prefix` is an npm implementation detail, not system global install.
- Raw/private command log retention for package/install smoke should be handled in T-0136, not widened here.
- `--keep-temp` may leave temporary package/checkouts locally; public reports must keep paths redacted and docs must treat retained content as local/private only and not committed.
