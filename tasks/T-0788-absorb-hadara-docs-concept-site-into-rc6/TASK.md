# T-0788 Absorb hadara-docs-concept site into RC6

## Identity

| Field | Value |
|---|---|
| ID | T-0788 |
| Title | Absorb hadara-docs-concept site into RC6 |
| Status | Done |
| Created | 2026-08-13T09:16Z |
| Updated | 2026-08-13T09:30Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Absorb the standalone `hadara-docs-concept` GitHub Pages site into `docs/site/` as an RC6-tracked, reproducible documentation app whose content reflects the current 0.5 CLI contract. | Preserve the CLI package boundary; no external GitHub Pages deployment in this capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Import site runtime, Markdown content, images/fonts, SEO assets, content-contract tests, nested package lock, current-command/content reconciliation, and root documentation for the site build. |
| Out | npm/GitHub Pages deployment, domain/repository changes, CLI runtime behavior changes, broad redesign, and unrelated documentation cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the absorption boundary and source/content reconciliation contract. | Done |
| 2 | Import the standalone site and adapt it to `docs/site/` and current RC6 CLI semantics. | Done |
| 3 | Build/test the site, record evidence, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The standalone site is present under `docs/site/` with its own reproducible package lock, Vite build, source content, public assets, and content-contract tests; no source-control metadata or generated dependency/build directories are imported. | Met | `ev:T-0788:88b793e059dc44b8b1cf5564` plus tracked import/package-boundary inspection. | site import boundary |
| AC-2 | Site build and content-contract tests pass from `docs/site/`, and the site reads the root HADARA version without hardcoded release drift. | Met | `ev:T-0788:cf1b8552329543fda5e88218` and `ev:T-0788:88b793e059dc44b8b1cf5564`; Vite reads `../../package.json`. | site build/test |
| AC-3 | Imported content uses the current 0.5 CLI ingress and Init v1 terminology, with stale commands/state paths reconciled or explicitly marked historical. | Met | `ev:T-0788:cf1b8552329543fda5e88218` plus empty stale-marker scan for `--profile`, top-level `hadara status`, and legacy Init v1 state paths. | documentation content |
| AC-4 | Root docs describe the site as a separate static documentation surface and RC6 release scope records the absorbed site without authorizing external deployment. | Met | `ev:T-0788:88b793e059dc44b8b1cf5564` plus `docs/site/README.md` and RC6 `RELEASE_NOTES.md` absorption boundary. | docs/spec/readiness |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm test` in `docs/site/` | Yes | Passed | Docker native-ext4 run: 6 tests passed. | T-0788 validation evidence |
| `npm run build` in `docs/site/` | Yes | Passed | Docker native-ext4 run: TypeScript and Vite production build passed. | T-0788 validation evidence |
| Root diff/build checks | Yes | Passed | Docker root `npm run build` and `npm run typecheck:tools` passed; root npm `files` excludes `docs/site/`. | T-0788 validation evidence |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/mnt/f/NowWorking/hadara-docs-concept` | reference | active | Operator-supplied standalone site; import excludes `.git`, `node_modules`, and `dist`. |
| `docs/CLI_JSON_CONTRACT.md` | design | active | Current public command and Init v1 terminology. |
| `docs/RELEASE_READINESS.md` | design | active | RC6 readiness and external deployment boundary. |
| `docs/specs/0.5.0-rc6/01_RELEASE_IDENTITY_AND_RETAINED_ARTIFACT_PUBLICATION_HARDENING.md` | design | active | RC6 capsule order and source identity. |

## Changes

| Area | Summary |
|---|---|
| Site runtime | Import React/Vite docs reader as a nested static site under `docs/site/`. |
| Content | Import nine Markdown pages and image/SEO assets; reconcile current CLI terminology before close. |
| Boundary | Track site build in RC6 source while keeping publication a separate operator action. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | External GitHub Pages deployment remains a separate publication capsule after source absorption. | Deferred | Post-absorption operator capsule |
| RF-2 | Risk | The site is a nested frontend with its own dependency tree and must not enter the CLI npm package. | Closed | Root package `files` whitelist remains `dist/`, `README.md`, `LICENSE`, and `package.json`; nested `node_modules/`/`dist/` are ignored and untracked. |

## Close Summary
The standalone `hadara-docs-concept` frontend is now tracked under `docs/site/` with its
source content, assets, nested lockfile, and content-contract tests. Its content was
reconciled to the current task-status ingress and Init v1 canonical artifacts. Docker
native-ext4 validation passed the site tests/build and the root CLI/tool builds. External
GitHub Pages publication remains a separate operator capsule.
 

## History

| Date | State | Note |
|---|---|---|
| 2026-08-13 | Draft | Initial task scaffold. |
| 2026-08-13 | In Progress | Created to absorb the operator-supplied GitHub Pages concept into RC6 without external deployment. |
| 2026-08-13 | Validation | Imported site, reconciled current CLI/Init v1 content, and passed nested and root build checks in Docker. |
| 2026-08-13 | Done | Close preflight prepared after evidence append and handoff reconciliation. |
