# T-0599 0.4.5 installed-candidate multi-shape brownfield dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0599 |
| Title | 0.4.5 installed-candidate multi-shape brownfield dogfood |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify the 0.4.5 installed candidate can safely adopt and operate in multiple existing project shapes. | Build a package tarball from the current source, install it into a temporary npm prefix, then run `hadara init` and baseline capsule lifecycle commands in TypeScript, Python/data, and web/monorepo brownfield fixtures. |

## Scope

| Boundary | Items |
|---|---|
| In | Temporary installed package candidate, brownfield dry-run/execute adoption, generated docs review, baseline task create/status/validation/finalize, and a structured dogfood report. |
| Out | npm/GitHub publication, final release readiness recycle, broad external-agent delegation, and feature expansion beyond defects found by the dogfood. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Build and install the current 0.4.5 candidate into an isolated temporary prefix. | Done |
| 2 | Dogfood TypeScript, Python/data, and web/monorepo brownfield fixtures from init through baseline capsule close. | Done |
| 3 | Record findings, fix any release-blocking defect found, and rerun affected fixtures. | Done |
| 4 | Record evidence and queue release readiness recycle. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Candidate package installs from a tarball and reports version `0.4.5`. | Done | `/tmp/hadara-t0599-prefix-Lij2lv/bin/hadara --version` | `package.json` |
| AC-2 | Three brownfield shapes adopt only after explicit `--adopt --execute --plan-hash`, preserve existing source/docs, and avoid `tasks/.gitkeep`. | Done | `DOGFOOD_REPORT.md` | `src/init/adoption.ts` |
| AC-3 | Each adopted fixture can create a baseline task, record validation evidence, and close it with `task finalize --execute --auto`. | Done | `DOGFOOD_REPORT.md` | `docs/HADARA_WORKFLOW.md` |
| AC-4 | Generated docs and CLI output issues are captured in `DOGFOOD_REPORT.md`, with release blockers fixed or explicitly deferred. | Done | `DOGFOOD_REPORT.md` | `DOGFOOD_REPORT.md` |
| AC-5 | Validation evidence is recorded. | Done | `EVIDENCE.md` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Candidate package install | Yes | Passed | ev:T-0599:ba42d06b508a4792bca030ea |
| Multi-shape brownfield dogfood | Yes | Passed | ev:T-0599:84e1144bdfb34d60a5e78132 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/brownfield-init-adoption.md` | constraint | active | Brownfield adoption safety contract. |
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | reference | active | Registry ownership and generated-doc expectations. |
| `tasks/T-0598-0-4-5-brownfield-adoption-safety-gap-closure/HANDOFF.md` | constraint | active | Requires installed-candidate multi-shape dogfood before release readiness recycle. |

## Changes

| Area | Summary |
|---|---|
| `DOGFOOD_REPORT.md` | Recorded installed-candidate dogfood results and non-blocking UX observations. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Recycle 0.4.5 release readiness after installed-candidate dogfood passes. | Open | `tasks/T-0600-*` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started installed-candidate multi-shape brownfield dogfood. |
| 2026-07-13 | Done | Candidate package dogfood passed across three brownfield shapes; release readiness recycle is next. |
