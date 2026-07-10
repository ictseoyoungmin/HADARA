# HADARA

<p align="center">
  <img src="https://raw.githubusercontent.com/ictseoyoungmin/HADARA/main/docs/assets/hadara_sub_right_name.png" alt="HADARA" width="720">
</p>

<p align="center">
  <img alt="Stable npm release" src="https://img.shields.io/badge/npm-0.4.2-blue">
  <img alt="Next npm release" src="https://img.shields.io/badge/next-0.4.2--rc.0-blue">
  <img alt="Node.js" src="https://img.shields.io/badge/node-%3E%3D22-brightgreen">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey">
</p>

**HADARA** is a portable agentic development workbench for keeping long-running AI-assisted software work inspectable, resumable, and evidence-backed.

> Unbroken Context, Verified Development.

HADARA binds non-deterministic LLM agent work into a production-oriented workflow through Task Capsules, evidence logs, and handoff documents.

This repository is both the HADARA source checkout and the HADARA protocol workspace used to build it.

## Install

Requires Node.js 22.

Install the stable release:

```bash
npm install -g hadara@0.4.2
hadara help
hadara doctor --json
```

Run without a global install:

```bash
npx hadara@0.4.2 help
npx hadara@0.4.2 doctor --json
```

## First Project

Full walkthrough: [Getting Started](docs/GETTING_STARTED.md).

```bash
mkdir my-workspace
cd my-workspace
hadara init --profile standard --json
hadara doctor --json
```

Profiles:

| Profile | Use When |
|---|---|
| `basic` | Small project, only task/handoff discipline needed. |
| `standard` | Default multi-session project with planning and validation docs. |
| `governed` | Long-lived project with security, roadmap, or operational governance needs. |

## First Capsule

Lifecycle walkthrough: [Lifecycle Quickstart](docs/LIFECYCLE_QUICKSTART.md).

Use a Task Capsule for each focused change:

```bash
hadara task status --json
hadara task create "ship the smallest useful change" --json
hadara task status --task T-0001 --summary-json
```

Do the work, run a real check, and record evidence:

```bash
hadara validation run --task T-0001 --check "Smoke test" -- npm test
# Or record an already-run check:
hadara evidence add-command --task T-0001 --summary "Smoke test passed" --result passed --category validation --json
```

Close with the reviewed finalize flow:

```bash
hadara task finalize --task T-0001 --json
hadara task finalize --task T-0001 --execute --auto --json
hadara task finalize --task T-0001 --execute --plan-hash sha256:... --json
```

`task finalize --json` is the dry-run review. `--execute --auto` is the ordinary guarded close path: it performs the same review internally, rechecks the current plan, and succeeds only after close audit is valid. Use the explicit `--plan-hash` form when a separate human or automation flow reviews and carries the dry-run plan.

## Release Status

| Surface | Status |
|---|---|
| Stable npm | [`hadara@0.4.2`](docs/RELEASE_NOTES.md#042) |
| GitHub Release | [`v0.4.2`](https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.4.2) |
| RC history | [`hadara@0.4.2-rc.0`](docs/RELEASE_NOTES.md#042-rc0) remains the prerelease history for this stable line |
| Historical releases | [Release Notes](docs/RELEASE_NOTES.md) |
| Docker image / installer | Deferred |
| PyPI bridge | `hadara==0.2.0rc1` preview bridge |

Release mutation remains operator-approved. The ordinary user path is install, init, create a capsule, record evidence, and finalize.

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

## Command Discovery

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
hadara help command task.finalize
```

## Lifecycle Details

The canonical agent loop, in the same `T-XXXX` form documented in `docs/HADARA_WORKFLOW.md` and `docs/TASK_WORKFLOW_COMMANDS.md`:

```bash
hadara task status --json
hadara task status --task T-XXXX --json

hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --auto --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
```

When `evidence add-command` uses both legacy `--result` and v2 `--outcome`, matching outcomes must agree with the legacy result. `recorded` and `not-applicable` outcomes keep legacy result `unknown`; incompatible combinations fail before evidence is appended.

Use `hadara evidence list --task T-XXXX` to discover evidence ids before writing exact resolution markers. Text output shows `[id] time | category/outcome | visibility | summary`; JSON output includes `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, and `tags`. For long-lived references, copy only durable persisted `ev:` ids:

```bash
hadara evidence list --task T-XXXX
hadara evidence add-command --task T-XXXX --summary "Fix verified" --result passed --category validation --resolves ev:T-XXXX:aaaaaaaaaaaaaaaaaaaaaaaa --json
```

Legacy compatibility ids are inspection-only and are not the preferred durable reference for `resolves:` or `supersedes:` examples.

Deferred Evidence v2 scope is explicit: rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id are future candidates, not current command behavior. Treat `evidence.jsonl` as canonical append-only evidence and `EVIDENCE.md` as a non-canonical human summary.

Use read-only lifecycle diagnostics when you want a current-stage report, next recommended action, or close-proof explanation:

```bash
hadara task status --task T-XXXX --json
hadara session start --task T-XXXX --json
```

Low-level proof-boundary commands were removed from the standalone surface in 0.4.1-rc.0 (FD-013). `task finish`, `task ready`, `task close`, `task audit-close`, `task complete`, and `task lifecycle` are no longer public routes. Use `task finalize` (`--execute --auto` for guarded execution, dry-run for step-level readiness/audit reports) or `task status --task T-XXXX --detail full --json` for diagnostics. The internal proof-boundary modules remain the engine under `task finalize`.

Important boundaries:

| Command | Boundary |
|---|---|
| `task status` | Read-only operator console. `ok:true` means the report was generated, not that the task is ready. `--detail full` includes done-level diagnostics and `state.closeState`. |
| `task finalize` | Default agent close path. Read-only by default; `--execute --plan-hash <hash>` executes a reviewed plan and `--execute --auto` folds review and hash check into one guarded call. |
| `task finish` / `task ready` / `task close` / `task audit-close` / `task complete` / `task lifecycle` | Fully removed public routes; use `task status` and `task finalize`. |

Before executing `task finalize`, finish Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, Task Board updates, and tracked state docs. After final close proof, changing close-source docs intentionally invalidates the previous close proof and requires rerunning finalize.

The full command semantics live in `docs/TASK_WORKFLOW_COMMANDS.md`.

## Proof and Diagnostics

Diagnostics are useful, but they are not the primary lifecycle:

```bash
hadara evidence lint --task T-0001 --json
hadara evidence list --task T-0001 --json
hadara task status --task T-0001 --detail full --json
hadara task finalize --task T-0001 --json
hadara status --json
hadara status --state-only --json
hadara status --detail full --json
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

`docs doctor --json` separates command success from document currentness. `ok` reports whether the doctor completed without error-severity issues, the legacy `health` field remains compatible, and `summary.currentnessVerdict` reports `clean`, `warning`, or `drifted`. Semantic drift includes stale install/removed-command guidance and mismatches between `.hadara/state/current.json`, its Markdown projections, and Task Board task state.

The document registry distinguishes canonical, active, reference, historical, superseded, and archived docs. `docs required-reading` reports the effective default reading set and excludes historical, superseded, and archived docs.

Docs cleanup is metadata-first:

```bash
hadara docs mark --path docs/specs/old.md --status superseded --by docs/specs/new.md --reason "Replaced" --json
hadara docs list --status superseded --json
hadara docs doctor --json
```

`docs mark --execute` is hash-guarded and writes only `.hadara/docs-registry.json`. Historical file movement is deliberate repository work, not a standalone HADARA CLI mutation.

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
hadara smoke package --dry-run --json
hadara smoke package --execute --attach-evidence --task T-0001 --json
hadara smoke clean-checkout --execute --attach-evidence --task T-0001 --json
hadara release artifact --execute --json --output dist-release --attach-evidence --task T-0001
hadara release gate --mode strict --json
hadara release dry-run --json
hadara release publish --mode dry-run --json
```

`smoke package --execute`, `smoke clean-checkout --execute`, and `release artifact --execute` create local validation artifacts and reduced public evidence only. They must not publish packages, create GitHub Releases, build Docker images, push images, or load publish token values.

`release publish --mode dry-run` reports readiness, token presence by name, approval requirements, and mutation privacy flags without running `npm publish`. Any publish execution must happen only in a separate approval-gated release capsule with explicit operator confirmation.

Dashboard, TUI, Hermes, MCP, installer, package, release, and run commands stay out of the primary lifecycle unless a task explicitly needs them.

## Safety Boundaries

HADARA 0.4.x is not:

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

0.4.x does not implement `hadara evidence rebuild --json` or an execute mode. Future rebuild work must first define whether a difference is formatting regeneration, managed-section drift, or data inconsistency before reporting `wouldChange`. Any later write-capable rebuild flow must be dry-run-first, reviewed, and before-hash guarded before it rewrites derived Markdown.

## Development / Contributing

Every init profile generates the 0.4 project scaffold with compact agent entry docs, a docs registry, a workflow guide, and the finalize-first lifecycle loop.

Init maintenance commands dry-run by default unless `--execute` is supplied:

```bash
hadara init doctor --json
hadara init upgrade --profile governed --json
hadara docs register --path docs/specs/LOCAL.md --title "Local spec" --kind spec --status active --read-when task-start --json
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
