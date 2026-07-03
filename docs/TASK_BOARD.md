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
| T-0240 | Task Capsule Upgrade Remediation Dry Run Hardening | Done | tasks/T-0240-task-capsule-upgrade-remediation-dry-run-hardening | |
| T-0241 | Reviewer Feedback Docs Alignment | Done | tasks/T-0241-reviewer-feedback-docs-alignment | |
| T-0242 | Release Package Readiness Hardening | Done | tasks/T-0242-release-package-readiness-hardening | Release dry-run readiness next actions and stage timing diagnostics added. |
| T-0243 | Create an explicit release artifact evidence refresh capsule | Done | tasks/T-0243-create-an-explicit-release-artifact-evidence-refresh-capsule | Added release artifact dirty-worktree guard; actual artifact refresh deferred until clean worktree. |
| T-0244 | Multi-Ecosystem Release Target Model | Done | tasks/T-0244-multi-ecosystem-release-target-model | Descriptor-backed release targets added with npm-primary execution, npm package-smoke provider metadata, and Python preview-only detection. |
| T-0245 | Release Artifact Evidence Refresh | Done | tasks/T-0245-release-artifact-evidence-refresh | |
| T-0246 | Release Provider Contract | Done | tasks/T-0246-release-provider-contract | |
| T-0247 | Python Release Preview Provider | Done | tasks/T-0247-python-release-preview-provider | |
| T-0248 | Python Package Smoke Dry Run Local Mode | Done | tasks/T-0248-python-package-smoke-dry-run-local-mode | |
| T-0249 | Python Package Smoke Boundary Hardening | Done | tasks/T-0249-python-package-smoke-boundary-hardening | |
| T-0250 | Python Release Advisory Read Model | Done | tasks/T-0250-python-release-advisory-read-model | |
| T-0251 | Release Target Configuration Preview | Done | tasks/T-0251-release-target-configuration-preview | |
| T-0252 | Release Target Config Warning Surfacing | Done | tasks/T-0252-release-target-config-warning-surfacing | |
| T-0253 | Multi-Agent Command Context Contract | Done | tasks/T-0253-multi-agent-command-context-contract | |
| T-0254 | Task Lifecycle Next Action Metadata | Done | tasks/T-0254-task-lifecycle-next-action-metadata | |
| T-0255 | Task Complete Flow Dry-Run | Done | tasks/T-0255-task-complete-flow-dry-run | |
| T-0256 | Close Evidence Idempotency / Supersedes | Done | tasks/T-0256-close-evidence-idempotency-supersedes | |
| T-0257 | Handoff Patch Suggestion | Done | tasks/T-0257-handoff-patch-suggestion | |
| T-0258 | Dev Docker Validation Wrapper | Done | tasks/T-0258-dev-docker-validation-wrapper | |
| T-0259 | Task Capsule Templates | Done | tasks/T-0259-task-capsule-templates | |
| T-0260 | Release Dry-Run Service Decomposition | Done | tasks/T-0260-release-dry-run-service-decomposition | |
| T-0261 | Phase 6 Reviewer Feedback Hardening | Done | tasks/T-0261-phase-6-reviewer-feedback-hardening | |
| T-0262 | Actor Context CLI Option Plumbing | Done | tasks/T-0262-actor-context-cli-option-plumbing | |
| T-0263 | Dev Docker Sync Dist Before-Hash Guard | Done | tasks/T-0263-dev-docker-sync-dist-before-hash-guard | |
| T-0264 | Close Evidence Append Race Recheck | Done | tasks/T-0264-close-evidence-append-race-recheck | |
| T-0265 | Task Create Collision Guard | Done | tasks/T-0265-task-create-collision-guard | |
| T-0266 | Handoff Suggestion Fragment Polish | Done | tasks/T-0266-handoff-suggestion-fragment-polish | |
| T-0267 | Task Finish EOF Normalization | Done | tasks/T-0267-task-finish-eof-normalization | |
| T-0268 | Release Candidate Freeze and Artifact Refresh | Done | tasks/T-0268-release-candidate-freeze-and-artifact-refresh | |
| T-0269 | Approval-Gated npm Publish for 0.2.0-rc.0 | Superseded | tasks/T-0269-approval-gated-npm-publish-for-0-2-0-rc-0 | Superseded by T-0275 rc.1 publish readiness. |
| T-0270 | Repository Skeleton Cleanup | Done | tasks/T-0270-repository-skeleton-cleanup | |
| T-0271 | npm Installed Toy Project Interface Recycle | Done | tasks/T-0271-npm-installed-toy-project-interface-recycle | |
| T-0272 | Run Scaffold Observation Match Hardening | Done | tasks/T-0272-run-scaffold-observation-match-hardening | |
| T-0273 | Fresh Init and Generic Project UX Hardening | Done | tasks/T-0273-fresh-init-and-generic-project-ux-hardening | |
| T-0274 | Lifecycle Status Clarity and Performance Hardening | Done | tasks/T-0274-lifecycle-status-clarity-and-performance-hardening | |
| T-0275 | Release Candidate 0.2.0-rc.1 Publish Readiness | Done | tasks/T-0275-release-candidate-0-2-0-rc-1-publish-readiness | Operator npm publish completed; npm view verified `0.2.0-rc.1`. |
| T-0276 | Python Bridge Package Preview | Done | tasks/T-0276-python-bridge-package-preview | Local `python/` PyPI bridge scaffold and validation; no TestPyPI/PyPI upload. |
| T-0277 | Python Trusted Publisher Workflow | Done | tasks/T-0277-python-trusted-publisher-workflow | |
| T-0278 | Python Bridge Version Alignment for rc.1 | Done | tasks/T-0278-python-bridge-version-alignment-for-rc-1 | |
| T-0279 | Init Scaffold Lifecycle Docs Alignment | Done | tasks/T-0279-init-scaffold-lifecycle-docs-alignment | |
| T-0280 | Init scaffold lifecycle wording follow-up | Done | tasks/T-0280-init-scaffold-lifecycle-wording-follow-up | |
| T-0281 | Init scaffold protocol guidance follow-up | Done | tasks/T-0281-init-scaffold-protocol-guidance-follow-up | |
| T-0282 | Release candidate 0.2.0-rc.2 publish readiness | Done | tasks/T-0282-release-candidate-0-2-0-rc-2-publish-readiness | Operator npm publish completed; npm view verified `0.2.0-rc.2`; GitHub draft false. |
| T-0283 | Document rc3 proof reliability dogfooding plan | Done | tasks/T-0283-document-rc3-proof-reliability-dogfooding-plan | |
| T-0284 | Implement evidence append idempotency and locking | Done | tasks/T-0284-implement-evidence-append-idempotency-and-locking | |
| T-0285 | Implement proof status explain freshness MVP | Done | tasks/T-0285-implement-proof-status-explain-freshness-mvp | |
| T-0286 | Implement rc3 CI gate MVP | Done | tasks/T-0286-implement-rc3-ci-gate-mvp | |
| T-0287 | Implement rc3 readiness and installed-package recycle | Done | tasks/T-0287-implement-rc3-readiness-and-installed-package-recycle | Prepared `hadara@0.2.0-rc.3` source candidate; package, clean-checkout, release artifact, release dry-run, publish dry-run, and fresh init/recycle smokes passed without publish mutation. |
| T-0288 | rc3 proof reliability hardening patch | Done | tasks/T-0288-rc3-proof-reliability-hardening-patch | |
| T-0289 | rc3 post-hardening release readiness refresh | Done | tasks/T-0289-rc3-post-hardening-release-readiness-refresh | |
| T-0290 | Stage Phase 7 surface refactor specs | Done | tasks/T-0290-stage-phase-7-surface-refactor-specs | |
| T-0291 | Implement Phase 7.1 command surface registry and structured help | Done | tasks/T-0291-implement-phase-7-1-command-surface-registry-and-structured-help | |
| T-0292 | Phase 7.2 Lifecycle Guide and Command Portfolio Audit | Done | tasks/T-0292-phase-7-2-lifecycle-guide-and-command-portfolio-audit | |
| T-0293 | Phase 7.3 Document Registry and Docs Doctor | Done | tasks/T-0293-phase-7-3-document-registry-and-docs-doctor | Added `.hadara/docs-registry.json` seed/projection, `docs list/doctor/explain`, schemas, tests, and built CLI smokes; standard wrapper timeout recorded. |
| T-0294 | Phase 7.4 Managed Sections and Safe Patch Plans | Done | tasks/T-0294-phase-7-4-managed-sections-and-safe-patch-plans | Added managed markers, `docs managed list/explain`, `docs patch`, patch-plan schema, tests, and built CLI smokes; standard wrapper timeout recorded. |
| T-0295 | Phase 7.5 Docs Cleanup Operations | Done | tasks/T-0295-phase-7-5-docs-cleanup-operations | Added `docs mark`, `docs archive`, `docs required-reading`, cleanup doctor warnings, schemas, focused tests, built CLI smoke, and full wrapper validation. |
| T-0296 | Phase 7.6 0.3.0 Release Hardening and Installed-Package Recycle | Done | tasks/T-0296-phase-7-6-0-3-0-release-hardening-and-installed-package-recycle | |
| T-0297 | 0.3.0-rc.0 prepublish cleanup and final readiness | Done | tasks/T-0297-0-3-0-rc-0-prepublish-cleanup-and-final-readiness | |
| T-0298 | 0.3.0-rc.1 publish metadata hardening | Done | tasks/T-0298-0-3-0-rc-1-publish-metadata-hardening | |
| T-0299 | 0.3.0-rc.1 protocol migration for 0.3 adoption | Done | tasks/T-0299-0-3-0-rc-1-protocol-migration-for-0-3-adoption | |
| T-0300 | Protocol migrate task evidence preservation blocker fix | Done | tasks/T-0300-protocol-migrate-task-evidence-preservation-blocker-fix | |
| T-0301 | 0.3.0-rc.1 final readiness and publish preparation | Done | tasks/T-0301-0-3-0-rc-1-final-readiness-and-publish-preparation | Operator npm publish completed; npm view verified `0.3.0-rc.1`; GitHub draft false. |
| T-0302 | 0.3.0-rc.1 post-publish installed-package recycle | Done | tasks/T-0302-0-3-0-rc-1-post-publish-installed-package-recycle | Published package registry/npx/global/help/docs/migration/lifecycle recycle passed; fresh-init doctor context friction recorded. |
| T-0303 | Fresh Init + Migration Context Scaffold and Doctor/Docs Cleanliness | Done | tasks/T-0303-fresh-init-migration-context-scaffold-and-doctor-docs-cleanlines | |
| T-0304 | Workflow Documentation Timing and Concurrency Guidance | Done | tasks/T-0304-workflow-documentation-timing-and-concurrency-guidance | |
| T-0305 | Task Board Row Preservation in task finish | Done | tasks/T-0305-task-board-row-preservation-in-task-finish | |
| T-0306 | Ready/Close Failure Guidance Improvement | Done | tasks/T-0306-ready-close-failure-guidance-improvement | |
| T-0307 | Required Reading Tier Guidance | Done | tasks/T-0307-required-reading-tier-guidance | |
| T-0308 | Required Reading Command Output Tiering | Done | tasks/T-0308-required-reading-command-output-tiering | |
| T-0309 | Protocol Migration Atomic Execute Hardening | Done | tasks/T-0309-protocol-migration-atomic-execute-hardening | |
| T-0310 | 0.3.0-rc.2 Readiness and Publish Preparation | Done | tasks/T-0310-0-3-0-rc-2-readiness-and-publish-preparation | |
| T-0311 | Atomic Write Path Containment Hardening | Done | tasks/T-0311-atomic-write-path-containment-hardening | |
| T-0312 | 0.3.0-rc.2 Post-Publish Installed-Package Recycle | Done | tasks/T-0312-0-3-0-rc-2-post-publish-installed-package-recycle | |
| T-0313 | HADARA-dev Docs Registry Artifact Dogfooding | Done | tasks/T-0313-hadara-dev-docs-registry-artifact-dogfooding | |
| T-0314 | Docs Patch Execute Atomic Write Hardening | Done | tasks/T-0314-docs-patch-execute-atomic-write-hardening | |
| T-0315 | Stable 0.3.0 Release Readiness Preparation | Done | tasks/T-0315-stable-0-3-0-release-readiness-preparation | Stable `0.3.0` source/readiness prepared; publish remains T-0316. |
| T-0316 | Stable 0.3.0 Approval-Gated Publish | Done | tasks/T-0316-stable-0-3-0-approval-gated-publish | Operator npm publish completed; npm view verified `0.3.0`; GitHub draft false. |
| T-0317 | Stable 0.3.0 Post-Publish Installed-Package Recycle | Done | tasks/T-0317-stable-0-3-0-post-publish-installed-package-recycle | |
| T-0318 | Stage Phase 8 0.3.1 status governance specs | Done | tasks/T-0318-stage-phase-8-0-3-1-status-governance-specs | |
| T-0319 | Phase 8.1 Status Token Policy and Document Ownership | Done | tasks/T-0319-phase-8-1-status-token-policy-and-document-ownership | |
| T-0320 | Phase 8.2 Task Handoff Current-State and Close-State Governance | Done | tasks/T-0320-phase-8-2-task-handoff-current-state-and-close-state-governance | |
| T-0321 | Phase 8.3 Installed-Package Findings Cleanup | Done | tasks/T-0321-phase-8-3-installed-package-findings-cleanup | |
| T-0322 | Phase 8.4 State Consistency Projection Read Model | Done | tasks/T-0322-phase-8-4-state-consistency-projection-read-model | |
| T-0323 | Phase 8.5 State Verify Doctor and Advisory Gates | Done | tasks/T-0323-phase-8-5-state-verify-doctor-and-advisory-gates | |
| T-0324 | Phase 8.6 rc1 Review and Hardening Cleanup | Done | tasks/T-0324-phase-8-6-rc1-review-and-hardening-cleanup | |
| T-0325 | Phase 8 CloseState handoff drift cleanup | Done | tasks/T-0325-phase-8-closestate-handoff-drift-cleanup | |
| T-0326 | 0.3.1-rc.1 Release Readiness Preparation | Done | tasks/T-0326-0-3-1-rc-1-release-readiness-preparation | Readiness validation complete; no publish mutation; publish remains T-0327. |
| T-0327 | 0.3.1-rc.1 Approval-Gated Publish | Done | tasks/T-0327-0-3-1-rc-1-approval-gated-publish | npm publish, registry/tarball verification, and dist-tag correction passed; close workflow pending. |
| T-0328 | 0.3.1-rc.1 Post-Publish Installed-Package Recycle | Done | tasks/T-0328-0-3-1-rc-1-post-publish-installed-package-recycle | Installed-package recycle passed; close workflow pending. |
| T-0329 | Post rc1 state docs cleanup | Done | tasks/T-0329-post-rc1-state-docs-cleanup | |
| T-0330 | Phase 9 Evidence v2 Writer Stabilization | Done | tasks/T-0330-phase-9-evidence-v2-writer-stabilization | |
| T-0331 | Evidence v2 Writer Hardening and Handoff Cleanup | Done | tasks/T-0331-evidence-v2-writer-hardening-and-handoff-cleanup | |
| T-0332 | Evidence v2 Core Writer Guard | Done | tasks/T-0332-evidence-v2-core-writer-guard | |
| T-0333 | Evidence v2 ID Visibility and List UX | Done | tasks/T-0333-evidence-v2-id-visibility-and-list-ux | |
| T-0334 | Evidence Rebuild Boundary Design Only | Done | tasks/T-0334-evidence-rebuild-boundary-design-only | |
| T-0335 | Evidence v2 Docs Consolidation | Done | tasks/T-0335-evidence-v2-docs-consolidation | |
| T-0336 | 0.3.2-rc.0 Release Readiness Preparation | Done | tasks/T-0336-0-3-2-rc-0-release-readiness-preparation | |
| T-0337 | 0.3.2-rc.0 Approval-Gated Publish | Done | tasks/T-0337-0-3-2-rc-0-approval-gated-publish | Published `hadara@0.3.2-rc.0` to npm with `next`; verified `latest=0.3.0`, `next=0.3.2-rc.0`, README/tarball metadata; no GitHub Release draft. |
| T-0338 | 0.3.2-rc.0 Post-Publish Installed-Package Recycle | Done | tasks/T-0338-0-3-2-rc-0-post-publish-installed-package-recycle | Installed-package recycle passed from temp-prefix bin; exact `npx` resolved stale local shim and is recorded as environment finding. |
| T-0339 | Stable 0.3.2 Decision | Done | tasks/T-0339-stable-0-3-2-decision | Stable `0.3.2` publish selected; T-0340 created for approval-gated publish. |
| T-0340 | Stable 0.3.2 Approval-Gated Publish | Done | tasks/T-0340-stable-0-3-2-approval-gated-publish | Published `hadara@0.3.2` to npm; npm view verified `0.3.2`; dist-tags verified `latest=0.3.2` and `next=0.3.2-rc.0`; GitHub Release draft was not requested. |
| T-0341 | Stable 0.3.2 Post-Publish Installed-Package Recycle | Done | tasks/T-0341-stable-0-3-2-post-publish-installed-package-recycle | Installed-package recycle passed from temp-prefix bin. |
| T-0342 | Context Routing Spec Docs Registration | Done | tasks/T-0342-context-routing-spec-docs-registration | |
| T-0343 | Context Graph Schema Types and Fixtures | Done | tasks/T-0343-context-graph-schema-types-and-fixtures | |
| T-0344 | Context Graph Extractor Contract | Done | tasks/T-0344-context-graph-extractor-contract | |
| T-0345 | Context Graph Task Extractors | Done | tasks/T-0345-context-graph-task-extractors | |
| T-0346 | Context Graph Registry Extractors | Done | tasks/T-0346-context-graph-registry-extractors | |
| T-0347 | Context Graph Evidence Extractor | Done | tasks/T-0347-context-graph-evidence-extractor | |
| T-0348 | Context Graph Managed Section Decision Extractors | Done | tasks/T-0348-context-graph-managed-section-decision-extractors | |
| T-0349 | Context Graph Release Readiness Extractor | Done | tasks/T-0349-context-graph-release-readiness-extractor | |
| T-0350 | C1 State Projection and Consistency Diagnostics | Done | tasks/T-0350-c1-state-projection-and-consistency-diagnostics | |
| T-0351 | C1 Graph Builder and Task Context Report | Done | tasks/T-0351-c1-graph-builder-and-task-context-report | |
| T-0352 | Create/start C1 Context Graph CLI and Read Surface | Done | tasks/T-0352-create-start-c1-context-graph-cli-and-read-surface | |
| T-0353 | C2 Code Index Schema and Ignore Rules | Done | tasks/T-0353-c2-code-index-schema-and-ignore-rules | |
| T-0354 | C2 Import and Export Extraction | Done | tasks/T-0354-c2-import-and-export-extraction | |
| T-0355 | C2 Symbol Extraction | Done | tasks/T-0355-c2-symbol-extraction | |
| T-0356 | C2 Command Implementation and Test File Hints | Done | tasks/T-0356-c2-command-implementation-and-test-file-hints | |
| T-0357 | C2 Test Relation Edges | Done | tasks/T-0357-c2-test-relation-edges | |
| T-0358 | C2 Context Graph Integration | Done | tasks/T-0358-c2-context-graph-integration | |
| T-0359 | C2 Code Index Budget Hardening | Done | tasks/T-0359-c2-code-index-budget-hardening | |
| T-0360 | C6 Fast Context Cache Spec | Done | tasks/T-0360-c6-fast-context-cache-spec | Added detailed C6 speed-first cache/performance spec, linked C6 routing docs, and registered the spec in SOP/docs registry surfaces. |
| T-0361 | C3 Context Pack Schema and Ranking | Done | tasks/T-0361-c3-context-pack-schema-and-ranking | Internal `hadara.contextPack.v1` schema/ranking builder; public CLI and C4 slicing deferred. |
| T-0362 | C3 Context Pack CLI from Graph Only | Done | tasks/T-0362-c3-context-pack-cli-from-graph-only | Public read-only context pack CLI implemented; C6.1 speed work next. |
| T-0363 | C6.1 Source Manifest and Shared Discovery | Done | tasks/T-0363-c6-1-source-manifest-and-shared-discovery | Internal source manifest schema/helper added; C6.2 cache store/status next. |
| T-0364 | C6.2 Cache Store and Status Read Model | Done | tasks/T-0364-c6-2-cache-store-and-status-read-model | Cache store/status implemented; C6.3 warm/integration next before C4. |
| T-0365 | C6.3 Cache Warm or Graph Code Index Cache Integration | Done | tasks/T-0365-c6-3-cache-warm-or-graph-code-index-cache-integration | C6 performance spec hardening in progress before cache-warm implementation. |
| T-0366 | C6.3 Cache Warm Phase 1 Implementation | Done | tasks/T-0366-c6-3-cache-warm-phase-1-implementation | Source-manifest cache warm phase 1. |
| T-0367 | C6.4 High Impact Extractor Shard Cache | Done | tasks/T-0367-c6-4-high-impact-extractor-shard-cache | |
| T-0368 | C6.5 Fast Cold Build and Graph Hot Path | Done | tasks/T-0368-c6-5-fast-cold-build-and-graph-hot-path | Added git worktree source-manifest fingerprints and fast cached-manifest reuse for cache status/warm and context graph shard reads. |
| T-0369 | C4 Deterministic Context Slice Core | Done | tasks/T-0369-c4-deterministic-context-slice-core | Added `hadara context slice` with schema-valid read-only explicit range, tail, keyword-window, and managed-section strategies. |
| T-0370 | C4 Symbol and Context Candidate Slicing | Done | tasks/T-0370-c4-symbol-and-context-candidate-slicing | Added read-only `context slice --symbol` and `--task --candidate` support over C2 symbols and C3 slice candidates. |
| T-0371 | C6 Speed-First Graph Cache Spec Refresh | Done | tasks/T-0371-c6-speed-first-graph-cache-spec-refresh | Added registered `08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md` with Graphify-aware speed-first cold/warm graph, code-index, and context-pack cache design. |
| T-0372 | C4 Context Slice Boundary and Proof Drift Hardening | Done | tasks/T-0372-c4-context-slice-boundary-and-proof-drift-hardening | |
| T-0373 | C6 ext4 Mounted Performance Baseline | Done | tasks/T-0373-c6-ext4-mounted-performance-baseline | |
| T-0374 | C6 Graph Core and Context Pack Warm Path | Done | tasks/T-0374-c6-graph-core-and-context-pack-warm-path | |
| T-0375 | C6 Code Index Shard Persistence | Done | tasks/T-0375-c6-code-index-shard-persistence | |
| T-0376 | Context Boundary and Warm Path Review Hardening | Done | tasks/T-0376-context-boundary-and-warm-path-review-hardening | Review items 1-4 hardened slice boundaries, graph-core tests, benchmark timeout handling, and context-pack command args. |
| T-0377 | C6 Incremental Code Index Recompute | Done | tasks/T-0377-c6-incremental-code-index-recompute | Explicit warm execute now reuses per-file code-index summaries and recomputes only changed/bad files. |
| T-0378 | Bounded C5 Session Start MVP | Done | tasks/T-0378-bounded-c5-session-start-mvp | |
| T-0379 | C6 Warm Pack and Session Start Cache Refinement | Done | tasks/T-0379-c6-warm-pack-and-session-start-cache-refinement | |
| T-0380 | C6 Performance Regression Fixtures | Done | tasks/T-0380-c6-performance-regression-fixtures | |
| T-0381 | Context Routing Spec Completion Audit | Done | tasks/T-0381-context-routing-spec-completion-audit | Added registered implementation completion audit and routed T-0382 next. |
| T-0382 | Session Start JSON UX Hardening | Done | tasks/T-0382-session-start-json-ux-hardening | Added structured Session Start guidance and no-task degraded-ok UX. |
| T-0383 | Context Routing E2E Smoke Pack | Done | tasks/T-0383-context-routing-e2e-smoke-pack | Added fast/full context-routing E2E smoke script profiles with cache no-write fingerprint checks. |
| T-0384 | Cache Warm Diagnostics Cleanup | Done | tasks/T-0384-cache-warm-diagnostics-cleanup | Added additive cache diagnostics for stale/corrupt/partial states, slow-path metadata, and warm command args. |
| T-0385 | 0.3.3 Readiness Cleanup | Done | tasks/T-0385-0-3-3-readiness-cleanup | |
| T-0386 | Acceptance Parser v2 Lifecycle Follow-up | Done | tasks/T-0386-acceptance-parser-v2-lifecycle-follow-up | |
| T-0387 | Context Slice/Pack Security Boundary Final Audit | Done | tasks/T-0387-context-slice-pack-security-boundary-final-audit | |
| T-0388 | Context Pack Read Recommendation Boundary Metadata | Done | tasks/T-0388-context-pack-read-recommendation-boundary-metadata | |
| T-0389 | Context Pack Item Source Hash Fidelity | Done | tasks/T-0389-context-pack-item-source-hash-fidelity | |
| T-0390 | Context Pack Slice Candidate Range Hardening | Done | tasks/T-0390-context-pack-slice-candidate-range-hardening | |
| T-0391 | Task Next Self Referential Handoff Guidance Hardening | Done | tasks/T-0391-task-next-self-referential-handoff-guidance-hardening | |
| T-0392 | Lifecycle Workflow Agent Convenience Spec and Budget | Done | tasks/T-0392-lifecycle-workflow-agent-convenience-spec-and-budget | |
| T-0393 | Task Lifecycle Read Model | Done | tasks/T-0393-task-lifecycle-read-model | |
| T-0394 | Close Repair Plan Read Model | Done | tasks/T-0394-close-repair-plan-read-model | |
| T-0395 | Lifecycle Guidance Dedup Hardening | Done | tasks/T-0395-lifecycle-guidance-dedup-hardening | |
| T-0396 | Task Finalize Dry-Run Plan | Done | tasks/T-0396-task-finalize-dry-run-plan | |
| T-0397 | Task Finalize Execute Guard | Done | tasks/T-0397-task-finalize-execute-guard | |
| T-0398 | Lifecycle Scenario Docs and Init Alignment | Done | tasks/T-0398-lifecycle-scenario-docs-and-init-alignment | |
| T-0399 | Finalize Evidence Guidance and Lifecycle Speed Hardening | Done | tasks/T-0399-finalize-evidence-guidance-and-lifecycle-speed-hardening | |
| T-0400 | Default Lifecycle Finalize Documentation | Done | tasks/T-0400-default-lifecycle-finalize-documentation | Made the 0.3.3 finalize-first lifecycle the default agent-facing path in docs, init templates, help, registry, and lifecycle projection. |
| T-0401 | 0.3.3-rc.0 Release Readiness Preparation | Done | tasks/T-0401-0-3-3-rc-0-release-readiness-preparation | Prepared `hadara@0.3.3-rc.0` source/readiness; Docker validation, release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, and publish dry-run passed without publish mutation. |
| T-0402 | 0.3.3-rc.0 Approval-Gated Publish | Done | tasks/T-0402-0-3-3-rc-0-approval-gated-publish | Published `hadara@0.3.3-rc.0` to npm with `next`; registry, dist-tags, tarball metadata, temp-prefix installed-bin smoke, and close audit passed. |
| T-0403 | 0.3.3 dogfood SaaS spec and capsule budget | Done | tasks/T-0403-0-3-3-dogfood-saas-spec-and-capsule-budget | Adds PatternForge procedural asset SaaS dogfood spec with 22-capsule budget and HADARA init/lifecycle/context evaluation criteria. |
| T-0404 | 0.3.3 dogfood findings release hardening | Done | tasks/T-0404-0-3-3-dogfood-findings-release-hardening | |
| T-0405 | 0.3.3 stable release readiness refresh | Done | tasks/T-0405-0-3-3-stable-release-readiness-refresh | |
| T-0406 | 0.3.3 stable approval-gated publish | Done | tasks/T-0406-0-3-3-stable-approval-gated-publish | Published `hadara@0.3.3` to npm with `latest`; registry/dist-tags and temporary-prefix installed-bin smoke passed. |
| T-0407 | Stable 0.3.3 post-publish installed-package recycle | Done | tasks/T-0407-stable-0-3-3-post-publish-installed-package-recycle | Verified published `hadara@0.3.3` from npm consumer paths: registry/dist-tags, temp-prefix install, installed bin, init, lifecycle/finalize, context, cache, session start, and cleanup passed. |
| T-0408 | 0.3.4 Agent UX Hardening spec and capsule budget | Done | tasks/T-0408-0-3-4-agent-ux-hardening-spec-and-capsule-budget | Added registered 0.3.4 Agent UX Hardening spec and capsule budget; next implementation starts with T-0409 handoff stale known-problem detection. |
| T-0409 | Handoff Stale Known-Problem Detector | Done | tasks/T-0409-handoff-stale-known-problem-detector | Added read-only `handoff stale-problems --json` candidate report with schema, CLI routing, command registry entry, focused tests, and built smoke. |
| T-0410 | Release Closeout Read-Only Plan | Done | tasks/T-0410-release-closeout-read-only-plan | Added read-only `release closeout --version --task --json` planning report with schema, CLI routing, registry/docs entries, focused tests, and built smoke. |
| T-0411 | Evidence Compact ID UX | Done | tasks/T-0411-evidence-compact-id-ux | Added read-only `evidence summary --task --json` compact id/copy-hint report with schema, CLI routing, registry/docs entries, focused tests, and built smokes. |
| T-0412 | Finalize Post-Close Drift Guidance | Done | tasks/T-0412-finalize-post-close-drift-guidance | Finalize/lifecycle now treat close-source drift as repair-required and route to close repair guidance; focused tests and built smokes passed. |
| T-0413 | Installed-Package Recycle Script UX | Done | tasks/T-0413-installed-package-recycle-script-ux | Added dry-run-first `hadara package recycle` with schema/docs/tests for post-publish installed-package consumer-path validation. |
| T-0414 | Session Start Primary-Action Hardening | Done | tasks/T-0414-session-start-primary-action-hardening | Session Start now exposes concrete primaryAction/nextCommandArgs guidance and task-scoped starts prioritize task lifecycle. |
| T-0415 | Context Pack Agent Actionability | Done | tasks/T-0415-context-pack-agent-actionability | Context Pack now emits read-only prioritized `agentActions`, improves task-local/source-specific ranking reasons, and preserves raw slice boundary metadata. |
| T-0416 | Init Generated Docs Agent Guidance Cleanup | Done | tasks/T-0416-init-generated-docs-agent-guidance-cleanup | Generated init docs now show the 0.3.4 task next -> session start -> lifecycle -> finalize loop while keeping low-level proof-boundary commands for debugging/recovery. |
| T-0417 | 0.3.4 RC Readiness Preparation | Done | tasks/T-0417-0-3-4-rc-readiness-preparation | Prepared `hadara@0.3.4-rc.0` source/readiness; Docker focused tests, built version smoke, release artifact, release dry-run, publish dry-run, package smoke dry-run, and whitespace checks passed without publish mutation. |
| T-0418 | 0.3.4 RC Approval-Gated Publish | Done | tasks/T-0418-0-3-4-rc-approval-gated-publish | `hadara@0.3.4-rc.0` was published to npm with dist-tag `next`; npm view verified the exact version and GitHub Release draft was skipped. |
| T-0419 | Dashboard API Route Timeout Hardening | Done | tasks/T-0419-dashboard-api-route-timeout-hardening | Hotfix for publish-blocking dashboard API route timeout; status route avoids debt scan and bootstrap defaults to core tier. |
| T-0420 | Full Suite Timeout Release Validation Hardening | Done | tasks/T-0420-full-suite-timeout-release-validation-hardening | Full Vitest suite timeout hardening for 0.3.4 RC publish retry; Docker ext4 full suite passed 144 files / 947 tests. |
| T-0421 | Clean Checkout Publish Smoke Failure Hardening | Done | tasks/T-0421-clean-checkout-publish-smoke-failure-hardening | Hotfix for clean-checkout publish smoke dashboard debt route timeout; focused validation and clean-checkout `npm run check` recheck passed. |
| T-0422 | 0.3.4-rc.0 Post-Publish Installed-Package Recycle | Done | tasks/T-0422-0-3-4-rc-0-post-publish-installed-package-recycle | Installed-package acceptance passed from `hadara@next`; package recycle helper residual was fixed by T-0423. |
| T-0423 | Package Recycle Helper Residual Fix | Done | tasks/T-0423-package-recycle-helper-residual-fix | Default package recycle now uses fast installed-agent UX path, `context graph` is opt-in, source workspace env leakage is fixed, and `hadara@next` installed recycle passed. |
| T-0424 | 0.4 Spec Finalization and Canonicalization | Done | tasks/T-0424-0-4-spec-finalization-and-canonicalization | Finalized canonical 0.4 productization specs under `docs/specs/0.4.0/productization-redesign/`; registration deferred to T-04A1. |
| T-0425 | 0.4 Workflow Template Clarification | Done | tasks/T-0425-0-4-workflow-template-clarification | Clarifies 0.4 AGENTS Required Reading and HADARA_WORKFLOW project-start/lifecycle/document-timing guidance before T-04A1 registration. |
| T-0426 | 0.4 Template Final Review Hold Open | Done | tasks/T-0426-0-4-template-final-review-hold-open | Focused docs validation passed in `ev:T-0426:496e55c598814f8d8a09cff6`; operator accepted closure and close audit passed. |
| T-0427 | T-04A1 0.4 Breaking Productization Spec Registration | Done | tasks/T-0427-t-04a1-0-4-breaking-productization-spec-registration | 0.4 spec registry registration passed in `ev:T-0427:8f087c4cf64747628829a5dc`; close audit passed. |
| T-0428 | T-04A2 0.4 Init Scaffold Model | Done | tasks/T-0428-t-04a2-0-4-init-scaffold-model | 0.4 init scaffold validation passed in `ev:T-0428:f09b011734c84cab8034facf`; close audit passed. |
| T-0429 | T-04A3 Agent Entry and Workflow Templates | Done | tasks/T-0429-t-04a3-agent-entry-and-workflow-templates | Agent/workflow template validation passed in `ev:T-0429:ab675a5933c84286b8d255fc`; close audit passed. |
| T-0430 | T-04A4 Docs Registry Storage and Register Surface | Done | tasks/T-0430-t-04a4-docs-registry-storage-and-register-surface | Docs register validation passed in `ev:T-0430:1933b10f80184f8abb9540cb`; close audit passed. |
| T-0431 | T-04A5 Docs Read Map and Drift Diagnostics | Done | tasks/T-0431-t-04a5-docs-read-map-and-drift-diagnostics | Docs read-map/inbox validation passed in `ev:T-0431:a81383c6d7894693a45a95ed`; close-ready. |
| T-0432 | T-04A6 Task Capsule Create Path | Done | tasks/T-0432-t-04a6-task-capsule-create-path | 0.4 task create validation passed in `ev:T-0432:6e7934c04498493ba76eac8f`; close-ready. |
| T-0433 | T-04A7 TASK.md Table Schema and Controlled Values | Done | tasks/T-0433-t-04a7-task-md-table-schema-and-controlled-values | |
| T-0434 | T-04A8 Source Document Hash and Drift Link | Done | tasks/T-0434-t-04a8-source-document-hash-and-drift-link | Source document hash/drift validation passed in `ev:T-0434:ca9cc42e94a44af4b02e893f`. |
| T-0435 | T-04A9 Managed Slot v2 Registry Hash | Done | tasks/T-0435-t-04a9-managed-slot-v2-registry-hash | Slot registry close proof validation passed in `ev:T-0435:31e917471a95404882ef0bdb`. |
| T-0436 | T-04A10 Evidence Projection | Done | tasks/T-0436-t-04a10-evidence-projection | Evidence projection validation passed in `ev:T-0436:f4c57fd4dc6a4d9dbffedfe0`. |
| T-0437 | T-04A11 Close Proof Placement | Done | tasks/T-0437-t-04a11-close-proof-placement | Close proof placement validation passed in `ev:T-0437:fc850943950547939127f430`. |
| T-0438 | T-04A12 Close Source Contract | Done | tasks/T-0438-t-04a12-close-source-contract | Close-source contract validation passed in `ev:T-0438:9462d50758aa418c84318576`. |
| T-0439 | T-04A13 Legacy Project Boundary | Done | tasks/T-0439-t-04a13-legacy-project-boundary | |
| T-0440 | T-04A13 Legacy Project Boundary | Done | tasks/T-0440-t-04a13-legacy-project-boundary | |
| T-0441 | T-04A14 Session Start Read-Map Integration | Done | tasks/T-0441-t-04a14-session-start-read-map-integration | |
| T-0442 | T-04A15 Context Pack Read-Map Integration | Done | tasks/T-0442-t-04a15-context-pack-read-map-integration | |
| T-0443 | T-04A16 Authoring Guidance Read Models | Done | tasks/T-0443-t-04a16-authoring-guidance-read-models | |
| T-0444 | Reviewer Feedback Residual Hardening | Done | tasks/T-0444-reviewer-feedback-residual-hardening | Reviewer feedback residual hardening passed in `ev:T-0444:68cba6d6c6e84a9f84e879ca` and `ev:T-0444:5cba035f87e74b3692ac3df6`. |
| T-0445 | T-04A17 Init Doctor and Profile Diagnostics | Done | tasks/T-0445-t-04a17-init-doctor-and-profile-diagnostics | Init doctor/profile diagnostics validation passed in `ev:T-0445:c894a34281b648be844445e2`. |
| T-0446 | T-04A18 Command Registry, Help, and Schema Alignment | Done | tasks/T-0446-t-04a18-command-registry-help-and-schema-alignment | Command registry/help/schema alignment validation passed in `ev:T-0446:1fc3397609c84c049282d0e2`. |
| T-0447 | T-04A19 Product Default Cleanup | Done | tasks/T-0447-t-04a19-product-default-cleanup | Product default cleanup validation passed in `ev:T-0447:b19bfcb789b64223bb4f4f45`. |
| T-0448 | T-04A20 Basic Profile Dogfood | Done | tasks/T-0448-t-04a20-basic-profile-dogfood | Basic profile dogfood validation passed in `ev:T-0448:9a048c17494b4a9fa625d603`. |
| T-0449 | T-04A21 Governed Profile Dogfood | Done | tasks/T-0449-t-04a21-governed-profile-dogfood | Governed profile dogfood validation passed in `ev:T-0449:a81f3af0c4ab408eba907092`. |
| T-0450 | T-04A22 Lifecycle UX Hardening | Done | tasks/T-0450-t-04a22-lifecycle-ux-hardening | Lifecycle UX hardening validation passed; wrapper dogfood evidence recorded. |
| T-0451 | T-04A23 Validation Run Workflow Polish | Done | tasks/T-0451-t-04a23-validation-run-workflow-polish | `validation run` is now the default generated workflow/lifecycle evidence path; `evidence add-command` is an already-run fallback. |
| T-0452 | T-04A24 Final Review and Documentation Cleanup | Done | tasks/T-0452-t-04a24-final-review-and-documentation-cleanup | Final 0.4 implementation-budget handoff/readiness cleanup passed; release work remains separate. |
| T-0453 | Agent UX Validation Run Task Sync Decoupling | Done | tasks/T-0453-agent-ux-validation-run-task-sync-decoupling | First agent UX refactor capsule after T-0452 dogfood; decouples validation evidence capture from automatic TASK.md row sync. |
| T-0454 | Agent UX Validation Attempt Auto Resolution | Done | tasks/T-0454-agent-ux-validation-attempt-auto-resolution | Same-check validation retries now auto-resolve earlier failed or blocked attempts with durable evidence tags. |
| T-0455 | Agent UX Validation Latest Attempt Projection | Done | tasks/T-0455-agent-ux-validation-latest-attempt-projection | `task status` now projects per-check validation attempt state and unresolved failed/blocked counts. |
| T-0456 | Agent UX Evidence Help Mutation Guard | Done | tasks/T-0456-agent-ux-evidence-help-mutation-guard | `evidence add-command --help` now prints help without appending evidence or requiring `--task`. |
| T-0457 | Agent UX Validation Wrapper Error Semantics | Done | tasks/T-0457-agent-ux-validation-wrapper-error-semantics | `validation run` launch failures now expose structured failureKind/error metadata and fallback next actions. |
| T-0458 | Agent UX Task Status Lifecycle Cockpit | Done | tasks/T-0458-agent-ux-task-status-lifecycle-cockpit | |
| T-0459 | Agent UX init scaffold and source document hardening | Done | tasks/T-0459-agent-ux-init-scaffold-and-source-document-hardening | |
| T-0460 | Consider a small CLI global-option parsing capsule | Done | tasks/T-0460-consider-a-small-cli-global-option-parsing-capsule | |
| T-0461 | Agent UX task status authoring suggestions | Done | tasks/T-0461-agent-ux-task-status-authoring-suggestions | |
| T-0462 | Agent UX fresh init quickstart verbosity hardening | Done | tasks/T-0462-agent-ux-fresh-init-quickstart-verbosity-hardening | |
| T-0463 | Agent UX status finalize latency diagnostics | Done | tasks/T-0463-agent-ux-status-finalize-latency-diagnostics | Adds additive CLI duration/slow diagnostics to `task status` and `task finalize`. |
| T-0464 | Agent UX finalize execute progress output | Done | tasks/T-0464-agent-ux-finalize-execute-progress-output | Adds execute-only finalize progress output on stderr. |
| T-0465 | Finalize staged plan hardening | Done | tasks/T-0465-finalize-staged-plan-hardening | Makes finalize dry-run expose deferred checks and partial execution risk. |
| T-0466 | Next action message summary dedupe | Done | tasks/T-0466-next-action-message-summary-dedupe | Removes redundant lifecycle next-action `message` output; RF-1 tracks adjacent close-repair-plan hash drift. |
| T-0467 | Close repair diagnostic and change summary UX | Done | tasks/T-0467-close-repair-diagnostic-and-change-summary-ux | Clarifies repair-plan as conditional diagnostic and adds Change Summary UX; validation evidence `ev:T-0467:e6450a6e21b6450dbaae39ed`, smoke `ev:T-0467:a469046512334522b0bc0418`. |
| T-0468 | Task status fast path and Change Summary schema cleanup | Done | tasks/T-0468-task-status-fast-path-and-change-summary-schema-cleanup | Default selected-task status fast path, Change Summary Area schema, and no git candidate rows; validation `ev:T-0468:91055b787fda40469bca06b5`, smoke `ev:T-0468:73df1894fd45461c9d043e28`, final rerun `ev:T-0468:ea4c3539ac3144bd8d299aab`. |
| T-0469 | Finalize close-boundary repair UX | Done | tasks/T-0469-finalize-close-boundary-repair-ux | Finalize now owns close-proof repair; closed-valid status has no lifecycle next action; validation `ev:T-0469:557a38f24fca4928a1893911`, build `ev:T-0469:95dfca9fc3c24f79b75bfec5`, smoke `ev:T-0469:efd716488ee4420cb7d94697`. |
| T-0470 | Full diagnostics finalize performance optimization | Done | tasks/T-0470-full-diagnostics-finalize-performance-optimization | Task-scoped close/finalize diagnostics avoid broad task scans; audit/full status mounted smokes improved; evidence `ev:T-0470:00190a9390e54a3db393d461`, `ev:T-0470:f5fc721056374e47b4a4ea43`, `ev:T-0470:b0beb3b22fea47f1b51b7c78`. |
| T-0471 | Protocol consistency legacy fixture cleanup | Done | tasks/T-0471-protocol-consistency-legacy-fixture-cleanup | Protocol doctor now reads current TASK.md Acceptance when legacy ACCEPTANCE.md is absent; protocol fixtures no longer assume removed FILES.md/ACCEPTANCE.md defaults; evidence `ev:T-0471:f1ba74206a9c4900a0dc68aa`, `ev:T-0471:f7a1d36929d7422fab03d9b9`, `ev:T-0471:0062866455bb449ebee07c0e`, `ev:T-0471:c9c0dfa110ec49a98e152ba8`. |
| T-0472 | Legacy sidecar reference audit | Done | tasks/T-0472-legacy-sidecar-reference-audit | Current 0.4 TASK.md fallback added across release closeout, state projection, harness plan drift, operational debt, evidence lint, and TUI read models; evidence `ev:T-0472:464654f09f824d09ad4e6a4e`, `ev:T-0472:ddf2c1f180054178b95a26a1`, `ev:T-0472:758500c96600471bb12c7bb8`, `ev:T-0472:abb18b6756a440a89fc68fd6`. |
| T-0473 | Global docs/profile diagnostics performance or compatibility-only sidecar cleanup decision | Done | tasks/T-0473-global-docs-profile-diagnostics-performance-or-compatibility-onl | Default workbench/dashboard status paths should stay fast; full docs/profile diagnostics remain explicit. |
| T-0474 | Dashboard API aggregate route latency profiling | Done | tasks/T-0474-dashboard-api-aggregate-route-latency-profiling | Timeline task-scoped route avoids broad capsule scan; status/tasks/bootstrap share process cache; evidence `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:814e9786faaa41aabd4b0087`, `ev:T-0474:7878feaa7ef14577b16e08ff`. |
| T-0475 | Compatibility-only legacy sidecar cleanup | Done | tasks/T-0475-compatibility-only-legacy-sidecar-cleanup | Current template, upgrade-scaffold, write-preflight, and TUI surfaces no longer expose legacy sidecar defaults; evidence `ev:T-0475:0fec147f12bb41c0bd76a38d`, `ev:T-0475:2f903acccdb647639c859021`, `ev:T-0475:e93357bbff7d4ea18e287b79`. |
| T-0476 | Final release-line code preflight hardening | Done | tasks/T-0476-final-release-line-code-preflight-hardening | Explicit task-scoped CI gate uses exact lookup; CI/release fixtures use current capsule docs without legacy sidecars; evidence `ev:T-0476:82360c5c03b346218210b7ba`, `ev:T-0476:6fe19cde6d3d4b00912d993a`, `ev:T-0476:719663c6debc4b11b269c3f5`. |
| T-0477 | 0.4.0-rc.0 release readiness and notes | Done | tasks/T-0477-0-4-0-rc-0-release-readiness-and-notes | Source/readiness/docs prepared and operator publish completed; npm verified `version=0.4.0-rc.0`, `next=0.4.0-rc.0`, `latest=0.3.3`; evidence `ev:T-0477:8f87cd1d94cc44be90dfa5ad`. |
| T-0478 | 0.4.0-rc.0 publish env safe-directory fix | Done | tasks/T-0478-0-4-0-rc-0-publish-env-safe-directory-fix | Publish preparation helper now registers both `/workspace` and `/workspace/.git` as Git safe directories before cloning; helper smoke passed through clone, npm ci, build, strict release gate, and clean final worktree. |
| T-0479 | 0.4.0-rc.0 installed dogfood MVP build | Done | tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build | Fresh unmounted container installed `hadara@0.4.0-rc.0`; FlowForge dogfood MVP produced specs, 12 capsules, 5,397 non-document LOC, smoke pass, command timing metrics, and structured HADARA UX findings. |
| T-0480 | Dogfood artifact status cleanup | Done | tasks/T-0480-dogfood-artifact-status-cleanup | FlowForge dogfood artifact internal capsules and global docs no longer remain in Draft/scaffold state; all 12 internal capsules were finalized to closed-valid and smoke still passed. |
| T-0481 | Task Capsule human-readable schema cleanup | Done | tasks/T-0481-task-capsule-human-readable-schema-cleanup | New TASK.md v2 scaffold order/columns, v1 compatibility, pre-stable plan doc, and bootstrap artifact-path redaction; evidence `ev:T-0481:d7ea70a9e2a2468a95aca229`, `ev:T-0481:8820c76990b947f2bf0e3a4c`, `ev:T-0481:15f0b359a90e4732b10c6e5a`, `ev:T-0481:cea807cf931d46d694652eeb`. |
| T-0482 | Task Capsule v2 minimal human schema cleanup | Done | tasks/T-0482-task-capsule-v2-minimal-human-schema-cleanup | Lean TASK.md v2 now keeps Evidence only on Acceptance/Validation, removes hash bookkeeping from Inputs, adds manual Date/State/Note History, preserves legacy compatibility, and validates 148 files / 988 tests; evidence `ev:T-0482:6ce94f74df354339b733197a`. |
| T-0483 | JSON taskId envelope hardening | Done | tasks/T-0483-json-taskid-envelope-hardening | Task-scoped JSON reports now expose root `taskId`, nested ids remain compatible, `task show --task` parsing is fixed, Docker check passed 148 files / 990 tests, and built CLI taskId smoke passed; evidence `ev:T-0483:39a179e7507c461886c664e7`. |
| T-0484 | doctor install location output | Done | tasks/T-0484-doctor-install-location-output | `hadara doctor` now reports executable/resolved path, package root/version, Node path/version, registry, and install hints; ext4 check passed 148 files / 990 tests; evidence `ev:T-0484:9c02d42dfceb46bdb8cd545d`, `ev:T-0484:8b9c1b5d460c43168e8a67b0`. |
| T-0485 | timing measurement root cause | Done | tasks/T-0485-timing-measurement-root-cause | T-0479 negative timings traced to dogfood harness wall-clock probes; harness now uses `process.hrtime.bigint()` and CLI elapsed paths use `startMonotonicTimer()`; ext4 check passed 150 files / 993 tests; evidence `ev:T-0485:c541e1fabdc54b35a1be92e5`, `ev:T-0485:c2aaa91b5fa74d5bb063085d`. |
| T-0486 | task id counter after manual capsule deletion | Done | tasks/T-0486-task-id-counter-after-manual-capsule-deletion | Task Board row ids now participate in next-id allocation and write preflight uses the same allocator; ext4 check passed 150 files / 995 tests; evidence `ev:T-0486:c4f5c6009a6a499191748196`. |
| T-0487 | dogfood output UX pass | Done | tasks/T-0487-dogfood-output-ux-pass | Added compact `task status --summary-json` and clearer non-JSON `validation run` child/evidence boundaries; ext4 check passed 150 files / 997 tests; evidence `ev:T-0487:7a5ab714f865434782d625c8`. |
