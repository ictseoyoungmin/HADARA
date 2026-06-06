# T-0271 npm Installed Toy Project Interface Recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0271 |
| Title | npm Installed Toy Project Interface Recycle |
| Status | Done |
| Created | 2026-06-06 |
| Updated | 2026-06-06 |

## Goal

| Goal | Notes |
|---|---|
| Exercise the npm-installed HADARA package inside `hadara-recycle` against a small toy project. | Use the published package path instead of the workspace build to evaluate install/runtime behavior, interfaces, bugs, strengths, and improvement opportunities. |

## Scope

| In Scope | Reason |
|---|---|
| Install `hadara@0.2.0-rc.0` into an isolated toy project under container `/tmp`. | Validates the consumer install path without mutating the HADARA-dev workspace package. |
| Exercise representative CLI interfaces: version, init, doctor/status, task workflow, evidence, policy, Hermes/context, package/release dry-run, TUI snapshot where feasible. | Covers practical operator surfaces at a toy-project scale. |
| Record observed bugs, rough UX quality, and improvement ideas. | The goal is not just pass/fail but release feedback. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish, GitHub Release creation, Docker image push, PyPI upload, or token loading. | This is a post-install recycle test, not a publish capsule. |
| Mutating the HADARA-dev source tree through the npm-installed CLI. | The toy project should remain isolated from the development workspace. |
| Full production-scale project validation. | The requested scope is an appropriately sized toy project. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-06 | Draft | Initial task scaffold. | `hadara task create "npm Installed Toy Project Interface Recycle" --json` |
| 2026-06-06 | Done | Installed-package toy project recycle completed with findings recorded. | `FINDINGS.md`; T-0271 evidence. |
