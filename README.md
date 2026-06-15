# HADARA

<p align="center">
  <img src="https://raw.githubusercontent.com/ictseoyoungmin/HADARA/main/docs/assets/hadara_sub_right_name.png" alt="HADARA" width="720">
</p>

<p align="center">
  <img alt="Stable npm release" src="https://img.shields.io/badge/npm-0.3.0-blue">
  <img alt="Source version" src="https://img.shields.io/badge/source-0.3.0-orange">
  <img alt="Node.js" src="https://img.shields.io/badge/node-%3E%3D22-brightgreen">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey">
</p>

**HADARA** is a portable agentic development workbench for keeping long-running AI-assisted software work inspectable, resumable, and evidence-backed.

> Unbroken Context, Verified Development.

HADARA binds non-deterministic LLM agent work into a production-oriented workflow through Task Capsules, Session Continuity, Policy Layers, Evidence Logs, and Handoff Protocols.

This repository is both the HADARA source checkout and the HADARA protocol workspace used to build it.

## Release Status

Current stable npm release:

```text
hadara@0.3.0
```

Previous npm release candidate:

```text
hadara@0.3.0-rc.2
```

The 0.3.0 line is the Phase 7 Surface Refactor. It organizes HADARA's existing task, evidence, proof, lifecycle, release, and document surfaces so agents can distinguish primary lifecycle commands, diagnostics, advanced surfaces, canonical documents, historical documents, and safe Markdown update boundaries.

Phase 7.x labels are internal implementation phases, not npm release-candidate labels. The stable `0.3.0` package is published through the approval-gated release path with explicit operator confirmation.

| Surface | Status |
|---|---|
| npm package | Primary release target. |
| `hadara@0.2.0-rc.1` | Previous published npm RC. |
| `hadara@0.2.0-rc.2` | Previous published npm RC. |
| `hadara@0.2.0-rc.3` | Previous published npm RC. |
| `hadara@0.3.0-rc.0` | Previous published npm RC; package metadata lacks the intended discovery fields. |
| `hadara@0.3.0-rc.1` | Previous published npm RC; T-0301 publish evidence verified `npm view` returned `0.3.0-rc.1`. |
| `hadara@0.3.0-rc.2` | Previous published npm RC; T-0310 publish evidence verified `npm view` returned `0.3.0-rc.2`. |
| `hadara@0.3.0` | Current stable npm release. |
| GitHub Release | Secondary target, approval-gated. |
| Docker image | Deferred. |
| PyPI/Python package | `hadara==0.2.0rc1` published preview bridge. |
| Installer scripts / USB launchers | Deferred. |

No release command should publish, create a GitHub Release, build Docker images, upload artifacts, or load token values unless an operator explicitly approves the mutation path for the active release capsule.

## Install

Requires Node.js 22.

Install the stable release:

```bash
npm install -g hadara@0.3.0
hadara help
hadara doctor --json
```

Run without a global install:

```bash
npx hadara@0.3.0 help
npx hadara@0.3.0 doctor --json
```

## What HADARA Gives You

| Capability | Purpose |
|---|---|
| Task Capsules | Keep each unit of work scoped, evidenced, and resumable. |
| Evidence Logs | Record public, reduced proof of validation without raw private logs. |
| Handoff Protocol | Preserve current state for the next operator or agent. |
| Structured Help | Separate primary lifecycle commands from diagnostics, advanced, release, UI, and integration surfaces. |
| Document Governance | Classify canonical, active, reference, historical, superseded, and archived docs. |
| Managed Markdown Safety | Patch declared generated sections with dry-run and hash guards. |
| Release Gates | Check package and release readiness through evidence-backed dry-run reports. |
| Read-only MCP Bridge | Expose project/task/evidence state without default write tools. |
| Dashboard and TUI | Provide local operator observation surfaces over existing read models. |

HADARA is deliberately conservative. Read surfaces are broad; write and release surfaces are narrow, explicit, and evidence-oriented.

## Start Here

Ask the CLI for the workflow before choosing commands:

```bash
hadara help
hadara help lifecycle
hadara task next --json
```

Use structured discovery when an agent or tool needs machine-readable command metadata:

```bash
hadara commands --json
hadara commands --family capsule-lifecycle --json
hadara help command task.close
```

## Primary Capsule Lifecycle

The primary path is intentionally small:

```bash
hadara task next --json
hadara task create "implement a focused change" --json
hadara task status --task T-XXXX --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --idempotency-key "command:T-XXXX:check" --json
hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json
# Finalize Task Capsule docs and tracked state docs before closing.
hadara task ready --task T-XXXX --level done --json
hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json
hadara task audit-close --task T-XXXX --json
hadara handoff suggest --task T-XXXX --json
```

Optional workflow compression is read-only. Use it separately when you want a compact current-stage report and next recommended action:

```bash
hadara task complete --task T-XXXX --json
```

Important boundaries:

| Command | Boundary |
|---|---|
| `task status` | Read-only operator console. `ok:true` means the report was generated, not that the task is ready. |
| `task complete` | Optional read-only workflow compressor. It reports the current stage and next action. |
| `task finish --execute` | Writes only bounded status bookkeeping in `TASK.md` and `docs/TASK_BOARD.md`. |
| `task close --execute` | Appends close evidence only. |
| `task audit-close` | Read-only close proof audit. |

Before `task close --execute`, finish Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, Task Board updates, and tracked state docs. After close execute, changing close-source docs intentionally invalidates the previous close proof and requires rerunning ready/close/audit.

The full command semantics live in `docs/TASK_WORKFLOW_COMMANDS.md`.

## Proof and Diagnostics

Diagnostics are useful, but they are not the primary lifecycle:

```bash
hadara evidence lint --task T-0001 --json
hadara evidence list --task T-0001 --json
hadara proof status --task T-0001 --json
hadara proof explain --task T-0001 --json
hadara ci gate --mode advisory --task T-0001 --json
hadara ci gate --mode strict --task T-0001 --json
hadara protocol doctor --json
```

Use strict gates before Done/close/release claims. Use advisory gates while exploring.

## Document Governance

HADARA projects can register and classify their operating documents:

```bash
hadara docs list --json
hadara docs doctor --json
hadara docs explain --path docs/PROJECT_STATE.md --json
hadara docs required-reading --json
```

The document registry distinguishes canonical, active, reference, historical, superseded, and archived docs. `docs required-reading` reports the effective default reading set and excludes historical, superseded, and archived docs.

Docs cleanup is metadata-first:

```bash
hadara docs mark --path docs/specs/old.md --status superseded --by docs/specs/new.md --reason "Replaced" --json
hadara docs archive --status superseded --json
```

`docs mark --execute` is hash-guarded and writes only `.hadara/docs-registry.json`. `docs archive` is dry-run planning only in the current implementation; it does not move or delete historical files.

## Managed Markdown Safety

HADARA can update declared managed sections only. Managed patch execution is dry-run-first and hash-guarded. User-authored prose remains outside automated writes.

```bash
hadara docs managed list --json
hadara docs managed explain --path docs/TASK_BOARD.md --json
hadara docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --json
hadara docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --execute --before-hash sha256:... --json
```

Managed patch reports describe target hashes, section hashes, planned operations, and issues before any write is applied.

## Release and Advanced Surfaces

Release/package commands are release-only surfaces, not ordinary lifecycle steps:

```bash
hadara package smoke --dry-run --json
hadara package smoke --execute --attach-evidence --task T-0001 --json
hadara smoke clean-checkout --execute --attach-evidence --task T-0001 --json
hadara release artifact --execute --json --output dist-release --attach-evidence --task T-0001
hadara release gate --mode strict --json
hadara release dry-run --json
hadara release publish --mode dry-run --json
```

`package smoke --execute`, `smoke clean-checkout --execute`, and `release artifact --execute` create local validation artifacts and reduced public evidence only. They must not publish packages, create GitHub Releases, build Docker images, push images, or load publish token values.

`release publish --mode dry-run` reports readiness, token presence by name, approval requirements, and mutation privacy flags without running `npm publish`. Any publish execution must happen only in a separate approval-gated release capsule with explicit operator confirmation.

Dashboard, TUI, Hermes, MCP, installer, package, release, and run commands stay out of the primary lifecycle unless a task explicitly needs them.

## Safety Boundaries

HADARA 0.3.0 is not:

- a full agent runtime;
- Rack/enterprise behavior;
- automatic broad document rewriting;
- automatic historical document deletion;
- default shell execution through agents;
- default MCP write tooling;
- release or publish automation without operator approval.

HADARA separates portable runtime state from project-owned development state.

Portable/local runtime state:

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

Project-owned reproducible state:

```text
docs/
tasks/
.hadara/
AGENTS.md
```

Portable/local state is not committed. Project docs, Task Capsules, and reduced public evidence are committed when they represent reproducible context.

## Development / Contributing

Initialize a project:

```bash
hadara init                  # default: standard
hadara init --profile basic
hadara init --profile standard
hadara init --profile governed
```

Every profile generates `docs/TASK_WORKFLOW_COMMANDS.md` so fresh projects get the current evidence, ready, finish, close, and audit-close loop.

| Profile | Use When |
|---|---|
| `basic` | Small project, only task/handoff discipline needed. |
| `standard` | Default multi-session project with planning and validation docs. |
| `governed` | Long-lived project with security, refactor, roadmap, or operational governance needs. |

Init maintenance commands dry-run by default unless `--execute` is supplied:

```bash
hadara init doctor --json
hadara init upgrade --profile governed --json
hadara init register-doc --path docs/specs/LOCAL.md --when "Local work" --purpose "Local spec" --json
hadara init enable-integration --integration mcp --json
```

Develop from source with Node.js 22:

```bash
npm install
npm run build
node dist/cli/main.js doctor --json
npm run check
```

For HADARA-dev itself, Docker is the preferred validation path because host `node_modules` on mounted workspaces can be unreliable:

```bash
npm run dev:docker-check
npm run dev:docker-sync-build
```

Focused validation:

```bash
npm run test:focused -- tests/unit/release-dry-run.test.ts
```

Optional integrations are not generated by `hadara init` and are not part of the default scaffold:

```bash
hadara init enable-integration --integration hermes --execute --json
hadara init enable-integration --integration mcp --execute --json
hadara hermes detect --json
hadara hermes export-context --json
hadara mcp serve
```

The default MCP server remains read-only. Evidence attach is opt-in, approval-recorded, and audited.

## License

HADARA is released under the MIT License. You can use, copy, modify, distribute, and build on it under the terms in `LICENSE`.
