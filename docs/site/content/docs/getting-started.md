---
id: getting-started
group: Start here
label: Getting Started
short: Scaffold, verify, and create your first capsule.
icon: rocket
eyebrow: First verified run
title: Start with a healthy project boundary.
lead: A useful first run is intentionally small: scaffold the project, confirm it's healthy, then create one Task Capsule with a testable acceptance condition.
callout: Init scaffolds a boundary; doctor confirms it. Neither one is completion evidence for your first task.
order: 2
---

## Step 01
### Install the CLI
Use the published package for normal projects, or a source-built candidate only when you are intentionally dogfooding HADARA itself.

## Step 02
### Scaffold the project
Run `hadara init --json`. On an empty directory, init writes the scaffold. On an existing project, it classifies the repository and defaults to a zero-write adoption plan.

## Step 03
### Create one capsule
Use `hadara task status --json` first. Create a Task Capsule only when no suitable capsule already exists.

## Commands
```shell
hadara init --preset standard --json
hadara init doctor --json
hadara task status --json
hadara task create "First verified change" --json
```

## Prerequisites

HADARA’s current Node CLI requires Node.js 22 or newer. For normal use, install the stable npm package:

```shell
npm install -g hadara
hadara version --json
```

For one-off use without a global install:

```shell
npx hadara@latest version --json
```

If you are testing a local candidate package, verify the exact binary before delegation:

```shell
hadara version --json
```

Check `packageVersion` and `cliEntry`. A globally installed `hadara` earlier on `PATH` can shadow a project-local candidate, especially when a project was installed with `--no-bin-links`.

## 1. Initialize

For a new directory:

```shell
mkdir my-workspace
cd my-workspace
hadara init --preset standard --json
```

For an existing project, a bare init is intentionally conservative. It classifies the repository and returns an adoption plan instead of writing immediately. If the report says adoption is required, review the returned `planHash` and execute the exact adoption command from the report:

```shell
hadara init --preset governed --adopt --execute --plan-hash sha256:<hash> --json
```

Write init JSON outside the target directory when capturing the first report:

```shell
hadara init --json > /tmp/hadara-init.json
```

A non-empty output file in the project root counts as existing project content and can change the init path.

## 2. Check scaffold health

```shell
hadara init doctor --json
hadara task status --json
```

`init doctor` checks scaffold consistency. `task status` is the normal session ingress after the scaffold exists. It does not create tasks, append evidence, run tests, or close work.

## 3. Choose work

```shell
hadara task status --json
```

If the report recommends inspecting an existing capsule, follow that action first:

```shell
hadara task status --task T-XXXX --json
```

If no suitable task exists, create one:

```shell
hadara task create "First verified change" --json
hadara task status --task T-0001 --json
```

## 4. Author the capsule before implementation

At minimum, fill the new `TASK.md` with:

| Section | What to write |
|---|---|
| Goal | The outcome this capsule must produce |
| Scope | What is in and out |
| Plan | Concrete steps, not placeholder rows |
| Acceptance | Observable criteria with `Required: Yes/No` |
| Validation | Checks that will produce evidence, or why validation is not applicable |
| Inputs / Constraints | Files, specs, prior decisions, or explicit “none required” |
| Risks / Follow-ups | Known residuals and next-capsule candidates |

Do not hand-edit lifecycle-owned status fields to force progress. `TASK.md` Identity `Status` and the matching `docs/TASK_BOARD.md` status are owned by `task create` and `task close`.

## 5. Validate and close

Run a real check and record evidence:

```shell
hadara validation run --task T-0001 --check "Smoke test" -- npm test
```

If the command already ran outside HADARA, record the direct result:

```shell
hadara validation run --task T-0001 --check "Smoke test" \
  --direct-result passed \
  --direct-summary "npm test passed directly" \
  --update-task \
  --json
```

Close ordinary clean work with:

```shell
hadara task close --task T-0001 --json
```

If a human or automation boundary must review the close plan, use the reviewed form:

```shell
hadara task close --task T-0001 --dry-run --json
hadara task close --task T-0001 --execute --plan-hash sha256:<hash> --json
```

## What to read next

- [hadara init reference](#cli-init)
- [Lifecycle Workflow](#workflow)
- [Task Capsules](#task-capsules)
- [Evidence & Gates](#evidence)
