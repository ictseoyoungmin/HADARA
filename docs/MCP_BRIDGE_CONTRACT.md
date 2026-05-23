# MCP_BRIDGE_CONTRACT

This document defines the first HADARA MCP bridge contract.

T-0042 is contract-only. It does not implement a JSON-RPC server or MCP tools.

## Phase

Phase: read-only bridge contract.

The first implementation must be safe for external agents to call while preserving HADARA's Task Capsule, evidence, policy, and harness discipline.

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

## General Tool Rules

- Tool names are namespaced with `hadara.`.
- Tool outputs should be JSON-serializable objects.
- Where a tool mirrors an existing CLI command, output should match the existing CLI JSON contract.
- Tools must not write files in this phase.
- Tools must not execute shell commands in this phase.
- Tools must not call model providers in this phase.
- Tools should report validation issues using existing HADARA issue shapes where possible.

## Tools

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
    "HANDOFF.md": "..."
  },
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
    "includeHistory": { "type": "boolean", "default": false }
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

If `includeHistory` is true, `history` and `validationHistory` may include `docs/HANDOFF_HISTORY.md` and `docs/VALIDATION_HISTORY.md` content.

### `hadara.project.state.read`

Read project state and roadmap pointers.

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
  "schemaVersion": "hadara.project.state.read.v1",
  "command": "project.state.read",
  "ok": true,
  "projectState": "docs/PROJECT_STATE.md content",
  "taskBoard": "docs/TASK_BOARD.md content",
  "developmentSlices": "docs/DEVELOPMENT_SLICES.md content",
  "issues": []
}
```

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

This tool does not execute the command.

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

## Relationship To CLI JSON

The bridge should treat `docs/CLI_JSON_CONTRACT.md` as the source for command/report envelope behavior. MCP should not invent competing command schemas when a CLI JSON schema already exists.
