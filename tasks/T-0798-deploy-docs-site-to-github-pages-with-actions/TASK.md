# T-0798 Deploy docs site to GitHub Pages with Actions

## Identity

| Field | Value |
|---|---|
| ID | T-0798 |
| Title | Deploy docs site to GitHub Pages with Actions |
| Status | Done |
| Created | 2026-08-23T23:44 |
| Updated | 2026-08-23T23:49 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Add a GitHub Pages Actions workflow that tests and builds `docs/site`, then deploys `docs/site/dist` as the project Pages site. | GitHub repository settings still require one human selection of `GitHub Actions` as the Pages source after merge. |

## Scope

| Boundary | Items |
|---|---|
| In | `.github/workflows/docs-pages.yml`, `docs/site` test/build commands, Pages artifact upload/deploy permissions, trigger paths, and operator setup guidance. |
| Out | GitHub-hosted workflow execution, repository Settings mutation, custom domain configuration, and unrelated site content/design changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and select the Actions publication boundary. | Done |
| 2 | Add the Pages workflow and local setup guidance. | Done |
| 3 | Run site content tests, production build, and workflow/documentation checks. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The workflow builds `docs/site` with its lockfile and uploads only `docs/site/dist` to GitHub Pages. | Met | Workflow uses `npm ci`, `npm test`, `npm run build`, `upload-pages-artifact`, and `deploy-pages` with Pages permissions. | `ev:T-0798:0e9cedc98e9849d9a2f2ffb1`; `.github/workflows/docs-pages.yml` |
| AC-2 | Local site tests and production build pass from a clean dependency install. | Met | Docker ext4 validation completed `npm ci`, all 17 content-contract tests, and `npm run build`; `dist/index.html` was generated. | `ev:T-0798:8cb9ce856fc8493abbb81bde`; `ev:T-0798:63fada6172d34c9784c790e9` |
| AC-3 | The operator setup path and resulting project URL are documented. | Met | README records the Pages source selection and `https://ictseoyoungmin.github.io/HADARA/`. | `ev:T-0798:0e9cedc98e9849d9a2f2ffb1`; `docs/site/README.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Site content contract | Yes | Passed | Docker ext4 validation passed: `npm ci` completed and all 17 docs/site content-contract tests passed. | `ev:T-0798:8cb9ce856fc8493abbb81bde` |
| Site production build | Yes | Passed | Docker ext4 validation passed: `npm run build` completed and generated `docs/site/dist/index.html`, `robots.txt`, `sitemap.xml`, favicon, OG image, and assets. | `ev:T-0798:63fada6172d34c9784c790e9` |
| Pages workflow/documentation review | Yes | Passed | Workflow and README reviewed; `git diff --check` passed, Pages permissions/environment are present, build runs from `docs/site`, and upload path is `docs/site/dist`. | `ev:T-0798:0e9cedc98e9849d9a2f2ffb1` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/site/package.json` and `package-lock.json` | implementation-source | active | Site test/build commands and locked frontend dependencies. |
| `docs/site/vite.config.ts` | implementation-source | active | Relative base and canonical project URL are already configured for project Pages hosting. |
| GitHub Pages official workflow contract | reference | active | Pages artifact upload/deploy requires the Pages permissions and `github-pages` environment. |
| `docs/site/README.md` | reference | active | Human setup and resulting URL. |

## Changes

| Area | Summary |
|---|---|
| GitHub Pages workflow | Added build/test/upload/deploy jobs with scoped push triggers and manual dispatch. |
| Site documentation | Added the one-time Pages settings step and project URL. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | A repository administrator must select `GitHub Actions` under Settings → Pages after the workflow is merged. | Open | `HANDOFF.md`; `docs/site/README.md` |
| RF-2 | Follow-up | The first GitHub-hosted workflow run must be reviewed for build/deploy success and the published URL. | Open | `.github/workflows/docs-pages.yml` |

## Close Summary

Close after local site validation passes and the workflow plus setup guidance are committed. GitHub Pages Settings and the first hosted run remain explicit operator follow-up actions.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-23 | Draft | Initial task scaffold. |
| 2026-08-23 | Done | Added and locally validated the GitHub Pages Actions workflow and operator setup guidance. |
