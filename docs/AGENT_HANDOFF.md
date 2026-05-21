# AGENT_HANDOFF

## Current Branch

main

## Last Completed

- Completed T-0002 Config and Path Resolver hardening.
- Completed T-0004 ProviderClient Contract hardening with ScriptedProvider.
- Completed T-0005 Evidence Store expansion with `evidence.jsonl` and public/private evidence handling.
- Completed T-0008 Policy Evaluator Shell Parser.
- Verified Docker `npm ci && npm run check`: 5 test files passed, 24 tests passed.

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
- Evidence Store does not yet copy binary/log artifacts into managed storage or encrypt private evidence.

## Next Recommended Step

1. Push branch and confirm GitHub Actions CI passes with Node 22.
2. Track npm audit findings separately.
3. Add harness replay command or continue CLI `--json` output stabilization before ShellTool execution.
4. Defer dashboard, real provider adapters, MCP server body, and full agent controller until the harness/policy loop is stronger.

## Evidence

- `tasks/T-0002-config-and-path-resolver/EVIDENCE.md`
- `tasks/T-0004-providerclient-contract/EVIDENCE.md`
- `tasks/T-0005-evidence-store/EVIDENCE.md`
- `tasks/T-0008-policy-evaluator-shell-parser/EVIDENCE.md`
- Docker check: 5 test files passed, 24 tests passed.
