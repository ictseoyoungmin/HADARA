# Context

T-0031 extracted init and run scaffold helpers from `src/cli/main.ts`. T-0032 extracted harness handling. T-0033 extracted evidence collect handling. `docs/AGENT_HANDOFF.md` recommends continuing command handler extraction with the policy command group.

This task extracts only CLI orchestration for the `policy` group. The policy evaluator remains in `src/policy/policy.ts`, preflight remains in `src/policy/preflight.ts`, and JSON report construction remains in `src/cli/policy-json.ts`.
