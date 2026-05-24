# OPERATIONAL_DEBT

Operational debt records track weaknesses discovered while dogfooding HADARA itself. They are product signals for continuity, validation, scope control, complexity, visibility, and environment reliability.

## Schema

| Field | Meaning |
|---|---|
| `id` | Stable operational debt id. |
| `title` | Short product-facing pain point. |
| `source` | Original discovery source. |
| `category` | Continuity, validation, scope-control, complexity, visibility, or environment. |
| `status` | `tracked`, `mitigated`, or `candidate`. |
| `severity` | `low`, `medium`, or `high` release-readiness impact. |
| `targetCapability` | HADARA capability that should reduce the debt. |

## Records

| ID | Title | Source | Category | Status | Severity | Target Capability |
|---|---|---|---|---|---|---|
| OD-0001 | Task Capsule Markdown consistency can drift after context compaction | `known_issue.log#1` | validation | mitigated | medium | Task Capsule format validation |
| OD-0002 | New sessions may miss Docker-based validation environment details | `known_issue.log#2` | environment | mitigated | medium | Validation environment handoff |
| OD-0003 | Agents can overfit to the last capsule and miss broader roadmap state | `known_issue.log#3` | continuity | tracked | high | Roadmap-aware handoff validation |
| OD-0004 | Long-running capsule work can concentrate too many features in one file | `known_issue.log#4` | complexity | tracked | medium | LOC and complexity risk indicators |
| OD-0005 | LOC calculation utility is needed for complexity management | `known_issue.log#5` | complexity | candidate | low | Changed LOC utility |
| OD-0006 | Capsule size should scale with task complexity | `known_issue.log#6` | scope-control | tracked | medium | Capsule size indicator |
| OD-0007 | Task change size should be visible in dashboard or TUI surfaces | `known_issue.log#7` | visibility | candidate | low | Changed-size dashboard signal |
| OD-0008 | `ACCEPTANCE.md` checkboxes can be marked before implementation evidence exists | `known_issue.log#8` | validation | tracked | high | Premature acceptance guard |

## Current Report

`createOperationalDebtReport(projectRoot)` returns:

- structured debt records;
- aggregate counts for total/open/status/severity/high-open debt;
- capsule size indicators using file count, line count, byte count, and `tiny|standard|large` size;
- warning issues for checked acceptance when the task is not Done or has no valid `hadara.evidence.v1` records.

Read-only surfaces:

- `hadara debt list --json`
- `hadara debt show <id> --json`
- MCP `hadara.debt.list`
- MCP `hadara.debt.show`
- `hadara ops status --json` includes debt aggregate counts.
- `hadara release gate --json` emits a warning check when open high-severity debt remains; it does not execute release, packaging, deployment, shell, or provider actions.

## V1.0 Follow-Up

The current implementation is a foundational report, not the final v1.0 debt system.

Planned follow-up details are tracked in `docs/V1_0_CAPSULE_BACKLOG.md` and `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.

Future work should add:

- persisted or extensible debt records;
- impact, recommended fix, linked tasks, and timestamps;
- persisted or externally editable records;
- blocking semantics for high-severity debt after false-positive risk is low.
