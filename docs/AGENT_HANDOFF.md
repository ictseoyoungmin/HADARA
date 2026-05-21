# AGENT_HANDOFF

## Current Branch

TBD.

## Last Completed

- Generated HADARA bootstrap skeleton repository.
- Added TypeScript/Node project structure.
- Added seed CLI commands: init, doctor, task, evidence, handoff, policy, hermes, mcp, run stub.
- Added MockProvider and tests.
- Added docs and initial Task Capsules.

## In Progress

- Phase 1: HADARA Seed CLI.
- Focus: make HADARA manage its own development state before implementing full coding-agent behavior.

## Do Not Change Without Updating Tests

- `src/providers/provider-contract.ts`
- `src/core/paths.ts`
- `src/task/task-capsule.ts`
- `src/policy/policy.ts`

## Known Problems

- Dashboard is not implemented.
- Real provider adapters are not implemented.
- MCP server is a stub.
- `policy check-shell` parser is intentionally minimal and should be replaced with a real command parser.

## Next Recommended Step

1. Run `npm install`.
2. Run `npm run check`.
3. Create a new task for the first real implementation slice.
4. Update this handoff before stopping.

## Evidence

- `tests/unit`
- `tests/contract`
- `tests/harness`
