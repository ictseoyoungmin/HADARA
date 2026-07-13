# Getting Started

This is the shortest path from install to a usable HADARA project.

## Install

HADARA requires Node.js 22.

Install the current stable release:

```bash
npm install -g hadara@0.4.3
hadara doctor --json
```

Without a global install, use the same stable release:

```bash
npx hadara@0.4.3 doctor --json
```

## Create A Project

```bash
mkdir my-workspace
cd my-workspace
hadara init --profile standard --json
hadara doctor --json
```

Use `basic` for small projects and `governed` for long-lived projects with roadmap, security, or release governance needs.

## Resume Without Reconstructing History

HADARA stores the small set of live continuation facts in `.hadara/state/current.json`: the current release, latest and active task, next operator intent, current known problems, and validation baseline. Generated instructions route a new worker or agent there before longer prose.

At the start of a later session, run:

```bash
hadara session start --json
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
hadara task finalize --task T-0001 --json
hadara task finalize --task T-0001 --execute --auto --json
hadara task finalize --task T-0001 --execute --plan-hash sha256:... --json
```

Use `--execute --auto` for ordinary clean work. Use the explicit plan hash when a separate human or automation boundary reviews the dry-run.

For more detail, see `docs/LIFECYCLE_QUICKSTART.md`.
