# Plan

1. Read HADARA protocol docs, release/install planning docs, and the T-0131 capsule.
2. Register a `hadara.featureSmoke.v1` report schema and runtime validator entry.
3. Implement a shared feature-smoke service with a read-only `core` profile.
4. Add `hadara smoke run --profile core --json` CLI handling and capability discovery.
5. Add focused unit coverage for report shape, profile boundaries, schema validation, CLI JSON output, and capability discovery.
6. Run Docker temp-copy validation, built CLI smoke checks, and done-level harness validation.
7. Update task evidence, roadmap/state docs, and handoff.
