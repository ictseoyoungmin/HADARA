# Plan

1. Read required protocol, release/package-smoke planning, and T-0134 capsule docs.
2. Update the package-smoke service and CLI so dry-run remains default-safe and local execution requires `--execute`.
3. Add focused tests for local execution success, reduced/redacted reports, failure handling, cleanup, and CLI JSON output.
4. Run focused Docker validation, full Docker check, built CLI smoke, strict release gate, and done-level harness validation.
5. Record evidence, update tracked state docs, and refresh handoff.
