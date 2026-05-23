# AGENT_HANDOFF

## Current State

- Current branch: main.
- CLI dispatcher extraction pass is complete.
- Runtime validation hardening is complete for permission modes, evidence result enums, fake-shell failure semantics, stale scaffold reuse, task title parsing, JSON-mode error envelopes, and policy safe command exactness.
- Old Draft task cleanup is complete: T-0003 is Superseded, and T-0006 is Partial with remaining bridge/server work moved to the Hermes/MCP roadmap.
- T-0042 is complete with follow-up MCP contract/schema clarifications.
- T-0043 is complete with a stdio JSON-RPC MCP server skeleton for lifecycle/discovery only.
- T-0044 and T-0045 are complete: MCP read tools are implemented and bridge contract tests validate payload wrapping, selected CLI JSON parity, notification handling, and dispatch issue mapping.
- T-0046 and T-0047 are complete: future MCP evidence attach contract is documented, write-tool issue codes are reserved, and guard tests prove evidence attach is not advertised or callable yet.
- T-0048 and T-0049 are complete: `hadara.evidence.attach` is implemented behind explicit `--enable-evidence-attach` opt-in, with safety tests for payload shape, artifact copy, boundary rejection, redaction rejection, and invalid input mapping.
- Real provider adapters, dashboard, shell execution, provider calls, and broad write-capable MCP behavior remain deferred.

## Last 3 Completed Tasks

- T-0047 Evidence Attach Guard Tests: reserved future write-tool issue codes and proved `hadara.evidence.attach` was not advertised or callable before implementation.
- T-0048 Gated MCP Evidence Attach Implementation: implemented `hadara.evidence.attach` behind explicit `--enable-evidence-attach` opt-in.
- T-0049 MCP Evidence Attach Safety Tests: validated evidence attach payloads, artifact copy, workspace boundary rejection, public artifact redaction rejection, and invalid input mapping.

## Current Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.
- Policy parser is intentionally minimal; it is safer than before, but not a full POSIX or PowerShell parser.
- Evidence Store copies public attached artifacts into Task Capsule managed storage, but does not yet encrypt private evidence.

## Next Recommended Step

1. Do a planning/reclassification slice before starting dashboard or real provider adapters.
2. Keep default MCP startup read-only; `hadara.evidence.attach` remains opt-in with `--enable-evidence-attach`.
3. Keep shell execution, provider calls, and broad write-capable MCP behavior deferred.

## Validation Baseline

- Use Docker validation by copying the repo into the container filesystem before `npm ci`.
- Latest full check: Docker `npm ci && npm run check` passed with 27 test files and 137 tests after T-0049.
- Latest MCP smoke: Docker built CLI `hadara mcp serve --enable-evidence-attach` `tools/list` advertised `hadara.evidence.attach` only in opt-in mode after T-0048.
- Latest done-level validation: Docker `node dist/cli/main.js harness validate --task T-0049 --level done --json` returned `ok: true`.

## Historical Index

- Completed task history: `docs/HANDOFF_HISTORY.md`
- Validation history: `docs/VALIDATION_HISTORY.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`
