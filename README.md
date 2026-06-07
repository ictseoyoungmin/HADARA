# HADARA

<p align="center">
  <img src="https://raw.githubusercontent.com/ictseoyoungmin/HADARA/main/docs/assets/hadara_sub_right_name.png" alt="HADARA" width="720">
</p>

<p align="center">
  <img alt="Release candidate" src="https://img.shields.io/badge/release-0.2.0--rc.2-blue">
  <img alt="Node.js" src="https://img.shields.io/badge/node-%3E%3D22-brightgreen">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey">
</p>

**HADARA** is a portable agentic development workbench for keeping long-running AI-assisted software work inspectable, resumable, and evidence-backed.

> Unbroken Context, Verified Development.

HADARA is named from **Harness + Dara**. A harness safely binds and controls complex systems; Dara carries layered associations of holding, wisdom, durability, and continuity. HADARA binds non-deterministic LLM agent work into a production-oriented workflow through Task Capsules, Session Continuity, Policy Layers, Evidence Logs, and Handoff Protocols.

This repository is both the HADARA source checkout and the HADARA protocol workspace used to build it.

## Release Status

The current source checkout targets:

```text
hadara@0.2.0-rc.2
```

T-0282 refreshed the npm release-candidate source state for `0.2.0-rc.2` after the init scaffold protocol guidance follow-up, then the operator published `hadara@0.2.0-rc.2` through the approval-gated manual helper. The helper regenerated release artifacts, reran package/clean-checkout evidence, published to npm, and verified `npm view` returned `0.2.0-rc.2`.

Current publish boundaries:

| Surface | Status |
|---|---|
| npm package | Primary release target. |
| `hadara@0.1.0-rc.0` | Published first RC. |
| `hadara@0.2.0-rc.0` | Superseded internal publish candidate after recycle findings. |
| `hadara@0.2.0-rc.1` | Previous published npm RC. |
| `hadara@0.2.0-rc.2` | Current published npm RC and current source version. |
| GitHub Release | Secondary target, still approval-gated. |
| Docker image | Deferred. |
| PyPI/Python package | `hadara==0.2.0rc1` published preview bridge. |
| Installer scripts / USB launchers | Deferred. |

No release command should publish, create a GitHub Release, build Docker images, upload artifacts, or load token values unless an operator explicitly approves the mutation path for the active release capsule.

## Install

Requires Node.js 22.

Install the current RC:

```bash
npm install -g hadara@0.2.0-rc.2
hadara doctor --json
hadara task list --json
hadara tools list --json
```

Run without a global install:

```bash
npx hadara@0.2.0-rc.2 doctor --json
npx hadara@0.2.0-rc.2 tools list --json
```

Previous published RCs: `hadara@0.2.0-rc.1` and `hadara@0.1.0-rc.0` remain available on npm for comparison or rollback, but new installs should use the current RC.

## What HADARA Gives You

| Capability | Purpose |
|---|---|
| Task Capsules | Keep each unit of work scoped, evidenced, and resumable. |
| Evidence Logs | Record public, reduced proof of validation without raw private logs. |
| Handoff Protocol | Preserve current state for the next operator or agent. |
| Policy Surfaces | Inspect command risk and release boundaries before mutation. |
| CLI JSON Reports | Give agents and automation stable read models. |
| Read-only MCP Bridge | Expose project/task/evidence state without default write tools. |
| Dashboard and TUI | Provide local operator observation surfaces over existing read models. |
| Release Gates | Check release readiness through evidence-backed dry-run reports. |

HADARA is deliberately conservative. Read surfaces are broad; write and release surfaces are narrow, explicit, and evidence-oriented.

## Common Commands

Project and protocol health:

```bash
hadara doctor --json
hadara status --json
hadara ops status --json
hadara tools list --json
hadara protocol doctor --json
hadara protocol doctor --scope docs --json
```

Task workflow:

```bash
hadara task next --json
hadara task create "implement a focused change" --json
hadara task status --task T-0001 --json
hadara task finish --task T-0001 --json
hadara task finish --task T-0001 --execute --json
hadara task ready --task T-0001 --level done --json
hadara task close --task T-0001 --json
hadara task close --task T-0001 --execute --json
hadara task audit-close --task T-0001 --json
```

Evidence and handoff:

```bash
hadara evidence collect --task T-0001 --json
hadara evidence add-command --task T-0001 --summary "Focused validation passed." --result passed --json
hadara evidence list --task T-0001 --json
hadara handoff suggest --task T-0001 --json
```

Release and package readiness:

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

## Task Capsule Lifecycle

HADARA task workflow commands have distinct read/write boundaries. The full command semantics live in `docs/TASK_WORKFLOW_COMMANDS.md`.

Phase 6 reports support optional actor/run metadata for future multi-agent-compatible workflows. Commands such as `task complete`, `task finish`, `task ready`, `task close`, `task audit-close`, `handoff suggest`, and `dev docker-check` may accept metadata such as `--agent-id`, `--run-id`, `--actor-role`, and `--parent-run-id`. These fields improve provenance but do not enable a scheduler or full multi-agent runtime.

```bash
hadara task next --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json

# If no matching capsule exists, create one first:
hadara task create "implement a focused change" --json
hadara task status --task T-XXXX --json

# Do the scoped work.

hadara evidence add-command --task T-XXXX --summary "..." --result passed --json

hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task ready --task T-XXXX --level done --json

# Optional workflow compression / next action preview:
hadara task complete --task T-XXXX --json

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json

hadara task audit-close --task T-XXXX --json
```

Important distinctions:

| Command | Boundary |
|---|---|
| `task status` | Read-only operator console. `ok:true` means the report was generated, not that the task is ready. |
| `task complete` | Read-only workflow compressor. It reports the current stage and next action. |
| `task finish --execute` | Writes only bounded status bookkeeping in `TASK.md` and `docs/TASK_BOARD.md`. |
| `task close --execute` | Appends close evidence only. |
| `task audit-close` | Read-only close proof audit. |

Before `task close --execute`, finish Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, Task Board updates, and tracked state docs. After close execute, changing those close-source docs intentionally invalidates the previous close proof and requires rerunning ready/close/audit. Use stable wording for close results instead of pasting volatile close evidence ids into close-source docs.

## Initialize a Project

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

`register-doc` can use `--require-exists` when missing referenced docs should be treated as an error. `enable-integration` registers project guidance docs only; it does not enable Hermes/MCP runtime behavior or change capability gates. `upgrade` creates missing scaffold docs and updates known generated profile metadata; it does not rewrite unrelated user-authored content.

## Develop from Source

Use Node.js 22.

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

## Release Discipline

HADARA release work is evidence-first.

Before any npm publish:

1. Confirm the git worktree is clean.
2. Run `hadara release dry-run --json`.
3. Run `hadara release publish --mode dry-run --json`.
4. Confirm `NPM_TOKEN` presence without printing the token value.
5. Confirm the exact package version is not already on npm.
6. Generate fresh package, clean-checkout, and release-artifact evidence for the active release capsule.
7. Publish only after explicit operator approval.
8. Verify with `npm view hadara@<version> version`.
9. Attach reduced publish evidence.
10. Update release notes, Project State, Agent Handoff, and the active Task Capsule.

Never write token values, private logs, raw npm output, private paths, or local machine state into committed evidence.

## Store Separation

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

## Optional / Deferred Integrations

Hermes and MCP surfaces exist for compatibility experiments and read-only bridge work. They are not generated by `hadara init` and are not part of the default scaffold. Use them only when a project explicitly opts into integration guidance.

```bash
hadara init enable-integration --integration hermes --execute --json
hadara init enable-integration --integration mcp --execute --json
hadara hermes detect --json
hadara hermes export-context --json
hadara mcp serve
```

The default MCP server remains read-only. Evidence attach is opt-in, approval-recorded, and audited.

## Deferred

These are intentionally not part of the current default runtime:

- Full multi-agent scheduler/controller.
- Broad MCP write tools.
- Shell execution through agents.
- Real provider execution as the default path.
- GitHub Release automation as a default path.
- Docker image publishing.
- Installer scripts and USB portable launchers.
- Live dashboard streaming.

## License

HADARA is released under the MIT License. You can use, copy, modify, distribute, and build on it under the terms in `LICENSE`.
