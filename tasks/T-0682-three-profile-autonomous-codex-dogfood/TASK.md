# T-0682 Three-profile autonomous Codex dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0682 |
| Title | Three-profile autonomous Codex dogfood |
| Status | Done |
| Created | 2026-07-22T18:56 |
| Updated | 2026-07-22T20:05 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0682 --json`.

## Goal

| Goal | Notes |
|---|---|
| Observe three autonomous Codex projects, one per init profile, through three sequential Task Capsules each using only generated guidance and project briefs. | Use the current built CLI; the coordinator may initialize, author/review briefs, and observe, but must not implement project code. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh `/tmp` basic/standard/governed init and scaffold review; one moderately difficult project brief per profile; three separate Codex CLI sessions/capsules per project; workflow, evidence, close, and cross-session continuity observation. |
| Out | Coordinator implementation in dogfood projects, Dashboard validation, installed-package/registry testing, publishing, and explaining HADARA to agents. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Initialize and inspect three fresh profile scaffolds from the current build. | Done |
| 2 | Author and register three project briefs with three bounded capability slices each. | Done |
| 3 | Run first autonomous Codex session for each profile and review capsule/workflow behavior without editing code. | Done |
| 4 | Start a fresh Codex session twice per project with only “AGENTS.md를 읽고 다음 작업 진행.” and observe continuation. | Done |
| 5 | Review final projects, record dogfood evidence, and report protocol findings. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current built CLI produces intentional basic, standard, and governed scaffold contents in `/tmp`. | Met | ev:T-0682:8fb54acee7674ce18a2dd039 | scaffold review and three doctor reports |
| AC-2 | Each project completes three substantive Task Capsules through Codex CLI sessions without coordinator code edits. | Met | ev:T-0682:af37a47a87064ae5a6379911 | project task boards and nine close proofs |
| AC-3 | Second and third sessions receive only the requested AGENTS continuation prompt and independently recover the next work. | Met | ev:T-0682:73af078f28aa4c9c8baf89dc | six fresh Codex session logs and final reports |
| AC-4 | Agents use generated workflow, validation evidence, and guarded close without being told what HADARA is. | Met | ev:T-0682:af37a47a87064ae5a6379911 | nine capsule evidence logs and close proofs |
| AC-5 | Dashboard tests are excluded while core dogfood checks remain honest. | Met | ev:T-0682:29f1311c06d1466b88135054 | three core unit suites; no dashboard command invoked |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Fresh three-profile scaffold inspection | Yes | Passed | ev:T-0682:8fb54acee7674ce18a2dd039 |
| Nine autonomous capsule lifecycle reviews | Yes | Passed | ev:T-0682:af37a47a87064ae5a6379911 |
| Six fresh-session continuity checks | Yes | Passed | ev:T-0682:73af078f28aa4c9c8baf89dc resolves the over-strict first attempt ev:T-0682:49a3b11729384692b934d8d2 |
| Core-focused project tests and HADARA close evidence | Yes | Passed | ev:T-0682:29f1311c06d1466b88135054 |
| Capsule report and accepted-spec Markdown integrity | Yes | Passed | ev:T-0682:35003dae36ea4a638691b1d7 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User dogfood protocol | constraint | active | Init only; no coordinator implementation; fresh session continuation prompts; no HADARA explanation; Dashboard tests excluded. |
| `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md` | reference | active | Stable lifecycle and profile intent under observation. |
| `DOGFOOD_REPORT.md` | reference | active | Durable profile matrix, continuity observations, findings, and evidence map. |

## Changes

| Area | Summary |
|---|---|
| Protocol | Defined a nine-capsule, three-profile autonomous observation matrix. |
| Dogfood projects | Initialized ForgePlan (basic), EpochFlags (standard), and QuorumLedger (governed); autonomous agents implemented and closed three capsules in each. |
| Continuity | Six fresh sessions recovered the next slice from generated Markdown and capsule handoff without product explanation. |
| Stable findings | Added prioritized autonomous-dogfood findings to the accepted pre-stable lifecycle specification. |
| Report | Added a capsule-local dogfood report with protocol, per-profile results, continuity evidence, defects, and conclusion. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Codex sessions may stall on CLI availability, permissions, or usage limits. | Closed | All nine sessions completed; logs and final reports were preserved under `/tmp`. |
| RF-2 | Risk | Agents may choose Dashboard-related validation despite the exclusion. | Closed | No Dashboard validation was invoked; final observer validation covered core suites only. |
| RF-3 | Follow-up | Continuation titles, docs-register metadata round trips, terminal close behavior, full-status readiness, basic profile boundaries, Markdown table validation, and help exit codes need pre-stable remediation. | Open | `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md#autonomous-dogfood-findings` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-22 | Draft | Initial task scaffold. |
| 2026-07-22 | Draft | Defined three-profile autonomous dogfood protocol and non-intervention boundary. |
| 2026-07-22 | Done | Nine autonomous capsules closed; six fresh-session continuations succeeded; findings were added to the accepted stable specification. |
