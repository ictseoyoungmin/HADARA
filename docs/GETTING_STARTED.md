# Getting Started

This is the shortest path from install to a usable HADARA project.

## Install

HADARA requires Node.js 22.

```bash
npm install -g hadara@0.4.0
hadara doctor --json
```

Without a global install:

```bash
npx hadara@0.4.0 doctor --json
```

## Create A Project

```bash
mkdir my-workspace
cd my-workspace
hadara init --profile standard --json
hadara doctor --json
```

Use `basic` for small projects and `governed` for long-lived projects with roadmap, security, or release governance needs.

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
hadara task finalize --task T-0001 --execute --plan-hash sha256:... --json
```

Review the dry-run first. Execute only with the current plan hash.

For more detail, see `docs/LIFECYCLE_QUICKSTART.md`.
