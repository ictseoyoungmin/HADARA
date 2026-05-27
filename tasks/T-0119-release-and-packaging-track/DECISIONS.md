# Decisions

- Release readiness checks are part of the existing `hadara.releaseGate.v1` report instead of a new schema or release subcommand.
- Readiness failures are warning-only in advisory mode and become errors in strict mode, matching the existing operational-debt release-gate semantics.
- T-0119 intentionally adds no archive/checksum/package publication behavior; it is a read-only checklist/reporting slice.
