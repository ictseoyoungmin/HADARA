# HADARA 0.5.5 Stabilization and Promotion Development Plan

## Release objective

Stabilize the 0.5.x agent loop for promotion after hardening. This release finalizes schema documentation, compatibility policy, release notes, package evidence, and installed-package recycle. It should close the line as "agent loop v1 complete", not as a full state-first architecture completion.

## Entry and exit contracts

| Boundary | Contract |
|---|---|
| Baseline | 0.5.4 dogfood/hardening has no open stable blockers. |
| Product claim | Agent loop v1: `status` routes globally, `task status` decides locally, `task close` commits. |
| Scope restraint | Full TASK.md state migration, verify-ac completion, and dashboard/TUI migration remain outside the promotion claim unless separately completed. |
| Exit | Stable promotion evidence proves the public package works from clean consumer paths. |

## Capsule budget

Release ceiling: **4 capsules**, at most **1 L**, total planned source ceiling **18 files / 2,000 net LOC** plus release artifacts.

| Plan ID | Capsule | Size | Depends on | Deliverable |
|---|---|---:|---|---|
| 055-C01 | Schema and compatibility documentation freeze | M | 0.5.4 | Final status/close schema docs, compatibility window, migration notes |
| 055-C02 | Final source and package release readiness | L | C01 | Version sync, docs currentness, build/test/package-smoke gate |
| 055-C03 | External installed-package recycle | M | C02 | Public package install, init, status, task status, task close, recycle evidence |
| 055-C04 | Stable promotion decision and closeout | S | C02-C03 | Release notes, promotion decision, post-publish evidence, handoff |

Split triggers:

- Split C02 if release readiness uncovers source fixes rather than documentation/evidence updates.
- Split C03 if installed-package recycle reveals a dogfood blocker.
- Defer any compatibility removal to a later line unless installed-consumer evidence proves it is safe.

## Compatibility policy

0.5.5 should freeze the 0.5.x compatibility promise:

| Surface | Policy |
|---|---|
| default `status --json` | lifecycle-aware v2 projection |
| v1 status contracts | retained through explicit compatibility routes for all 0.5.x |
| `session start` | removed from public routing/guidance |
| `task close` | primary close command after promotion gate |
| `finalize` | compatibility/deprecated route, not primary guidance |
| evidence locality | unchanged, task-local canonical |

v1 removal is a future 0.6.0 decision and requires installed-consumer evidence.

## Stabilization checklist

| Area | Required proof |
|---|---|
| schemas | public schemas have examples for clean, blocked, degraded, terminal, compatibility |
| docs | README, workflow, init scaffold, task templates, package smoke docs, release notes agree |
| routing | no public `session start` route or generated guidance remains |
| close | clean close one-command path and blocked close recovery pass from installed package |
| compatibility | v1 status and finalize compatibility are tested and documented |
| projection | selected generated/projection contracts are doctor-clean and drift-safe |
| performance | compact status remains bounded and reports slow readers |
| security | write boundaries, lock/recovery files, and machine-local paths respect the security model |

## Validation and acceptance

| Gate | Required proof |
|---|---|
| Source readiness | Focused and full validation pass in the development environment. |
| Clean package | Package smoke passes from a clean checkout/publish clone. |
| Public install | `npm install -g hadara@<candidate>` or equivalent isolated install passes. |
| Agent loop | Installed package completes `status` → `task status` → validation/evidence → `task close`. |
| Brownfield | Existing project adoption remains zero-write until reviewed execute. |
| Release notes | User-facing release notes state the exact compatibility and deferred-scope boundaries. |
| Recycle | Post-publish installed-package recycle verifies the public stable version. |

## Promotion statement

0.5.5 may claim:

```text
HADARA 0.5.x completes agent loop v1:
status routes globally, task status decides locally, and task close commits safely.
```

0.5.5 must not claim:

- full state-first architecture completion;
- full TASK.md structured-state migration;
- complete verify-ac automation;
- dashboard/TUI migration;
- centralized evidence.

## Rollback

If stable promotion uncovers a release blocker, patch the smallest affected surface. If the issue is compatibility routing, keep v2 default but restore explicit compatibility behavior. If the issue is task-close safety, demote `task close` guidance and route through the proven close engine until fixed.
