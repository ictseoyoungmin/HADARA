# T-0640 0.5.0 init output redirection greenfield trap hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0640 |
| Title | 0.5.0 init output redirection greenfield trap hardening |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0640 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Prevent init JSON shell redirection from surprising first users. | A zero-byte `init.json` created by `hadara init --json > init.json` before process startup should not make an otherwise empty project look brownfield; documentation should still recommend capturing init output outside the target directory. |

## Scope

| Boundary | Items |
|---|---|
| In | Init greenfield/brownfield classification for zero-byte init output placeholders, regression tests, first-project documentation guidance. |
| Out | Broad brownfield safety changes, non-zero output tolerance, new init options. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement zero-byte init output placeholder tolerance and docs guidance. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Empty `init.json` in an otherwise empty project no longer forces brownfield adoption. | Done | `ev:T-0640:1a398635fd53419b8c116088`, `ev:T-0640:2af1d6c5eaf243688e219098` | `tests/unit/init.test.ts` |
| AC-2 | Non-empty `init.json` remains a brownfield signal. | Done | `ev:T-0640:1a398635fd53419b8c116088` | `tests/unit/init.test.ts` |
| AC-3 | Init docs tell users to capture JSON outside the target directory before scaffold exists. | Done | `ev:T-0640:e1f0ea1a881f4a1ca7811fdf` | `README.md`, `docs/GETTING_STARTED.md`, `docs/HADARA_WORKFLOW.md`, `src/init/templates.ts` |
| AC-4 | Validation evidence is recorded. | Done | `ev:T-0640:1a398635fd53419b8c116088`, `ev:T-0640:e1f0ea1a881f4a1ca7811fdf`, `ev:T-0640:2af1d6c5eaf243688e219098` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run test:focused -- tests/unit/init.test.ts` | Yes | Passed | `ev:T-0640:1a398635fd53419b8c116088` |
| `npm run build` | Yes | Passed | `ev:T-0640:e1f0ea1a881f4a1ca7811fdf` |
| Built CLI `/tmp` redirection smoke | Yes | Passed | `ev:T-0640:2af1d6c5eaf243688e219098` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/feedback/T-0638-init-output-redirection-brownfield-trap.md` | reference | active | Dogfood finding that shell redirection can create `init.json` before init classifies the target directory. |

## Changes

| Area | Summary |
|---|---|
| Init adoption | Ignore a small allowlist of zero-byte init output placeholders during root-entry brownfield classification. |
| Documentation | Add guidance to capture init JSON outside the target directory before scaffold exists. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Over-tolerating root files could weaken brownfield safety; this task only ignores zero-byte known init output filenames. | Closed | `src/init/adoption.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Implemented zero-byte init output placeholder tolerance and docs guidance. |
| 2026-07-17 | Done | Validated focused init tests, TypeScript build, and built CLI redirection smoke. |
