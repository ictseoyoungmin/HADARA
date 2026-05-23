# Handoff

## Last Completed

- Added `docs/MCP_EVIDENCE_ATTACH_CONTRACT.md` as a contract-only future write-capable evidence attach tool contract.
- Documented `hadara.evidence.attach` input/output shape, safety gates, workspace boundary requirements, public artifact redaction requirements, and future write-tool error taxonomy.
- Clarified in MCP/Hermes guidance that `hadara.policy.evaluate` is policy evaluation only, not MCP execution authorization.
- Added the evidence attach contract to exported Hermes context.
- Docker `npm ci && npm run check` passed with 25 test files and 128 tests.
- Docker built CLI `harness validate --task T-0046 --level done --json` returned `ok: true`.

## Next Recommended Step

Continue with T-0047 Evidence Attach Guard Tests. Keep current MCP runtime read-only and prove `hadara.evidence.attach` is not advertised or callable yet.
