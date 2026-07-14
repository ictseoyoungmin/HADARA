# T-0603 0.4.5 operator publish and installed-package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0603 |
| Title | 0.4.5 operator publish and installed-package recycle |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify the published `hadara@0.4.5` package from npm after operator publication. | Confirm the public package installs and supports fresh-project lifecycle dogfooding before considering the release fully recycled. |

## Scope

| Boundary | Items |
|---|---|
| In | npm install from registry, installed CLI version/doctor checks, fresh init for all profiles, governed toy lifecycle dogfood, feature smoke, release recycle notes. |
| Out | Publishing another npm/GitHub release, changing package source code, or fixing non-blocking UX follow-ups. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Record operator publish completion and install `hadara@0.4.5` from npm. | Done |
| 2 | Initialize fresh basic, standard, and governed projects. | Done |
| 3 | Use installed HADARA to run task lifecycle dogfood and core smoke. | Done |
| 4 | Record findings and release recycle disposition. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara@0.4.5` installs from npm and reports version `0.4.5`. | Done | `ev:T-0603:6448691495c54d078e1414b4`; `DOGFOOD_REPORT.md` | `/tmp/hadara-045-installed-dogfood/prefix` |
| AC-2 | Fresh `basic`, `standard`, and `governed` init profiles pass docs doctor immediately after init. | Done | `ev:T-0603:6448691495c54d078e1414b4`; `DOGFOOD_REPORT.md` | `/tmp/hadara-045-installed-dogfood/{basic,standard,governed}` |
| AC-3 | A governed toy task can be created, validated, and finalized to `closed-valid` with the installed package. | Done | `ev:T-0603:6448691495c54d078e1414b4`; `DOGFOOD_REPORT.md` | `/tmp/hadara-045-installed-dogfood/governed` |
| AC-4 | Installed core feature smoke passes after the toy lifecycle. | Done | `ev:T-0603:6448691495c54d078e1414b4`; `DOGFOOD_REPORT.md` | `hadara smoke run --profile core --json` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm install and version check | Yes | Passed | ev:T-0603:6448691495c54d078e1414b4 |
| Fresh profile docs doctor | Yes | Passed | ev:T-0603:6448691495c54d078e1414b4 |
| Installed governed lifecycle dogfood | Yes | Passed | ev:T-0603:6448691495c54d078e1414b4 |
| Installed core feature smoke | Yes | Passed | ev:T-0603:6448691495c54d078e1414b4 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User-provided publish completion output | reference | active | npm and GitHub release publication completed before this recycle. |
| `tasks/T-0602-fix-package-smoke-generated-init-workspace-isolation/HANDOFF.md` | reference | active | Source readiness was green before operator publish. |
| Published npm package `hadara@0.4.5` | constraint | active | Dogfood must use downloaded package, not source workspace. |

## Changes

| Area | Summary |
|---|---|
| `DOGFOOD_REPORT.md` | Added installed-package recycle results and non-blocking findings. |
| `/tmp/hadara-045-installed-dogfood` | Used as disposable external dogfood workspace. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fresh unnamed projects warn about Product Name/Purpose placeholders after a task is closed. | Open | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Tool-host `spawnSync node EPERM` remains environment-specific; direct-result fallback worked. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Installed `hadara@0.4.5` from npm and dogfooded fresh profiles plus governed lifecycle. |
| 2026-07-14 | Done | Installed-package recycle passed with non-blocking findings recorded. |
