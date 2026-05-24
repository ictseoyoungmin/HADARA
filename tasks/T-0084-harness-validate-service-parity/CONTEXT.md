# Context

Relevant documents and files read:

- `docs/AGENT_HANDOFF.md`
- `docs/DEVELOPMENT_SLICES.md`
- `src/cli/harness.ts`
- `src/harness/validate.ts`
- `src/mcp/tool-registry.ts`
- `tests/contract/cli-mcp-service-parity.test.ts`
- `tests/contract/mcp-bridge-contract.test.ts`

Service Parity Expansion has already moved task and policy report builders behind shared services. This capsule applies the same pattern to harness validation while preserving the existing validation rules and output schema.

Validation should use Docker because host Node/npm remain unreliable in the current WSL environment.
