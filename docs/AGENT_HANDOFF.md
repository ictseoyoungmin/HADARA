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
- T-0057 is complete: comfort dark mockup is promoted to dashboard visual baseline, with `docs/design/dashboard/index.html` binding values from `hadara.ops.status.v1` fixture/fallback data and retaining static boundary tests.
- T-0058 is complete: static dashboard fixture binding smoke coverage verifies `data-field` attributes map to fixture-backed or derived `hadara.ops.status.v1` values.
- T-0059 is complete: `hadara dashboard serve` serves the static sample-backed dashboard and fixture through allowlisted routes.
- T-0060 is complete: dashboard serving is hardened with GET/HEAD-only responses, basic security headers, and traversal-like route regressions.
- T-0061 is complete: `evidence.jsonl` validation now rejects missing `time`, `summary`, and `visibility`, and recent dashboard timestamp-only evidence records were migrated to canonical `time`.
- T-0062 is complete: static dashboard server failures now return safe 404/500 responses for missing roots/files and unexpected static response generation errors.
- T-0063 is complete: `docs/ARCHITECTURE.md` and `docs/ROADMAP.md` now distinguish implemented, partial, and deferred capabilities in line with `docs/PROJECT_STATE.md`.
- T-0064 is complete: `docs/ROADMAP.md` now freezes v0.3 as the current read-only Operations Layer, lists explicit in/out-of-scope boundaries, separates v0.3-v1.0 candidate scopes, and adds an Operational Debt Track.
- T-0065 is complete: context export now includes roadmap/slice ordering and instructs external agents to prefer HADARA CLI JSON or read-only MCP surfaces before falling back to raw repository documents.
- T-0066 is complete: a Hermes-like compatibility fixture now replays exported context expectations and read-only MCP calls for project/task/handoff/policy/harness state, while proving write/execution-like MCP tools remain unavailable.
- T-0067 is complete: project/handoff read-model logic now lives in a shared service used by Operations Status JSON and MCP project/handoff tools, with parity tests against shared services and CLI/domain report builders.
- T-0068 is complete: single active run state now uses `.hadara/local/state/active-run.json`, exposes an Operations Status JSON projection, provides resume guidance, and warns when handoff omits the active task id.
- T-0069 is complete: `known_issue.log` themes now exist as structured operational debt records with capsule size indicators and premature acceptance warning checks.
- T-0070 is complete: operations state robustness now degrades malformed active run local state into status warnings, reports missing active Task Capsules, validates evidence records for premature acceptance, and matches shared Markdown sections by heading line.
- T-0071 is complete: reusable Docker workflow is documented, `hadara-dev` is running, and new Task Capsules should be created through HADARA CLI by default.
- V1.0 planning is now split into concrete implementation references: `docs/V1_0_CAPSULE_BACKLOG.md` tracks future capsule candidates and `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` preserves detailed schema/file/test notes from the v1.0 technical plan.
- T-0072 is complete: v1.0 planning docs now explicitly separate T-0066 through T-0070 current implementation from future expansion targets, including fixture location, service parity scope, active-run schema/path, debt persistence caveats, and degraded-read robustness scope.
- T-0074 is complete: redaction now uses a registry/report model with pattern ids, severities, byte counts, finding counts, and broader high-risk token coverage while preserving existing evidence/audit redaction APIs.
- T-0075 is complete: public evidence artifact policy now uses `hasBlockingRedactionFinding(report, 'high')`, `containsSecret()` remains an any-finding compatibility wrapper, redaction count overlap semantics are documented, blocking policy errors retain internal redaction reports without exposing them in evidence collect output, non-blocking findings are diagnostics only, future active-run MCP tool names use dot-separated segments, and context export MCP planning shows memory-mode output with `contextPath: null`.
- T-0076 is complete: evidence list reads now use shared `hadara.evidence.list.v1`, `hadara evidence list --json`, and read-only MCP `hadara.evidence.list`, with malformed JSONL degraded to warning issues, normalized output records, private path stripping, defensive summary redaction, and taskId mismatch drops.
- Real provider adapters, product-served/live dashboard integration, shell execution, provider calls, and broad write-capable MCP behavior remain deferred.

## Last 3 Completed Tasks

- T-0074 Redaction Hardening: added a redaction registry/report model and broader public evidence secret detection.
- T-0075 Redaction Policy Follow-up: separated redaction reports from public artifact policy blocking, added internal policy-error redaction reports, and aligned MCP planning names.
- T-0076 Evidence List Read Model: added shared evidence list report builder, CLI JSON, read-only MCP evidence list degraded reads, and hotfix normalization for external read safety.

## Current Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.
- Policy parser is intentionally minimal; it is safer than before, but not a full POSIX or PowerShell parser.
- Evidence Store copies public attached artifacts into Task Capsule managed storage, but does not yet encrypt private evidence.

## Next Recommended Step

1. Use `docker exec hadara-dev ... node dist/cli/main.js task create "<title>" --project /workspace` for the next new capsule, then continue the next P0 slice from `docs/V1_0_CAPSULE_BACKLOG.md`; Context Export MCP Read Tool is next.
2. Keep default MCP startup read-only; `hadara.evidence.attach` remains opt-in with `--enable-evidence-attach`, requires per-call approval metadata, and audits write attempts privately.
3. Keep shell execution, provider calls, live dashboard streaming, multi-agent concurrency, and broad write-capable MCP behavior deferred.

## Validation Baseline

- Use Docker validation by copying the repo into the container filesystem before `npm ci`.
- Latest full check: Docker `npm run check` passed with 34 test files and 192 tests after the T-0076 read-safety hotfix.
- Latest reusable container check: `docker ps --filter name=^/hadara-dev$` showed `hadara-dev` running.
- Latest done-level validation: Reusable container `node dist/cli/main.js harness validate --task T-0076 --level done --json --project /workspace` returned `ok: true`.

## Historical Index

- Completed task history: `docs/HANDOFF_HISTORY.md`
- Validation history: `docs/VALIDATION_HISTORY.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`
