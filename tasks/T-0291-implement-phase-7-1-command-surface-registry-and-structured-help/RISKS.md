# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Command inventory drift from dispatch code | Public commands could be missing or duplicated in structured help. | Medium | Added focused coverage tests against required public command ids and unique registry IDs/command patterns. | Mitigated |
| `tools list` compatibility regression | Existing consumers of `hadara.tools.list.v1` could break. | Medium | Kept `CapabilitySurface` projection shape and added drift test that CLI surfaces are projected from registry entries. | Mitigated |
| Default help overexposes advanced/release/dev surfaces | Worker agents could still infer from a noisy flat inventory. | Medium | Added help tests that default help is short and excludes alias/advanced/release/dev/UI/integration commands. | Mitigated |
| Host npm scripts unavailable | Host `npm run build` and focused `npm run test:focused` fail because `tsc`/`vitest` are unavailable. | High | Installed dependencies in Docker with `npm ci --no-bin-links` and ran package entrypoints directly. | Accepted with evidence |
| Standard Docker sync-check timeout | `timeout 120 bash scripts/dev-docker-sync-build.sh --check-only --no-smoke` produced no output and timed out. | Medium | Used direct Docker `tsc` and Vitest package entrypoints; record blocked evidence. | Residual |
| Full-suite timeout tests | Full Docker direct Vitest still fails on timeout-only dashboard/dogfooding tests; Phase 7.1 correctness failures were fixed and focused checks pass. | Medium | Recorded full-suite blocked evidence; reran relevant correction sets and evidence-parallel/feature-smoke focused tests. | Residual |
