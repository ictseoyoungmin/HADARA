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
| `targetCapability` | HADARA capability that should reduce the debt. |

## Records

| ID | Title | Source | Category | Status | Target Capability |
|---|---|---|---|---|---|
| OD-0001 | Task Capsule Markdown consistency can drift after context compaction | `known_issue.log#1` | validation | mitigated | Task Capsule format validation |
| OD-0002 | New sessions may miss Docker-based validation environment details | `known_issue.log#2` | environment | mitigated | Validation environment handoff |
| OD-0003 | Agents can overfit to the last capsule and miss broader roadmap state | `known_issue.log#3` | continuity | tracked | Roadmap-aware handoff validation |
| OD-0004 | Long-running capsule work can concentrate too many features in one file | `known_issue.log#4` | complexity | tracked | LOC and complexity risk indicators |
| OD-0005 | LOC calculation utility is needed for complexity management | `known_issue.log#5` | complexity | candidate | Changed LOC utility |
| OD-0006 | Capsule size should scale with task complexity | `known_issue.log#6` | scope-control | tracked | Capsule size indicator |
| OD-0007 | Task change size should be visible in dashboard or TUI surfaces | `known_issue.log#7` | visibility | candidate | Changed-size dashboard signal |
| OD-0008 | `ACCEPTANCE.md` checkboxes can be marked before implementation evidence exists | `known_issue.log#8` | validation | tracked | Premature acceptance guard |

## Current Report

`createOperationalDebtReport(projectRoot)` returns:

- structured debt records;
- capsule size indicators using file count, line count, byte count, and `tiny|standard|large` size;
- warning issues for checked acceptance when the task is not Done or has no valid `hadara.evidence.v1` records.
