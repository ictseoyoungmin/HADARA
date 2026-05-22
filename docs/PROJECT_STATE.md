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
- CLI handler extraction has started: init profile logic lives in `src/cli/init.ts`, run scaffold logic lives in `src/cli/run-scaffold.ts`, harness CLI handling lives in `src/cli/harness.ts`, and `src/cli/main.ts` remains the dispatcher.
- Evidence CLI handling lives in `src/cli/evidence.ts`.
- Real provider adapters are not implemented.
- Dashboard is not implemented.
- MCP server is not implemented.

## Single Source of Truth

- Current state: `docs/PROJECT_STATE.md`
- Work queue: `docs/TASK_BOARD.md`
- Next-session handoff: `docs/AGENT_HANDOFF.md`
- Task details: `tasks/T-*/`
