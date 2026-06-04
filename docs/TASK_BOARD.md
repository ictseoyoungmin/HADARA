# TASK_BOARD

| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
| T-0001 | Bootstrap repository skeleton | Done | tasks/T-0001-bootstrap-repository-skeleton | Initial skeleton generated. |
| T-0002 | Implement Config and Path Resolver | Done | tasks/T-0002-config-and-path-resolver | realpath containment, env priority, Windows normalization, and data boundary hardened. |
| T-0003 | Expand CLI Command Specification | Superseded | tasks/T-0003-cli-command-specification | Superseded by T-0011~T-0039 CLI JSON, strict args, handler extraction, and runtime hardening work. |
| T-0004 | Implement ProviderClient Contract | Done | tasks/T-0004-providerclient-contract | ScriptedProvider and provider contract metadata added. |
| T-0005 | Implement Evidence Store | Done | tasks/T-0005-evidence-store | Markdown plus JSONL evidence index and private/public split added. |
| T-0006 | Implement Hermes Agent Compatibility | Partial | tasks/T-0006-hermes-agent-compatibility | Detect/export-context implemented; remaining bridge/server scope continues under Hermes/MCP bridge TBD slice. |
| T-0007 | Bootstrap Validation Pass | Done | tasks/T-0007-bootstrap-validation-pass | Docker npm ci/check and seed CLI loop passed. |
| T-0008 | Policy Evaluator Shell Parser | Done | tasks/T-0008-policy-evaluator-shell-parser | Tokenizer, safe allowlist, and dangerous command tests added. |
| T-0009 | Harness Validate JSON | Done | tasks/T-0009-harness-validate-json | Docker check and CLI JSON smoke passed. |
| T-0010 | Harness Replay Skeleton | Done | tasks/T-0010-harness-replay-skeleton | Docker check and replay CLI JSON smoke passed. |
| T-0011 | CLI Doctor JSON | Done | tasks/T-0011-cli-doctor-json | Docker check and doctor JSON/text CLI smokes passed. |
| T-0012 | CLI Task JSON | Done | tasks/T-0012-cli-task-json | Docker check and task JSON/text CLI smokes passed. |
| T-0013 | CLI Policy JSON | Done | tasks/T-0013-cli-policy-json | Docker check and policy JSON/non-JSON CLI smokes passed. |
| T-0014 | CLI Hermes JSON | Done | tasks/T-0014-cli-hermes-json | Docker check and Hermes JSON/non-JSON CLI smokes passed. |
| T-0015 | CLI Evidence JSON | Done | tasks/T-0015-cli-evidence-json | Docker check and evidence JSON/non-JSON CLI smokes passed. |
| T-0016 | Evidence Artifact Copy | Done | tasks/T-0016-evidence-artifact-copy | Docker check and public/private artifact CLI smokes passed. |
| T-0017 | Policy Execution Preflight | Done | tasks/T-0017-policy-execution-preflight | Docker check and allowed/approval/denied preflight CLI smokes passed. |
| T-0018 | Provider Fallback Executor | Done | tasks/T-0018-provider-fallback-executor | Docker check and provider fallback contract tests passed. |
| T-0019 | Shell Preflight Harness | Done | tasks/T-0019-shell-preflight-harness | Docker check and fake shell policy-gated harness tests passed. |
| T-0020 | Task Capsule Format Validation | Done | tasks/T-0020-task-capsule-format-validation | Docker check and Task Capsule Markdown format drift regression tests passed. |
| T-0021 | Agent Loop Minimal Harness | Done | tasks/T-0021-agent-loop-minimal-harness | Docker check, CLI run smoke, and harness validation passed. |
| T-0022 | Protocol Instruction Consolidation | Done | tasks/T-0022-protocol-instruction-consolidation | Reusable first-session HADARA protocol consolidated into AGENTS and SOP docs. |
| T-0023 | Workspace File Boundary | Done | tasks/T-0023-workspace-file-boundary | Realpath workspace resolver and boundary regression tests passed Docker validation. |
| T-0024 | Evidence Artifact Redaction | Done | tasks/T-0024-evidence-artifact-redaction | Public text artifact secret scan and binary rejection passed Docker validation. |
| T-0025 | CLI Args Parser | Done | tasks/T-0025-cli-args-parser | Strict option helpers and malformed value regressions passed Docker validation. |
| T-0026 | Agent Loop Evidence Attachment | Done | tasks/T-0026-agent-loop-evidence-attachment | Fake-shell observation evidence attachments passed Docker validation. |
| T-0027 | Deterministic Scripted Provider and Capsule Evidence Index | Done | tasks/T-0027-deterministic-scripted-provider-capsule-index | Sequential scripts and empty evidence indexes passed Docker validation. |
| T-0028 | Init Profiles Protocol Docs | Done | tasks/T-0028-init-profiles-protocol-docs | Init profiles and protocol doc scaffolding passed Docker validation. |
| T-0029 | Done-Level Harness Validation | Done | tasks/T-0029-done-level-harness-validation | Draft/done validation levels passed Docker validation. |
| T-0030 | Run Scenario Scaffold | Done | tasks/T-0030-run-scenario-scaffold | Deterministic run scaffold helper passed Docker validation. |
| T-0031 | CLI Handler Extraction | Done | tasks/T-0031-cli-handler-extraction | Extracted init and run scaffold helpers from CLI dispatcher. |
| T-0032 | CLI Harness Handler Extraction | Done | tasks/T-0032-cli-harness-handler-extraction | Extracted harness command group from CLI dispatcher. |
| T-0033 | CLI Evidence Handler Extraction | Done | tasks/T-0033-cli-evidence-handler-extraction | Extracted evidence command group from CLI dispatcher. |
| T-0034 | CLI Policy Handler Extraction | Done | tasks/T-0034-cli-policy-handler-extraction | Extracted policy command group from CLI dispatcher. |
| T-0035 | CLI Hermes and Handoff Handler Extraction | Done | tasks/T-0035-cli-hermes-handoff-handler-extraction | Extracted Hermes and handoff command groups from CLI dispatcher. |
| T-0036 | CLI Remaining Handler Extraction | Done | tasks/T-0036-cli-remaining-handler-extraction | Extracted remaining command groups from CLI dispatcher. |
| T-0037 | Runtime Validation and Harness Semantics | Done | tasks/T-0037-runtime-validation-harness-semantics | Hardened mode parsing, evidence enums, fake-shell failures, scaffold reuse, and task title parsing. |
| T-0038 | CLI JSON Error Envelope | Done | tasks/T-0038-cli-json-error-envelope | Added fallback JSON error envelope for CLI parse and validation failures. |
| T-0039 | Policy Safe Command Exactness | Done | tasks/T-0039-policy-safe-command-exactness | Required exact token matching for policy safe commands. |
| T-0040 | Handoff Compaction Policy | Done | tasks/T-0040-handoff-compaction-policy | Compacted current handoff and moved old history into dedicated docs. |
| T-0041 | Old Draft Task Reclassification | Done | tasks/T-0041-old-draft-task-reclassification | Reclassified T-0003 as Superseded and T-0006 as Partial. |
| T-0042 | Hermes/MCP Read-Only Contract | Done | tasks/T-0042-hermes-mcp-read-only-contract | Defined read-only MCP contract, CLI JSON policy, and task status schema alignment. |
| T-0043 | MCP JSON-RPC Server Skeleton | Done | tasks/T-0043-mcp-json-rpc-server-skeleton | Stdio read-only MCP server lifecycle/discovery skeleton added. |
| T-0044 | MCP Read Tools Implementation | Done | tasks/T-0044-mcp-read-tools-implementation | Implemented read-only MCP tools from the bridge contract. |
| T-0045 | MCP Bridge Harness Tests | Done | tasks/T-0045-mcp-bridge-harness-tests | Validated MCP bridge payloads against CLI JSON contracts. |
| T-0046 | Evidence Attach Tool Contract | Done | tasks/T-0046-evidence-attach-tool-contract | Defined future MCP evidence attach contract and write-tool error taxonomy. |
| T-0047 | Evidence Attach Guard Tests | Done | tasks/T-0047-evidence-attach-guard-tests | Guarded against premature MCP evidence attach advertisement or execution. |
| T-0048 | Gated MCP Evidence Attach Implementation | Done | tasks/T-0048-gated-mcp-evidence-attach-implementation | Implemented evidence attach behind explicit MCP opt-in. |
| T-0049 | MCP Evidence Attach Safety Tests | Done | tasks/T-0049-mcp-evidence-attach-safety-tests | Validated opt-in MCP evidence attach safety gates. |
| T-0050 | MCP Write Audit Log | Done | tasks/T-0050-mcp-write-audit-log | Audits opt-in MCP evidence attach success and failure attempts to the private portable audit store. |
| T-0051 | MCP Phase/Mode Config | Done | tasks/T-0051-mcp-phase-mode-config | Initialize metadata and instructions now reflect default read-only vs evidence attach-enabled mode. |
| T-0052 | MCP Evidence Attach Approval Record | Done | tasks/T-0052-mcp-evidence-attach-approval-record | Requires per-call approval actor/reason for opt-in MCP evidence attach writes. |
| T-0053 | Operations Status JSON | Done | tasks/T-0053-operations-status-json | Adds `hadara status --json` and `hadara ops status --json` as dashboard/external-agent read models. |
| T-0054 | Operations Status JSON Cleanup | Done | tasks/T-0054-operations-status-json-cleanup | Hardens status JSON warnings, stable task counts, raw status counts, phase parsing, and validation fallback. |
| T-0055 | Dashboard Read Model Contract | Done | tasks/T-0055-dashboard-read-model-contract | Maps dashboard cards/panels to `hadara.ops.status.v1` and adds a sample fixture. |
| T-0056 | Minimal Static Dashboard | Done | tasks/T-0056-minimal-static-dashboard | Adds a static Operations Home dashboard consuming the sample status fixture without backend, live CLI, MCP, writes, or build step. |
| T-0057 | Dashboard Mockup Adoption | Done | tasks/T-0057-dashboard-mockup-adoption | Promotes the comfort dark mockup to dashboard visual baseline while preserving `hadara.ops.status.v1` fixture binding and static boundaries. |
| T-0058 | Dashboard Fixture Binding Smoke | Done | tasks/T-0058-dashboard-fixture-binding-smoke | Adds static smoke coverage that dashboard `data-field` attributes map to fixture-backed or derived `hadara.ops.status.v1` values. |
| T-0059 | Dashboard Served from HADARA CLI | Done | tasks/T-0059-dashboard-served-from-hadara-cli | Adds `hadara dashboard serve` for the static sample-backed dashboard with allowlisted asset routes. |
| T-0060 | Dashboard Serve Boundary Hardening | Done | tasks/T-0060-dashboard-serve-boundary-hardening | Restricts dashboard serving to safe methods, security headers, and traversal-resistant allowlisted routes. |
| T-0061 | Evidence Index Schema Hardening | Done | tasks/T-0061-evidence-index-schema-hardening | Requires canonical `time`, `summary`, and `visibility` evidence index fields and migrates recent timestamp drift. |
| T-0062 | Dashboard Server Failure Semantics | Done | tasks/T-0062-dashboard-server-failure-semantics | Makes static dashboard server failures predictable for missing roots/files and unexpected response generation errors. |
| T-0063 | Architecture/Roadmap State Reconciliation | Done | tasks/T-0063-architecture-roadmap-state-reconciliation | Aligns architecture and roadmap docs with implemented, partial, and deferred HADARA capabilities. |
| T-0064 | Roadmap v0.3 Operations Layer Freeze | Done | tasks/T-0064-roadmap-v0-3-operations-layer-freeze | Freezes v0.3 as the current read-only operations layer and moves provider work behind external-agent readiness slices. |
| T-0065 | Context Export MCP Instructions | Done | tasks/T-0065-context-export-mcp-instructions | Updates context export to include roadmap/slice ordering and MCP/CLI-first external-agent guidance. |
| T-0066 | Compatibility Fixture | Done | tasks/T-0066-compatibility-fixture | Adds a Hermes-like read-only compatibility fixture replayed through context export and MCP tool dispatch. |
| T-0067 | CLI/MCP Service Parity Refactor | Done | tasks/T-0067-cli-mcp-service-parity-refactor | Moves project/handoff read logic into shared services and adds CLI/MCP parity coverage. |
| T-0068 | Single Active Run State | Done | tasks/T-0068-single-active-run-state | Adds local single active run manifest, resume projection, stale handoff warning, and status JSON exposure. |
| T-0069 | Operational Debt Track | Done | tasks/T-0069-operational-debt-track | Converts `known_issue.log` themes into structured debt records, capsule size indicators, and premature acceptance warnings. |
| T-0070 | Operations State Robustness Fix | Done | tasks/T-0070-operations-state-robustness-fix | Hardens active run corruption handling, missing-task warnings, premature acceptance checks, and shared section extraction. |
| T-0071 | Reusable Docker Development Container | Done | tasks/T-0071-reusable-docker-development-container | Documents reusable Docker workflow and CLI-based Task Capsule creation. |
| T-0072 | Core v1.0 Technical Plan Refresh | Done | tasks/T-0072-core-v1-0-technical-plan-refresh | Clarifies T-0066 through T-0070 implementation/design mismatches in v1.0 planning docs. |
| T-0074 | Redaction Hardening | Done | tasks/T-0074-redaction-hardening | Adds redaction registry/report model and broadens high-risk public evidence secret detection. |
| T-0075 | Redaction Policy Follow-up | Done | tasks/T-0075-redaction-policy-follow-up | Separates redaction report findings from severity-threshold public artifact blocking and aligns future MCP planning names. |
| T-0076 | Evidence List Read Model | Done | tasks/T-0076-evidence-list-read-model | Adds shared `hadara.evidence.list.v1`, CLI JSON evidence list, and read-only MCP evidence list with degraded JSONL warnings. |
| T-0077 | Context Export MCP Read Tool | Done | tasks/T-0077-context-export-mcp-read-tool | Adds read-only MCP `hadara.context.export` memory payload without writing context files. |
| T-0078 | Tools List Read Model | Done | tasks/T-0078-tools-list-read-model | Adds shared `hadara.tools.list.v1`, CLI JSON tools list, read-only MCP capability discovery, neutral capability registry, availability/risk metadata, and disabled surfaces. |
| T-0079 | Schema Layer Planning | Done | tasks/T-0079-schema-layer-planning | Adds `docs/SCHEMAS.md`, schema index fixture, and initial JSON Schema fixtures for evidence list, context export, and tools list read models. |
| T-0080 | Service Parity Expansion | Done | tasks/T-0080-service-parity-expansion | Moves task list/show/read reports into a shared task read-model service and routes MCP task list/read through it. |
| T-0081 | Policy Service Parity | Done | tasks/T-0081-policy-service-parity | Moves policy check/evaluate report builders into a shared policy service and routes CLI preflight plus MCP policy evaluate through it. |
| T-0082 | Cleanup Follow-up Notes | Done | tasks/T-0082-cleanup-follow-up-notes | Captures redaction/schema/task.read/policy cleanup gaps and aligns policy check mode input with policy evaluate. |
| T-0083 | Task Read Evidence Normalization | Done | tasks/T-0083-task-read-evidence-normalization | Reuses evidence-list normalization for task.read evidenceIndex and sanitized evidence.jsonl file view. |
| T-0084 | Harness Validate Service Parity | Done | tasks/T-0084-harness-validate-service-parity | Routes CLI/MCP harness validate through a shared service and makes task.read private evidence opt-in. |
| T-0085 | Operations Status Service Parity | Done | tasks/T-0085-operations-status-service-parity | Moves Operations Status JSON report creation into a shared service while preserving CLI status output. |
| T-0086 | Active Run Read Surfaces | Done | tasks/T-0086-active-run-read-surfaces | Adds read-only CLI/MCP active-run projection and resume guidance surfaces. |
| T-0087 | Operational Debt Release Gates | Done | tasks/T-0087-operational-debt-release-gates | Adds debt list/show read surfaces, ops debt aggregates, and advisory/strict release-gate debt checks. |
| T-0088 | Active Run Resume Hardening | Done | tasks/T-0088-active-run-resume-hardening | Canonicalizes active-run resume paths, warns on capsule mismatches, adds active-run schema fixtures, and clarifies read-only resume guidance. |
| T-0089 | Redaction Policy Observability Tests | Done | tasks/T-0089-redaction-policy-observability-tests | Adds safe public artifact policy diagnostics and medium-finding non-blocking coverage. |
| T-0090 | Policy Matrix Refactor | Done | tasks/T-0090-policy-matrix-refactor | Splits shell policy internals and blocks release-risk commands outside release mode while approval-gating auto/trusted network risk. |
| T-0091 | Private Evidence Manifest | Done | tasks/T-0091-private-evidence-manifest | Adds private portable-store manifests with hashes, deferred encryption metadata, audit events, and context-export exclusion tests. |
| T-0092 | Active Run Runtime Schema Validation | Done | tasks/T-0092-active-run-runtime-schema-validation | Adds runtime schema validation for active-run projection/resume reports and malformed-state degraded outputs. |
| T-0093 | Policy Matrix Release Gate Feedback | Done | tasks/T-0093-policy-matrix-release-gate-feedback | Verifies release/network policy matrix behavior and sharpens strict release-gate exit-code regression coverage. |
| T-0094 | Security Schema Follow-up Cleanup | Done | tasks/T-0094-security-schema-follow-up-cleanup | Restricts private evidence source copies to project-boundary files, adds `--visibility` evidence alias, separates active-run schema warnings, and adds privateEvidence/releaseGate schema fixtures. |
| T-0095 | Logger and Audit Event Model | Done | tasks/T-0095-logger-and-audit-event-model | Adds `hadara.event.v1`, structured event helpers/schema, and compatibility-preserving audit event records. |
| T-0096 | Real Provider Adapter Preparation | Done | tasks/T-0096-real-provider-adapter-preparation | Adds provider config/call schema fixtures, runtime schema assertions, unknown-field denial, and safe preparation helpers without real provider execution. |
| T-0097 | Dashboard Read Integration | Done | tasks/T-0097-dashboard-read-integration | Adds read-only dashboard API routes for status, tasks, evidence, active-run, and debt without shell/write/provider behavior. |
| T-0098 | CLI Write Boundary Preflight | Done | tasks/T-0098-cli-write-boundary-preflight | Adds schema-backed read-only write preflight reports for CLI-owned write command families. |
| T-0099 | TUI Design and Development Plan | Done | tasks/T-0099-tui-design-and-development-plan | Aligns `.mockup/tui` and `.mockup/tui-final` into main docs as a future read-only terminal work console; no production TUI implementation yet. |
| T-0100 | TUI Read-Model Aggregator | Done | tasks/T-0100-tui-read-model-aggregator | Adds internal TUI aggregate read model over existing shared services without renderer, CLI entry point, cache, writes, shell, provider, or MCP behavior. |
| T-0101 | Task Board Append Done-Level Guard | Done | tasks/T-0101-task-board-append-done-level-guard | Adds done-level harness validation for duplicate/stale Task Board rows when completing a Task Capsule. |
| T-0102 | TUI Snapshot Renderer | Done | tasks/T-0102-tui-snapshot-renderer | Adds deterministic no-color fixed-size snapshots for Overview, Tasks, Detail, and Help over the internal TUI aggregate. |
| T-0103 | TUI Mockup Parity Module Port | Done | tasks/T-0103-tui-mockup-parity-module-port | Ports mockup-derived constants, layout helpers, Markdown document rendering, and mockup-style read-only snapshot frame into `src/tui`. |
| T-0104 | TUI Snapshot Polish | Done | tasks/T-0104-tui-snapshot-polish | Hides volatile snapshot timestamps by default, adds mockup/compact width policy, and hardens wide-character Markdown rendering. |
| T-0105 | TUI Interactive State | Done | tasks/T-0105-tui-interactive-state | Adds pure internal TUI state transitions for panels, task selection/search, detail docs, scroll, refresh completion, and quit without terminal runtime or writes. |
| T-0106 | TUI Raw Terminal Shell | Done | tasks/T-0106-tui-raw-terminal-shell | Adds an internal injected-stream terminal shell for key decoding, redraw, refresh effects, and clean shutdown without a public CLI command or project writes. |
| T-0107 | TUI Public CLI Entry Point | Done | tasks/T-0107-tui-public-cli-entry-point | Adds public read-only `hadara tui` and `hadara tui --snapshot` CLI entry points over the TUI renderer/terminal shell. |
| T-0108 | TUI Native Runtime Docs Assimilation | Done | tasks/T-0108-tui-native-runtime-docs-assimilation | Reflects the full TUI mockup parity/native runtime design into main v1.0 planning docs without omission. |
| T-0109 | TUI Local Cache and Incremental Refresh | Done | tasks/T-0109-tui-local-cache-and-incremental-refresh | Adds internal local TUI cache, source-signal invalidation, opt-in `hadara tui --cache`, private-evidence cache disable, context-export exclusion, and 1000-capsule benchmark evidence. |
| T-0110 | TUI Visual Parity and Loading States | Done | tasks/T-0110-tui-visual-parity-and-loading-states | Adds HADARA/contrast themes, no-color preservation, status/log line, loading frames, visual task/detail polish, mockup-style key handling, and state-driven selection rendering. |
| T-0111 | TUI Frame Color and Viewer Parity Fix | Done | tasks/T-0111-tui-frame-color-and-viewer-parity-fix | Switches TUI themes to mockup true-color RGB, fixes viewer/tab parity, and optimizes cache source-signal fast validation by reusing unchanged hashes after mtime/size checks. |
| T-0112 | TUI Loading Animation Mouse and Resize Ergonomics | Done | tasks/T-0112-tui-loading-animation-mouse-and-resize-ergonomics | Adds immediate startup loading frames, multi-tick refresh/detail loading, SGR mouse panel/task/doc-tab clicks, and resize redraw without writes. |
| T-0113 | TUI Async Loading and Read-Model Performance Refactor | Done | tasks/T-0113-tui-async-loading-and-read-model-performance-refactor | Adds fast TUI read-model profile, routes interactive startup/refresh/detail through it, and makes cache indexing tolerate missing TASK.md files. |
| T-0114 | TUI Mockup UX Parity Audit Fix | Done | tasks/T-0114-tui-mockup-ux-parity-audit-fix | Makes fast-profile deferred advisory reads visible, aligns task-list rendering with scroll/search state, and makes task-row mouse clicks open refreshed detail. |
| T-0115 | TUI Renderer-Derived Mouse Hitboxes and Detail Tab Fix | Done | tasks/T-0115-tui-renderer-derived-mouse-hitboxes-and-detail-tab-fix | Derives mouse hitboxes from the TUI renderer, consumes mouse releases safely, and aligns Task cursor windowing with the mockup. |
| T-0116 | TUI Markdown Viewer and Live Overview Parity | Done | tasks/T-0116-tui-markdown-viewer-and-live-overview-parity | Ports mockup-style Markdown table/viewer semantics, latest-two Overview summaries, and async loading pulse while preserving read-only read-model-first TUI behavior. |
| T-0117 | TUI Arrow Input and Narrow Color Clipping Fix | Done | tasks/T-0117-tui-arrow-input-and-narrow-color-clipping-fix | Fixes production TUI arrow escape decoding for more terminals, clamps Detail document scroll at the rendered bottom, and preserves ANSI colors when colored text is clipped in narrow windows. |
| T-0118 | TUI Tasks Height and Overview Copy Parity | Done | tasks/T-0118-tui-tasks-height-and-overview-copy-parity | Aligns Tasks panel height with Detail, simplifies Overview Resume Signals, matches mockup-style Current/Previous Work Next/Proof fallback order, and lets numeric keys be searched while Tasks search is active. |
| T-0119 | Release and Packaging Track | Done | tasks/T-0119-release-and-packaging-track | Extends release gate with package/bin/script, Node/CI, clean-checkout smoke, generated artifact policy, and operational debt checklist checks. |
| T-0120 | Dogfooding E2E Fixture | Done | tasks/T-0120-dogfooding-e2e-fixture | Adds a deterministic fixture replaying context export, policy, evidence, handoff, and done-level harness continuity. |
| T-0121 | Done-level Capsule Scaffold Guard | Done | tasks/T-0121-done-level-capsule-scaffold-guard | Adds done-level harness validation for scaffold/default capsule Markdown leftovers. |
| T-0122 | Remote CI Release Observation | Done | tasks/T-0122-remote-ci-release-observation | Observed GitHub Actions CI run #109 on main and added documented remote CI observation to release-gate readiness. |
| T-0123 | Operational Debt High Severity Mitigation | Done | tasks/T-0123-operational-debt-high-severity-mitigation | Mitigates OD-0003/OD-0008 based on implemented protocol and done-level validation safeguards; strict release gate now passes when readiness docs pass. |
| T-0124 | Clean Checkout Package Smoke Planning | Done | tasks/T-0124-clean-checkout-package-smoke-planning | Strengthens clean-checkout package smoke planning markers in TEST_STRATEGY and the read-only release gate. |
| T-0125 | Executable Package Smoke Artifact Boundary Design | Done | tasks/T-0125-executable-package-smoke-artifact-boundary-design | Defines future executable package-smoke workspace/artifact/evidence boundaries and strengthens the read-only release gate. |
| T-0126 | Package Smoke Command Surface Design | Done | tasks/T-0126-package-smoke-command-surface-design | Defines `hadara package smoke` command-surface semantics and strengthens the read-only release gate. |
| T-0127 | Package Metadata Release Readiness | Done | tasks/T-0127-package-metadata-release-readiness | Records package name/version/private/files/license/publish-target decisions and strengthens the read-only release gate. |
| T-0128 | Installer Script Surface and Schema | Done | tasks/T-0128-installer-script-surface-and-schema | Defines installer/portable launcher surfaces, redacted install plan schema, execute-reserved policy, and read-only release-gate markers without install mutation. |
| T-0129 | Installer Dry-run Implementation | Done | tasks/T-0129-installer-dry-run-implementation | Adds read-only `hadara install plan --json` dry-run reports with redacted paths, explicit USB-root requirement, and execute-disabled behavior. |
| T-0130 | Install Matrix Smoke Plan | Done | tasks/T-0130-install-matrix-smoke-plan | Defines Linux/WSL/Windows/USB install matrix rows, evidence boundaries, and read-only release-gate markers without executing install smoke. |
| T-0131 | Major Feature Smoke Runner | Done | tasks/T-0131-major-feature-smoke-runner | Adds read-only `hadara smoke run --profile core --json` with reduced feature-smoke reports. |
| T-0132 | Package Smoke Schema and Fixture | Done | tasks/T-0132-package-smoke-schema-and-fixture | Registers `hadara.packageSmoke.v1` with deterministic reduced fixtures and no package-smoke execution. |
| T-0133 | Package Smoke Dry-run Implementation | Done | tasks/T-0133-package-smoke-dry-run-implementation | Adds read-only `hadara package smoke --dry-run --json` planning reports without package execution. |
| T-0134 | Local Package Smoke Execution | Done | tasks/T-0134-local-package-smoke-execution | Adds explicit `hadara package smoke --execute --json` local smoke with npm pack, isolated prefix install, installed doctor/core smoke, cleanup, and reduced reports. |
| T-0135 | Clean Checkout Smoke Implementation | Done | tasks/T-0135-clean-checkout-smoke-implementation | Adds explicit `hadara smoke clean-checkout --execute --json` source-checkout smoke in a disposable copy with reduced reports and cleanup. |
| T-0136 | Smoke Evidence Integration | Done | tasks/T-0136-smoke-evidence-integration | Adds reduced public smoke evidence attachment for package-smoke and clean-checkout smoke. |
| T-0137 | Release Artifact Builder | Done | tasks/T-0137-release-artifact-builder | Adds explicit local release artifact tarball/checksum/manifest builder without publishing. |
| T-0138 | Release Gate Evidence Freeze | Done | tasks/T-0138-release-gate-evidence-freeze | Adds read-only evidence-backed release gate checks for package smoke, clean-checkout smoke, and release artifacts. |
| T-0139 | CI Release Workflow Target Decision | Done | tasks/T-0139-ci-release-workflow-target-decision | Decides npm primary, GitHub Release secondary, Docker deferred, and documents token names without values. |
| T-0140 | Final Deployment Script Dry Run | Done | tasks/T-0140-final-deployment-script-dry-run | Adds read-only release dry-run evidence cross-checks and release artifact public evidence attachment. |
| T-0141 | Final Publish/Deploy Script | Done | tasks/T-0141-final-publish-deploy-script | Adds approval-gated release publish/deploy readiness reports with token presence checks, blocked execute audit, and no publish/GitHub/Docker mutation. |
| T-0142 | Package Metadata Transition Plan | Done | tasks/T-0142-package-metadata-transition-plan | Transitions package metadata to `0.1.0-rc.0`, `private: false`, and a narrow files whitelist; regenerates package-smoke, clean-checkout, release-artifact, release dry-run, and release publish dry-run evidence without publish/deploy mutation. |
| T-0143 | Manual RC Npm Publish | Done | tasks/T-0143-manual-rc-publish-dry-run | Published `hadara@0.1.0-rc.0` to npm after fresh package-smoke, clean-checkout, release-artifact, release-gate, dry-run, and npm tarball dry-run evidence; GitHub Release, tag push, install scripts, and README cleanup are deferred. |
| T-0144 | README release install docs cleanup | Done | tasks/T-0144-readme-release-install-docs-cleanup | Aligns README with npm RC install/use, source-checkout development, MIT license, and deferred release/install boundaries. |
| T-0145 | MCP initialize package version metadata | Done | tasks/T-0145-mcp-initialize-package-version-metadata | Reports MCP initialize serverInfo.version from HADARA package metadata instead of stale bootstrap metadata. |
| T-0146 | Release metadata hardcoding cleanup | Done | tasks/T-0146-release-metadata-hardcoding-cleanup | Removes exact current-RC version coupling from release readiness checks and keeps package-smoke tarball examples version-flexible. |
| T-0147 | Init scaffold protocol alignment | Done | tasks/T-0147-init-scaffold-protocol-alignment | Aligns init scaffolds and root SOP with general HADARA protocol, removes Hermes defaults, adds `.gitignore`, and structures generated docs. |
| T-0148 | Init profile scale matrix refactor | Done | tasks/T-0148-init-profile-scale-matrix-refactor | Replaces primary init profiles with `basic`, `standard`, and `governed`; generated SOP/AGENTS now reflect the selected profile's docs. |
| T-0149 | Init Generated Markdown Table Frame Alignment | Done | tasks/T-0149-init-generated-markdown-table-frame-alignment | Aligns generated init docs with table-first generic frames, removes generic optional-surface defaults, and cleans generated `.gitignore` data boundary. |
| T-0150 | Init Follow-up Commands Completion | Done | tasks/T-0150-init-follow-up-commands-completion | Completes init scaffold doctor, lazy runtime-store init behavior, profile upgrade, Required Reading registration, and optional Hermes/MCP integration enable commands. |
| T-0151 | Init Follow-up Hardening | Done | tasks/T-0151-init-follow-up-hardening | Hardens init follow-up wording, profile-drift doctor checks, register-doc validation/strict mode, and integration guidance write ordering. |
| T-0152 | Task Capsule Scaffold Frame Alignment | Done | tasks/T-0152-task-capsule-scaffold-frame-alignment | Starts Phase 2 protocol consistency with v2 Task Capsule table frames and compatibility validation. |
| T-0153 | Task Capsule Consistency Doctor | Done | tasks/T-0153-task-capsule-consistency-doctor | Adds read-only task-scoped protocol consistency doctor. |
| T-0154 | Project Docs Consistency Doctor | Done | tasks/T-0154-project-docs-consistency-doctor | Adds read-only docs-scope protocol consistency doctor. |
| T-0155 | Project Docs Consistency Doctor Completion | Done | tasks/T-0155-project-docs-consistency-doctor-completion | Completes the planned T-0154 project-doc doctor coverage as logical T-0154a. |
| T-0156 | Profile Drift Remediation Guide | Done | tasks/T-0156-profile-drift-remediation-guide | Adds `--scope profile` diagnostics and manual remediation guidance; Docker validation and built CLI smokes passed. |
| T-0157 | Safe Protocol Remediation MVP | Done | tasks/T-0157-safe-protocol-remediation-mvp | Adds dry-run-first bounded `protocol remediate` fixes for Task Board rows, Decisions table frame, Project State profile row, and evidence JSONL. |
| T-0158 | Safe Protocol Remediation Hardening | Done | tasks/T-0158-safe-protocol-remediation-hardening | Hardens `protocol remediate` atomic writes, Metadata upsert, table-frame guards, and conflict checks. |
| T-0159 | Protocol Consistency JSON Contract | Done | tasks/T-0159-protocol-consistency-json-contract | Registers protocol consistency/remediation JSON schemas and contract tests; Docker validation and built CLI smokes passed. |
| T-0160 | Protocol Doctor All Scope | Done | tasks/T-0160-protocol-doctor-all-scope | Adds all-scope protocol doctor aggregation; Docker validation and built CLI smokes passed. |
| T-0161 | Markdown Table Helper Extraction | Done | tasks/T-0161-markdown-table-helper-extraction | Extracts shared Markdown table helper; Docker validation and full check passed. |
| T-0162 | Doctor Remediation Hint Unification | Done | tasks/T-0162-doctor-remediation-hint-unification | Adds safe-auto remediation hints to protocol doctor reports; Docker validation passed. |
| T-0163 | Task Capsule Upgrade Scaffold Command | Done | tasks/T-0163-task-capsule-upgrade-scaffold-command | Adds dry-run-first non-destructive task scaffold upgrade command; Docker validation passed. |
| T-0164 | Protocol Surface Docs Alignment | Done | tasks/T-0164-protocol-surface-docs-alignment | Aligns CLI help, README, JSON contract docs, schema notes, and Phase 2 planning docs with implemented protocol doctor/remediation/task upgrade surfaces; Docker validation passed. |
| T-0165 | Evidence Lint and Doctor Validation | Done | tasks/T-0165-evidence-lint-and-doctor-validation | Adds read-only evidence lint, protocol doctor evidence drift surfacing, schema fixture, and close/evidence loop design docs. |
| T-0166 | Task Close Plan Report | Done | tasks/T-0166-task-close-plan-report | Adds read-only task close plan report with validation/evidence lint/task doctor checks, close evidence loop-boundary metadata, and nextActions. |
| T-0167 | Task Close Execute MVP | Done | tasks/T-0167-task-close-execute-mvp | Enables `task close --execute` to append canonical close evidence only after blockers pass. |
| T-0168 | Task Ready Preflight | Done | tasks/T-0168-task-ready-preflight | Adds read-only `task ready --level done` preflight with friendly blockers, check booleans, and nextActions. |
| T-0169 | Evidence Command UX | Done | tasks/T-0169-evidence-command-ux | Adds `evidence add-command` canonical command-log evidence writer without shell execution. |
| T-0170 | Close UX Polish and Audit Semantics | Done | tasks/T-0170-close-ux-polish-and-audit-semantics | Adds close report/source hash split, execute nextActions polish, append result paths, and read-only `task audit-close`. |
| T-0171 | Task Workbench Status Report | Done | tasks/T-0171-task-workbench-status-report | Adds read-only `task status --task <id> --json` workbench projection over close, evidence, protocol, and Task Board sources. |
| T-0172 | Workbench Suggested Action Engine | Done | tasks/T-0172-workbench-suggested-action-engine | Centralizes workbench nextActions with priorities, source issue codes, and dry-run/execute pairing. |
| T-0173 | Workbench Schema Contract | Done | tasks/T-0173-workbench-schema-contract | Registers fixture-level `hadara.task.workbench.v1` schema and validation coverage. |
| T-0174 | Worker-Friendly Text Output | Done | tasks/T-0174-worker-friendly-text-output | Adds grouped non-JSON task status and audit-close output. |
| T-0175 | Dashboard TUI MCP Read Projection Prep | Done | tasks/T-0175-dashboard-tui-mcp-read-projection-prep | Adds workbench read-model consumer contract and future dashboard/MCP guidance. |
| T-0176 | Evidence From Command Design | Done | tasks/T-0176-evidence-from-command-design | Adds design-only safety boundary for future shell-executing evidence capture. |
| T-0177 | Task Workbench Hardening | Done | tasks/T-0177-task-workbench-hardening | Hardened workbench Task Board projection, nextAction normalization, and close state semantics. |
| T-0178 | Runtime Version CLI Origin Doctor | Done | tasks/T-0178-runtime-version-cli-origin-doctor | Adds read-only `version --verbose --json` runtime origin diagnostics. |
| T-0179 | Docker Dev Sync Build Script | Done | tasks/T-0179-docker-dev-sync-build-script | Adds npm helpers for Docker check and sync-build/dist refresh. |
| T-0180 | Task Finish Status Sync MVP | Done | tasks/T-0180-task-finish-status-sync-mvp | |
| T-0181 | Task Next Recommendation | Done | tasks/T-0181-task-next-recommendation | |
| T-0182 | Schema Stability Classification | Done | tasks/T-0182-schema-stability-classification | |
| T-0183 | Focused Test Command UX | Done | tasks/T-0183-focused-test-command-ux | |
| T-0184 | Task Finish Write Safety Hardening | Done | tasks/T-0184-task-finish-write-safety-hardening | |
| T-0185 | Task Workflow Command Semantics Audit | Done | tasks/T-0185-task-workflow-command-semantics-audit | |
| T-0186 | Evidence Proof Semantics Foundation | Done | tasks/T-0186-evidence-proof-semantics-foundation | |
| T-0187 | Evidence Lint Semantic Integration | Done | tasks/T-0187-evidence-lint-semantic-integration | |
| T-0188 | Protocol and Harness Semantic Gates | Done | tasks/T-0188-protocol-and-harness-semantic-gates | |
| T-0189 | Dashboard/TUI Evidence Semantic Contract | Done | tasks/T-0189-dashboard-tui-evidence-semantic-contract | |
| T-0190 | Evidence v2 Writer and Migration Plan | Done | tasks/T-0190-evidence-v2-writer-and-migration-plan | |
| T-0191 | Release Evidence Strict Gate | Done | tasks/T-0191-release-evidence-strict-gate | |
| T-0192 | Evidence Semantics Hardening | Done | tasks/T-0192-evidence-semantics-hardening | |
| T-0193 | Dashboard Live Read Binding | Done | tasks/T-0193-dashboard-live-read-binding | |
| T-0194 | Dashboard Operator Console Layout | Done | tasks/T-0194-dashboard-operator-console-layout | |
| T-0195 | Dashboard Selected Task Evidence Lens | Done | tasks/T-0195-dashboard-selected-task-evidence-lens | |
| T-0196 | Dashboard Timeline Read Model | Done | tasks/T-0196-dashboard-timeline-read-model | |
| T-0197 | Dashboard Bootstrap Read Model | Done | tasks/T-0197-dashboard-bootstrap-read-model | |
| T-0198 | Dashboard Progressive Bootstrap Frontend | Done | tasks/T-0198-dashboard-progressive-bootstrap-frontend | |
| T-0199 | Dashboard Task Detail Aggregate Endpoint | Done | tasks/T-0199-dashboard-task-detail-aggregate-endpoint | |
| T-0200 | Dashboard Timeline Identity Hardening | Done | tasks/T-0200-dashboard-timeline-identity-hardening | |
| T-0201 | Dashboard Serve TTL Cache | Done | tasks/T-0201-dashboard-serve-ttl-cache | |
| T-0202 | Dashboard Degraded UX and Performance Budget | Done | tasks/T-0202-dashboard-degraded-ux-and-performance-budget | |
| T-0203 | Optional Dashboard Polling Refresh | Done | tasks/T-0203-optional-dashboard-polling-refresh | |
| T-0204 | Dashboard Production Readiness Review | Done | tasks/T-0204-dashboard-production-readiness-review | |
| T-0205 | Dashboard Playwright Performance Measurement | Done | tasks/T-0205-dashboard-playwright-performance-measurement | |
| T-0206 | Dashboard Production Hardening Follow-up | Done | tasks/T-0206-dashboard-production-hardening-follow-up | |
| T-0207 | Dashboard Design Language and Tokens | Done | tasks/T-0207-dashboard-design-language-and-tokens | |
| T-0208 | Dashboard Frontend Tech Decision Spike | Done | tasks/T-0208-dashboard-frontend-tech-decision-spike | |
| T-0209 | Dashboard Operator Console Shell Rebuild | Done | tasks/T-0209-dashboard-operator-console-shell-rebuild | |
| T-0210 | Dashboard Active Next and Command Affordance | Done | tasks/T-0210-dashboard-active-next-and-command-affordance | |
| T-0211 | Dashboard Activity Feed Timeline Redesign | Done | tasks/T-0211-dashboard-activity-feed-timeline-redesign | |
| T-0212 | Dashboard Proof Verdict and Evidence Lens Redesign | Done | tasks/T-0212-dashboard-proof-verdict-and-evidence-lens-redesign | |
| T-0213 | Dashboard Metrics With Meaning and Developer JSON | Done | tasks/T-0213-dashboard-metrics-with-meaning-and-developer-json | |
| T-0214 | Dashboard Visual Regression and A11y Gate | Done | tasks/T-0214-dashboard-visual-regression-and-a11y-gate | |
| T-0215 | Phase 5.6 Close / Handoff Sync | Done | tasks/T-0215-phase-5-6-close-handoff-sync | |
| T-0216 | Dashboard Projection Contract | Done | tasks/T-0216-dashboard-projection-contract | |
| T-0217 | Dashboard Local Projection Store | Done | tasks/T-0217-dashboard-local-projection-store | |
| T-0218 | Dashboard Core Route from Projection | Done | tasks/T-0218-dashboard-core-route-from-projection | |
| T-0219 | Background Refresh and Serve Warmup | Done | tasks/T-0219-background-refresh-and-serve-warmup | |
| T-0220 | Incremental Task Projection | Done | tasks/T-0220-incremental-task-projection | |
| T-0221 | Timeline / Debt Projection | Done | tasks/T-0221-timeline-debt-projection | |
| T-0222 | Frontend Core + Heavy Merge | Done | tasks/T-0222-frontend-core-heavy-merge | |
| T-0223 | Projection Validation and Visual/A11y States | Done | tasks/T-0223-projection-validation-and-visual-a11y-states | |
| T-0224 | Dashboard Refresh Refactor and Validation Read Model | Done | tasks/T-0224-dashboard-refresh-refactor-and-validation-read-model | Metadata gate follow-up validated with Docker sync-build. |
| T-0225 | Dashboard Cooperative Refresh Progress | Done | tasks/T-0225-dashboard-cooperative-refresh-progress | |
| T-0226 | Dashboard Refresh Responsiveness Measurement | Done | tasks/T-0226-dashboard-refresh-responsiveness-measurement | |
| T-0227 | Task Status History Done Gate | Done | tasks/T-0227-task-status-history-done-gate | |
| T-0228 | TUI Projection-First Operator Read Model | Done | tasks/T-0228-tui-projection-first-operator-read-model | |
| T-0229 | TUI Selected Task Detail Shared Read Model | Done | tasks/T-0229-tui-selected-task-detail-shared-read-model | |
| T-0230 | TUI Projection-First Task Index Cache Replacement | Done | tasks/T-0230-tui-projection-first-task-index-cache-replacement | |
| T-0231 | TUI CLI Lazy Startup for Snapshot Smoke | Done | tasks/T-0231-tui-cli-lazy-startup-for-snapshot-smoke | |
| T-0232 | TUI Overview Markdown Table Preview Cleanup | Done | tasks/T-0232-tui-overview-markdown-table-preview-cleanup | Also fixes Detail table cells with inline-code or escaped pipe characters. |
| T-0233 | Evidence v2 Persisted ID Writer MVP | Done | tasks/T-0233-evidence-v2-persisted-id-writer-mvp | |
| T-0234 | Evidence v2 Release Read Model Compatibility | Done | tasks/T-0234-evidence-v2-release-read-model-compatibility | |
| T-0235 | Evidence v2 Migration Preview | Done | tasks/T-0235-evidence-v2-migration-preview | |
| T-0236 | Evidence v2 Migration Execute Mode | Done | tasks/T-0236-evidence-v2-migration-execute-mode | |
| T-0237 | Task Finish State Docs Advisory Report | Done | tasks/T-0237-task-finish-state-docs-advisory-report | |
| T-0238 | Task Close Audit Boundary Guidance | Done | tasks/T-0238-task-close-audit-boundary-guidance | |
| T-0239 | Task Next Handoff Priority | Done | tasks/T-0239-task-next-handoff-priority | |
