# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Old low-level lifecycle sequence remains visible as the primary path. | Agents may continue to run finish/ready/close/audit manually as the default flow. | Medium | Registry primary path, `help lifecycle`, README, SOP, workflow docs, and init templates now present finalize-first as default. | Mitigated |
| Hiding low-level commands too aggressively harms recovery/debugging. | Operators lose precise proof-boundary repair commands. | Medium | Low-level commands remain executable and documented as proof-boundary commands outside the primary path. | Mitigated |
| Built CLI could be stale after TypeScript changes. | Smoke results would validate old behavior. | Medium | `npm run dev:docker-sync-build` passed and reported `distLooksStale:false` before built CLI smoke. | Mitigated |
| Host node_modules lacks vitest. | Host focused validation cannot run. | High | Failed host check recorded; Docker focused validation and full Docker sync-build passed. | Accepted Risk |
