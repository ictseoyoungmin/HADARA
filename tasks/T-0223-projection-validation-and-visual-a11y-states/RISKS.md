# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Static dashboard bundle was not rebuilt after authored frontend changes. | Served HTML may still reflect the previous bundle until dependencies/Docker are restored. | High in this workspace | `npm run dashboard:build` is recorded as blocked by missing `esbuild`; rerun build and visual gate after dependency/Docker access returns. | Open |
| Full Docker validation and Playwright/axe visual gate could not run. | Projection code/tests added since T-0217 still need a successful full reproducible validation pass. | High in this session | Recorded blocked commands and kept changes covered by static/syntax/redaction checks; next validation window should run `npm run dev:docker-sync-build` and `npm run dashboard:visual:docker`. | Open |
| Projection status fixtures are currently gate inputs more than user-visible UI controls. | Future UI could stop surfacing stale/refreshing/missing metadata while the gate still stubs the route. | Medium | Static tests pin route stubbing and screenshots; future frontend status rendering should add explicit locator assertions once the UI consumes `/api/dashboard/projection/status`. | Tracked |
