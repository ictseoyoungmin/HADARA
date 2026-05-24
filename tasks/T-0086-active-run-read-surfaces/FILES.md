# Files

| Path | Action | Reason |
|---|---|---|
| `src/cli/run-state.ts` | Add | CLI read-only active-run projection command. |
| `src/cli/main.ts` | Update | Dispatch `hadara run-state show`. |
| `src/services/active-run-state.ts` | Update | Add read-only resume guidance report derived from the projection. |
| `src/services/capability-registry.ts` | Update | Register active-run CLI/MCP read surfaces. |
| `src/mcp/tool-registry.ts` | Update | Dispatch new active-run read-only MCP tools. |
| `docs/CLI_JSON_CONTRACT.md` | Update | Mark active-run projection read surface as implemented. |
| `docs/MCP_BRIDGE_CONTRACT.md` | Update | Add active-run read/resume tool contracts. |
| `tests/unit/active-run-state.test.ts` | Update | Cover resume guidance report and CLI show command. |
| `tests/unit/mcp-tools.test.ts` | Update | Cover MCP active-run tools. |
| `tests/unit/tools-list.test.ts` | Update | Cover capability discovery for active-run surfaces. |
| `tests/contract/mcp-bridge-contract.test.ts` | Update | Compare MCP active-run read payload to the shared service. |
| `tasks/T-0086-active-run-read-surfaces/*` | Update | Track task scope, evidence, and handoff. |
| `docs/TASK_BOARD.md` | Update | Track T-0086 status. |
| `docs/PROJECT_STATE.md` | Update | Record new active-run read surfaces. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark active-run read-surface slice progress. |
| `docs/AGENT_HANDOFF.md` | Update | Refresh next-session handoff. |
