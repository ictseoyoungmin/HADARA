# Handoff

## Last Completed

- Extracted init CLI handling into `src/cli/init.ts`.
- Extracted doctor CLI handling into `src/cli/doctor.ts`.
- Extracted task CLI handling into `src/cli/task.ts`.
- Extracted mcp placeholder CLI handling into `src/cli/mcp.ts`.
- Extracted run/run scaffold CLI handling and run helper exports into `src/cli/run.ts`.
- Updated run CLI helper tests to import from `src/cli/run.ts`.
- `src/cli/main.ts` decreased from 332 LOC to 115 LOC.
- Docker `npm ci && npm run check` passed: 21 test files passed, 97 tests passed.
- Built CLI init, doctor, task, mcp, run scaffold, and scaffolded run smokes passed.
- Docker built CLI `harness validate --task T-0036 --level done --json` returned `ok: true`.

## Next Recommended Step

Continue with the next roadmap slice, such as Hermes/MCP bridge expansion.
