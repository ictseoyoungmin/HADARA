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
- T-0053 is complete: `hadara status --json` and `hadara ops status --json` provide a dashboard/external-agent Operations Status JSON snapshot, with design mockups documented as reference-only.
- T-0054 is complete: Operations Status JSON now reports degraded-source warning issues, stable task counts, raw status counts, explicit phase parsing, and validation history fallback.
- T-0055 is complete: Dashboard read model contract maps dashboard cards/panels to `hadara.ops.status.v1`, adds `health`, true raw status counts, normalized status counts, and a sample fixture.
- T-0056 is complete: minimal static dashboard reference consumes the sample status fixture with an inline fallback and keeps backend, live CLI, MCP, file writes, and build steps out of scope.
- Real provider adapters, dashboard, shell execution, provider calls, and broad write-capable MCP behavior remain deferred.

## Last 3 Completed Tasks

- T-0054 Operations Status JSON Cleanup: hardened warnings, stable counts, raw status counts, phase parsing, and validation fallback.
- T-0055 Dashboard Read Model Contract: documented dashboard field mapping, empty/degraded behavior, status semantics, mockup mapping, and sample fixture.
- T-0056 Minimal Static Dashboard: added static Operations Home dashboard, non-live sample fixture metadata, inline fallback, and static scope smoke tests.

## Current Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.
- Policy parser is intentionally minimal; it is safer than before, but not a full POSIX or PowerShell parser.
- Evidence Store copies public attached artifacts into Task Capsule managed storage, but does not yet encrypt private evidence.

## Next Recommended Step

1. Continue with T-0057 Dashboard Fixture Smoke before CLI serving or live integrations.
2. Keep default MCP startup read-only; `hadara.evidence.attach` remains opt-in with `--enable-evidence-attach`, requires per-call approval metadata, and audits write attempts privately.
3. Keep shell execution, provider calls, and broad write-capable MCP behavior deferred.

## Validation Baseline

- Use Docker validation by copying the repo into the container filesystem before `npm ci`.
- Latest full check: Docker `npm ci && npm run check` passed with 29 test files and 150 tests after T-0056.
- Latest static dashboard smoke: Docker `npm test -- tests/unit/dashboard-static.test.ts tests/unit/status-json.test.ts` passed with 2 test files and 8 tests.
- Latest done-level validation: Docker `node dist/cli/main.js harness validate --task T-0056 --level done --json` returned `ok: true`.

## Historical Index

- Completed task history: `docs/HANDOFF_HISTORY.md`
- Validation history: `docs/VALIDATION_HISTORY.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`
