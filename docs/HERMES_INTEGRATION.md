# HERMES_INTEGRATION

This document describes HADARA compatibility with `nousresearch/hermes-agent` and broader Agent Harness ecosystems.

## Goals

- Export HADARA project context into files Hermes can read.
- Keep context files small, stable, and evidence-oriented.
- Allow a future read-only MCP bridge between Hermes and HADARA before write-capable tooling.

## Context Files

HADARA may generate or maintain:

```text
AGENTS.md
.hermes.md
HERMES.md
.hadara/context/HADARA_CONTEXT.md
```

## Modes

### HADARA → Hermes Context Export

```bash
hadara hermes export-context
```

Generates `.hadara/context/HADARA_CONTEXT.md`.

### HADARA as MCP Server

Planned read-only first step:

```bash
hadara mcp serve
```

Tool surface:

- `hadara.task.list`
- `hadara.task.read`
- `hadara.handoff.read`
- `hadara.project.state.read`
- `hadara.policy.evaluate`
- `hadara.harness.validate`
- `hadara.evidence.attach` only when the MCP server process is started with explicit evidence attach enablement

Shell execution, provider calls, broad write tools, and release gates are out of scope for the current MCP bridge. See `docs/MCP_BRIDGE_CONTRACT.md`.

`hadara.policy.evaluate` reports policy evaluation only. It is not permission for Hermes or any MCP client to execute commands through HADARA.

MCP evidence attachment is disabled by default. When a server process is explicitly started with evidence attach enabled, each `hadara.evidence.attach` call must include approval metadata and is audited to the private portable audit store.

### Hermes as External Agent

Hermes should read:

1. `AGENTS.md`
2. `.hermes.md`
3. `.hadara/context/HADARA_CONTEXT.md`
4. `docs/AGENT_HANDOFF.md`
5. active `tasks/T-*/`
6. `docs/CLI_JSON_CONTRACT.md`
7. `docs/MCP_BRIDGE_CONTRACT.md`
8. `docs/MCP_EVIDENCE_ATTACH_CONTRACT.md` before considering opt-in evidence attachment over MCP

And must update:

1. `tasks/T-*/EVIDENCE.md`
2. `tasks/T-*/HANDOFF.md`
3. `docs/AGENT_HANDOFF.md`
4. `docs/TASK_BOARD.md`

Except for explicitly enabled, approval-recorded, audited MCP evidence attachment, Hermes must perform updates through normal repository edits and HADARA validation, not through MCP.

## Compatibility Beyond Hermes

The same file contract should work for:

- Claude Code / Claude agents
- Codex CLI style agents
- Gemini CLI style agents
- OpenHarness-like runners
- CI harness runners
- ScriptedProvider replay
