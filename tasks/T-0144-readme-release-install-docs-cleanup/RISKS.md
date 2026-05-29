# Risks

| Risk | Mitigation |
|---|---|
| README implies installer, USB, or GitHub Release support before implementation. | State npm RC and source-checkout paths only; list deferred surfaces explicitly. |
| README examples drift from actual package metadata. | Verify against `package.json` and the T-0143 registry evidence. |
| Documentation-only work is marked done without evidence. | Run Docker `npm run check`, done-level harness validation, and record evidence. |
