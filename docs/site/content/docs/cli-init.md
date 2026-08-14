---
id: cli-init
group: Setup reference
label: Init Reference
short: Preset, automation, and existing-project initialization details.
eyebrow: Human setup reference
title: Use the Init reference when the default first run is not enough.
lead: Getting Started owns the plain interactive path. This page covers non-default scaffold selection, reviewed non-interactive execution, and adoption into an existing repository.
callout: Start with Getting Started if this is your first HADARA project. Return here only when you need a preset choice, automation boundary, or existing-project plan.
audience: human
commandAudience: human
order: 20
---

## 01 · Choose
### Select an initial scaffold
Presets change the initial document set, not the lifecycle the agent follows.

## 02 · Automate
### Carry a reviewed plan identity
JSON and non-interactive callers receive a plan hash and never get an implicit write.

## 03 · Adopt
### Preserve existing project ownership
Existing repositories use an explicit adoption plan instead of silent overwrite.

## Choose an initial scaffold

The default plain setup uses `standard`. Choose another preset only when its initial document scope is a better fit:

```shell
hadara init --preset minimal
hadara init --preset standard
hadara init --preset governed
```

| Preset | Initial document scope | Intended starting point |
|---|---|---|
| `minimal` | Shared core only | Small experiments and tightly bounded work. |
| `standard` | Core + `PROJECT_OVERVIEW.md` | Most products and team projects; this is the default. |
| `governed` | Core + project overview, architecture, security, and governance docs | Long-running or policy-sensitive projects that need explicit documentation. |

All three presets use the same lifecycle. `governed` supplies document scaffolding, not a policy engine or compliance guarantee. A preset is an initial scaffold choice, not a permanent project identity.

## Automation / agent init boundary

When initialization itself is being driven by JSON, CI, a pipe, or an agent, it remains two-step:

```shell
hadara init --preset standard --json
hadara init --preset standard --execute --plan-hash sha256:... --json
```

Piped output, redirected shells, JSON callers, CI, and agents never get implicit write behavior.

## Existing-project adoption and recovery

`--adopt` exists for bringing HADARA into an existing project through the reviewed plan boundary. Unsafe or ambiguous existing states should fail closed rather than being silently overwritten.

If adoption reports a conflict, partial state, stale plan hash, symlink boundary, or ancestor root, preserve the report and follow [Limits & Recovery](#limits-and-recovery) rather than editing HADARA-managed project state by hand.
