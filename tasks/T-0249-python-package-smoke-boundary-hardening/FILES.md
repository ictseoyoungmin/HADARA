# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/package-smoke.ts` | Modify | Add network policy model, Python offline command flags, and Python evidence attach. | Done |
| `src/cli/package-smoke.ts` | Modify | Add `--network-policy` option. | Done |
| `src/services/smoke-evidence.ts` | Modify | Preserve reduced provider/networkPolicy metadata in smoke evidence source reports. | Done |
| `src/schemas/package-smoke.schema.json` | Modify | Validate additive `networkPolicy` field. | Done |
| `src/schemas/release-dry-run.schema.json` | Modify | Document additive provider ecosystem metadata in evidence checks. | Done |
| `src/services/release-evidence.ts` | Modify | Expose provider ecosystem from smoke evidence summaries and enforce provider expectations. | Done |
| `src/services/release-dry-run.ts` | Modify | Require npm-compatible provider for current package-smoke evidence gate. | Done |
| `tests/unit/package-smoke-dry-run.test.ts` | Modify | Cover default/offline network policy and Python evidence attach. | Done |
| `tests/unit/release-dry-run.test.ts` | Modify | Cover Python evidence not satisfying npm release gate. | Done |
| `docs/*` | Modify | Update tracked state and handoff. | In Progress |
