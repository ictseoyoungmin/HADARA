# Plan

1. Read HADARA state, handoff, task board, implementation SOP, development slices, v1.0 backlog, and active capsule docs.
2. Observe remote GitHub Actions CI status for the current `main` baseline.
3. Record remote CI evidence in validation/release docs while keeping remote observation distinct from local Docker validation.
4. Add a read-only release-gate readiness check that verifies remote CI observation is documented locally.
5. Run focused release-gate tests, full Docker validation, release-gate CLI smokes, and done-level harness validation.
6. Update capsule evidence, project state, task board, slices, and handoff.
