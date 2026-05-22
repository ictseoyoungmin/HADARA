# Files

| Path | Action | Reason |
|---|---|---|
| src/cli/main.ts | Update | Delegate remaining command groups to focused modules. |
| src/cli/init.ts | Update | Own init CLI handling. |
| src/cli/doctor.ts | Update | Own doctor CLI output and exit code behavior. |
| src/cli/task.ts | Add | Own task create/list/show CLI behavior. |
| src/cli/mcp.ts | Add | Own MCP placeholder CLI behavior. |
| src/cli/run.ts | Add | Own run and run scaffold CLI behavior plus run helper exports. |
| tests/unit/run-cli.test.ts | Update | Import run helpers from focused run module. |
| tasks/T-0036-cli-remaining-handler-extraction/* | Add/Update | Track task capsule, evidence, and handoff. |
| docs/TASK_BOARD.md | Update | Track T-0036 status. |
| docs/PROJECT_STATE.md | Update | Record completed CLI handler extraction pass. |
| docs/DEVELOPMENT_SLICES.md | Update | Track extraction completion. |
| docs/AGENT_HANDOFF.md | Update | Refresh next-session handoff. |
