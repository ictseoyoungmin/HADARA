# Risks

| Risk | Mitigation |
|---|---|
| Accidentally implying package-smoke execution is implemented | Keep this capsule to schema/fixture/tests only and record no CLI command, npm pack, install, publish, release artifact, or evidence attachment. |
| Public package-smoke reports leaking private paths or raw logs later | Require deterministic fixtures and tests for redacted path references and explicit false privacy booleans. |
| Release gate begins executing package smoke too early | Add a regression that strict release-gate output remains a release-gate report and does not emit a `package.smoke` report. |
