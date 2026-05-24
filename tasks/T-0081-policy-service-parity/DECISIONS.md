# Decisions

- Keep `src/cli/policy-json.ts` as a compatibility facade for `createPolicyCheckReport` so existing CLI tests and imports remain stable.
- Name the MCP-facing report builder `createPolicyEvaluateReport` because `hadara.policy.evaluate` is a read-only policy evaluation surface, even though its schema remains `hadara.policy.preflight.v1`.
- Preserve existing policy/preflight JSON shapes and permission semantics; this capsule only changes the service boundary.
