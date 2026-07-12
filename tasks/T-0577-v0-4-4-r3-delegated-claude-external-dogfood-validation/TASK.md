# T-0577 v0.4.4 R3 delegated Claude external dogfood validation

## Identity

| Field | Value |
|---|---|
| ID | T-0577 |
| Title | v0.4.4 R3 delegated Claude external dogfood validation |
| Status | Done |
| Created | 2026-07-12 |
| Updated | 2026-07-12 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Validate v0.4.4 readiness through an independent Claude Code agent using installed HADARA in a governed-profile external project. | Codex acts as reviewer/orchestrator only: prepare instructions, run Claude Code as the delegated agent, collect outputs, and classify findings without silently substituting Codex's own HADARA knowledge for the user workflow. |

## Scope

| Boundary | Items |
|---|---|
| In | Claude Code CLI delegated run; disposable governed-profile project in `/tmp`; installed `hadara@latest` or local packed candidate where needed; at least 8 HADARA Task Capsules unless blocked by a release-impacting defect; report Claude's raw findings and reviewer classification. |
| Out | Publishing, deployment, secrets, external repo history rewrites, direct HADARA-dev source commands inside the dogfood project, and Codex-authored replacement for the delegated agent's actual work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define R3 delegated-agent validation contract and Claude instructions. | Done |
| 2 | Run Claude Code CLI against a disposable governed-profile project using HADARA. | Done |
| 3 | Inspect Claude-created docs/tasks and classify findings against v0.4.4 release gates. | Done |
| 4 | Fix any release-blocking HADARA defects found by the delegated run. | Done |
| 5 | Record evidence, report, handoff, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Claude Code CLI, not Codex alone, performs the external governed-profile HADARA workflow from written instructions. | Done | `ev:T-0577:c2cbfbd77f1d415bb306c352` | Claude transcript/artifacts |
| AC-2 | The delegated project uses installed HADARA and completes at least 8 Task Capsules, or stops early with a clearly classified release-impacting defect. | Done | `ev:T-0577:c2cbfbd77f1d415bb306c352` | `R3_CLAUDE_DOGFOOD_REPORT.md` |
| AC-3 | Generated global docs and task docs from the delegated run are audited for contradictions, placeholders, wrong next-work, stale commands, and profile mismatch. | Done | `ev:T-0577:fba2ca49eac2444cb301283c` | `R3_REVIEWER_CLASSIFICATION.md` |
| AC-4 | Codex reviewer records Claude's findings separately from reviewer interpretation and fixes any v0.4.4 blocker before close. | Done | `ev:T-0577:86df1cd8b70943c9aa6632a9`, `ev:T-0577:fba2ca49eac2444cb301283c` | `R3_REVIEWER_CLASSIFICATION.md` |
| AC-5 | HADARA-dev evidence and close proof are recorded for this capsule. | Done | `ev:T-0577:c2cbfbd77f1d415bb306c352`, `ev:T-0577:86df1cd8b70943c9aa6632a9`, `ev:T-0577:fba2ca49eac2444cb301283c` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Claude CLI availability | Yes | Passed | `claude --version` returned 2.1.207. |
| Delegated R3 dogfood run | Yes | Passed | `ev:T-0577:c2cbfbd77f1d415bb306c352` |
| Delegated artifacts audit | Yes | Passed | `ev:T-0577:fba2ca49eac2444cb301283c` |
| HADARA-dev regression validation | Yes | Passed | `ev:T-0577:86df1cd8b70943c9aa6632a9` |
| Finalize close proof dry-run | Yes | Passed | `planHash sha256:6b910fb621fa64fca042db1ee892ae78bb3b1d7eb9d91c7ec491d8e40c45565c` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0572-v0-4-4-external-repository-validation-planning/EXTERNAL_REPOSITORY_VALIDATION_PLAN.md` | reference | active | Defines R3 as governed-profile, 8+ capsule external validation. |
| `tasks/T-0576-v0-4-4-r2-external-dogfood-validation/R2_DOGFOOD_REPORT.md` | reference | active | Shows why R3 must be delegated to an independent agent, not only Codex. |
| `claude --help` | reference | active | Confirms non-interactive `--print` mode and permission controls. |

## Changes

| Area | Summary |
|---|---|
| Task Capsule | Defined delegated Claude R3 validation contract. |
| Dogfood artifacts | Copied Claude's R3 report and wrote reviewer classification. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Claude CLI may require network/auth and can fail independently of HADARA. | Open | Delegate transcript |
| RF-2 | Risk | R3 used npm `latest` 0.4.3, so reviewer classification is needed to separate published-version findings from v0.4.4 candidate behavior. | Open | `R3_REVIEWER_CLASSIFICATION.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-12 | Draft | Initial task scaffold. |
| 2026-07-12 | In Progress | Defined R3 as delegated Claude Code external dogfood validation. |
| 2026-07-12 | Done | Claude completed 8 governed-profile capsules; reviewer classified findings against current v0.4.4 candidate coverage. |
