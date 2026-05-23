# PROJECT_STATE

## Product

HADARA - Portable Agentic Development Workbench

## Current Phase

Phase 0 / Phase 1 boundary.

This repository is a bootstrap skeleton. Development should follow the HADARA protocol before full HADARA automation exists.

## Current Status

- Skeleton repository exists.
- Seed CLI exists.
- MockProvider contract exists.
- ScriptedProvider exists for deterministic harness/replay provider behavior.
- Provider fallback executor exists for deterministic chat fallback orchestration.
- Fake shell preflight harness exists for deterministic tool observations without real shell execution.
- Minimal deterministic agent loop harness exists for ScriptedProvider responses plus fake shell observations.
- Task Capsule creation exists.
- Evidence append writes Markdown summaries, `evidence.jsonl` indexes, and managed public artifact copies.
- Handoff update exists.
- AGENTS.md and IMPLEMENTATION_SOP now capture reusable HADARA session protocol rules.
- Hermes/Agent Harness context export exists as a seed command.
- Doctor CLI JSON output exists as `hadara doctor --json`.
- Task list/show CLI JSON output exists as `hadara task list --json` and `hadara task show <task-id> --json`.
- Policy check CLI JSON output exists as `hadara policy check-shell <command> --json`.
- Policy execution preflight exists as `hadara policy preflight-shell <command> --json`.
- Hermes detect/export CLI JSON output exists as `hadara hermes detect --json` and `hadara hermes export-context --json`.
- Evidence collect CLI JSON output exists as `hadara evidence collect --json`.
- Harness Task Capsule validation exists as `hadara harness validate --task <id> --json`.
- Harness Task Capsule validation enforces core Markdown format markers for Task Capsule continuity.
- Harness Task Capsule validation requires `evidence.jsonl` so completed work cannot miss the evidence index.
- Harness replay skeleton exists as `hadara harness replay <scenario.jsonl> --json`.
- Config/path resolver has realpath containment, environment priority, Windows path normalization, and project data boundary tests.
- Policy evaluator has a minimal tokenizer, safe command allowlist, destructive command denial tests, and shell execution preflight.
- Tool runtime work has started with fake shell observations gated by policy preflight.
- Agent loop work has started with bounded deterministic `hadara run --script ... --fake-shell-fixtures ... --json`.
- Workspace file boundary hardening is complete with a shared realpath resolver applied to evidence artifact copy, harness replay, and deterministic run file inputs.
- Evidence artifact redaction baseline exists: public artifacts must be UTF-8 text and pass secret-pattern scanning before committed copy.
- Strict CLI argument helper parsing exists for string, required string, integer, and boolean flag options.
- Agent loop evidence attachment exists: deterministic fake-shell observations from `hadara run --task ...` can be attached as managed public command-log artifacts and reported in run JSON output.
- ScriptedProvider now consumes scripted steps in order for deterministic replay semantics.
- Task Capsule creation now includes an empty `evidence.jsonl` required by harness validation.
- Init profiles exist as `hadara init --profile minimal|full|hadara-protocol`; default/minimal init creates core HADARA protocol docs for Hermes/export-context readiness.
- Harness validation supports `--level draft|done`; done-level validation requires Done status, completed acceptance, evidence records, and updated handoff sections.
- Run scenario scaffolding exists as `hadara run scaffold --task <id> --command <command>`, generating deterministic ScriptedProvider and fake-shell fixture JSON files under `.hadara/scenarios/`.
- Runtime validation now rejects unsupported permission modes and evidence result values; harness validation enforces evidence JSONL enum values.
- JSON-mode CLI parse and validation failures return a shared `hadara.cli.error.v1` fallback envelope.
- CLI JSON output policy is documented in `docs/CLI_JSON_CONTRACT.md`.
- Policy safe command classification requires exact token matches; suffixes are not implicitly safe.
- Agent loop run results now fail when fake-shell observations fail, including non-zero fake-shell exit codes.
- Run scenario scaffolding now rejects duplicate scenario files instead of silently reusing stale content.
- CLI handler extraction pass is complete: `src/cli/main.ts` is a top-level dispatcher and command groups live in focused `src/cli/*` modules.
- Project handoff is compacted: current state lives in `docs/AGENT_HANDOFF.md`, with historical task and validation history in dedicated history docs.
- Old Draft task capsules have been reclassified: T-0003 is Superseded, and T-0006 is Partial with remaining Hermes/MCP bridge scope deferred to the roadmap.
- Read-only Hermes/MCP bridge contract is documented in `docs/MCP_BRIDGE_CONTRACT.md`; stdio server and read tools are implemented.
- MCP JSON-RPC stdio server exists as `hadara mcp serve`; it supports discovery/lifecycle requests and read-only tools for task list/read, handoff read, project state read, policy evaluate, and harness validate.
- MCP bridge contract tests validate JSON text payload wrapping, notification no-response behavior, dispatch issue-code mapping, and CLI JSON parity for task list, policy evaluate, and harness validate.
- MCP evidence attach contract is documented in `docs/MCP_EVIDENCE_ATTACH_CONTRACT.md`; the tool is implemented only for explicit opt-in mode.
- MCP evidence attach can be enabled explicitly with `hadara mcp serve --enable-evidence-attach`; default MCP startup remains read-only and does not advertise the tool.
- MCP evidence attach safety tests cover JSON payload shape, safe public artifact copies, workspace boundary rejection, public artifact secret rejection, and invalid input mapping.
- MCP initialize metadata now reflects default read-only mode versus evidence attach-enabled mode, including `hadara/evidenceAttach`, `hadara/writes`, and disabled shell/provider flags.
- MCP evidence attach now requires per-call approval metadata with an actor and reason before writing evidence.
- MCP evidence attach write attempts are audited to the private portable audit store on both success and report-level failure.
- Evidence CLI handling lives in `src/cli/evidence.ts`.
- Policy CLI handling lives in `src/cli/policy.ts`.
- Hermes CLI handling lives in `src/cli/hermes.ts`; handoff CLI handling lives in `src/cli/handoff.ts`.
- Real provider adapters are not implemented.
- Dashboard is not implemented.
- Broad MCP write tools are not implemented beyond the explicitly enabled, approval-recorded, audited evidence attach tool.

## Single Source of Truth

- Current state: `docs/PROJECT_STATE.md`
- Work queue: `docs/TASK_BOARD.md`
- Next-session handoff: `docs/AGENT_HANDOFF.md`
- Task details: `tasks/T-*/`
