# Plan

1. Read HADARA protocol docs, T-0127 handoff, tracked release/install/package-smoke planning docs, and the local-only ignored supporting plan when present.
2. Replace scaffold capsule docs with T-0128-specific scope, risks, files, decisions, acceptance, and validation.
3. Create a dedicated tracked release-readiness document for installer/package readiness details.
4. Document installer surfaces, portable launcher responsibilities, default install locations, Node 22/WSL checks, USB paths, and install report shape without creating installer scripts.
5. Register `hadara.install.plan.v1` schema fixture and add focused tests.
6. Add a read-only release-gate readiness check for installer surface/schema markers.
7. Run Docker validation, record evidence, and update project state, task board, slices, and handoff.
