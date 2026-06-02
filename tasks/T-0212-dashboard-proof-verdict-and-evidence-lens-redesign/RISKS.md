# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| NTFS-mounted workspace cannot host an npm install for the build deps. | `npm install` fails with EPERM on /mnt/f. | High | Resolve esbuild/preact via DASH_DEPS / Docker (scripts/dashboard-build.sh); output is the committed static index.html. | Mitigated |
| Container-to-host fetch can stall in the Playwright Docker harness. | Live-data screenshots are not capturable from inside the container. | Medium | Visual gate stubs the read-only APIs from committed fixtures for deterministic capture; real browsers on the host get live data (verified). | Mitigated |
| Work is implemented and validated but not committed or closed. | Reviewer may revise or roll back before locking. | Medium | Status kept Partial; finish/close deferred until review sign-off. | Accepted |
