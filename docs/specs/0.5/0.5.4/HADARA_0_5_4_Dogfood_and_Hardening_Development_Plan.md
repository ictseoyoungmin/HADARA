# HADARA 0.5.4 Dogfood and Hardening Development Plan

## Release objective

Run the promoted 0.5.x agent loop through broad installed-package dogfood and harden regressions before declaring the line stable. This release should not add major new surfaces. It validates that `status`, `task status`, `task close`, compatibility routing, and selected projection ownership behave predictably across real project shapes.

## Entry and exit contracts

| Boundary | Contract |
|---|---|
| Baseline | 0.5.0 stable status ingress/public close and selected post-0.5.0 projection contracts are implemented. |
| Primary loop | `status --json` → `task status` → validation/evidence → `task close --task T --json`. |
| Compatibility | 0.5.x compatibility routes remain available but are not taught as primary. |
| Exit | Installed-package dogfood and regression hardening show the loop works without private HADARA-dev knowledge. |

## Capsule budget

Release ceiling: **5 capsules**, at most **2 L**, total planned source ceiling **28 files / 3,200 net LOC** plus dogfood artifacts.

| Plan ID | Capsule | Size | Depends on | Deliverable |
|---|---|---:|---|---|
| 054-C01 | Installed-package dogfood matrix | L | 0.5.3 | Greenfield, brownfield, Python/data, JS/TS, and governed projects |
| 054-C02 | Delegated-agent onboarding dogfood | L | C01 | Codex/Claude/other-agent prompts without HADARA-dev private context |
| 054-C03 | Status and close regression hardening | M | C01-C02 | Fixes for phase/readiness, recovery, and stale-guidance findings |
| 054-C04 | Projection/drift hardening | M | C01-C03 | No-op render, direct-edit drift, optional-doc absence, and brownfield notes |
| 054-C05 | Release/recycle rehearsal | S | C01-C04 | Dry release readiness, package smoke, and installed recycle rehearsal |

Split triggers:

- Split C01 by project type if one scenario creates implementation work rather than dogfood evidence.
- Split C03 if a finding changes the close transaction contract rather than a bounded bug.
- Defer any new public command or schema expansion to 0.5.5+; 0.5.4 is hardening, not feature growth.

## Dogfood matrix

| Scenario | Required proof |
|---|---|
| fresh basic | `status --json` routes to first task; first task closes cleanly |
| fresh standard | optional docs absence is not treated as missing required state |
| fresh governed | required-reading and close boundaries remain clear |
| brownfield JS/TS | adoption preview is zero-write; execute is reviewed; close loop works |
| brownfield Python/data | manifest inference is best-effort and does not overclaim |
| delegated agent | agent follows generated docs without private HADARA-dev instructions |
| failed validation | failed evidence is visible; repair path is actionable; close blocks until resolved |
| blocked close | zero lifecycle writes and one recovery action |
| projection drift | direct generated-region edit fails closed |
| installed package | public package behavior matches source package behavior |

## Compatibility checks

0.5.4 must verify:

- default docs teach v2 status and primary `task close`;
- v1 status compatibility routes still work where promised for 0.5.x;
- compatibility outputs include migration metadata;
- no public guidance teaches `session start`;
- `finalize` compatibility does not fork the close engine.

## Validation and acceptance

| Gate | Required proof |
|---|---|
| Dogfood | Every matrix scenario has task-local evidence or a documented blocked finding. |
| Regression | All blocker-class dogfood findings are fixed or explicitly deferred with release rationale. |
| Compatibility | v1 status compatibility and finalize compatibility are exercised from installed package. |
| Drift | Generated/projection drift checks fail closed without silent overwrite. |
| Performance | Mounted and temp-project status runs stay diagnostic when slow. |
| Release rehearsal | Release readiness and recycle pass without publishing. |

## Promotion and rollback

Promote to 0.5.5 only when dogfood blockers are closed and compatibility behavior is documented. If a promoted public command regresses, keep the implementation but restore the previous primary documentation in a patch plan; do not teach two primary paths.
