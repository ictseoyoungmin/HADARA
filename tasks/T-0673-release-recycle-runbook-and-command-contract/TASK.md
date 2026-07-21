# T-0673 Release Recycle Runbook and Command Contract

## Identity

| Field | Value |
|---|---|
| ID | T-0673 |
| Title | Release Recycle Runbook and Command Contract |
| Status | Done |
| Created | 2026-07-21T22:33 |
| Updated | 2026-07-21T22:38 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0673 --json`.

## Goal

| Goal | Notes |
|---|---|
| Define the release-readiness recycle runbook and helper contract. | Agents must be able to run release recycle without dirtying clean source validation, without reusing mounted HADARA-dev as installed smoke project, and without losing the GitHub Release note step after npm publish. |

## Scope

| Boundary | Items |
|---|---|
| In | Canonical release recycle runbook, root-role strategy, Docker recovery path, evidence attach order, package smoke/recycle isolation guidance, publish helper release-note guidance, and helper release-artifact journal ordering. |
| Out | One-shot fully automated release command, actual npm publish, actual GitHub Release creation/publication, Docker image publishing. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add canonical recycle runbook and workflow quickstart. | Done |
| 3 | Align publish helpers with release note and artifact journal ordering. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A new session can identify distinct `sourceRoot`, `evidenceRoot`, and `smokeProjectRoot` roles from the release runbook. | Met | ev:T-0673:94958b6d68b448bc843d024b | `docs/RELEASE_READINESS.md` |
| AC-2 | The recycle order removes the dirty worktree/evidence loop by requiring release artifact journal generation before evidence attachment. | Met | ev:T-0673:94958b6d68b448bc843d024b | `docs/RELEASE_READINESS.md`, `scripts/release/manual-publish-rc.sh` |
| AC-3 | Docker fresh image/container recovery and mounted-workspace caution are documented. | Met | ev:T-0673:94958b6d68b448bc843d024b | `docs/RELEASE_READINESS.md`, `docs/HADARA_WORKFLOW.md` |
| AC-4 | Publish preparation keeps a GitHub Release note path available instead of leaving only ad-hoc post-npm guidance. | Met | ev:T-0673:94958b6d68b448bc843d024b | `scripts/release/prepare-publish-env.sh` |
| AC-5 | Validation evidence is recorded. | Met | ev:T-0673:94958b6d68b448bc843d024b | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `bash -n scripts/release/prepare-publish-env.sh scripts/release/manual-publish-rc.sh` | Yes | Passed | ev:T-0673:94958b6d68b448bc843d024b |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0673:94958b6d68b448bc843d024b |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer release recycle plan | requirement | active | Requires deterministic <=10 step workflow, root separation, Docker recovery, evidence attach ordering, and release note continuity. |
| `docs/RELEASE_READINESS.md` | implementation-source | active | Owns release readiness and release gate contract. |
| `docs/HADARA_WORKFLOW.md` | implementation-source | active | Owns operator/agent workflow quickstarts. |
| `scripts/release/prepare-publish-env.sh` | implementation-source | active | Prepares Docker ext4 publish clone and operator command guidance. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Runs approval-gated publish helper and release evidence sequence. |

## Changes

| Area | Summary |
|---|---|
| Release docs | Added canonical release-readiness recycle runbook with explicit root roles, Docker recovery, order of operations, and forbidden ordering. |
| Workflow docs | Added release recycle quickstart and routed full details to release readiness. |
| Publish helper | Creates a public `GITHUB_RELEASE_NOTE.md` artifact when missing and prints a GitHub-draft-capable publish command. |
| Manual publish helper | Generates release artifact journal first, then attaches evidence from the journal to avoid clean-source self-invalidation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fully automated one-shot release recycle remains out of scope until the root/evidence contracts have been dogfooded again. | Open | T-0674+ reviewer queue |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Added release recycle runbook, workflow quickstart, and helper contract fixes; validation started. |
| 2026-07-21 | Done | Validation evidence recorded and close-source docs prepared. |
