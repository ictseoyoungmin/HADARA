# AGENT_HANDOFF

## Current State

- Current branch: main.
- CLI dispatcher extraction pass is complete.
- Runtime validation hardening is complete for permission modes, evidence result enums, fake-shell failure semantics, stale scaffold reuse, task title parsing, JSON-mode error envelopes, and policy safe command exactness.
- Old Draft task cleanup is complete: T-0003 is Superseded, and T-0006 is Partial with remaining bridge/server work moved to the Hermes/MCP roadmap.
- T-0042 is complete with follow-up MCP contract/schema clarifications.
- T-0043 is complete with a stdio JSON-RPC MCP server skeleton for lifecycle/discovery only.
- Real provider adapters, dashboard, MCP read tools, and write-capable MCP behavior remain deferred.

## Last 3 Completed Tasks

- T-0041 Old Draft Task Reclassification: marked T-0003 Superseded and T-0006 Partial so agents follow the current roadmap.
- T-0042 Hermes/MCP Read-Only Contract: documented CLI JSON output policy, read-only MCP bridge tool contract, MCP JSON text payload policy, and task status schema alignment.
- T-0043 MCP JSON-RPC Server Skeleton: added `hadara mcp serve` stdio JSON-RPC lifecycle/discovery skeleton with read-only capability metadata and unimplemented tool calls.

## Current Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.
- Policy parser is intentionally minimal; it is safer than before, but not a full POSIX or PowerShell parser.
- Evidence Store copies public attached artifacts into Task Capsule managed storage, but does not yet encrypt private evidence.

## Next Recommended Step

1. Continue with T-0044 MCP Read Tools Implementation.
2. Keep T-0044 read-only and limited to the tools documented in `docs/MCP_BRIDGE_CONTRACT.md`.
3. Continue deferring dashboard, real provider adapters, MCP write tools, and full agent controller until harness/policy/evidence gates are stronger.

## Validation Baseline

- Use Docker validation by copying the repo into the container filesystem before `npm ci`.
- Latest full check: Docker `npm ci && npm run check` passed with 23 test files and 115 tests after T-0043.
- Latest MCP smoke: Docker built CLI `hadara mcp serve` returned JSON-RPC `initialize` read-only capability metadata.
- Latest done-level validation: Docker `node dist/cli/main.js harness validate --task T-0043 --level done --json` returned `ok: true`.

## Historical Index

- Completed task history: `docs/HANDOFF_HISTORY.md`
- Validation history: `docs/VALIDATION_HISTORY.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`
