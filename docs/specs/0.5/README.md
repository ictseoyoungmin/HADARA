# HADARA 0.5.x Development Plan Index

**Status:** implementation planning  
**Baseline:** HADARA 0.4.6  
**Source set:** [`all/`](./all/) combined agent-loop and lifecycle/use-case plans

## Decision Update: 0.5.0 Stable Absorbs Close

After `0.5.0-rc.0`, the stable scope changed: **0.5.0 stable must include the one-command task close path**, not only status ingress.

The practical release boundary is now:

```text
0.5.0-rc.0
  status ingress, selected-task cockpit, session-start removal

0.5.0 stable
  status ingress + task-close transaction + public primary task close + installed/delegated dogfood
```

The old `0.5.1` task-close transaction and `0.5.2` public-close promotion plans are retained as source design modules, but their deliverables are folded into the 0.5.0 stable pre-release workstream. Do not treat them as future-version promises unless the plan is explicitly resplit.

## Previous Split: six release slices

The original 0.5.x plan was split into **six release folders**, `0.5.0` through `0.5.5`. This table is now historical planning context for workstream ownership, not the current stable-release boundary.

| Release | Theme | Primary risk retired | Promotion result |
|---|---|---|---|
| [0.5.0](./0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md) | Status ingress and shared evaluation semantics | Ambiguous global/local routing | One global route and phase-aware local cockpit; stable now also requires close work below |
| [0.5.1](./0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md) | Task-close transaction engine | Partial close, races, premature proof | Folded into 0.5.0 stable scope |
| [0.5.2](./0.5.2/HADARA_0_5_2_Public_Close_Migration_Development_Plan.md) | Public close promotion and compatibility | Two taught close paths and consumer drift | Folded into 0.5.0 stable scope |
| [0.5.3](./0.5.3/HADARA_0_5_3_Structured_State_and_Projection_Development_Plan.md) | Structured state and projection ownership | Manual synchronization and projection drift | Proven state-first expansion for selected machine-owned facts |
| [0.5.4](./0.5.4/HADARA_0_5_4_Dogfood_and_Hardening_Development_Plan.md) | Dogfood and hardening | Hidden regressions across real project shapes | Broad installed-package proof and blocker cleanup |
| [0.5.5](./0.5.5/HADARA_0_5_5_Stabilization_and_Promotion_Development_Plan.md) | Stabilization and promotion | Overclaiming or unstable compatibility | Agent loop v1 stable promotion decision |

Six is the smallest release count that does not mix these independent risk domains:

1. Read-only status behavior can ship without transaction mutation risk.
2. Close correctness can be proven behind an experimental route before changing public guidance.
3. Public command migration can be measured independently from the close engine implementation.
4. Structured-state expansion can be gated on stable status and close contracts instead of blocking them.
5. Installed-package dogfood/hardening can fix real-project regressions without adding more feature scope.
6. Stabilization/promotion can freeze schemas, compatibility policy, release notes, and public package evidence without absorbing new implementation risk.

Using only the original three labels (`0.5.0`, `0.5.1`, `0.5.2+`) would leave `0.5.2+` with command migration, state/projection migration, hardening, and promotion. That creates an unbounded capsule line and weakens rollback decisions. Four releases are enough for core implementation planning, but six releases better match the final combined scope.

## Cross-release dependency chain

```text
0.5.0-rc.0 status/evaluation contracts
  → 0.5.0 stable close transaction and recovery
    → 0.5.0 stable public task-close migration
      → post-0.5.0 structured-state expansion
        → post-0.5.0 broad dogfood and hardening
          → post-0.5.0 stabilization and promotion
```

`0.5.0-rc.0` remains a valid pre-release snapshot, but **0.5.0 stable is not promotable until close transaction, public close migration, and installed/delegated close dogfood pass**.

## Capsule budget model

The release plans use a common planning budget. It is a split trigger, not a productivity quota.

| Size | Intended scope | Source-file ceiling | Test/fixture ceiling | Net implementation ceiling |
|---|---|---:|---:|---:|
| S | One schema, projection, doc migration, or narrow adapter | 4 | 3 | 350 LOC |
| M | One service boundary plus CLI/schema integration | 7 | 5 | 700 LOC |
| L | Transaction or cross-surface migration with fault coverage | 10 | 8 | 1,100 LOC |

Budget rules:

- A capsule owns one acceptance narrative and one primary write boundary.
- Generated outputs such as `dist/` do not count as source files, but source schemas and tests do.
- Docs-only migration may exceed the LOC ceiling when changes are mechanical; touched-doc count must still be explicit.
- Crossing either file ceiling or implementation ceiling requires splitting the capsule or recording a reviewed exception in its `TASK.md`.
- Same-file writers, evidence appenders, close/finalize execution, and release mutations remain serialized.
- Each implementation capsule must be created through the active HADARA task workflow; the IDs below are planning IDs, not preallocated `T-XXXX` IDs.

## Workflow budget target

The existing Task Capsule budget remains four unique task-work commands. `hadara status` is the project/session ingress outside that bounded task loop.

| Layer | Unique commands | Clean invocation target |
|---|---:|---:|
| Project/session ingress | 1 (`status`) | 1 |
| Task Capsule loop | 4 (`task status`, `task create`, `validation run`, primary close) | at most 5 from empty selection to close |
| Combined ordinary path | 5 | at most 6 after init |

`task close` replaces `task finalize` in the task-loop portfolio before 0.5.0 stable promotion. The product must never teach both as primary commands in one release.

## Cross-cutting invariants

- `ok` reports command/report generation; `health` reports operational condition.
- Phase and intent readiness remain separate.
- Not-evaluated, unavailable, stale, invalid, and partial are never collapsed into healthy zero values.
- Public status schemas stay scope-specific while using a shared internal evaluator.
- Task evidence remains canonical in `tasks/T-*/evidence.jsonl`.
- State `rev`/CAS prevents lost updates; close-source hashes prove close safety. Neither replaces the other.
- Close proof is appended last, after final source verification.
- Human prose remains human-owned unless a projection ownership contract explicitly says otherwise.
- Compact output exposes one primary next action and hides unrelated diagnostics.

## Release-wide validation matrix

| Gate | 0.5.0 rc/status | 0.5.0 close engine | 0.5.0 public close | Post-0.5.0 state | Post-0.5.0 dogfood | Post-0.5.0 promotion |
|---|---|---|---|---|---|---|
| Focused unit/schema tests | Required | Required | Required | Required | Required | Required |
| CLI JSON contract smokes | Required | Required | Required | Required | Required | Required |
| Race/fault injection | Routing consistency | Required | Compatibility retry | CAS/render conflict | Regression replay | Release gate |
| Disposable-project workflow | Status ingress | Clean/blocked/recovery close | Primary portfolio | No-op/drift/migration | Multi-scenario dogfood | Stable candidate proof |
| Installed-package delegated dogfood | Status + task status | Close engine | Full promoted loop | Projection upgrade/recycle | Broad matrix | Public stable recycle |
| Full Docker validation | Release gate | Release gate | Release gate | Release gate | Release gate | Release gate |

## Source coverage map

| Combined-plan concern | Owning release |
|---|---|
| Remove public `session start`; global `status` routing | 0.5.0 |
| Health, readiness, evaluation state, write-boundary semantics | 0.5.0 |
| Clean/blocked close, lock ordering, idempotency, recovery, proof-last | 0.5.0 stable |
| One public close surface, compatibility and workflow-budget change | 0.5.0 stable |
| Projection ownership tiers, Task Board inputs, structured-state expansion gates | 0.5.3 |
| Broad greenfield, brownfield, delegated-agent, failed-validation, projection-drift, and release-rehearsal hardening | 0.5.4 |
| Schema freeze, compatibility policy, stable release readiness, public recycle, and promotion decision | 0.5.5 |
| Greenfield, brownfield, delegated agent, failed validation, release recycle | Distributed across release dogfood gates, consolidated in 0.5.4/0.5.5 |

## Deferred beyond 0.5.5

- Full `TASK.md` state migration.
- Centralized task evidence.
- Cloud/controller runtime or default real-provider execution.
- Broad MCP mutation or shell execution.
- Automatic release-scope inference from arbitrary version-file changes.
- Full `verify --ac` automation.
- Dashboard/TUI migration beyond compatibility wrappers.
