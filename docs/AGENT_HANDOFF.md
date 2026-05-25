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
- T-0077 is complete: read-only MCP `hadara.context.export` now returns `hadara.context.export.v1` as an in-memory payload with `contextPath: null` and no `.hadara/context/HADARA_CONTEXT.md` mutation; CLI `hadara hermes export-context` remains the file-writing path. Context export includes `docs/IMPLEMENTATION_SOP.md` as the authoritative workflow source and warns with `SUMMARY_ONLY_NOT_IMPLEMENTED` when `summaryOnly` is requested.
- T-0078 is complete: tools discovery now uses a neutral capability registry, shared `hadara.tools.list.v1`, `hadara tools list --json`, and read-only MCP `hadara.tools.list`, reporting fuller CLI/MCP surfaces, `availability`/`risk` metadata, opt-in evidence attach, and disabled shell/provider/release/broad-write MCP surfaces.
- T-0079 is complete: schema layer planning now has `docs/SCHEMAS.md`, `src/schemas/schema-index.json`, and initial JSON Schema fixtures for stable read models; broad runtime schema validation and release gates remain deferred.
- T-0080 is complete: task list/show/read report logic now lives in shared `src/services/task-read-model.ts`, CLI task JSON imports remain compatible, and read-only MCP task list/read route through the shared service with parity coverage.
- T-0081 is complete: policy check/evaluate report logic now lives in shared `src/services/policy-service.ts`, CLI policy JSON imports remain compatible, and CLI preflight plus read-only MCP policy evaluate route through the shared service with parity coverage.
- T-0082 is complete: cleanup follow-up notes now document redaction policy observability, schema strictness levels, task.read embedded evidence normalization, and PolicyService authorization limitations; `createPolicyCheckReport()` now accepts string/default mode input consistently with policy evaluate.
- T-0083 is complete: `task.read` embedded evidence now reuses evidence-list normalization for `evidenceIndex` and `files["evidence.jsonl"]`, stripping private paths and unknown fields, dropping taskId mismatches, warning on malformed lines, and redacting summaries.
- T-0084 is complete: harness validate report access now lives behind shared `src/services/harness-service.ts`, with CLI `harness validate` and read-only MCP `hadara.harness.validate` routed through it. MCP `hadara.task.read` now excludes private evidence metadata by default and supports explicit `includePrivate`; `files["evidence.jsonl"]` is documented as a sanitized read-model view.
- T-0085 is complete: Operations Status JSON report access now lives behind shared `src/services/operations-status-service.ts`, with CLI `hadara status` and `hadara ops status` routed through it while `src/cli/status-json.ts` remains a compatibility export.
- T-0086 is complete: active-run read surfaces now include CLI `hadara run-state show --json`, CLI `hadara run-state resume --json`, read-only MCP `hadara.active.run.read`, and read-only MCP `hadara.active.run.resume`; active-run writes remain deferred.
- T-0087 is complete: operational debt read surfaces now include CLI `hadara debt list/show --json`, read-only MCP `hadara.debt.list/show`, Operations Status debt aggregate counts, and read-only `hadara release gate --mode advisory|strict --json` checks for open high-severity debt.
- T-0088 is complete: active-run resume guidance now canonicalizes Task Capsule paths from `taskId`, warns with `ACTIVE_RUN_CAPSULE_MISMATCH` on stale manifest capsule paths, registers active-run projection/resume schema fixtures, and clarifies `run-state resume` as read-only guidance.
- T-0089 is complete: public evidence artifact policy now has safe internal observability via `hadara.evidence_artifact_policy.v1`, reporting redaction pattern ids, severities, counts, and byte counts while keeping medium diagnostics non-blocking and high/critical findings blocking.
- T-0090 is complete: shell policy internals now split tokenizer, exact safe presets, command-risk classification, and permission-matrix decisions while preserving existing public imports. Release-risk commands are denied outside release mode and require explicit approval in release mode; auto/trusted network-risk commands require approval. Strict release-gate CLI failures now set exit code 6.
- T-0091 is complete: private evidence with readable source artifacts now writes raw bytes only to the ignored private portable store, records `hadara.privateEvidence.v1` manifests with SHA-256 hashes, retention, byte counts, and deferred encryption metadata, audits manifest writes privately, and keeps committed Task Capsule files plus context export free of private raw content, source paths, and private store paths.
- T-0092 is complete: active-run projection/resume reports now validate against registered runtime schemas via `src/core/schema.ts`, and malformed active-run local state still degrades to schema-valid warning reports.
- T-0093 is complete: policy matrix/release-gate feedback was verified against current code; production policy behavior was already present, and strict release-gate exit-code regression coverage was sharpened.
- T-0094 is complete: private evidence source artifact copying is project-boundary-limited by default, `hadara evidence collect` accepts `--visibility public|private`, active-run schema/report failure warnings are split by code, and `hadara.privateEvidence.v1` plus `hadara.releaseGate.v1` schema fixtures are registered.
- T-0095 is complete: structured `hadara.event.v1` helpers and schema fixture exist, private audit JSONL writes keep existing compatibility fields and embed a nested redacted structured event, and focused event/schema plus full Docker checks passed.
- T-0096 is complete: provider adapter preparation contracts now exist as `hadara.provider.config.v1` and `hadara.provider.call.v1`, with helper APIs that reject stored secret values, omit prompt/response content from call reports, and keep real provider execution deferred.
- Real provider adapters, product-served/live dashboard integration, shell execution, provider calls, and broad write-capable MCP behavior remain deferred.

## Last 3 Completed Tasks

- T-0094 Security Schema Follow-up Cleanup: limited private evidence raw source copying to project-boundary files, added evidence `--visibility` CLI alias, split active-run warning codes, and added privateEvidence/releaseGate schema fixtures.
- T-0095 Logger and Audit Event Model: added `hadara.event.v1` helpers/schema and embedded structured redacted events into existing private audit JSONL records without breaking compatibility fields.
- T-0096 Real Provider Adapter Preparation: added provider config/call schema fixtures and preparation helpers without real provider SDKs, network calls, secret loading, or provider execution surfaces.

## Current Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.
- Policy parser is intentionally minimal; it is safer than before, but not a full POSIX or PowerShell parser.
- Private evidence encryption remains deferred; private evidence manifests record this explicitly.

## Next Recommended Step

1. Use `docker exec hadara-dev ... node dist/cli/main.js task create "<title>" --project /workspace` for the next new capsule. The next roadmap slice is Dashboard Read Integration, limited to local read APIs over existing read models with no shell execution, provider calls, live streaming, or write behavior.
2. Keep default MCP startup read-only; `hadara.evidence.attach` remains opt-in with `--enable-evidence-attach`, requires per-call approval metadata, and audits write attempts privately.
3. Keep shell execution, provider calls, live dashboard streaming, multi-agent concurrency, and broad write-capable MCP behavior deferred.

## Validation Baseline

- Use Docker validation by copying the repo into the container filesystem before `npm ci`.
- Latest focused provider/schema check: Docker `npx vitest run tests/contract/provider-preparation.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts` passed with 3 files and 13 tests.
- Latest full check: Docker `npm run check` passed with 39 test files and 245 tests after T-0096.
- Latest done-level validation: Reusable container `node dist/cli/main.js harness validate --task T-0096 --level done --json --project /workspace` returned `ok: true`.
- Latest reusable container check: `docker ps --filter name=^/hadara-dev$` showed `hadara-dev` running.

## Historical Index

- Completed task history: `docs/HANDOFF_HISTORY.md`
- Validation history: `docs/VALIDATION_HISTORY.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`
