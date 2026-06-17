# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Exact `npx` resolves stale local/global shim. | Could falsely report the wrong package version. | Observed | Use temp-prefix installed bin as canonical proof and record `npx` as environment finding. | Mitigated |
| Temp recycle artifacts remain in `/tmp`. | Could leak machine-local test state. | Low | Removed `/tmp/hadara-t0338-recycle` and `/tmp/hadara-npm-cache`; follow-up `find` returned no paths. | Mitigated |
| Evidence workflow passes in source but fails in package. | Would block stable 0.3.2 decision. | Low | Ran list/add-command exact resolution through installed package binary only. | Mitigated |
