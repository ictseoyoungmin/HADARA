# EVIDENCE_FROM_COMMAND_DESIGN

## Purpose

This document records the Phase 3 design boundary for a future `hadara evidence from-command` surface.

The command is **not implemented** in Phase 3. Current supported command-log evidence remains non-executing:

```bash
hadara evidence add-command --task <task-id> --summary "..." --result passed --json
```

## Proposed Future Command

```bash
hadara evidence from-command --task <task-id> --dry-run -- <command...>
hadara evidence from-command --task <task-id> --execute -- <command...>
```

## Required Safety Gates

| Gate | Requirement |
|---|---|
| Explicit mode | `--dry-run` previews only; `--execute` is required for any subprocess execution. |
| Policy preflight | Execute mode must run shell policy preflight before subprocess execution. |
| Approval | Commands requiring approval must stop before execution unless an approved execution path exists. |
| Redaction | Public stdout/stderr summaries or artifacts must pass existing public artifact redaction policy. |
| Size limits | Raw stdout/stderr must be capped or stored privately/local-only before any public evidence summary is written. |
| Exit code capture | Evidence result must derive from exit code unless operator explicitly overrides it. |
| Workspace boundary | Any retained artifact path must remain inside the project/task evidence boundary or private portable store. |
| No MCP default | Do not expose this as an MCP tool unless a separate write/execution-capable MCP contract is approved. |

## Dry-run Report Shape

Future dry-run output should be a read-only plan, not execution:

| Field | Meaning |
|---|---|
| `schemaVersion` | Future schema id, for example `hadara.evidence.from_command.v1`. |
| `command` | `evidence.from-command`. |
| `mode` | `dry-run` or `execute`. |
| `taskId` | Target Task Capsule. |
| `policy` | Policy preflight summary. |
| `plannedEvidence` | Kind/result/visibility/artifact plan. |
| `privacy` | Whether raw logs, private paths, or environment data would be retained. |
| `issues` | Blocking errors or warnings. |

## Execution Boundary

Execute mode, if implemented later, may only:

1. Run the requested command after policy and approval gates pass.
2. Capture bounded stdout/stderr metadata and exit code.
3. Write evidence through existing evidence writer paths.
4. Store raw logs only privately/local-only unless explicitly reduced and redaction-safe.

It must not:

| Prohibited Behavior | Reason |
|---|---|
| Execute by default in `evidence add-command`. | Existing command-log UX is intentionally non-executing. |
| Store raw private logs in committed Task Capsule files. | Prevents leaking secrets, local paths, and large logs. |
| Bypass shell policy. | Preserves existing execution safety model. |
| Add MCP execution tools by implication. | MCP write/execution surfaces require separate contracts. |
| Mark tasks Done automatically. | Evidence capture is not task closure. |

## Minimum Acceptance For Future Implementation

| Criterion | Required Evidence |
|---|---|
| Dry-run is read-only. | No-write test. |
| Execute requires explicit flag. | CLI test. |
| Denied policy blocks before execution. | Fake command/preflight test. |
| Approval-required policy does not execute without approval. | Policy matrix test. |
| Public artifacts are redaction-scanned. | Redaction policy test. |
| Raw logs stay private or temporary. | Artifact boundary test. |
| Evidence JSONL remains canonical. | Evidence lint and list tests. |
