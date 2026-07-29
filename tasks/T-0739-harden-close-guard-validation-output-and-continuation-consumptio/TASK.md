# T-0739 Harden close guard validation output and continuation consumption

## Identity

| Field | Value |
|---|---|
| ID | T-0739 |
| Title | Harden close guard validation output and continuation consumption |
| Status | Done |
| Created | 2026-07-29T21:39 |
| Updated | 2026-07-29T21:47 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close T-0738 review hardening gaps before rc2. | Ensure close execute has an actual proof guard before mutation, validation reports do not expose raw command secrets by default, task-local continuation cannot repeatedly revive stale HANDOFF guidance, redaction avoids known filename false positives, and stale Task Board notes are cleaned. |

## Scope

| Boundary | Items |
|---|---|
| In | Pre-acquire and reuse the actual close proof append guard before any guarded write or close evidence mutation can happen. |
| In | Redact validation command argv/summary/non-JSON command surfaces by default, expose hashes/previews, and keep raw argv behind explicit opt-in. |
| In | Add consumption semantics for task-local HANDOFF continuation selection so older actionable guidance does not reappear after a later terminal task. |
| In | Tighten OpenAI-key redaction boundaries and add regression coverage for `task-selection-continuation` filenames. |
| In | Remove stale T-0736 Task Board note. |
| Out | Full CI/GitHub Actions validation and release publication. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the hardening contract from reviewer findings. | Done |
| 2 | Harden close proof guard availability before mutation. | Done |
| 3 | Harden validation argv/report trust boundary and redaction false positive. | Done |
| 4 | Add task-local continuation consumed/superseded semantics. | Done |
| 5 | Clean stale Task Board note. | Done |
| 6 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Direct close-plan execute refuses with zero writes if the proofAppendGuard provider is missing, returns undefined, or throws before mutation. | Done | ev:T-0739:a5042ea7a4674f03a6334c47 | Reviewer P1 |
| AC-2 | Validation reports and text output expose redacted argv previews plus argv hashes by default; raw argv is opt-in only. | Done | ev:T-0739:a5042ea7a4674f03a6334c47 | Reviewer P1 |
| AC-3 | Redaction does not redact the clean filename `tests/unit/task-selection-continuation.test.ts` while still redacting real OpenAI-style keys. | Done | ev:T-0739:a5042ea7a4674f03a6334c47 | Reviewer P2 |
| AC-4 | Task-local HANDOFF continuation selection does not revive older actionable/waiting guidance after a later Done task declares terminal, blocked, unresolved, or superseding continuation. | Done | ev:T-0739:a5042ea7a4674f03a6334c47 | Reviewer P1 |
| AC-5 | T-0736 Task Board stale note is removed. | Done | ev:T-0739:a5042ea7a4674f03a6334c47 | Reviewer P2 |
| AC-6 | Focused validation and TypeScript checks pass with evidence recorded. | Done | ev:T-0739:a5042ea7a4674f03a6334c47; ev:T-0739:6dd1862b77574c50b8834558 | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused hardening tests | Yes | Passed | exit 0 in 12078ms | ev:T-0739:a5042ea7a4674f03a6334c47 |
| TypeScript no-emit | Yes | Passed | exit 0 in 7807ms | ev:T-0739:6dd1862b77574c50b8834558 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer hardening note | background | active | Defines guard provider, argv trust boundary, continuation consumption, redaction false positive, and Task Board cleanup findings. |
| T-0738 implementation | implementation-source | active | Provides the current close guard, validation preview, and HANDOFF continuation implementation to harden. |

## Changes

| Area | Summary |
|---|---|
| Close transaction | Direct close-plan execute now evaluates the proof append guard provider before guarded writes or close proof mutation, refuses zero-write on missing/undefined/throwing providers, and reuses the acquired guard for proof append. |
| Validation run | Report JSON and text output now expose `argvHash`, redacted `argvPreview`, and `argvRedacted` by default; `rawArgv` appears only with `--show-raw-argv`. Evidence summaries and TASK validation rows use the redacted preview. |
| Redaction | OpenAI-key matching now requires a token boundary so `task-selection-continuation` filenames are not redacted while real `sk-...` keys still are. |
| Task selection | Task-local HANDOFF continuation selection now evaluates only the latest Done task, so a newer terminal/blocked/unresolved HANDOFF supersedes older actionable guidance. |
| Task Board | Removed the stale T-0736 note about remaining status/MCP old-contract tests. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Changing close execute guard timing can affect task close transaction recovery and direct execute tests. | Closed | ev:T-0739:a5042ea7a4674f03a6334c47 |
| RF-2 | Risk | Redacting argv by default can reduce operator debugging detail unless previews and hashes remain useful. | Closed | ev:T-0739:a5042ea7a4674f03a6334c47 |
| RF-3 | Risk | Continuation consumption semantics must prevent stale resurrection without hiding the newest actionable HANDOFF. | Closed | ev:T-0739:a5042ea7a4674f03a6334c47 |

## Close Summary

T-0739 closed the bundled review hardening gaps after T-0738. Close proof guard availability is now checked by acquiring the actual guard before mutation, validation reports hide raw argv by default, the known OpenAI-key false positive is fixed, latest Done HANDOFF semantics prevent older continuation resurrection, and the stale T-0736 Task Board note is removed.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Started bundled review hardening task after T-0738 closed-valid. |
| 2026-07-29 | Done | Implemented bundled hardening changes and recorded focused validation plus TypeScript evidence. |
