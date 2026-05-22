# AGENT_HANDOFF

## Current Branch

main

## Last Completed

- Completed T-0002 Config and Path Resolver hardening.
- Completed T-0004 ProviderClient Contract hardening with ScriptedProvider.
- Completed T-0005 Evidence Store expansion with `evidence.jsonl` and public/private evidence handling.
- Completed T-0008 Policy Evaluator Shell Parser.
- Completed T-0009 Harness Validate JSON with `hadara harness validate --task <id> --json`.
- Completed T-0010 Harness Replay Skeleton with `hadara harness replay <scenario.jsonl> --json`.
- Completed T-0011 CLI Doctor JSON with `hadara doctor --json`.
- Completed T-0012 CLI Task JSON with `hadara task list/show --json`.
- Completed T-0013 CLI Policy JSON with `hadara policy check-shell <command> --json`.
- Completed T-0014 CLI Hermes JSON with `hadara hermes detect/export-context --json`.
- Completed T-0015 CLI Evidence JSON with `hadara evidence collect --json`.
- Completed T-0016 Evidence Artifact Copy with managed public artifact storage.
- Completed T-0017 Policy Execution Preflight with `hadara policy preflight-shell <command> --json`.
- Completed T-0018 Provider Fallback Executor for deterministic chat fallback orchestration.
- Completed T-0019 Shell Preflight Harness with deterministic fake shell observations gated by policy preflight.
- Normalized T-0019 Task Capsule Markdown format to match neighboring capsules.
- Completed T-0020 Task Capsule Format Validation to detect Markdown format drift in harness validation.
- Completed T-0021 Agent Loop Minimal Harness with deterministic `hadara run --script ... --fake-shell-fixtures ... --json`.
- Hardened harness validation to require `evidence.jsonl` and cover missing evidence indexes with regression tests.
- Completed T-0022 Protocol Instruction Consolidation by moving reusable first-session rules into AGENTS.md and IMPLEMENTATION_SOP.
- Completed T-0023 Workspace File Boundary with shared realpath workspace file resolution for evidence, replay, and deterministic run inputs.
- Completed T-0024 Evidence Artifact Redaction with public text artifact scanning, binary rejection, and JSON policy issues.
- Completed T-0025 CLI Args Parser with strict reusable option helpers and malformed option value rejection.
- Completed T-0026 Agent Loop Evidence Attachment with fake-shell observation command-log artifacts and run JSON evidence metadata.
- Completed T-0027 Deterministic Scripted Provider and Capsule Evidence Index with sequential script consumption and empty `evidence.jsonl` scaffolding.
- Completed T-0028 Init Profiles Protocol Docs with `minimal`, `full`, and `hadara-protocol` init profiles and baseline protocol docs.
- Completed T-0029 Done-Level Harness Validation with `--level draft|done` and completion gates for Done status, acceptance, evidence, and handoff.
- Completed T-0030 Run Scenario Scaffold with deterministic script/fixture generation under `.hadara/scenarios/`.
- Completed T-0031 CLI Handler Extraction by moving init profile logic to `src/cli/init.ts` and run scaffold logic to `src/cli/run-scaffold.ts`.
- Verified Docker `npm ci && npm run check`: 16 test files passed, 64 tests passed.
- Verified Docker `hadara harness validate --task T-0019 --json`: `ok: true` after capsule doc normalization.
- Verified Docker `hadara harness validate --task T-0020 --json`: `ok: true`.
- Verified Docker `hadara run ... --json`: `ok: true` with fake shell observation.
- Verified Docker `hadara harness validate --task T-0021 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Verified Docker `hadara harness validate --task T-0022 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Verified Docker read-only mount `npm ci && npm run check`: 18 test files passed, 74 tests passed.
- Verified Docker `node dist/cli/main.js harness validate --task T-0023 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Verified Docker read-only mount `npm ci && npm run check`: 18 test files passed, 78 tests passed.
- Verified Docker `node dist/cli/main.js harness validate --task T-0024 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Verified Docker read-only mount `npm ci && npm run check`: 19 test files passed, 84 tests passed.
- Verified built CLI JSON smoke for malformed `run --script --json --json`: stable `agent.loop` JSON issue returned.
- Verified Docker `node dist/cli/main.js harness validate --task T-0025 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.

## In Progress

No active implementation task.

## Do Not Change Without Updating Tests

- `src/providers/provider-contract.ts`
- `src/core/paths.ts`
- `src/task/task-capsule.ts`
- `src/policy/policy.ts`

## Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.
- Policy parser is still intentionally minimal; it is safer than before, but not a full POSIX or PowerShell parser.
- Evidence Store copies public attached artifacts into Task Capsule managed storage, but does not yet encrypt private evidence.
- First Docker validation on the mounted `/mnt/f` workspace failed because npm could not create symlinks in `node_modules`; copying the repo into the container filesystem before `npm ci` is the working validation pattern.
- Task Capsule Markdown format is now checked by harness validation for core files; future capsules should not be marked Done if `hadara harness validate` reports format drift.

## Next Recommended Step

1. Continue command handler extraction by moving another cohesive command group, such as evidence or harness, out of `src/cli/main.ts`.
2. Track npm audit findings separately.
3. Defer dashboard, real provider adapters, MCP server body, and full agent controller until the harness/policy/evidence gates are stronger.

## Evidence

- `tasks/T-0002-config-and-path-resolver/EVIDENCE.md`
- `tasks/T-0004-providerclient-contract/EVIDENCE.md`
- `tasks/T-0005-evidence-store/EVIDENCE.md`
- `tasks/T-0008-policy-evaluator-shell-parser/EVIDENCE.md`
- `tasks/T-0009-harness-validate-json/EVIDENCE.md`
- `tasks/T-0010-harness-replay-skeleton/EVIDENCE.md`
- `tasks/T-0011-cli-doctor-json/EVIDENCE.md`
- `tasks/T-0012-cli-task-json/EVIDENCE.md`
- `tasks/T-0013-cli-policy-json/EVIDENCE.md`
- `tasks/T-0014-cli-hermes-json/EVIDENCE.md`
- `tasks/T-0015-cli-evidence-json/EVIDENCE.md`
- `tasks/T-0016-evidence-artifact-copy/EVIDENCE.md`
- `tasks/T-0017-policy-execution-preflight/EVIDENCE.md`
- `tasks/T-0018-provider-fallback-executor/EVIDENCE.md`
- `tasks/T-0019-shell-preflight-harness/EVIDENCE.md`
- `tasks/T-0020-task-capsule-format-validation/EVIDENCE.md`
- `tasks/T-0021-agent-loop-minimal-harness/EVIDENCE.md`
- `tasks/T-0022-protocol-instruction-consolidation/EVIDENCE.md`
- `tasks/T-0023-workspace-file-boundary/EVIDENCE.md`
- `tasks/T-0024-evidence-artifact-redaction/EVIDENCE.md`
- `tasks/T-0025-cli-args-parser/EVIDENCE.md`
- `tasks/T-0026-agent-loop-evidence-attachment/EVIDENCE.md`
- `tasks/T-0027-deterministic-scripted-provider-capsule-index/EVIDENCE.md`
- `tasks/T-0028-init-profiles-protocol-docs/EVIDENCE.md`
- `tasks/T-0029-done-level-harness-validation/EVIDENCE.md`
- `tasks/T-0030-run-scenario-scaffold/EVIDENCE.md`
- `tasks/T-0031-cli-handler-extraction/EVIDENCE.md`
- Docker check: 21 test files passed, 97 tests passed.
- Docker `node dist/cli/main.js harness validate --task T-0026 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker built CLI `hadara run --task T-0026 ... --json`: `ok: true`, with one command-log evidence attachment.
- Docker `node dist/cli/main.js harness validate --task T-0027 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker built CLI task-create smoke: new capsule had an empty `evidence.jsonl` and validated with `ok: true`.
- Docker `node dist/cli/main.js harness validate --task T-0028 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker built CLI `hadara init --profile full` plus `hermes export-context --json`: `ok: true`.
- Docker `node dist/cli/main.js harness validate --task T-0029 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker built CLI `hadara run scaffold ...` followed by scaffolded `hadara run ... --json`: `ok: true`.
- Docker `node dist/cli/main.js harness validate --task T-0030 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Built CLI smoke after extraction: `init --profile full`, `run scaffold`, and scaffolded `run` returned `ok: true`.
- Docker `node dist/cli/main.js harness validate --task T-0031 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
