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
- Verified Docker `npm ci && npm run check`: 15 test files passed, 59 tests passed.
- Verified Docker `hadara harness validate --task T-0019 --json`: `ok: true` after capsule doc normalization.
- Verified Docker `hadara harness validate --task T-0020 --json`: `ok: true`.

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

1. Push branch and confirm GitHub Actions CI passes with Node 22.
2. Track npm audit findings separately.
3. Begin a minimal agent loop harness that combines ScriptedProvider responses with fake tool observations.
4. Defer dashboard, real provider adapters, MCP server body, and full agent controller until the harness/policy loop is stronger.

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
- Docker check: 15 test files passed, 59 tests passed.
