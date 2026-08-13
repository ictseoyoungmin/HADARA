---
id: release-boundaries
group: Reference
label: Release Boundaries
short: Read-only gates vs operator-approved mutation.
eyebrow: Trust boundary
title: Readiness may be automated. Publication stays explicit.
lead: HADARA separates source validation, artifact identity, package smoke, and read-only release gates from the authority to mutate npm or GitHub.
callout: A green release gate is evidence of readiness. It is not permission to publish.
audience: release-operator
order: 30
---

## 01 · Prepare
### Build exact source
Release identity starts from a clean committed source state and an exact artifact, checksum, manifest, and retained operator workspace policy.

## 02 · Observe
### Gates stay read-only
Strict release gate and dry-run surfaces may inspect tracked evidence and current managed release state, but must not publish packages or create releases.

## 03 · Mutate
### Operator boundary
npm publication, tag push, and GitHub Release creation remain explicit operator-controlled external mutations with publication evidence afterward.

## Current RC6 source state

| Field | RC6 documentation target |
|---|---|
| Source version | `0.5.0-rc.6` |
| Latest published prerelease at snapshot | `0.5.0-rc.5` |
| Stable npm `latest` | `0.4.6` |
| Stable promotion | Blocked pending current-source RC regeneration/public lifecycle acceptance |

This page describes the release boundary, not a claim that RC6 has already been publicly published.

## Root separation

Current release-readiness guidance separates three roles:

| Root | Purpose |
|---|---|
| `sourceRoot` | Clean source used for build/artifact/package/gate/publish checks. |
| `evidenceRoot` | Reviewed workspace where capsule evidence is appended. |
| `smokeProjectRoot` | Disposable consumer project for installed-package smoke/recycle. |

That separation prevents evidence writes or consumer installs from dirtying the exact source identity being validated.

## Read-only release surfaces

```shell
node --import tsx tools/dev-surfaces.ts release gate --mode strict --json
node --import tsx tools/dev-surfaces.ts release dry-run --json
```

The strict release gate is deliberately observational. It must not publish, create GitHub Releases, mutate registry state, or turn a dry-run into implicit execution.

## Publication evidence

Operator publication should bind the actual destination and mutation outcome. Partial external mutation—such as npm success followed by GitHub failure—must remain durably reconstructable rather than being collapsed into a single ambiguous “release failed” line.

## Why this is part of HADARA

Release tooling is not the product runtime, but it is a consequential test of HADARA's own thesis: irreversible work should have explicit authority, exact identity, durable evidence, and a recoverable handoff.
