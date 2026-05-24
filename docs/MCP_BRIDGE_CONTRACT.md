# MCP_BRIDGE_CONTRACT

This document defines the first HADARA MCP bridge contract.

T-0042 is contract-only. It does not implement a JSON-RPC server or MCP tools.

## Phase

Phase: read-only bridge contract.

The first implementation must be safe for external agents to call while preserving HADARA's Task Capsule, evidence, policy, and harness discipline.

Future write-capable evidence attachment is documented separately in `docs/MCP_EVIDENCE_ATTACH_CONTRACT.md`. It is not part of the read-only bridge.

Planned v1.0 read-only MCP extensions are tracked in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`. They are not part of the current default tool contract until their individual Task Capsules complete.
T-0076 completed `hadara.evidence.list` as a read-only extension.
T-0077 completed `hadara.context.export` as a read-only memory-payload extension.
T-0078 completed `hadara.tools.list` as a read-only capability discovery extension.

## Non-Goals

The following are explicitly out of scope for the first bridge:

- File writes.
- Task creation or task mutation.
- Evidence attachment.
- Handoff updates.
- Shell execution.
- Provider calls.
- Release gates or deployment.
- Dashboard integration.

## Transport

The first implementation should use stdio JSON-RPC MCP server behavior.

Future server implementations should expose `hadara mcp serve` as the local entry point.

JSON-RPC requests with no `id` are notifications. Notifications produce no response.

## MCP Tool Result Payload

All HADARA MCP read tools return one JSON text payload. The MCP protocol envelope belongs to MCP; the payload text, when parsed as JSON, must be the HADARA command/report schema described by this contract and `docs/CLI_JSON_CONTRACT.md`.

For example, an MCP tool result should carry one text content item whose `text` value is a serialized HADARA report:

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"schemaVersion\":\"hadara.task.list.v1\",\"command\":\"task.list\",\"ok\":true,\"count\":1,\"tasks\":[]}"
    }
  ]
}
```

Server internals may use typed payloads, but the external MCP tool result payload is JSON text. Do not wrap HADARA reports in a second custom JSON object inside the text payload.

## General Tool Rules

- Tool names are namespaced with `hadara.`.
- Tool outputs should be JSON-serializable objects.
- Where a tool mirrors an existing CLI command, output should match the existing CLI JSON contract.
- Tools must not write files in this phase.
- Tools must not execute shell commands in this phase.
- Tools must not call model providers in this phase.
- Tools should report validation issues using existing HADARA issue shapes where possible.

## Tool Dispatch Errors

`tools/call` input must have this shape:

```json
{
  "name": "hadara.task.list",
  "arguments": {}
}
```

Tool dispatch failures use JSON-RPC errors for transport-level failure and include a HADARA issue object under `error.data.issue`.

Initial HADARA issue codes:

| Code | Meaning |
|---|---|
| `TOOL_NOT_FOUND` | The requested MCP tool name is not registered. |
| `TOOL_INPUT_INVALID` | `tools/call` params or tool arguments failed schema validation. |
| `TOOL_NOT_IMPLEMENTED` | The tool is registered but has no handler in the current implementation. |
| `TOOL_FORBIDDEN_BY_PHASE` | The tool exists but is forbidden by the current HADARA phase. |

Future write-capable tool errors such as `TOOL_POLICY_DENIED`, `TOOL_WRITE_FORBIDDEN`, `TOOL_WORKSPACE_BOUNDARY`, `TOOL_ARTIFACT_REDACTION_FAILED`, and `TOOL_SCHEMA_VERSION_MISMATCH` are reserved by `docs/MCP_EVIDENCE_ATTACH_CONTRACT.md`.

## Tools

Current default read-only tools:

```text
hadara.task.list
hadara.task.read
hadara.handoff.read
hadara.project.state.read
hadara.policy.evaluate
hadara.harness.validate
hadara.evidence.list
hadara.context.export
hadara.tools.list
```

Planned v1.0 read-only candidates:

```text
hadara.active.run.read
hadara.active.run.resume
hadara.debt.list
```

These candidates must remain read-only. `hadara.context.export` returns a memory payload through MCP; it must not generate or mutate `.hadara/context/HADARA_CONTEXT.md`.

### `hadara.context.export`

Export HADARA context as an in-memory read-only payload without writing files.

Input schema:

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "format": { "type": "string", "enum": ["markdown", "json"], "default": "markdown" },
    "summaryOnly": { "type": "boolean", "default": false }
  }
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.context.export.v1",
  "command": "context.export",
  "ok": true,
  "format": "markdown",
  "mode": "memory",
  "content": "# HADARA_CONTEXT...",
  "contextPath": null,
  "wouldWritePath": ".hadara/context/HADARA_CONTEXT.md",
  "issues": []
}
```

If `summaryOnly` is true before summary generation exists, the tool returns the full context and includes warning issue code `SUMMARY_ONLY_NOT_IMPLEMENTED`.

### `hadara.tools.list`

List current HADARA CLI/MCP capabilities and disabled surfaces for external-agent discovery.

Input schema:

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.tools.list.v1",
  "command": "tools.list",
  "ok": true,
  "surfaces": {
    "cli": [
      {
        "name": "hadara task list --json",
        "category": "read",
        "stable": true,
        "readOnly": true,
        "enabledByDefault": true,
        "schemaVersion": "hadara.task.list.v1"
      }
    ],
    "mcp": [
      {
        "name": "hadara.task.list",
        "category": "read",
        "stable": true,
        "readOnly": true,
        "enabledByDefault": true
      },
      {
        "name": "hadara.evidence.attach",
        "category": "write",
        "stable": true,
        "readOnly": false,
        "enabledByDefault": false,
        "schemaVersion": "hadara.evidence.collect.v1"
      }
    ]
  },
  "disabled": [
    {
      "name": "mcp.shell.execute",
      "category": "execute",
      "reason": "MCP shell execution is out of scope for the current read-only bridge."
    }
  ],
  "issues": []
}
```

The report is discovery-only. It must not enable disabled tools, execute commands, call providers, or mutate files.

### `hadara.task.list`

List Task Capsules known to the project.

Input schema:

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.task.list.v1",
  "command": "task.list",
  "ok": true,
  "count": 1,
  "tasks": [
    {
      "id": "T-0042",
      "title": "Hermes/MCP Read-Only Contract",
      "status": "Draft",
      "capsule": "tasks/T-0042-hermes-mcp-read-only-contract"
    }
  ],
  "issues": []
}
```

### `hadara.task.read`

Read a single Task Capsule summary and standard capsule files.

Input schema:

```json
{
  "type": "object",
  "required": ["taskId"],
  "additionalProperties": false,
  "properties": {
    "taskId": { "type": "string", "pattern": "^T-[0-9]{4}$" }
  }
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.task.read.v1",
  "command": "task.read",
  "ok": true,
  "task": {
    "id": "T-0042",
    "title": "Hermes/MCP Read-Only Contract",
    "status": "Draft",
    "capsule": "tasks/T-0042-hermes-mcp-read-only-contract"
  },
  "files": {
    "TASK.md": "...",
    "PLAN.md": "...",
    "CONTEXT.md": "...",
    "ACCEPTANCE.md": "...",
    "TESTS.md": "...",
    "RISKS.md": "...",
    "DECISIONS.md": "...",
    "EVIDENCE.md": "...",
    "evidence.jsonl": "...",
    "HANDOFF.md": "..."
  },
  "evidenceIndex": [
    {
      "schemaVersion": "hadara.evidence.v1",
      "taskId": "T-0042",
      "kind": "test-log",
      "summary": "...",
      "result": "passed",
      "visibility": "public"
    }
  ],
  "issues": []
}
```

### `hadara.evidence.list`

List evidence index records for one Task Capsule without reading artifact contents.

Input schema:

```json
{
  "type": "object",
  "required": ["taskId"],
  "additionalProperties": false,
  "properties": {
    "taskId": { "type": "string", "pattern": "^T-[0-9]{4}$" },
    "limit": { "type": "integer", "minimum": 0, "maximum": 500, "default": 50 },
    "includePrivate": { "type": "boolean", "default": false }
  }
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.evidence.list.v1",
  "command": "evidence.list",
  "ok": true,
  "taskId": "T-0042",
  "count": 1,
  "records": [
    {
      "schemaVersion": "hadara.evidence.v1",
      "time": "2026-05-24T00:00:00.000Z",
      "taskId": "T-0042",
      "kind": "test-log",
      "summary": "...",
      "result": "passed",
      "visibility": "public"
    }
  ],
  "issues": []
}
```

### `hadara.handoff.read`

Read compact handoff state and historical indexes.

Input schema:

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "includeHistory": { "type": "boolean", "default": false },
    "historyLimit": { "type": "integer", "minimum": 1, "maximum": 100, "default": 20 }
  }
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.handoff.read.v1",
  "command": "handoff.read",
  "ok": true,
  "handoff": {
    "current": "docs/AGENT_HANDOFF.md content",
    "history": null,
    "validationHistory": null
  },
  "issues": []
}
```

If `includeHistory` is true, `history` and `validationHistory` should return compact tail history by default, limited by `historyLimit`. Full unbounded history is out of scope until a later paginated API exists.

### `hadara.project.state.read`

Read project state and roadmap pointers.

Input schema:

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "includeDocuments": { "type": "boolean", "default": true },
    "summaryOnly": { "type": "boolean", "default": false }
  }
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.project.state.read.v1",
  "command": "project.state.read",
  "ok": true,
  "projectState": "docs/PROJECT_STATE.md content",
  "taskBoard": "docs/TASK_BOARD.md content",
  "developmentSlices": "docs/DEVELOPMENT_SLICES.md content",
  "issues": []
}
```

If `summaryOnly` is true, the tool may return extracted current-state and next-step fields instead of full document text. If `includeDocuments` is false, full Markdown document bodies should be omitted while preserving enough metadata for agent orientation.

### `hadara.policy.evaluate`

Evaluate policy for a shell-like command without executing it.

Input schema:

```json
{
  "type": "object",
  "required": ["command"],
  "additionalProperties": false,
  "properties": {
    "command": { "type": "string", "minLength": 1 },
    "mode": {
      "type": "string",
      "enum": ["readonly", "assisted", "trusted", "auto", "release"],
      "default": "assisted"
    }
  }
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.policy.preflight.v1",
  "command": "policy.preflight-shell",
  "ok": true,
  "input": {
    "command": "npm run check",
    "mode": "assisted"
  },
  "decision": {
    "action": "ask",
    "risk": "low",
    "reason": "Assisted mode still requires approval for safe shell commands."
  },
  "execution": {
    "status": "requires_approval"
  },
  "issues": []
}
```

This tool does not execute the command. Its output is a policy evaluation result, not execution authorization for MCP. Even if CLI policy would allow a command, MCP tools must not execute it unless a separate write/execution-capable contract and implementation explicitly allow that behavior.

### `hadara.harness.validate`

Validate a Task Capsule without mutating it.

Input schema:

```json
{
  "type": "object",
  "required": ["taskId"],
  "additionalProperties": false,
  "properties": {
    "taskId": { "type": "string", "pattern": "^T-[0-9]{4}$" },
    "level": {
      "type": "string",
      "enum": ["draft", "done"],
      "default": "draft"
    }
  }
}
```

Output schema:

```json
{
  "schemaVersion": "hadara.harness.validate.v1",
  "command": "harness.validate",
  "ok": true,
  "level": "done",
  "task": {
    "id": "T-0042",
    "title": "Hermes/MCP Read-Only Contract",
    "capsule": "tasks/T-0042-hermes-mcp-read-only-contract"
  },
  "checkedFiles": [],
  "issues": []
}
```

## Recommended First Implementation Order

1. T-0043 MCP JSON-RPC Server Skeleton.
2. T-0044 MCP Read Tools Implementation.
3. T-0045 MCP Bridge Harness Tests.
4. T-0046 Evidence Attach Tool Contract, still no shell execution.
5. T-0047 Evidence Attach Guard Tests, still no evidence attach implementation.

## Relationship To CLI JSON

The bridge should treat `docs/CLI_JSON_CONTRACT.md` as the source for command/report envelope behavior. MCP should not invent competing command schemas when a CLI JSON schema already exists.
