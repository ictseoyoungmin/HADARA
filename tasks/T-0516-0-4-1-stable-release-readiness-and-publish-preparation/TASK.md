# T-0516 0.4.1 stable release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0516 |
| Title | 0.4.1 stable release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.4.1` stable source/readiness for operator publish. | Retarget source metadata and release-facing docs from `0.4.1-rc.0` to stable `0.4.1`, regenerate/build validation evidence, and leave npm/GitHub mutation as explicit operator action. |

## Scope

| Boundary | Items |
|---|---|
| In | `package.json`/lockfile version, package-facing README, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, release helper guidance, stable GitHub release note artifact, build/release dry-run evidence, and operator command handoff. |
| Out | npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, token loading, MCP release/package execution, and post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Retarget stable metadata and package-facing docs from `0.4.1-rc.0` to `0.4.1`. | Done |
| 2 | Add stable GitHub release note artifact and refresh release helper examples. | Done |
| 3 | Build and run release-readiness/package dry-runs without publish mutation. | Done |
| 4 | Record evidence, update shared state docs, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Source metadata and built CLI report stable `0.4.1`. | Done | ev:T-0516:c350db29604743c1909bc809 | `package.json`; `dist/cli/main.js version` |
| AC-2 | README and release docs describe stable `0.4.1` as the prepared target and keep RC status as history. | Done | ev:T-0516:da163705394440369c51c82a | `README.md`; `docs/RELEASE_NOTES.md`; `docs/RELEASE_READINESS.md` |
| AC-3 | Stable GitHub release note artifact exists for `v0.4.1`. | Done | ev:T-0516:da163705394440369c51c82a | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Publish helpers still keep `prepare-publish-env.sh` non-publishing and leave `manual-publish-rc.sh --execute` as the explicit npm mutation boundary. | Done | ev:T-0516:da163705394440369c51c82a | `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh` |
| AC-5 | Local pre-publish gates pass where valid before commit; clean publish clone remains responsible for release artifact/package smoke regeneration before npm publish. | Done | ev:T-0516:5845854cb8b545559afe4dd6; ev:T-0516:d6c585f30bc54e9bbd5617e2; ev:T-0516:7726f03afc544b34b823340a | `release gate`; package smoke tests; publish helper |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@0.4.1 version --registry=https://registry.npmjs.org` | Yes | Passed | Registry returned no published `0.4.1` before source preparation. |
| `npm run build` | Yes | Passed | ev:T-0516:d81598fc7c2a45778792d656 |
| `node dist/cli/main.js version` | Yes | Passed | ev:T-0516:c350db29604743c1909bc809 |
| `npx vitest run tests/unit/package-smoke-dry-run.test.ts tests/unit/command-surface-drift.test.ts --reporter=dot` | Yes | Passed | ev:T-0516:d6c585f30bc54e9bbd5617e2 |
| `node dist/cli/main.js release gate --mode strict --json` | Yes | Passed | ev:T-0516:5845854cb8b545559afe4dd6 |
| `node dist/cli/main.js release artifact --execute --json --output dist-release --attach-evidence --task T-0516` | No | Failed | ev:T-0516:fac06be2497a47ebba182b18; clean committed worktree required, resolved by ev:T-0516:7726f03afc544b34b823340a |
| `npm_config_cache=/tmp/hadara-npm-cache node dist/cli/main.js smoke package --execute --attach-evidence --task T-0516 --json` | No | Failed | ev:T-0516:11704cd7d6f344cf83d677e0; sandbox spawn EPERM reporting fixed, resolved by ev:T-0516:7726f03afc544b34b823340a |
| `node dist/cli/main.js release publish --mode dry-run --approval-actor local-operator --approval-reason ... --confirm publish-deploy --json` | No | Blocked | Expected before clean-clone release artifact regeneration; no publish mutation executed. |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` | reference | active | 0.4.1-rc.0 scope/debt completion queue. |
| `docs/RELEASE_READINESS.md` | reference | active | Current release metadata and publish boundary. |
| `docs/RELEASE_NOTES.md` | reference | active | Package-facing release notes. |
| `tasks/T-0513-0-4-1-rc0-installed-package-recycle` | reference | active | RC installed-package recycle proof. |
| `tasks/T-0515-0-4-1-rc0-post-recycle-adaptive-dogfood` | reference | active | Post-refactor adaptive recycle dogfood proof. |

## Changes

| Area | Summary |
|---|---|
| Metadata | Retarget package source from `0.4.1-rc.0` to stable `0.4.1`. |
| Docs | Add stable release notes/readiness and package-facing README status. |
| Release Helpers | Refresh examples so stable publish remains explicit and helper roles are clear. |
| Artifacts | Add stable GitHub Release note artifact. |
| Package Smoke | Treat non-timeout `spawnSync` errors as spawn failures instead of reporting misleading exit 0 with empty stdout. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After npm/GitHub publish, run stable installed-package recycle for `hadara@latest` expected `0.4.1`. | Open | Future capsule |
| RF-2 | Follow-up | Run `prepare-publish-env.sh T-0516`, then `manual-publish-rc.sh T-0516 --execute` from the clean ext4 clone so release artifact/package smoke evidence is regenerated from committed source before npm publish. | Open | `scripts/release/prepare-publish-env.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Preparing stable `0.4.1` release source/readiness; publish remains operator-controlled. |
| 2026-07-08 | In Progress | Stable metadata/docs retargeted; local checks recorded; clean publish clone remains the release evidence/publish boundary. |
