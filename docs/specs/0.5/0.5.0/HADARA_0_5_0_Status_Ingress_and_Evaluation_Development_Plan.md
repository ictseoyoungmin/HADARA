# HADARA 0.5.0 Status Ingress and Evaluation Development Plan

## Release objective

Make `hadara status --json` the sole project/session ingress and make status reports distinguish routing, lifecycle phase, operational health, evaluation completeness, and action readiness. This release is read-model first: it does not introduce the public task-close mutation.

## Entry and exit contracts

| Boundary | Contract |
|---|---|
| Baseline | 0.4.6 status, task status, current-state canon, and `task finalize` remain working. |
| Entry command | `hadara status --json` |
| Local decision command | `hadara task status [--task T-XXXX] --json` |
| Primary close command | `task finalize` remains primary for 0.5.0. |
| Exit | Global status emits one route; selected-task status emits phase, health, readiness, evaluation state, and one local action. |

## Capsule budget

Release ceiling: **6 capsules**, at most **2 L**, total planned source ceiling **32 files / 3,800 net LOC** excluding generated `dist`.

| Plan ID | Capsule | Size | Depends on | Deliverable |
|---|---|---:|---|---|
| 050-C01 | Shared evaluation vocabulary and schema foundation | M | — | Internal evaluator types, schema fragments, validation helpers |
| 050-C02 | Project status v2 ingress router | L | C01 | Lifecycle-aware global routing without selected-task duplication |
| 050-C03 | Task-selection status v2 projection | M | C01-C02 | Recommendation precedence, source explanation, compact action |
| 050-C04 | Selected-task status v2 cockpit | L | C01 | Phase/readiness/health mapping and phase-relevant compact output |
| 050-C05 | Remove public `session start` and migrate guidance | M | C02-C04 | Routing/help/scaffold/docs/package-smoke migration |
| 050-C06 | Cross-profile and installed-package dogfood | S | C02-C05 | Greenfield, brownfield, active, idle, degraded evidence |

Split triggers:

- Split C02 if adoption/upgrade routing needs mutation planning beyond read-only detection.
- Split C04 if close-grade diagnostics cannot remain opt-in without touching the close engine.
- Split C05 by source versus docs only if public-route removal exceeds the M file ceiling.

## Schema plan

### Internal evaluation schema

Proposed internal-only contract:

```ts
interface StatusEvaluationV1 {
  scope: 'project' | 'task-selection' | 'task' | 'release';
  phase: string;
  health: 'ok' | 'attention' | 'blocked' | 'degraded' | 'unknown';
  readiness: IntentReadinessV1;
  evaluations: EvaluationSummaryV1[];
  primaryNextAction: NextActionV2 | null;
  issues: StatusIssueV1[];
}

interface IntentReadinessV1 {
  intent: 'orient' | 'plan' | 'edit' | 'validate' | 'close' | 'release';
  status: 'ready' | 'needs-context' | 'needs-review' | 'not-evaluated' | 'blocked' | 'terminal';
  reason: string;
}

type EvaluationState =
  | 'evaluated'
  | 'not-evaluated'
  | 'unavailable'
  | 'stale'
  | 'invalid'
  | 'partial';
```

Public projections:

| Schema | Scope | Compatibility rule |
|---|---|---|
| `hadara.project.status.v2` | Global ingress | New version; v1 consumers receive an explicit migration note. |
| `hadara.taskSelection.status.v2` | No selected task | Preserve recommendation identity/source while normalizing envelope fields. |
| `hadara.task.status.v2` | Selected capsule | Replace ambiguous `ok` readiness use with explicit health/readiness. |
| `hadara.release.status.v2` | Explicit release work only | May remain internal/conditional until release signals are available. |

`primaryNextAction` extends the existing next-action contract with canonical `writeBoundary`, `risk`, and `requiresReview`. The boolean `writes` may remain a derived convenience field.

## Implementation details by capsule

### 050-C01 — evaluator foundation

- Define controlled enums once and expose them through schema lookup.
- Add a lossless adapter from existing v1 status/workbench reports.
- Prohibit skipped checks from becoming `count: 0` with implicit health.
- Add schema fixtures for every evaluation and readiness token.

### 050-C02 — project status ingress

- Detect uninitialized, adoption-review, upgrade-required, select-work, active-work, release-preparation, integration-setup, idle, and degraded phases.
- Preserve valid canonical facts when optional cache or registry reads fail.
- Route active work to `task status --task T`; do not compute the final local task phase.
- Keep detailed project diagnostics behind explicit detail mode.

### 050-C03 — task selection

- Implement precedence: valid active task → structured next work → current-state candidate → Task Board → slice/backlog → first-task creation → idle.
- Return recommendation source and one primary action.
- Avoid broad graph, release, or integration diagnostics in compact mode.

### 050-C04 — selected-task cockpit

- Cover author-task, plan-work, implement, validate, repair-evidence, close-ready, blocked, closed-valid, and closed-stale.
- Require an explicit signal for `plan-work`; do not infer it from an empty code diff.
- Do not advance toward close merely because one evidence record exists.
- Hide authoring/validation/close sections when terminal and closed-valid.

### 050-C05 — session-start removal

- Remove public routing, default help, README/scaffold instructions, and workflow teaching.
- Move useful active/latest task, validation baseline, required-reading, and primary-action facts to project status.
- Detect stale installed guidance through docs/currentness checks.
- Do not retain a second taught ingress alias.

### 050-C06 — dogfood

- Run basic, standard, and governed disposable projects.
- Cover uninitialized/adoption preview, first task, active task, idle, malformed optional state, and malformed canonical state.
- Repeat through the installed package with a delegated agent prompt.

## Validation and acceptance

| Gate | Required proof |
|---|---|
| Schema | Every public fixture validates; scope-specific schemas do not become a giant optional-field union. |
| Routing | Top-level status returns exactly one primary action for every non-terminal phase. |
| Separation | Active project status routes to task status and does not duplicate local phase evaluation. |
| Failure semantics | `ok:true` may coexist with non-`ok` health; all skipped/unavailable checks are explicit. |
| Currentness | `session start` is absent from public routing, help, README, generated guidance, workflow docs, and package smokes. |
| Regression | 0.4.6 finalize/evidence behavior and task-local evidence locality remain unchanged. |
| Dogfood | Installed-package runs cover project ingress and selected-task routing without private repo knowledge. |

## Promotion and rollback

Promote 0.5.0 only if compact status is faster than the configured slow threshold on a local temp project and mounted-workspace degradation remains diagnostic rather than correctness-affecting. Roll back public schema selection—not the shared evaluator—if existing consumers cannot migrate cleanly. Do not start 0.5.1 public routing work until C01-C04 contracts are frozen.

