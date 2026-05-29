# HADARA

**HADARA** is a portable agentic development workbench.

> Unbroken Context, Verified Development.

HADARA is named from **Harness + Dara**. A harness safely binds and controls complex systems; Dara carries layered associations of holding, wisdom, durability, and continuity. HADARA binds non-deterministic LLM agent work into a production-oriented workflow through Task Capsules, Session Continuity, Policy Layers, Evidence Logs, and Handoff Protocols.

This repository is both the source checkout for HADARA and the protocol workspace used to build it. The first npm release candidate, `hadara@0.1.0-rc.0`, is published for early CLI evaluation.

## Quick Start

### Install the RC Package

Requires Node.js 22.

```bash
npm install -g hadara@0.1.0-rc.0
hadara doctor --json
hadara task list --json
hadara tools list --json
```

You can also run the package without a global install:

```bash
npx hadara@0.1.0-rc.0 doctor --json
```

The RC package includes the built CLI, README, license, and package metadata. GitHub Release archives, installer scripts, USB portable launchers, Docker images, and installed-CLI matrix evidence are still deferred.

### Develop from Source

```bash
npm install
npm run dev -- doctor
npm run dev -- task create "implement ProviderClient contract"
npm run dev -- task list
npm run check
```

Build and run the compiled source checkout CLI:

```bash
npm run build
node dist/cli/main.js doctor --json
```

## Current CLI Surfaces

Common read and protocol commands:

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
```

Read-only operations and validation surfaces:

```bash
hadara status --json
hadara ops status --json
hadara tools list --json
hadara release gate --mode advisory --json
hadara smoke run --profile core --json
hadara tui --snapshot
```

Release, package, and install planning surfaces are intentionally explicit:

```bash
hadara package smoke --dry-run --json
hadara install plan --platform linux --json
hadara release dry-run --json
hadara release publish --mode dry-run --json
```

These planning commands are reduced/reporting surfaces unless their help or current Task Capsule explicitly says otherwise. The default MCP server remains read-only; evidence attach is opt-in and approval-recorded.

## Development Protocol

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

Current CLI execution is still deliberately bounded. Real provider execution, shell execution through agents, broad write-capable MCP tools, GitHub Release automation, installer scripts, USB portable launchers, Docker image publishing, and live dashboard streaming are deferred to later Task Capsules.

## Test Suites

```bash
npm run test:unit
npm run test:contract
npm run test:harness
npm run check
```

## License

HADARA is released under the MIT License. You can use, copy, modify, distribute, and build on it under the terms in `LICENSE`.
