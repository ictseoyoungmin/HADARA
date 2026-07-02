# HADARA

<p align="center">
  <img src="https://raw.githubusercontent.com/ictseoyoungmin/HADARA/main/docs/assets/hadara_sub_right_name.png" alt="HADARA" width="720">
</p>

<p align="center">
  <img alt="Stable npm release" src="https://img.shields.io/badge/npm-0.3.3-blue">
  <img alt="Next npm release" src="https://img.shields.io/badge/next-0.4.0--rc.0-blue">
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
hadara@0.3.3
```

Current npm release candidate:

```text
hadara@0.4.0-rc.0
```

Previous published release candidate:

```text
hadara@0.3.4-rc.0
```

The 0.4.0 source line is a breaking productization release candidate after stable 0.3.3 and the published 0.3.4-rc.0 agent UX line. It keeps the context-routing and finalize-first lifecycle baseline, then simplifies new projects around a productized 0.4 scaffold, registry-backed docs read maps, a four-file Task Capsule, generated evidence projection, a normalized close-source contract, and fail-closed legacy mutation boundaries.

Phase labels are internal implementation phases, not npm release-candidate labels. The stable `0.3.3` package remains the default install target through the `latest` dist-tag; `0.4.0-rc.0` is published on npm under the `next` dist-tag for explicit release-candidate evaluation.

| Surface | Status |
|---|---|
| Current stable | [`hadara@0.3.3`](docs/RELEASE_NOTES.md#033) |
| Current RC | [`hadara@0.4.0-rc.0`](docs/RELEASE_NOTES.md#040-rc0) on `next` |
| Previous RC | [`hadara@0.3.4-rc.0`](docs/RELEASE_NOTES.md#034-rc0) |
| Previous stable | [`hadara@0.3.2`](docs/RELEASE_NOTES.md#032) |
| Historical RCs | See [Release Notes](docs/RELEASE_NOTES.md). |
| GitHub Release | Secondary target, approval-gated. |
| Docker image | Deferred. |
| PyPI/Python package | `hadara==0.2.0rc1` published preview bridge. |
| Installer scripts / USB launchers | Deferred. |

No release command should publish, create a GitHub Release, build Docker images, upload artifacts, or load token values unless an operator explicitly approves the mutation path for the active release capsule. Stable `0.3.3` remains the default npm package line; `0.4.0-rc.0` is available for explicit RC evaluation through `hadara@next` or the exact version. GitHub Release, Docker/PyPI publish, installer execution, and MCP release/package execution remain separate explicit mutations.

## Install

Requires Node.js 22.

Install the stable release:

```bash
npm install -g hadara@0.3.3
hadara help
hadara doctor --json
```

Run without a global install:

```bash
npx hadara@0.3.3 help
npx hadara@0.3.3 doctor --json
```

Evaluate `0.4.0-rc.0` explicitly:

```bash
npm install -g hadara@0.4.0-rc.0
npx hadara@0.4.0-rc.0 help
```

For release or recycle evidence, prefer an isolated prefix install when PATH, global installs, or `npx` cache behavior may be stale:

```bash
tmp="$(mktemp -d)"
npm --prefix "$tmp" install hadara@0.3.3
"$tmp/node_modules/.bin/hadara" version --json
```

`npx hadara@0.3.3 ...` remains convenient for normal use. The isolated installed-bin path is stronger proof that the published package installed and executed from the intended package tree.

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
hadara task status --json
```

Use structured discovery when an agent or tool needs machine-readable command metadata:

```bash
hadara commands --json
hadara commands --family capsule-lifecycle --json
hadara help command task.close
```

## Primary Capsule Lifecycle

The 0.4 primary path is intentionally small. Agents should start with compact context and use `task finalize` as the default lifecycle close path:

```bash
hadara task status --json
hadara session start --task T-XXXX --json
hadara task create "implement a focused change" --json
hadara task status --task T-XXXX --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json
# Finalize Task Capsule docs and tracked state docs before closing.
hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
hadara handoff suggest --task T-XXXX --json
```

`task finalize --json` is the reviewed dry-run. It reports the current lifecycle step, write boundaries, expected write paths, and a current `planHash`. `task finalize --execute --plan-hash ...` rechecks that plan hash, executes phases serially, stops on blockers, and succeeds only after final close audit is `closed-valid`.

When `evidence add-command` uses both legacy `--result` and v2 `--outcome`, matching outcomes must agree with the legacy result. `recorded` and `not-applicable` outcomes keep legacy result `unknown`; incompatible combinations fail before evidence is appended.

Use `hadara evidence list --task T-XXXX` to discover evidence ids before writing exact resolution markers. Text output shows `[id] time | category/outcome | visibility | summary`; JSON output includes `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, and `tags`. For long-lived references, copy only durable persisted `ev:` ids:

```bash
hadara evidence list --task T-XXXX
hadara evidence add-command --task T-XXXX --summary "Fix verified" --result passed --category validation --resolves ev:T-XXXX:aaaaaaaaaaaaaaaaaaaaaaaa --json
```

Legacy compatibility ids are inspection-only and are not the preferred durable reference for `resolves:` or `supersedes:` examples.

Deferred Evidence v2 scope is explicit: rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id are future candidates, not current command behavior. Treat `evidence.jsonl` as canonical append-only evidence and `EVIDENCE.md` as a non-canonical human summary.

Use read-only lifecycle diagnostics when you want a compact current-stage report, next recommended action, or close-proof repair explanation:

```bash
hadara task status --task T-XXXX --json
hadara task complete --task T-XXXX --json
hadara task lifecycle --task T-XXXX --json # compatibility
hadara task close-repair-plan --task T-XXXX --json
```

Low-level proof-boundary commands remain available for debugging, recovery, and command implementation work:

```bash
hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json
hadara task ready --task T-XXXX --level done --json
hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json
hadara task audit-close --task T-XXXX --json
```

Those commands are canonical proof boundaries under the wrapper, but they are no longer the default agent-facing cycle.

Important boundaries:

| Command | Boundary |
|---|---|
| `task status` | Read-only operator console. `ok:true` means the report was generated, not that the task is ready. |
| `task complete` | Optional read-only workflow compressor. It reports the current stage and next action. |
| `task lifecycle` | Read-only normalized lifecycle phase report for agents. |
| `task close-repair-plan` | Read-only close-proof repair classifier. |
| `task finalize` | Default agent close path. Read-only by default; guarded execute requires a matching current `planHash` and preserves underlying write boundaries. |
| `task finish` / `task ready` / `task close` / `task audit-close` | Low-level proof-boundary commands for debugging and recovery. |

Before executing `task finalize`, finish Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, Task Board updates, and tracked state docs. After final close proof, changing close-source docs intentionally invalidates the previous close proof and requires rerunning finalize or the low-level ready/close/audit sequence.

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

HADARA 0.4.0-rc.0 is not:

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

### Evidence Rebuild Boundary

`evidence.jsonl` is the canonical Task Capsule evidence source. `EVIDENCE.md` is a non-canonical human summary that can help review validation history, but it must not be treated as the source of truth for rebuild, migration, or resolution logic.

0.4.0-rc.0 does not implement `hadara evidence rebuild --json` or an execute mode. Future rebuild work must first define whether a difference is formatting regeneration, managed-section drift, or data inconsistency before reporting `wouldChange`. Any later write-capable rebuild flow must be dry-run-first, reviewed, and before-hash guarded before it rewrites derived Markdown.

## Development / Contributing

Initialize a project:

```bash
hadara init                  # default: standard
hadara init --profile basic
hadara init --profile standard
hadara init --profile governed
```

Every profile generates the 0.4 project scaffold with compact agent entry docs, a docs registry, a workflow guide, and the current context-aware finalize-first lifecycle loop plus low-level proof-boundary reference commands.

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
