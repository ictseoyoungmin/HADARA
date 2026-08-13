---
id: cli-init
group: Setup reference
label: Init (human setup)
short: The main CLI surface a human is expected to use directly.
eyebrow: Human setup reference
title: Init is the human-facing project boundary.
lead: Unlike the normal task/evidence lifecycle, initialization is commonly invoked directly by a human to bring HADARA into a workspace and review the first managed write plan.
callout: After init, ordinary development should move back to natural-language human instructions while the coding agent operates the HADARA protocol.
audience: human
order: 20
---

## 01 · Plan
### Review before write
Interactive TTY init can print a reviewed plan and ask before applying it. JSON and non-interactive invocations return a plan/hash without implicit write.

## 02 · Apply
### Human-friendly interactive path
For a normal local setup, `hadara init` is intentionally the shortest path.

## 03 · Repair
### Upgrade managed core state
Base init is a no-op on an initialized project. `init upgrade` repairs managed Init v1 core artifacts; it is not a hidden profile-change command.

## Typical human setup

```shell
mkdir my-workspace
cd my-workspace
hadara init
```

Optional preset selection:

```shell
hadara init --preset minimal
hadara init --preset standard
hadara init --preset governed
```

Plain `hadara init` in a real TTY prints the reviewed plan, asks `Apply this reviewed plan? [y/N]`, and applies in the same process only after `y`/`yes`.

## Automation / agent init boundary

When initialization itself is being driven by JSON, CI, a pipe, or an agent, it remains two-step:

```shell
hadara init --preset standard --json
hadara init --preset standard --execute --plan-hash sha256:... --json
```

Piped output, redirected shells, JSON callers, CI, and agents never get implicit write behavior.

## Adoption and repair

`--adopt` exists for bringing HADARA into an existing project through the reviewed plan boundary. Unsafe or ambiguous existing states should fail closed rather than being silently overwritten.

`hadara init upgrade` repairs only managed Init v1 core artifacts. Configuration changes remain a separate reviewed decision.
