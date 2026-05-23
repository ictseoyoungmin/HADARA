# Files

| Path | Action | Reason |
|---|---|---|
| src/mcp/tool-schemas.ts | Update | Add write-capable evidence attach metadata for opt-in registry use. |
| src/mcp/tool-registry.ts | Update | Register `hadara.evidence.attach` only when explicitly enabled. |
| src/mcp/server.ts | Update | Carry evidence attach enablement through server options. |
| src/cli/mcp.ts | Update | Add explicit opt-in CLI flag. |
| src/cli/main.ts | Update | Help text for explicit opt-in flag. |
| tests/contract/mcp-evidence-attach-guard.test.ts | Update | Confirm default hidden and opt-in advertised/writable behavior. |
| docs/MCP_EVIDENCE_ATTACH_CONTRACT.md | Update | Record explicit opt-in runtime flag. |
| docs/TASK_BOARD.md | Update | Track T-0048 status. |
| docs/DEVELOPMENT_SLICES.md | Update | Record T-0048 completion state when done. |
| docs/PROJECT_STATE.md | Update | Record gated evidence attach implementation when done. |
| docs/AGENT_HANDOFF.md | Update | Refresh next-session handoff. |
| tasks/T-0048-gated-mcp-evidence-attach-implementation/* | Add/Update | Track task capsule and evidence. |
