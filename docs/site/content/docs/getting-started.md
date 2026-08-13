---
id: getting-started
group: Start here
label: Getting Started
short: Install and initialize; then hand the development loop to your agent.
eyebrow: Human setup
title: Initialize the boundary. Then describe the work.
lead: The ordinary human path is intentionally short: install HADARA, initialize the workspace, and give the coding agent your goal. The agent should take over the status/task/evidence/close protocol from there.
callout: You do not need to learn the evidence CLI to use HADARA. Evidence commands exist so the agent can leave durable proof that humans can later inspect.
audience: human
order: 2
---

## 01 · Install
### Human setup
Install the package you intend to use and confirm the binary. For normal stable use, that is currently `hadara@0.4.6`.

## 02 · Initialize
### Establish the project boundary
Init v1 reviews the scaffold before write. Interactive TTY use can prompt in the same process; JSON/non-interactive callers remain dry-run + reviewed execute.

## 03 · Hand off
### Talk to the agent normally
After init, state the task in natural language. The agent should use `task status` first and operate the HADARA protocol itself.

## Install

HADARA requires Node.js 22.

```shell
npm install -g hadara@0.4.6
hadara version --json
```

For RC evaluation, install the reviewed prerelease version explicitly rather than relying on `latest`.

## Initialize a project

The simplest interactive path is:

```shell
mkdir my-workspace
cd my-workspace
hadara init
```

Plain `hadara init` in an interactive terminal prints the reviewed plan and asks `Apply this reviewed plan? [y/N]`. You can choose a preset explicitly when needed:

```shell
hadara init --preset standard
```

Preferred Init v1 presets are `minimal`, `standard`, and `governed`. Use `--preset`; old profile terminology is historical compatibility guidance, not the current setup path.

For JSON, CI, piped shells, or an agent-driven initialization boundary, init remains two-step:

```shell
hadara init --preset standard --json
hadara init --preset standard --execute --plan-hash sha256:... --json
```

Base init is idempotent and does not repair a partial installation. `hadara init upgrade` exists for managed Init v1 repair.

## After init: stop operating the lifecycle manually

At this point, a normal human can simply tell the coding agent what to do:

```text
"Implement exponential retry backoff in the API client.
Keep the public API compatible, run the focused tests,
and tell me if anything blocks a clean close."
```

The agent—not the human—is expected to translate that request into the HADARA workflow. Internally it will usually orient with `hadara task status --json`, resume or create a capsule, keep the task contract current, execute validation, append evidence, and run guarded close.

You should only cross back into explicit command-level operation when you are intentionally debugging HADARA itself, reviewing a guarded plan, or acting at a boundary that genuinely requires human authority.

## What you review

Instead of typing evidence records, review the resulting surfaces:

- the implementation and test result
- Task Capsule goal/scope/acceptance/handoff
- structured status/summary produced by the agent
- human-readable evidence projection such as `EVIDENCE.md`
- blockers, residual risk, or approval requests surfaced by the agent

When the agent reports that `task close` reached `closed-valid`, that capsule has current close proof. The human should decide what to do next from the product result and current instruction—not by manually replaying the lifecycle commands.
