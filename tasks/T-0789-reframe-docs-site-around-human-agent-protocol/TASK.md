# T-0789 Reframe docs site around human-agent protocol

## Identity

| Field | Value |
|---|---|
| ID | T-0789 |
| Title | Reframe docs site around human-agent protocol |
| Status | Done |
| Created | 2026-08-13T09:50Z |
| Updated | 2026-08-13T09:58Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Reframe the absorbed docs site so a reader understands HADARA's human/agent operating model, canonical state, projections, and agent-owned CLI lifecycle without stale command guidance. | Preserve the reproducible Vite site and CLI package boundary; no external GitHub Pages deployment in this capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Audience-aware site content, human/agent diagrams, agent protocol CLI explanations, stale-command removal, frontmatter/parser/test contract updates, and local diagram assets. |
| Out | npm/GitHub Pages deployment, domain/repository changes, CLI runtime behavior changes, broad visual redesign, and unrelated documentation cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the audience/content contract against current CLI and protocol sources. | Done |
| 2 | Rework docs content, renderer metadata, diagrams, and stale-command tests. | Done |
| 3 | Build/test the site, record evidence, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The site clearly separates human setup/review from agent-owned CLI protocol execution and explains HADARA as state/proof/projection control plane. | Met | `ev:T-0789:dde0078388ba411199955bc5` | audience-aware content and diagrams |
| AC-2 | CLI pages identify the agent as the normal executor for task lifecycle, validation/evidence, and close; human direct CLI use is limited to setup/init and explicit approvals. | Met | `ev:T-0789:dde0078388ba411199955bc5` | agent protocol pages |
| AC-3 | Public docs contain no removed `context pack` routing or other stale lifecycle commands; current task status/read-map/context graph boundaries are accurately described. | Met | `ev:T-0789:dde0078388ba411199955bc5` | content-contract test |
| AC-4 | Diagrams and concrete artifact explanations render from local site assets, and audience metadata is validated by the site parser/tests. | Met | `ev:T-0789:dde0078388ba411199955bc5` | renderer/assets/tests |
| AC-5 | Site tests/build and root CLI/tool checks pass; root npm package boundary remains unchanged. | Met | `ev:T-0789:d390c42e2e754371a0c3e2b9` | validation |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm test` in `docs/site/` | Yes | Passed | Docker native-ext4 run: 7 content/audience/stale-command contract tests passed. | T-0789 validation evidence |
| `npm run build` in `docs/site/` | Yes | Passed | Docker native-ext4 TypeScript and Vite production build passed with local diagrams. | T-0789 validation evidence |
| Root diff/build checks | Yes | Passed | Docker root `npm run build` and `npm run typecheck:tools` passed; root npm package boundary unchanged. | T-0789 validation evidence |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `temp/HADARA-site-rc6-static-v2/HADARA-site-rc6` | reference | active | Audience-aware content refresh; port semantics without importing its CDN/raw-URL runtime. |
| `docs/CLI_JSON_CONTRACT.md` | design | active | Current task/evidence contracts and removed public context-pack routing. |
| `docs/HADARA_WORKFLOW.md` | design | active | Human/agent protocol and session workflow boundaries. |

## Changes

| Area | Summary |
|---|---|
| Content model | Add human/shared/agent-protocol/release-operator audience metadata and explain the human-to-agent handoff. |
| Protocol guidance | Make task status, task lifecycle, validation/evidence, and close examples explicitly agent-run. |
| Visual model | Add local HADARA operating-model and lifecycle diagrams rendered through the existing image pipeline. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | External GitHub Pages deployment remains a separate publication capsule after this docs source change. | Deferred | RC6 regeneration and later Pages operator capsule |
| RF-2 | Risk | The nested frontend must remain outside the root HADARA npm package. | Closed | Root package `files` whitelist and package boundary check passed. |

## Close Summary
The docs site now explains the human-to-agent operating model, HADARA's canonical state
and human-readable projections, and the status-first/proof-last lifecycle. CLI pages are
audience-scoped: init is human setup, while task/evidence/close pages describe the agent
protocol. Removed `context pack` guidance was eliminated and local operating-model and
lifecycle diagrams were added. Site and root validation passed in Docker.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-13 | Draft | Initial task scaffold. |
| 2026-08-13 | In Progress | Created to correct stale docs-site guidance and establish the human/agent protocol model. |
| 2026-08-13 | Validation | Reframed content, added audience metadata and local diagrams, removed stale routing, and passed site/root checks. |
| 2026-08-13 | Done | Close preflight prepared after evidence append and handoff reconciliation. |
