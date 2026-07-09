# T-0543 0.4.2 stable preflight dogfood finding fixes

## Identity

| Field | Value |
|---|---|
| ID | T-0543 |
| Title | 0.4.2 stable preflight dogfood finding fixes |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix T-0542 dogfood findings that should not ship into stable 0.4.2. | Focus on installed-package consumer UX before stable: context routing, first-task guidance, handoff matching, slice truncation semantics, validation recovery guidance, and evidence contention signaling. |

## Scope

| Boundary | Items |
|---|---|
| In | T-0542 P-1 through P-6: consumer `context pack` source-checkout leakage, empty-project first-task guidance, handoff/open-task fuzzy match, context-slice clamp vs truncation, validation direct-result recovery command quality, and append-lock contention warnings. |
| Out | Stable publish metadata, npm/GitHub publication, unrelated command portfolio reductions, broad context graph redesign, and changing evidence canonical storage. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from T-0542 report. | Done |
| 2 | Fix context-pack source-checkout warnings for installed consumer projects. | Done |
| 3 | Improve task selection for empty projects and similar handoff/open-task titles. | Done |
| 4 | Correct context-slice truncation summary semantics. | Done |
| 5 | Improve validation/evidence contention guidance. | Done |
| 6 | Validate, refresh `dist`, dogfood if needed, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh installed/consumer-style `context pack` no longer reports missing HADARA source files or release-readiness docs. | Done | `ev:T-0543:0d80024ae7f5495da975cdda` | `src/context/registry-extractors.ts`; `src/context/release-extractors.ts`; `src/context/state-projection.ts` |
| AC-2 | Empty init projects get a first-task create recommendation from `task status --json`. | Done | `ev:T-0543:0d80024ae7f5495da975cdda` | `src/task/task-selection.ts` |
| AC-3 | Handoff recommendations that closely match an open Task Board row reuse the existing task instead of suggesting a duplicate `task create`. | Done | `ev:T-0543:517b75fb0f7e40d494f38758` | `src/task/task-selection.ts` |
| AC-4 | `context slice` distinguishes range clamping to EOF from real output truncation. | Done | `ev:T-0543:0d80024ae7f5495da975cdda` | `src/context/context-slice.ts` |
| AC-5 | Validation wrapper blocked guidance preserves `--update-task`, and evidence/validation JSON reports warn when append-lock contention occurs. | Done | `ev:T-0543:517b75fb0f7e40d494f38758` | `src/services/validation-run.ts`; `src/cli/evidence-json.ts` |
| AC-6 | Focused tests, TypeScript build, Docker build/version smoke, whitespace check, and a fresh built-CLI consumer smoke pass. | Done | `ev:T-0543:517b75fb0f7e40d494f38758`; `ev:T-0543:44ab2482aafe493d8c25f304`; `ev:T-0543:0d80024ae7f5495da975cdda`; `ev:T-0543:8fffcd9e3c044972b8719191` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests | Yes | Passed | ev:T-0543:517b75fb0f7e40d494f38758 |
| Docker build and version smoke | Yes | Passed | ev:T-0543:44ab2482aafe493d8c25f304 |
| Fresh consumer smoke | Yes | Passed | ev:T-0543:0d80024ae7f5495da975cdda |
| Whitespace diff check | Yes | Passed | ev:T-0543:8fffcd9e3c044972b8719191 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0542-0-4-2-rc0-installed-toy-project-dogfood-across-init-profiles/artifacts/DOGFOOD_REPORT.md` | implementation-source | active | Defines P-1 through P-6 findings to fix before stable. |
| `docs/AGENT_HANDOFF.md` | constraint | active | Current phase and stable-preflight follow-up decision. |
| `AGENTS.md` | constraint | active | Requires HADARA lifecycle, Docker-built `dist` refresh, and serialized evidence writes. |

## Changes

| Area | Summary |
|---|---|
| Context graph | Source-checkout-only missing source/release warnings are no longer emitted for installed consumer projects. |
| Task selection | Empty projects now get first-task guidance; handoff recommendations can bind to similar open Task Board rows. |
| Context slice | `summary.truncated` now means actual output loss, not simple EOF range clamping. |
| Validation/evidence UX | Direct-result recovery preserves `--update-task`; JSON reports surface evidence append contention as warnings. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Re-run installed-package recycle/dogfood after publishing stable or the next RC to prove the fixes from an npm install. | Open | T-0542 report |
| RF-2 | Follow-up | Standard `npm run dev:docker-sync-build` produced no progress after initial output in this session; direct Docker build/test/version smoke passed and refreshed `dist`. | Open | `ev:T-0543:44ab2482aafe493d8c25f304` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Implementing stable-preflight fixes from T-0542 dogfood findings. |
| 2026-07-09 | Done | Fixed T-0542 P-1 through P-6 and validated with Docker-focused tests plus fresh consumer smoke. |
