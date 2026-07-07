# T-0509 0.4.1 rc0 release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0509 |
| Title | 0.4.1 rc0 release readiness and publish preparation |
| Status | Done |
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
| 2 | Retarget package metadata and release-facing docs to `0.4.1-rc.0`. | Done |
| 3 | Prepare concrete GitHub Release draft notes. | Done |
| 4 | Run focused finalize-auto safety tests and build/version smokes. | Done |
| 5 | Run package/release readiness smokes or record honest blockers. | Done |
| 6 | Update evidence, handoff, shared state docs, then finalize the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Package metadata and lockfile target `0.4.1-rc.0`; stable install docs still point at `0.4.0`. | Done | `ev:T-0509:985a38847a4e47b6856f2280` | `package.json`, `package-lock.json`, `README.md` |
| AC-2 | Release notes/readiness docs describe concrete `0.4.1-rc.0` changes, boundaries, and manual publish path. | Done | `ev:T-0509:8d224267508c4883ae29027a` | `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| AC-3 | GitHub Release note draft exists for `v0.4.1-rc.0`. | Done | `ev:T-0509:8d224267508c4883ae29027a` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Focused finalize-auto safety validation proves clean close, blocker zero-write refusal, and stale-plan mismatch refusal. | Done | `ev:T-0509:34a2f44b3e3e4918a551415a` | `tests/unit/task-finalize.test.ts` |
| AC-5 | Build/version/package/release readiness checks pass, or any environment blockers are recorded honestly. | Done | `ev:T-0509:d75bd5d8cf5b45fab7a8ce29`, `ev:T-0509:c6e8cacc44814a249c5da181`, `ev:T-0509:580e544b0e2e4484b3fdacfb`, `ev:T-0509:8d224267508c4883ae29027a` | `dist/cli/main.js`, release smoke commands |
| AC-6 | Publish helper instructions leave the operator able to run `npm login` and approval-gated `manual-publish-rc.sh T-0509 --execute`. | Done | `ev:T-0509:5b14389630774f87b9481533` | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npx vitest run tests/unit/task-finalize.test.ts --reporter=dot | Yes | Passed | ev:T-0509:34a2f44b3e3e4918a551415a |
| npm run build | Yes | Passed | ev:T-0509:d75bd5d8cf5b45fab7a8ce29 |
| node dist/cli/main.js version | Yes | Passed | ev:T-0509:985a38847a4e47b6856f2280 |
| node dist/cli/main.js smoke package --execute --timeout 300 --json | Yes | Passed | ev:T-0509:c6e8cacc44814a249c5da181 |
| node dist/cli/main.js release artifact --execute --json --output dist-release --attach-evidence --task T-0509 | Yes | Passed | ev:T-0509:580e544b0e2e4484b3fdacfb |
| node dist/cli/main.js smoke clean-checkout --execute --attach-evidence --task T-0509 --json | Yes | Passed | ev:T-0509:9f1f8cbc00cc405384db41f3 |
| node dist/cli/main.js release gate --mode strict --json | Yes | Passed | ev:T-0509:67c6d3713b684b6abeff192e |
| node dist/cli/main.js release dry-run --json | Yes | Passed | ev:T-0509:8d224267508c4883ae29027a |
| node dist/cli/main.js release publish --mode dry-run --json | Yes | Passed | ev:T-0509:5b14389630774f87b9481533 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | reference | active | Current release-line state and validation baseline. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Finalize/status lifecycle and removed-command boundaries. |
| `docs/RELEASE_READINESS.md` | implementation-source | active | Release readiness source and publish boundary. |
| `docs/RELEASE_NOTES.md` | implementation-source | active | Package-facing release notes. |
| `scripts/release/prepare-publish-env.sh` | implementation-source | active | Operator clean-clone publish environment helper. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Approval-gated npm publish helper. |

## Changes

| Area | Summary |
|---|---|
| Metadata | Retarget package source metadata to `0.4.1-rc.0`. |
| Docs | Update README/release readiness/release notes and GitHub Release draft notes. |
| Release helpers | Align examples and publish-prep comments with T-0509 / `0.4.1-rc.0`. |
| Package smoke | Fixed command-surface drift probing so an empty captured installed-bin stdout falls back to the installed `dist/cli/main.js`; host spawn `EPERM` remains environment-specific and Docker package smoke passes. |
| Evidence | Record focused finalize-auto, build, package, and release readiness checks. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Actual npm publish and optional GitHub Release draft/publication remain manual operator actions after this commit. | Open | `scripts/release/manual-publish-rc.sh` |
| RF-2 | Risk | Host Node `spawnSync` can return `EPERM` for installed subprocesses; Docker/ext4 package smoke is the release-grade validation path for this capsule. | Closed | `ev:T-0509:b53a52f365724072a494f4ba` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Release readiness contract defined and metadata/docs retarget started. |
| 2026-07-07 | In Progress | Release/package readiness evidence passed; publish remains manual. |
