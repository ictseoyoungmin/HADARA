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
| OD-0003 | Agents can overfit to the last capsule and miss broader roadmap state | `known_issue.log#3` | continuity | mitigated | high | Required-reading protocol and roadmap-aware handoff guidance |
| OD-0004 | Long-running capsule work can concentrate too many features in one file | `known_issue.log#4` | complexity | tracked | medium | LOC and complexity risk indicators |
| OD-0005 | LOC calculation utility is needed for complexity management | `known_issue.log#5` | complexity | candidate | low | Changed LOC utility |
| OD-0006 | Capsule size should scale with task complexity | `known_issue.log#6` | scope-control | tracked | medium | Capsule size indicator |
| OD-0007 | Task change size should be visible in operator surfaces | `known_issue.log#7` | visibility | candidate | low | Changed-size TUI signal |
| OD-0008 | `ACCEPTANCE.md` checkboxes can be marked before implementation evidence exists | `known_issue.log#8` | validation | mitigated | high | Premature acceptance guard and done-level harness validation |

## Mitigation Notes

- OD-0003 is mitigated by the current HADARA session protocol: `AGENTS.md` and `docs/IMPLEMENTATION_SOP.md` route agents through task status, Task Board, task-local handoff, development slices, the active Task Capsule, and referenced specs before implementation. Historical handoff/project-state snapshots live under `docs/history/` and are not default session context.
- OD-0008 is mitigated by release-readiness and completion guards already implemented in the harness and operational debt service. Debt reports warn on checked acceptance before Done status or valid evidence, and done-level harness validation requires completed acceptance, evidence records, handoff sections, Task Board consistency, and non-scaffold capsule Markdown before work can be marked done.

## Current Report

`createOperationalDebtReport(projectRoot)` returns:

- structured debt records;
- aggregate counts for total/open/status/severity/high-open debt;
- capsule footprint metrics using file count, line count, and byte count;
- warning issues for checked acceptance when the task is not Done or has no valid `hadara.evidence.v1` records.

Read-only surfaces:

- `node --import tsx tools/dev-surfaces.ts debt list --json`
- `node --import tsx tools/dev-surfaces.ts debt show <id> --json`
- `hadara status --compat v1 --json` includes legacy debt aggregate counts; the primary lifecycle uses `hadara task status --json`.
- `node --import tsx tools/dev-surfaces.ts release gate --mode advisory --json` is the default current release gate. Open high-severity debt would emit a warning check and `ok: true`.
- `node --import tsx tools/dev-surfaces.ts release gate --mode strict --json` is a read-only blocking readiness report. Open high-severity debt would emit an error check and `ok: false`; with OD-0003 and OD-0008 mitigated, strict mode can pass when all other documented readiness checks pass.

Both release-gate modes are read-only reports. They do not execute release, packaging, deployment, shell, provider, or remote CI actions. Remote CI readiness is represented by documented observation evidence; the release gate checks for that record without calling GitHub.

## V1.0 Follow-Up

The current implementation is a foundational report, not the final v1.0 debt system.

Planned follow-up details are tracked in `docs/archive/retired-2026-07-26/V1_0_CAPSULE_BACKLOG.md` and `docs/archive/retired-2026-07-26/V1_0_IMPLEMENTATION_SCHEMAS.md`.

Future work should add:

- persisted or extensible debt records;
- impact, recommended fix, linked tasks, and timestamps;
- persisted or externally editable records;
- richer strict-mode inputs after false-positive risk is lower.
