# AGENT_HANDOFF

## Current State

- Current branch: main.
- CLI dispatcher extraction pass is complete.
- Runtime validation hardening is complete for permission modes, evidence result enums, fake-shell failure semantics, stale scaffold reuse, task title parsing, JSON-mode error envelopes, and policy safe command exactness.
- Old Draft task cleanup is complete: T-0003 is Superseded, and T-0006 is Partial with remaining bridge/server work moved to the Hermes/MCP roadmap.
- T-0042 is complete with follow-up MCP contract/schema clarifications.
- T-0043 is complete with a stdio JSON-RPC MCP server skeleton for lifecycle/discovery only.
- T-0044 and T-0045 are complete: MCP read tools are implemented and bridge contract tests validate payload wrapping, selected CLI JSON parity, notification handling, and dispatch issue mapping.
- Real provider adapters, dashboard, MCP write tools, and write-capable MCP behavior remain deferred.

## Last 3 Completed Tasks

- T-0043 MCP JSON-RPC Server Skeleton: added `hadara mcp serve` stdio JSON-RPC lifecycle/discovery skeleton with read-only capability metadata and unimplemented tool calls.
- T-0044 MCP Read Tools Implementation: implemented read-only MCP tools for task list/read, handoff read, project state read, policy evaluate, and harness validate.
- T-0045 MCP Bridge Harness Tests: added contract tests for MCP JSON text payload wrapping, selected CLI JSON parity, notification behavior, and dispatch issue mapping.

## Current Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.
- Policy parser is intentionally minimal; it is safer than before, but not a full POSIX or PowerShell parser.
- Evidence Store copies public attached artifacts into Task Capsule managed storage, but does not yet encrypt private evidence.

## Next Recommended Step

1. Continue with T-0046 Evidence Attach Tool Contract.
2. Keep T-0046 contract-only unless a separate accepted implementation capsule is created.
3. Continue deferring dashboard, real provider adapters, MCP write tools, and full agent controller until harness/policy/evidence gates are stronger.

## Validation Baseline

- Use Docker validation by copying the repo into the container filesystem before `npm ci`.
- Latest full check: Docker `npm ci && npm run check` passed with 25 test files and 128 tests after T-0045.
- Latest MCP smoke: Docker built CLI `hadara mcp serve` `tools/call` returned `hadara.task.list` as one MCP JSON text payload after T-0044.
- Latest done-level validation: Docker `node dist/cli/main.js harness validate --task T-0045 --level done --json` returned `ok: true`.

## Historical Index

- Completed task history: `docs/HANDOFF_HISTORY.md`
- Validation history: `docs/VALIDATION_HISTORY.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`
