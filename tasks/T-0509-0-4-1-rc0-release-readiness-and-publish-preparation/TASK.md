# T-0509 0.4.1 rc0 release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0509 |
| Title | 0.4.1 rc0 release readiness and publish preparation |
| Status | In Progress |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.4.1-rc.0` source/readiness for approval-gated npm `next` publish. | Retarget metadata/docs, write concrete release notes, run release/package gates, and prove finalize `--execute --auto` safety before handing off to manual publish. |

## Scope

| Boundary | Items |
|---|---|
| In | `package.json`/lockfile version, README/release readiness/release notes, release helper examples, GitHub Release note draft, release/package smoke evidence, finalize-auto safety evidence, and publish instructions. |
| Out | Actual npm publish, GitHub Release publication, Docker/PyPI/installer publish, token loading, and broad 0.5 state-first adoption. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the release readiness contract and acceptance gates. | Done |
| 2 | Retarget package metadata and release-facing docs to `0.4.1-rc.0`. | In Progress |
| 3 | Prepare concrete GitHub Release draft notes. | Pending |
| 4 | Run focused finalize-auto safety tests and build/version smokes. | Pending |
| 5 | Run package/release readiness smokes or record honest blockers. | Pending |
| 6 | Update evidence, handoff, shared state docs, then finalize the capsule. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Package metadata and lockfile target `0.4.1-rc.0`; stable install docs still point at `0.4.0`. | Pending | TBD | `package.json`, `package-lock.json`, `README.md` |
| AC-2 | Release notes/readiness docs describe concrete `0.4.1-rc.0` changes, boundaries, and manual publish path. | Pending | TBD | `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| AC-3 | GitHub Release note draft exists for `v0.4.1-rc.0`. | Pending | TBD | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Focused finalize-auto safety validation proves clean close, blocker zero-write refusal, and stale-plan mismatch refusal. | Pending | TBD | `tests/unit/task-finalize.test.ts` |
| AC-5 | Build/version/package/release readiness checks pass, or any environment blockers are recorded honestly. | Pending | TBD | `dist/cli/main.js`, release smoke commands |
| AC-6 | Publish helper instructions leave the operator able to run `npm login` and approval-gated `manual-publish-rc.sh T-0509 --execute`. | Pending | TBD | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |
| AC-7 | The T-0509 capsule closes through `task finalize --execute --auto` and reports `closed-valid`. | Pending | TBD | T-0509 close evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npx vitest run tests/unit/task-finalize.test.ts --reporter=dot` | Yes | Not Run | TBD |
| `npm run build` | Yes | Not Run | TBD |
| `node dist/cli/main.js version` | Yes | Not Run | TBD |
| `node dist/cli/main.js smoke package --execute --timeout 300 --json` | Yes | Not Run | TBD |
| `node dist/cli/main.js release gate --mode strict --json` | Yes | Not Run | TBD |
| `node dist/cli/main.js release dry-run --json` | Yes | Not Run | TBD |
| `node dist/cli/main.js release publish --mode dry-run --json` | Yes | Not Run | TBD |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | reference | active | Current release-line state and validation baseline. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Finalize/status lifecycle and removed-command boundaries. |
| `docs/RELEASE_READINESS.md` | source | active | Release readiness source and publish boundary. |
| `docs/RELEASE_NOTES.md` | source | active | Package-facing release notes. |
| `scripts/release/prepare-publish-env.sh` | source | active | Operator clean-clone publish environment helper. |
| `scripts/release/manual-publish-rc.sh` | source | active | Approval-gated npm publish helper. |

## Changes

| Area | Summary |
|---|---|
| Metadata | Retarget package source metadata to `0.4.1-rc.0`. |
| Docs | Update README/release readiness/release notes and GitHub Release draft notes. |
| Release helpers | Align examples and publish-prep comments with T-0509 / `0.4.1-rc.0`. |
| Evidence | Record focused finalize-auto, build, package, and release readiness checks. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Boundary | Actual npm publish and optional GitHub Release draft/publication remain manual operator actions after this commit. | Open | `scripts/release/manual-publish-rc.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Release readiness contract defined and metadata/docs retarget started. |
