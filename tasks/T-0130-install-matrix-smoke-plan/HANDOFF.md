# Handoff

## Last Completed

T-0130 Install Matrix Smoke Plan:

- `docs/RELEASE_READINESS.md` and `docs/TEST_STRATEGY.md` define the install matrix rows and evidence boundaries.
- The same docs record a follow-up to promote growing matrix rows into `docs/release-readiness.json` or `src/fixtures/install-matrix.v1.json` using `hadara.installMatrix.plan.v1`.
- The read-only release gate includes `INSTALL_MATRIX_SMOKE_PLAN` and maps missing markers to `INSTALL_MATRIX_SMOKE_PLAN_UNCLEAR`.
- No installer execution, package smoke execution, package artifact creation, USB validation, Windows validation, publish, or deploy behavior was added.

## Next Recommended Step

Continue with T-0131 Major Feature Smoke Runner: implement a bounded installed-CLI smoke runner with a `core` profile for `hadara doctor --json`, `hadara status --json`, `hadara task list --json`, `hadara tools list --json`, `hadara tui --snapshot --json`, and `hadara release gate --mode advisory --json`, without package-smoke or strict evidence cycles.
