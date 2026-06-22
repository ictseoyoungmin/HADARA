# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Publish stable `0.3.3` with npm dist-tag `latest`. | Accepted | Non-rc helper default resolves stable versions to `latest`; T-0405 readiness passed and npm precheck showed `0.3.3` was not already published. | `ev:T-0405:79a290abc677408b85064993`, `ev:T-0405:98c78116db1242319eaf3759` |
| D-2 | Make package-facing README assume `0.3.3` is already deployed. | Accepted | npm uploads README with the package; readers should not see "after publish completes" language after the publish mutation. | User request |
| D-3 | Do not create GitHub Release draft by default. | Accepted | Previous release capsules kept GitHub Release explicit and optional; user only requested npm publish preparation. | Release workflow precedent |
