# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm registry or network access fails from this environment. | Recycle cannot prove consumer install paths in this run. | Medium | Rerun with approved network access; record failed/blocked evidence honestly if unavailable. | Closed; registry/install checks passed. |
| A stale global `hadara` or `npx` shim masks the installed package. | False positive or wrong package version. | Medium | Use isolated temp-prefix installed bin through `hadara package recycle`, not global PATH as proof. | Mitigated |
| Stable `0.3.4` decision is made before recycle proof. | Release readiness could miss installed-package regressions. | Low | Keep shared docs explicit that stable decision remains separate after T-0422. | Mitigated |
| Published `hadara package recycle --execute` failed its extra installed `context graph --json` smoke and created stray source-workspace smoke capsules before cleanup. | The helper itself is not fully reliable as a one-command stable readiness gate for `0.3.4-rc.0`. | Medium | Preserve failed helper evidence; use manual installed-bin acceptance proof for T-0422 minimum acceptance; carry this residual into stable decision input. | Open |
