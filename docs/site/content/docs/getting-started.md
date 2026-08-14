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
commandAudience: human
order: 2
---

## 01 · Install
### Human setup
Install the package version selected for your project and confirm the binary before initializing the workspace.

## 02 · Initialize
### Establish the project boundary
`hadara init` previews the repository changes and asks before applying them.

## 03 · Hand off
### Talk to the agent normally
After init, state the task in natural language. The agent should use `task status` first and operate the HADARA protocol itself.

## Install

HADARA requires Node.js 22.

```shell
npm install -g hadara
hadara version --json
```

For prerelease evaluation, install the reviewed version explicitly rather than relying on a moving distribution tag.

## Initialize a project

The simplest interactive path is:

```shell
mkdir my-workspace
cd my-workspace
hadara init
```

Plain `hadara init` in an interactive terminal prints the reviewed plan and asks `Apply this reviewed plan? [y/N]`. Applying that plan is the last setup step in this guide.

## What init creates

After you review and apply the plan, the default initialization establishes this project-local boundary:

| Surface | Change and purpose |
|---|---|
| `AGENTS.md` | Adds repository instructions that a compatible coding agent discovers or is configured to read. |
| `.hadara/project.json` | Records validated current project capabilities and lifecycle version. |
| `.hadara/documents.json` | Becomes document-routing authority. |
| `.hadara/context/READ_MAP.md` | Provides the generated fallback projection of document routing; agents normally enter through status and the task-specific `docs read-map` command. |
| `docs/HADARA_WORKFLOW.md` | Explains the status-first, proof-last operating loop to the agent. |
| `docs/TASK_BOARD.md` and `tasks/` | Establish the project task index and Task Capsule home. |
| `.gitignore` | Appends HADARA local/generated-state exclusions without replacing unrelated rules. |

The default setup also adds `docs/PROJECT_OVERVIEW.md`. Init does not create a hosted service, connect a model account, or begin autonomous development; it prepares the repository contract the agent will follow.

If you need a smaller or governed document scaffold, non-interactive automation, or adoption into an existing repository, use [Init Reference](#cli-init) after understanding this basic path.

## After init: stop operating the lifecycle manually

At this point, a normal human can simply tell the coding agent what to do:

```text
"Implement exponential retry backoff in the API client.
Keep the public API compatible, run the focused tests,
and tell me if anything blocks a clean close."
```

The agent—not the human—is expected to translate that request into the HADARA workflow. It will usually orient with `hadara task status --json`, resume or create a capsule, keep the task contract current, execute validation, append evidence, and run guarded close.

You normally return to command-level operation only when reviewing a guarded plan or resolving a reported setup problem.

## What you review

Instead of typing evidence records, review the resulting surfaces:

- the implementation and test result
- Task Capsule goal/scope/acceptance/handoff
- structured status/summary produced by the agent
- human-readable evidence projection such as `EVIDENCE.md`
- blockers, residual risk, or open questions surfaced by the agent

When the agent reports that `task close` reached `closed-valid`, that capsule has current close proof. The human should decide what to do next from the product result and current instruction—not by manually replaying the lifecycle commands.

If init refuses an existing project, a plan becomes stale, or several agents share one repository, read [Limits & Recovery](#limits-and-recovery) before forcing another write.
