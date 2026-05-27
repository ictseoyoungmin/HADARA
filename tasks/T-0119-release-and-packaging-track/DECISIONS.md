# Decisions

- Release readiness checks are part of the existing `hadara.releaseGate.v1` report instead of a new schema or release subcommand.
- Readiness failures are warning-only in advisory mode and become errors in strict mode, matching the existing operational-debt release-gate semantics.
- T-0119 intentionally adds no archive/checksum/package publication behavior; it is a read-only checklist/reporting slice.
- Actual release smoke execution should be a later dedicated command or fixture, not hidden inside `hadara release gate`.

## Severity Matrix

| Code | Advisory | Strict |
|---|---|---|
| `PACKAGE_BIN_MISSING` | warning | error |
| `VALIDATION_SCRIPT_MISSING` | warning | error |
| `NODE_POLICY_UNCLEAR` | warning | error |
| `CI_CLEAN_INSTALL_UNCLEAR` | warning | error |
| `CLEAN_CHECKOUT_SMOKE_UNCLEAR` | warning | error |
| `GENERATED_ARTIFACT_POLICY_UNCLEAR` | warning | error |
| `OPEN_HIGH_OPERATIONAL_DEBT` | warning | error |
