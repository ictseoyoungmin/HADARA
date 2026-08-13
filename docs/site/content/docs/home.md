---
id: home
group: Start here
label: Home
short: A local-first evidence control plane for agentic development.
icon: compass
eyebrow: Agentic development harness
title: Unbroken context.\nVerified development.
lead: HADARA turns non-deterministic agent work into inspectable Task Capsules, append-only evidence, and explicit project state—so the next session resumes from facts, not chat history.
callout: Start every session with status, not a re-read of the whole project. Setup is optional; project state is authoritative.
order: 1
---

## 01 · Orient
### Start from status
`hadara task status --json` is the project/session ingress. It reads the structured current-state and task-selection sources and returns the safest next action before an agent scans files or starts editing.

## 02 · Work
### Carry a Task Capsule
A Task Capsule keeps the goal, scope, acceptance, validation, change notes, risks, handoff, and evidence together so work can survive model switches and session loss.

## 03 · Prove
### Close with evidence
`hadara task close --task T-XXXX --json` is the ordinary guarded close path. It succeeds only after readiness evidence and close audit reach `closed-valid`.

## Commands
```shell
hadara task status --json
hadara task status --json
hadara task close --task T-XXXX --json
```

## What HADARA is

HADARA is a **local-first evidence control plane for trustworthy agentic development**.

It does not try to replace a coding agent, a CI system, a project manager, or a release platform. Instead, it gives them a shared local protocol:

- a structured current-state canon under `.hadara/state/`
- bounded read models that tell an agent what to inspect next
- Task Capsules for scoped work
- append-only evidence records
- close gates that derive completion from proof instead of prose
- release gates that separate prepared source from publish/deploy authority

The important design point is that the CLI is not primarily a human terminal UI. It is a deterministic local API for agents and automation. Human-readable Markdown remains important because it makes review possible, but the agent should start from JSON reports instead of reconstructing state from historical documents.

## The shortest useful loop

```shell
hadara task status --json
hadara task status --json
hadara task create "ship the smallest useful change" --json
hadara task status --task T-0001 --json
hadara validation run --task T-0001 --check "Smoke test" -- npm test
hadara task close --task T-0001 --json
```

Use `task close --dry-run --json` and `--execute --plan-hash ...` only when a separate human or automation boundary must review and carry the plan hash. Ordinary clean work should use `task close --json`.

## Why status comes first

A project that has been touched by multiple agents cannot rely on chat history. `hadara task status --json` reports the current task-selection state, active/latest task, readiness, known problems, and next-action guidance from structured sources.

That sequence prevents the common agent failure mode: opening old docs, seeing plausible prose, and acting on stale intent.

## What the website covers

| Page | Use it for |
|---|---|
| Getting Started | First scaffold and first capsule |
| What is HADARA? | Product boundary and mental model |
| Lifecycle Workflow | The ordinary task loop |
| Task Capsules | The durable work unit |
| Evidence & Gates | How proof and close decisions relate |
| CLI Reference | Exact command surfaces and flags |
| Release Boundaries | What HADARA does and does not authorize |
