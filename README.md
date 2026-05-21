# HADARA

**HADARA** is a portable agentic development workbench.

> Unbroken Context, Verified Development.

HADARA is named from **Harness + Dara**. A harness safely binds and controls complex systems; Dara carries layered associations of holding, wisdom, durability, and continuity. HADARA binds non-deterministic LLM agent work into a production-oriented workflow through Task Capsules, Session Continuity, Policy Layers, Evidence Logs, and Handoff Protocols.

This repository is a **bootstrap skeleton** for developing HADARA using the HADARA protocol itself.

## Quick Start

```bash
npm install
npm run dev -- doctor
npm run dev -- task create "implement ProviderClient contract"
npm run dev -- task list
npm test
```

Linux/macOS portable launcher:

```bash
chmod +x ./start.sh
./start.sh doctor
```

Windows launcher:

```bat
START.bat doctor
```

## Development Principle

HADARA development must dogfood the HADARA workflow:

1. Read `docs/PROJECT_STATE.md`
2. Read `docs/AGENT_HANDOFF.md`
3. Read `docs/TASK_BOARD.md`
4. Work inside a Task Capsule
5. Attach evidence before marking work complete
6. Update handoff before stopping

## Store Separation

HADARA separates **portable runtime state** from **project-owned development state**.

### Portable / USB Store

Located under the HADARA installation root:

```text
data/
  config/
  secrets/
  sessions/
  logs/
  audit/
  cache/
  exports/
```

This is **not committed**. It is local, portable, and may live on a USB drive.

### Project Repo Store

Located inside each project repository:

```text
docs/
tasks/
.hadara/
AGENTS.md
.hermes.md
HERMES.md
```

This is committed when it represents reproducible project state, conventions, or agent context.

## Initial CLI Commands

```bash
hadara init
hadara doctor
hadara task create "..."
hadara task list
hadara task show T-0001
hadara evidence collect --task T-0001
hadara handoff update --task T-0001
hadara hermes detect
hadara hermes export-context
hadara mcp serve
```

Current CLI is a seed implementation. Full agent execution, provider integration, dashboard, and MCP server runtime are intentionally stubbed for later tasks.

## Test Suites

```bash
npm run test:unit
npm run test:contract
npm run test:harness
npm run check
```

## License

TBD. Recommended candidates: Apache-2.0 or MIT.
