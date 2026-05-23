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
- T-0050, T-0051, and T-0052 are complete: opt-in MCP evidence attach write attempts are privately audited, initialize metadata reflects read-only vs evidence attach-enabled mode, and each evidence attach call requires approval actor/reason metadata.
- Real provider adapters, dashboard, shell execution, provider calls, and broad write-capable MCP behavior remain deferred.

## Last 3 Completed Tasks

- T-0050 MCP Write Audit Log: audited opt-in MCP evidence attach success and report-level failure attempts to the private portable audit store.
- T-0051 MCP Phase/Mode Config: aligned MCP initialize metadata and instructions with default read-only and evidence attach-enabled modes.
- T-0052 MCP Evidence Attach Approval Record: required per-call approval actor/reason for opt-in MCP evidence attach writes and recorded approval metadata in audit events.

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
2. Keep default MCP startup read-only; `hadara.evidence.attach` remains opt-in with `--enable-evidence-attach`, requires per-call approval metadata, and audits write attempts privately.
3. Keep shell execution, provider calls, and broad write-capable MCP behavior deferred.

## Validation Baseline

- Use Docker validation by copying the repo into the container filesystem before `npm ci`.
- Latest full check: Docker `npm ci && npm run check` passed with 27 test files and 142 tests after T-0052.
- Latest focused MCP check: Docker MCP guard, safety, and server metadata suites passed with 20 tests after T-0052.
- Latest done-level validation: Docker `node dist/cli/main.js harness validate --task T-0050 --level done --json`, `--task T-0051 --level done --json`, and `--task T-0052 --level done --json` returned `ok: true`.

## Historical Index

- Completed task history: `docs/HANDOFF_HISTORY.md`
- Validation history: `docs/VALIDATION_HISTORY.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`
