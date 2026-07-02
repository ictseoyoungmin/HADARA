# T-0479 0.4.0-rc.0 installed dogfood MVP build

## Identity

| Field | Value |
|---|---|
| ID | T-0479 |
| Title | 0.4.0-rc.0 installed dogfood MVP build |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/run_flowforge_dogfood.sh | implementation-source | approved | implemented | sha256:6a487e1a64d2d5c5f2bf4cbc9c71d6972327c01314b0482c577a010c9bc39bb0 | Reproducible fresh-container dogfood script. |
| tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md | reference | approved | implemented | sha256:92e35a3078dd1b16ae92d8e786156fec6cb6c43d712ba603b125219e2c0c1a25 | Structured HADARA 0.4.0-rc.0 installed-package dogfood findings. |
| tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp/reports/loc.json | reference | approved | implemented | sha256:a9e42bfa83b89ab5ed295389d2969020d6266d759b386e79cadbbef666a72c24 | Non-document software LOC measurement for FlowForge MVP. |

## Goal

| Goal | Notes |
|---|---|
| Dogfood `hadara@0.4.0-rc.0` as an installed package in a fresh unmounted container by building a real MVP and recording findings. | The MVP should live in an isolated project folder, include project specs, use 10-20 Task Capsules, contain 5-10k lines of usable non-documentation software, and produce a structured Markdown report on HADARA command time/ratio, confusing output, unnecessary length, UX improvements, structural improvements, and strengths. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the dogfood experiment contract and start a fresh unmounted container. | Done | T-0479 TASK.md; installed `hadara@0.4.0-rc.0` version smoke |
| 2 | Initialize an isolated HADARA project and create 10-20 development capsules. | Done | `artifacts/flowforge-mvp/task-map.csv`; `ev:T-0479:44d172a854d844fca613b484` |
| 3 | Build a usable 5-10k LOC MVP with project specs and validations. | Done | `artifacts/flowforge-mvp/reports/loc.json`; `ev:T-0479:5d1dd05f6e384512abe57030` |
| 4 | Collect command timing/ratio metrics and write structured HADARA UX findings. | Done | `artifacts/flowforge-mvp/hadara-command-metrics.jsonl`; `artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md` |
| 5 | Copy artifacts back into this capsule and record validation evidence. | Done | `artifacts/flowforge-mvp/`; `ev:T-0479:44d172a854d844fca613b484` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | A fresh container without a repository mount installs and runs `hadara@0.4.0-rc.0`. | Yes | Met | `ev:T-0479:cd8f8b6dcd5b491da343e78e` | Required | User request |
| AC-2 | The isolated dogfood project contains project specs and 10-20 HADARA Task Capsules. | Yes | Met | 12 capsules in `artifacts/flowforge-mvp/tasks/`; `ev:T-0479:44d172a854d844fca613b484` | Required | User request |
| AC-3 | The MVP contains 5-10k lines of non-documentation software and is runnable/usable. | Yes | Met | 5,397 LOC; `ev:T-0479:5d1dd05f6e384512abe57030` | Required | User request |
| AC-4 | The experiment records command timings and HADARA command time/ratio at whole-work and capsule levels. | Yes | Met | `artifacts/flowforge-mvp/hadara-command-metrics.jsonl`; dogfood report timing tables | Required | User request |
| AC-5 | A structured Markdown report covers confusing/unnecessary CLI output, output length, UX improvements, structural improvements, and strengths. | Yes | Met | `artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md` | Required | User request |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Installed package smoke | Fresh unmounted container: `npm install -g hadara@0.4.0-rc.0`; `hadara version --json` | Yes | Passed | `ev:T-0479:cd8f8b6dcd5b491da343e78e` |
| MVP smoke | Run the generated app smoke tests in the isolated project. | Yes | Passed | Container and copied-artifact `npm run smoke`; `ev:T-0479:5d1dd05f6e384512abe57030` |
| LOC/capsule count | Count non-documentation software lines and Task Capsules in the isolated project. | Yes | Passed | 5,397 LOC and 12 capsules; `ev:T-0479:44d172a854d844fca613b484` |
| Report presence | Verify structured HADARA dogfood report exists and has metrics sections. | Yes | Passed | `artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md` |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/run_flowforge_dogfood.sh` | dogfood script | Added the reproducible unmounted-container dogfood runner. | Preserve how the installed-package experiment was executed. | `ev:T-0479:44d172a854d844fca613b484` |
| `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp/` | dogfood artifact | Added the generated FlowForge MVP, specs, 12 capsules, metrics, and report copied from the container. | Preserve reproducible dogfood output for later HADARA improvement work. | `ev:T-0479:44d172a854d844fca613b484` |
| `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/TASK.md` | task capsule | Recorded acceptance, validation, and artifact locations. | Keep HADARA-dev evidence aligned with the external installed-package dogfood. | `ev:T-0479:5d1dd05f6e384512abe57030` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | GitHub Release draft remains separate from this installed-package dogfood experiment. | Open | docs/AGENT_HANDOFF.md |
| RF-2 | Risk | The isolated project is generated and developed inside a container, then copied back as an artifact rather than being HADARA-dev product code. | Accepted | User request |
