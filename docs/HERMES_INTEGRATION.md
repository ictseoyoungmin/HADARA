# HERMES_INTEGRATION

This document describes HADARA compatibility with `nousresearch/hermes-agent` and broader Agent Harness ecosystems.

## Goals

- Export HADARA project context into files Hermes can read.
- Keep context files small, stable, and evidence-oriented.
- Allow future MCP bridge between Hermes and HADARA.

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

Planned:

```bash
hadara mcp serve
```

Tool surface:

- `task.list`
- `task.read`
- `task.create`
- `evidence.attach`
- `handoff.update`
- `policy.evaluate`
- `release.status`

### Hermes as External Agent

Hermes should read:

1. `AGENTS.md`
2. `.hermes.md`
3. `.hadara/context/HADARA_CONTEXT.md`
4. `docs/AGENT_HANDOFF.md`
5. active `tasks/T-*/`

And must update:

1. `tasks/T-*/EVIDENCE.md`
2. `tasks/T-*/HANDOFF.md`
3. `docs/AGENT_HANDOFF.md`
4. `docs/TASK_BOARD.md`

## Compatibility Beyond Hermes

The same file contract should work for:

- Claude Code / Claude agents
- Codex CLI style agents
- Gemini CLI style agents
- OpenHarness-like runners
- CI harness runners
- ScriptedProvider replay
