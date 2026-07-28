# Getting Started

This is the shortest path from install to a usable HADARA project.

## Install

HADARA requires Node.js 22.

Install the current stable release:

```bash
npm install -g hadara@0.4.6
hadara doctor --json
```

Without a global install, use the same stable release:

```bash
npx hadara@0.4.6 doctor --json
```

## Create A Project

```bash
mkdir my-workspace
cd my-workspace
hadara init --profile standard --json
hadara doctor --json
```

If you capture init JSON before the scaffold exists, write it outside the target
directory, for example `hadara init --json > /tmp/hadara-init.json`.

Use `basic` for small projects and `governed` for long-lived projects with roadmap, security, or release governance needs.

## Resume Without Reconstructing History

HADARA keeps portable continuation guidance in the Task Board, Task Capsules, and their tracked Markdown projections. `.hadara/state/current.json` remains a command-owned compatibility checkpoint for older readers, not the normal human or agent starting point.

At the start of a later session, run:

```bash
hadara task status --json
```

If the report identifies an active capsule, continue with its bounded status packet:

```bash
hadara task status --task T-XXXX --json
```

This is the normal fast-resume path. Read historical indexes only when the active task or current-state packet routes you there.

## Create The First Capsule

```bash
hadara task create "ship the smallest useful change" --json
hadara task status --task T-0001 --summary-json
```

Then do the work and record evidence:

```bash
hadara validation run --task T-0001 --check "Smoke test" -- npm test
```

If the check already ran elsewhere:

```bash
hadara evidence add-command --task T-0001 --summary "Smoke test passed" --result passed --category validation --json
```

## Close The Capsule

```bash
hadara task close --task T-0001 --json
hadara task close --task T-0001 --dry-run --json
hadara task close --task T-0001 --execute --plan-hash sha256:... --json
```

Use `task close --json` for ordinary clean work. Use the explicit plan hash when a separate human or automation boundary reviews the dry-run.

For more detail, see `docs/TASK_WORKFLOW_COMMANDS.md`.
