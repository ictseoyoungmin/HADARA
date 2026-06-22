# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat installed package temp-prefix smoke as the canonical 0.3.3 post-publish recycle proof. | Accepted | It verifies the package users install, independent of source checkout validation. | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| D-2 | Do not create a GitHub Release draft in T-0407. | Accepted | GitHub Release remains a secondary approval-gated target after npm package recycle. | `docs/RELEASE_READINESS.md` |
| D-3 | Accept degraded warnings in minimal disposable context smokes when commands return `ok:true`. | Accepted | Fresh generated projects do not contain the full HADARA-dev source graph; T-0407 verifies installed command surfaces, not deep project content quality. | `artifacts/installed-package-recycle-summary.md` |
