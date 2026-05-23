# MCP_EVIDENCE_ATTACH_CONTRACT

This document defines the HADARA MCP evidence attach contract.

T-0046 was contract-only. T-0048 implemented `hadara.evidence.attach` only for explicit opt-in mode, and T-0050 through T-0052 added private audit logging, accurate initialize metadata, and per-call approval records.

## Phase

Phase: narrow opt-in write-capable evidence contract.

The default MCP runtime remains read-only. `hadara.evidence.attach` may only be advertised when the operator explicitly starts MCP with evidence attach enabled. Enabled evidence attach mode must be reflected in `initialize` metadata.

## Non-Goals

- Advertising write-capable MCP tools by default.
- Shell execution.
- Provider calls.
- Task creation or mutation outside evidence append behavior.
- Handoff updates.
- Dashboard integration.

## Policy Relationship

`hadara.policy.evaluate` is an evaluation tool only. It reports policy preflight output and never grants MCP execution authority.

Even when policy output says a command would be allowed by CLI policy, MCP tools must not execute that command. Future write-capable MCP tools need their own explicit phase gates, schema validation, workspace checks, and evidence policy checks.

## Tool

### `hadara.evidence.attach`

Attach evidence to an existing Task Capsule using HADARA evidence store semantics.

Runtime availability:

```bash
hadara mcp serve --enable-evidence-attach
```

Without this explicit flag, `hadara.evidence.attach` must not appear in `tools/list` and must not be callable.

Input schema:

```json
{
  "type": "object",
  "required": ["taskId", "kind", "summary", "result", "approval"],
  "additionalProperties": false,
  "properties": {
    "taskId": { "type": "string", "pattern": "^T-[0-9]{4}$" },
    "kind": {
      "type": "string",
      "enum": ["test-log", "command-log", "diff-summary", "screenshot", "note"]
    },
    "summary": { "type": "string", "minLength": 1 },
    "result": {
      "type": "string",
      "enum": ["passed", "failed", "blocked", "unknown"]
    },
    "visibility": {
      "type": "string",
      "enum": ["public", "private"],
      "default": "public"
    },
    "artifactPath": {
      "type": "string",
      "minLength": 1,
      "description": "Optional project-relative path for an existing evidence artifact."
    },
    "approval": {
      "type": "object",
      "required": ["actor", "reason"],
      "additionalProperties": false,
      "properties": {
        "actor": { "type": "string", "minLength": 1 },
        "reason": { "type": "string", "minLength": 1 }
      }
    }
  }
}
```

Initialize metadata:

Default read-only startup must report:

```json
{
  "hadara/phase": "read-only-bridge",
  "hadara/readOnly": true,
  "hadara/writes": false,
  "hadara/evidenceAttach": false,
  "hadara/shellExecution": false,
  "hadara/providerCalls": false
}
```

Evidence attach-enabled startup must report:

```json
{
  "hadara/phase": "evidence-attach-enabled",
  "hadara/readOnly": false,
  "hadara/writes": true,
  "hadara/evidenceAttach": true,
  "hadara/shellExecution": false,
  "hadara/providerCalls": false
}
```

Output payload:

The MCP protocol result must contain one JSON text payload. Parsed text must be the existing HADARA evidence collect report shape:

```json
{
  "schemaVersion": "hadara.evidence.collect.v1",
  "command": "evidence.collect",
  "ok": true,
  "evidence": {
    "schemaVersion": "hadara.evidence.v1",
    "taskId": "T-0046",
    "kind": "note",
    "summary": "Contract accepted.",
    "result": "passed",
    "visibility": "public",
    "markdownPath": "tasks/T-0046-evidence-attach-tool-contract/EVIDENCE.md"
  },
  "issues": []
}
```

## Required Safety Gates

A future implementation must:

- Reject the tool unless the HADARA MCP phase explicitly allows write-capable evidence tools.
- Validate the full input schema before writing.
- Require per-call approval metadata before writing.
- Require `taskId` to resolve to an existing Task Capsule.
- Preserve the portable/project store boundary.
- Resolve `artifactPath` through the workspace boundary resolver before reading.
- Apply public artifact text/binary and secret redaction policy before creating committed public copies.
- Avoid writing secrets, private logs, or machine-local paths into committed files.
- Audit successful and failed write attempts to the private portable audit store.
- Never execute shell commands.
- Never call model providers.
- Return the existing evidence collect JSON report shape when evidence append succeeds or fails at command-report level.

## Tool Dispatch Error Taxonomy

Write-capable MCP tools should continue to use JSON-RPC errors for adapter/transport-level failures and include a HADARA issue object under `error.data.issue`.

Issue codes reserved for write-capable MCP tools:

| Code | Meaning |
|---|---|
| `TOOL_POLICY_DENIED` | A tool call was denied by an explicit HADARA policy gate. |
| `TOOL_WRITE_FORBIDDEN` | The current MCP phase or mode forbids write behavior. |
| `TOOL_WORKSPACE_BOUNDARY` | A file path failed project/workspace boundary validation. |
| `TOOL_ARTIFACT_REDACTION_FAILED` | A public artifact failed text, binary, or secret redaction policy. |
| `TOOL_SCHEMA_VERSION_MISMATCH` | A caller requested or returned an unsupported schema version. |

Existing read/dispatch issue codes remain valid:

| Code | Meaning |
|---|---|
| `TOOL_NOT_FOUND` | The requested MCP tool name is not registered. |
| `TOOL_INPUT_INVALID` | `tools/call` params or tool arguments failed schema validation. |
| `TOOL_NOT_IMPLEMENTED` | The tool is registered but has no handler in the current implementation. |
| `TOOL_FORBIDDEN_BY_PHASE` | The tool exists but is forbidden by the current HADARA phase. |

## Implementation Prerequisites

Before implementation, create a new Task Capsule that:

1. Adds `hadara.evidence.attach` to the MCP tool registry with write-capable metadata.
2. Adds contract tests proving current read-only tools remain unchanged.
3. Adds tests for each safety gate and error code above.
4. Runs full Docker validation and done-level harness validation.
