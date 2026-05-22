# AGENT_HANDOFF

## Current State

- Current branch: main.
- CLI dispatcher extraction pass is complete.
- Runtime validation hardening is complete for permission modes, evidence result enums, fake-shell failure semantics, stale scaffold reuse, task title parsing, JSON-mode error envelopes, and policy safe command exactness.
- Old Draft task cleanup is complete: T-0003 is Superseded, and T-0006 is Partial with remaining bridge/server work moved to the Hermes/MCP roadmap.
- Real provider adapters, dashboard, and MCP server body remain deferred.

## Last 3 Completed Tasks

- T-0039 Policy Safe Command Exactness: safe shell commands now require exact token matches.
- T-0040 Handoff Compaction Policy: compacted this handoff and moved historical entries into dedicated history docs.
- T-0041 Old Draft Task Reclassification: marked T-0003 Superseded and T-0006 Partial so agents follow the current roadmap.

## Current Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.
- Policy parser is intentionally minimal; it is safer than before, but not a full POSIX or PowerShell parser.
- Evidence Store copies public attached artifacts into Task Capsule managed storage, but does not yet encrypt private evidence.

## Next Recommended Step

1. Continue with the Hermes/MCP bridge expansion roadmap slice.
2. Continue deferring dashboard, real provider adapters, MCP server body, and full agent controller until harness/policy/evidence gates are stronger.

## Validation Baseline

- Use Docker validation by copying the repo into the container filesystem before `npm ci`.
- Latest full check: Docker `npm ci && npm run check` passed with 22 test files and 109 tests during T-0041.
- Latest done-level validation: Docker `node dist/cli/main.js harness validate --task T-0041 --level done --json` returned `ok: true`.

## Historical Index

- Completed task history: `docs/HANDOFF_HISTORY.md`
- Validation history: `docs/VALIDATION_HISTORY.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`
