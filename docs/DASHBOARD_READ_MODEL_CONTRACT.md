# DASHBOARD_READ_MODEL_CONTRACT

This document defines how a future HADARA dashboard consumes `hadara.ops.status.v1`.

T-0055 is contract-only for dashboard data consumption. It does not implement dashboard UI.

## Data Source

Primary source:

```bash
hadara status --json
```

Equivalent source:

```bash
hadara ops status --json
```

Sample fixture:

- `docs/design/fixtures/hadara.ops.status.sample.json`

Visual reference:

- `docs/design/mockups/HADARA_web_ui_v0.1_comfort_dark.html`

The mockup is visual direction only. The read model is authoritative for dashboard data fields.

## Operations Home Mapping

| Dashboard area | Field path | Empty behavior | Degraded behavior |
|---|---|---|---|
| Topbar project phase | `project.phase` | Show `unknown`. | Show with degraded status accent if `health` is `degraded`. |
| Topbar branch | `project.branch` | Show `unknown`. | No special treatment unless issues mention source state. |
| Health indicator | `health` | Show `unknown` only if field is absent. | Show `degraded`; expose warning count from `issues`. |
| Task metric: Done | `tasks.counts.done` | Show `0`. | Show normally; warnings belong in health panel. |
| Task metric: Draft | `tasks.counts.draft` | Show `0`. | Show normally. |
| Task metric: Partial | `tasks.counts.partial` | Show `0`. | Show normally. |
| Task metric: Superseded | `tasks.counts.superseded` | Show `0`. | Show normally. |
| Task metric: In progress | `tasks.counts.inProgress` | Show `0`. | Show normally. |
| Task metric: Unknown | `tasks.counts.unknown` | Show `0`. | Highlight only when greater than zero. |
| Last completed cards | `tasks.lastCompleted[]` | Show an empty state. | Show any available cards and a degraded notice if handoff is missing. |
| Next recommended work | `tasks.nextRecommended` | Show `No recommendation available`. | Show available value or degraded empty state. |
| Current state panel | `handoff.currentState[]` | Show `No current state found`. | Show warning if `AGENT_HANDOFF_MISSING` exists. |
| Known problems panel | `handoff.knownProblems[]` | Show `No known problems listed`. | Show warning if `AGENT_HANDOFF_MISSING` exists. |
| Validation full check | `validation.latestFullCheck` | Show `No full check recorded`. | Show warning if `VALIDATION_BASELINE_MISSING` exists. |
| Validation done-level check | `validation.latestDoneLevelValidation` | Show `No done-level validation recorded`. | Show warning if `VALIDATION_BASELINE_MISSING` exists. |
| MCP default mode | `mcp.defaultMode` | Show `unknown`. | No live process warning; this is configured state only. |
| MCP evidence attach guard | `mcp.evidenceAttach` | Show guard values as unavailable. | No live process warning; this is configured state only. |
| Issues panel | `issues[]` | Hide or show `No issues`. | Show warning issue code and message. |

## Status Semantics

| Value | Color role | Meaning |
|---|---|---|
| `health: "ok"` | success | Report generated with complete source state. |
| `health: "degraded"` | warning | Report generated, but one or more source documents or validation baseline details are missing. |
| `health: "error"` | danger | Reserved for future structured report-generation failures. |
| `issues[].severity: "warning"` | warning | Dashboard should remain usable and show partial data. |
| `issues[].severity: "error"` | danger | Reserved for future hard failures. |

Suggested color roles are semantic only. Actual palette and component styling belong to a later dashboard implementation slice.

## Mockup Reference Mapping

Use the comfort dark mockup to guide placement only:

- topbar/sidebar hierarchy maps to project, branch, and health fields
- metric cards map to `tasks.counts`
- task cards map to `tasks.lastCompleted` and `tasks.nextRecommended`
- evidence/validation cards map to `validation`
- handoff panels map to `handoff.currentState`, `handoff.knownProblems`, and `handoff.nextRecommendedStep`
- operational notices map to `issues`

## Non-Goals

- Rendering HTML, React, or Vite UI.
- Live MCP stream connection.
- Current MCP process discovery.
- Provider/run/queue UI.
- Persisting dashboard state.
