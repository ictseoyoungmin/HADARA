---
id: cli-init
group: CLI Reference
label: hadara init
short: Scaffold a fresh project, or safely adopt an existing one.
icon: folder-tree
eyebrow: Command reference
title: One command, two very different projects.
lead: hadara init behaves differently depending on what it finds. On an empty directory it scaffolds directly. On a project that already has files, it classifies the repository first and defaults to a plan that writes nothing at all.
callout: A bare init on an existing project is a zero-write dry run. Nothing is written until you explicitly confirm the plan it proposed.
order: 20
---

## Fresh project
### Direct scaffold
On an empty directory, `hadara init --json` creates the scaffold. The writes are additive and should not overwrite project files.

## Existing project
### Review before adoption
On a directory with existing files, init treats the project as brownfield and returns a zero-write adoption plan unless you explicitly execute the reviewed plan.

## Presets
### Choose the governance level
Presets control the initial scaffold and documentation packs. They do not become the project’s canonical authority and do not change evidence integrity or close semantics.

## Commands
```shell
hadara init --json
hadara init --preset minimal --json
hadara init --preset standard --json
hadara init --preset governed --json
hadara init doctor --json
hadara init --preset governed --adopt --execute --plan-hash sha256:<hash> --json
```

## What init returns

`hadara init --json` returns a structured init report. Agents should inspect `schemaVersion`, `ok`, classification/state fields, planned actions, and any execute command before acting.

Important rule:

```text
empty project  → scaffold can be written directly
existing files → plan first, write only after explicit adoption execute
```

This is how HADARA avoids silently taking ownership of a project that already has source files, docs, or local install artifacts.

## Greenfield scaffold

A normal scaffold includes the local HADARA control plane:

```text
.hadara/
├── context/
│   └── READ_MAP.md
├── project.json
└── documents.json
docs/
├── PROJECT_STATE.md
├── TASK_BOARD.md
└── HADARA_WORKFLOW.md
AGENTS.md
.gitignore
tasks/
```

Depending on profile and later docs commands, additional project docs may be present. Do not assume optional docs exist until a read model, registry, or file check confirms them.

## Current state after init

Init v1 uses two canonical files for project and document routing authority:

| Field | Purpose |
|---|---|
| `.hadara/project.json` | Validated project features, document packs, and preset provenance |
| `.hadara/documents.json` | Document-routing registry and authority |
| `.hadara/context/READ_MAP.md` | Generated routing projection, not a replacement for canonical state |

`docs/PROJECT_STATE.md` and `docs/AGENT_HANDOFF.md` may project selected current-state facts for humans. Do not hand-edit managed current-state blocks.

## Brownfield adoption

When init detects existing content, review the dry-run report. If the report is safe and adoption is intended, execute the exact reviewed command:

```shell
hadara init --preset governed --adopt --execute --plan-hash sha256:<hash> --json
```

Do not invent the hash. Use the one returned by the dry-run/adoption report.

Brownfield adoption should preserve project-owned files and mark existing docs as project-owned rather than converting them into HADARA-owned templates. HADARA may add bounded scaffold files and managed sections only through reviewed writes.

## Presets

| Profile | Typical use |
|---|---|
| `minimal` | Small project that needs task/evidence discipline with minimal docs. |
| `standard` | Default multi-session project with current-state, workflow, task board, and docs registry. |
| `governed` | Long-lived project where handoff, security, release, or operational governance matters. |

Profiles do not authorize broader writes, release publication, shell execution, or destructive operations.

## Output capture warning

If you save the first init JSON report, write it outside the project directory:

```shell
hadara init --json > /tmp/hadara-init.json
```

A non-empty file created inside the target directory before init runs is project content and can make an otherwise empty directory look brownfield.

## Project-local install warning

A project-local install under a path such as `.hadara-install/` can also make a directory look non-empty before init. That is not fatal, but it means init may take the adoption path.

A project-local install also does not shadow a global `hadara` earlier on `PATH`. Before delegating, run:

```shell
hadara version --json
```

Check that `packageVersion` and `cliEntry` match the intended binary.

## After init

Use:

```shell
hadara task status --json
hadara task status --json
```

Then create the first capsule only if task status recommends no existing task to inspect.
