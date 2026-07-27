# HADARA 0.5.2 Public Close Migration Development Plan

> Status update, 2026-07-18: this plan is no longer a separate post-0.5.0 release boundary. Its public close migration work is folded into the **0.5.0 stable** scope after `0.5.0-rc.0`. Keep this document as the detailed migration design module referenced by 0.5.0 C08.

## Release objective

Promote the proven task-close transaction to the single public primary close surface before 0.5.0 stable, retain a bounded compatibility path for `finalize`, migrate all generated and installed guidance, and demonstrate that the ordinary lifecycle stays within its invocation budget.

## Promotion prerequisites

- 0.5.0 stable transaction dogfood passes clean, blocked, race, retry, and partial recovery flows.
- No unresolved proof-last, lock-order, or duplicate-evidence defect remains.
- Project and task status schemas identify close-ready and recovery-required deterministically.
- The compatibility window and removal policy are recorded before public help changes.

## Capsule budget

Release ceiling: **5 capsules**, at most **2 L**, total planned source ceiling **30 files / 3,500 net LOC**, plus bounded mechanical docs/scaffold changes.

| Plan ID | Capsule | Size | Depends on | Deliverable |
|---|---|---:|---|---|
| 052-C01 | Command registry and public route promotion | M | 0.5.1 gate | `task close` default-help/public routing and stable report contract |
| 052-C02 | `finalize` compatibility/deprecation adapter | M | C01 | One-way compatibility with explicit notices and no split engines |
| 052-C03 | Workflow budget and measurement migration | M | C01-C02 | Updated command portfolio and six-invocation measurement |
| 052-C04 | Scaffold, docs, MCP/read-model, and package consumer migration | L | C01-C03 | One taught close surface in every generated/installed consumer |
| 052-C05 | Delegated lifecycle/release dogfood and removal audit | L | C01-C04 | Full use-case proof and zero stale primary guidance |

Split triggers:

- Split C04 if MCP/schema adapters require behavior changes rather than command-string migration.
- Split C05 into lifecycle and release-recycle capsules if external mutation approvals prevent one bounded run.

## Schema plan and public command contract

Primary command:

```json
{
  "futureCommandId": "task.close",
  "argv": ["task", "close", "--task", "T-XXXX", "--json"],
  "availability": "0.5.0 stable target; unavailable in the 0.5.0-rc.0 snapshot"
}
```

Optional review/debug paths:

```json
[
  ["task", "close", "--task", "T-XXXX", "--dry-run", "--json"],
  ["task", "close", "--task", "T-XXXX", "--execute", "--plan-hash", "sha256:...", "--json"]
]
```

Rules:

- No flag is required for the ordinary guarded write path; the mutating command name is explicit.
- The clean report uses the stable `hadara.task.close.v2` schema frozen in 0.5.1.
- Blocked reports expose `health`, `writeSummary`, recovery state, issues, and one primary next action.
- The internal transaction engine is shared. `finalize` must not retain an independently evolving mutation engine.

The public response schema is `hadara.task.close.v2`; compatibility `finalize` output may retain its old envelope only through a lossless adapter to the same internal result. Schema fixtures must cover clean, blocked-before-write, recovery-required, idempotent no-op, and closed-valid terminal reports.

## Compatibility plan

| Surface | 0.5.0 stable behavior | Later decision |
|---|---|---|
| `task close` | Stable primary | Retain |
| `task finalize` | Compatibility route or deprecated alias; omitted from primary help examples | Remove only after installed-consumer telemetry/dogfood shows no required use |
| `task close --dry-run` | Supported review/debug path | Retain while CI/review use exists |
| Historical low-level close commands | Remain removed | Do not resurrect |

Compatibility output must include replacement guidance without reporting a false failure for a successfully completed compatible operation.

## Workflow budget

After promotion, update the primary workflow decision to:

| Layer | Invocation sequence | Budget |
|---|---|---:|
| Ingress | `status` | 1 |
| Empty selection | `task status`, optional `task create`, selected `task status` | at most 3 |
| Proof | `validation run` | at least 1 |
| Close | `task close` | 1 clean invocation |
| Total after init | ingress + empty-selection clean path | at most 6 |

The Task Capsule command portfolio remains four unique command IDs: `task.status`, `task.create`, `validation.run`, and `task.close`. Project `status` is measured separately as ingress. Recovery calls caused by real failures remain reported separately.

## Implementation details by capsule

### 052-C01 — public route

- Promote capability-registry classification, lifecycle help, command discovery, CLI parsing, and JSON schema registry entries together.
- Keep text and JSON output semantically aligned.
- Ensure legacy mutation blocking and policy classification recognize the new route.

### 052-C02 — compatibility

- Route compatibility calls into the same transaction/evaluation services.
- Preserve machine-readable close verdicts required by existing consumers.
- Add stable issue codes and replacement command fields.
- Avoid teaching both commands as equal primary options.

### 052-C03 — budget measurement

- Update the primary workflow budget document and automated regression test.
- Measure accepted/ignored/corrected recommendations from status through close.
- Verify clean close uses one close invocation and no copied plan hash.
- Keep setup and measurement probes outside the task-loop count.

### 052-C04 — consumer migration

- Migrate README, lifecycle/workflow docs, AGENTS/scaffold guidance, task templates, help snapshots, package recycle, clean-checkout smoke, and registered examples.
- Update MCP/Hermes/read-model command strings only where those surfaces expose lifecycle guidance; do not broaden MCP writes.
- Run stale-command/currentness scans against source and built `dist`.

### 052-C05 — delegated dogfood

Cover greenfield first task, brownfield adoption, delegated external agent onboarding, failed validation then repair, clean close, blocked close, partial recovery, concurrent task allocation, optional docs growth, manual/CI release paths, and installed-package recycle.

## Validation and acceptance

| Gate | Required proof |
|---|---|
| Single primary | Default help, README, scaffold, workflow docs, generated task guidance, and installed package teach only `task close`. |
| Compatibility | Supported `finalize` consumers reach the same engine/verdict and receive migration metadata. |
| Budget | Ordinary empty-selection path is at most six invocations including ingress and one close call. |
| Currentness | Source, built CLI, clean checkout, and installed package contain no stale primary `finalize` guidance. |
| Safety | 0.5.1 fault suite passes unchanged through the public route. |
| Delegation | An external agent with generated project instructions completes the baseline loop without private HADARA-dev knowledge. |
| Release | Package/release readiness and post-publish recycle use the promoted command portfolio. |

## Rollback

If consumer migration fails after release, keep `task close` implemented but restore `finalize` as the sole documented primary in a patch release. Do not expose both as co-primary. If the close engine itself regresses, disable the public route and use the already-proven compatibility engine while retaining recovery records for diagnosis.
