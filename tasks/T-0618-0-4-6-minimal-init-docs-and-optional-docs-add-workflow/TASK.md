# T-0618 0.4.6 minimal init docs and optional docs add workflow

## Identity

| Field | Value |
|---|---|
| ID | T-0618 |
| Title | 0.4.6 minimal init docs and optional docs add workflow |
| Status | Done |
| Created | 2026-07-15 |
| Updated | 2026-07-15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make init-generated docs enforce ongoing docs maintenance without bloating fresh scaffolds. | Default init should create only core workflow docs; optional project docs should be added explicitly through a guarded `hadara docs add` workflow or custom Markdown plus registry registration. |

## Scope

| Boundary | Items |
|---|---|
| In | Init profile doc sets, docs registry seed entries, generated workflow/AGENTS guidance, `hadara docs add` CLI/service/schema/help, focused tests, built CLI smoke. |
| Out | Large docs taxonomy redesign, domain-specific profile types, automatic migration of every historical project doc, full Docker helper refactor. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the minimal-init and optional-docs contract. | Done |
| 2 | Remove optional project docs from default standard/governed scaffold generation and registry seeding. | Done |
| 3 | Add guarded `hadara docs add <type>` for optional docs and register it in help/schema surfaces. | Done |
| 4 | Update generated and repo workflow guidance so agents keep generated/project-owned docs current. | Done |
| 5 | Validate with focused tests, build, and built CLI smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh `standard` init creates only core docs and no optional architecture/decision/roadmap/security docs. | Done | `ev:T-0618:b81551b589904ee5baf444c1`, `ev:T-0618:5216f26b073f44b49525c173` | `src/init/profile.ts`, `src/services/docs-registry.ts`, `tests/unit/init.test.ts` |
| AC-2 | `hadara docs add` dry-run/execute can create or register optional docs with registry metadata. | Done | `ev:T-0618:9b0731cf4a72409193c26498`, `ev:T-0618:5216f26b073f44b49525c173` | `src/services/docs-add.ts`, `src/cli/docs.ts`, `tests/unit/docs-registry.test.ts` |
| AC-3 | Generated workflow/AGENTS guidance tells agents to update generated docs and use `docs add` or `docs register` for project-specific docs. | Done | `ev:T-0618:b81551b589904ee5baf444c1` | `src/init/templates.ts`, `docs/HADARA_WORKFLOW.md` |
| AC-4 | Public command/schema/help surfaces include `docs.add`. | Done | `ev:T-0618:9b0731cf4a72409193c26498` | `src/services/capability-registry.ts`, `src/schemas/docs-add.schema.json`, `tests/unit/schema-fixtures.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused init/docs/help tests | Yes | Passed | `ev:T-0618:b81551b589904ee5baf444c1` |
| Adjacent docs/schema contract tests | Yes | Passed | `ev:T-0618:9b0731cf4a72409193c26498` |
| TypeScript build | Yes | Passed | `ev:T-0618:1a57668356284afea68260ae` |
| Built CLI `/tmp` smoke | Yes | Passed | `ev:T-0618:5216f26b073f44b49525c173` |
| Docker sync build | No | Blocked | `ev:T-0618:d7a1e7aca2a34782ba8e84a2` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0615-0-4-6-rc-0-installed-package-multi-scenario-delegated-dogfood/DOGFOOD_REPORT.md` | reference | active | Delegated dogfood showed project docs were ignored unless generated docs make the obligation explicit. |
| User direction | requirement | active | Do not add more init profile options; prefer a later `hadara docs add` path for decisions/roadmap/etc. |
| `docs/HADARA_WORKFLOW.md` | implementation-source | active | Current workflow docs must reflect the same generated-doc maintenance rule. |

## Changes

| Area | Summary |
|---|---|
| Init profiles | `standard` now emits core docs only; `governed` adds compact handoff only. Optional architecture/decision/roadmap/security docs are no longer default seed docs. |
| Docs registry | Seed entries match the smaller init surface; profile drift tests now target actual required generated docs. |
| CLI | Added dry-run-first `hadara docs add <architecture|decisions|roadmap|security-model|test-strategy|agent-guide>`. |
| Templates/docs | Generated workflow and AGENTS guidance now require keeping generated/project-owned docs current and explain `docs add` / `docs register`. |
| Schema/help | Added `hadara.docs.add.v1` schema fixture and command registry/help entry. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Accepted residual risk for `ev:T-0618:d7a1e7aca2a34782ba8e84a2`: `npm run dev:docker-sync-build` hung without output during validation; add heartbeat/stage timeout to the helper. | Open | `.hadara/local/feedback/T-0618-docker-sync-build-hang.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-15 | Draft | Initial task scaffold. |
| 2026-07-15 | In Progress | Implemented minimal init docs, optional `docs add`, guidance updates, focused validation, and built CLI smoke. |
| 2026-07-15 | Done | Closed after focused tests, schema/help validation, TypeScript build, and built CLI docs-add smoke. |
