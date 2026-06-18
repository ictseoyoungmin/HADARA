# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C1 extractor spec. | Done | Session reads completed before edits. |
| 2 | Add docs registry and command registry extractors. | Done | `src/context/registry-extractors.ts`. |
| 3 | Add focused unit coverage. | Done | `tests/unit/context-graph-registry-extractors.test.ts`. |
| 4 | Run validation and refresh dist if source changes pass. | Done | Docker focused tests, Docker `npm run build`, Docker `npm run check`, dist refresh, built CLI version smoke, and `git diff --check` passed in `ev:T-0346:013ad0cd2fd843ccb006d900`. |
| 5 | Attach evidence, update handoff/state docs, and close. | Done | Evidence attached and close-source docs updated before lifecycle close. |
