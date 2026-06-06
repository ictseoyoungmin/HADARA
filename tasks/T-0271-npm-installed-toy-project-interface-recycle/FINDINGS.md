# Findings

## Setup

| Item | Result | Notes |
|---|---|---|
| Container | Passed | `hadara-recycle` has Node `v22.22.3` and npm `10.9.8`. |
| Registry visibility | Passed | `npm view hadara@0.2.0-rc.0 version` returned `0.2.0-rc.0`. |
| Install | Passed | `npm install hadara@0.2.0-rc.0` completed in `/tmp/hadara-recycle-toy-0271` with 0 vulnerabilities. |
| Installed version | Passed | Installed `hadara version --verbose --json` reported package version `0.2.0-rc.0`. |

## Interface Matrix

| Surface | Result | Notes |
|---|---|---|
| Help/version | Passed | Help exposes expected CLI surfaces; version reports installed package path. |
| Init | Passed after T-0273 | `init --profile governed --json` now emits structured `hadara.init.v1`. |
| Doctor/status | Passed after T-0273 | Doctor becomes ok after `hermes export-context`; status now parses table-first toy Project State phase as `bootstrap-development`. |
| Task create/list/status | Passed | Template create, list, and workbench status work with actionable next actions. |
| Evidence add/list/lint | Passed | v2 persisted ids, evidence list, and semantic lint worked; later passed operation evidence resolved earlier failed operation evidence. |
| Finish/ready/close/audit/complete | Passed | Task lifecycle reached `closed-valid` and `task complete` reached stage `complete`. |
| Handoff update/suggest | Passed after T-0273 | `handoff update --json` emits `hadara.handoff.update.v1`; `handoff suggest --json` now uses generic project-work wording. |
| Policy | Passed | `policy preflight-shell` correctly requires approval in assisted mode. |
| Hermes/context | Passed | Detect/export work; export creates `.hadara/context/HADARA_CONTEXT.md` and fixes doctor project-context. |
| MCP stdio | Passed | Initialize and tools/list returned read-only metadata and tool schemas. |
| Dashboard/TUI | Passed with UX note | Dashboard `/api/status` and TUI snapshot work; TUI fast path showed proof deferred/unknown immediately after close. |
| Run scaffold/run | Passed after T-0272 | Generated scaffold script now matches the JSON fake-shell observation envelope in trusted mode. |
| Release/package/install | Passed as dry-run surfaces | Release/package dry-runs block appropriately for the toy package without mutation; install plan reports planned writes without executing. |
| Smoke/debt/run-state | Passed | Core smoke, debt list, and run-state show worked. |

## Bugs / Improvement Candidates

| Priority | Finding | Impact | Suggested Follow-up |
|---|---|---|---|
| High | `run scaffold` generates a script whose second match expects raw stdout, but `run` feeds the provider a JSON fake-shell observation. | Scaffolded deterministic runs fail even in trusted mode unless the user edits the generated script. | Fixed in T-0272 by matching stable JSON observation-envelope content. |
| Medium | Fresh governed init followed by `init doctor --json` warns `INIT_OLD_PROFILE_NAME` for generated `docs/IMPLEMENTATION_SOP.md`. | New users see a warning immediately after init. | Fixed in T-0273. |
| Medium | `status --json` and dashboard `/api/status` parse Project State phase as `| Field | Value |` in a fresh toy scaffold. | Operator status looks misleading in new projects. | Fixed in T-0273. |
| Medium | `handoff suggest` emits HADARA-dev-specific text such as “Continue Phase 6” in a generic toy project. | Generic projects receive confusing suggestions. | Fixed in T-0273. |
| Low | `init --profile governed --json` accepts the flag but emits text. | Minor JSON consistency surprise. | Fixed in T-0273 by adding `hadara.init.v1`. |
| Low | `handoff update` only emits text. | Harder to use in automation compared with newer JSON-first lifecycle surfaces. | Fixed in T-0273 by adding `hadara.handoff.update.v1`. |
| Low | `doctor` reports `project-context` missing until `hermes export-context`, but the path points only at `.hadara`. | The missing target is ambiguous. | Fixed in T-0273; doctor reports `.hadara/context/HADARA_CONTEXT.md`. |
| Low | `task status` can show `closed-valid` while `ready:false` after post-close failed evidence. | Semantically correct but potentially confusing. | Fixed in T-0274 with additive `state.readiness` summary. |
| Low | T-0271 evidence lint on the mounted HADARA-dev workspace took roughly 30 seconds for one record, and `task finish --json` took roughly two minutes before returning a simple two-write plan. | Operators may perceive simple lifecycle checks as hung. | Fixed in T-0274 for single-task paths by replacing broad capsule scans with direct `findTaskCapsule()` lookup. |
| Low | Official `dev docker-check --json` wrapper failed at `temp-workspace` without enough diagnostic detail in sandboxed recycle validation. | Operators cannot tell whether the failure is test, npm, Docker, or setup related. | Fixed in T-0274 by adding redacted `stepId`, `exitCode`, and `debugHint` while keeping raw logs private. |

## Positive Findings

| Area | Observation |
|---|---|
| Install path | Published package installs and runs quickly from a clean toy project. |
| Lifecycle UX | Task status and ready/finish/close reports provide useful blockers, write boundaries, and next commands. |
| Evidence semantics | Failed evidence is blocked while unresolved and resolved after later passed same-category evidence. |
| Safety posture | Release publish dry-run, release dry-run, package smoke dry-run, install plan, MCP default mode, and policy preflight all avoid mutation and expose privacy/safety metadata. |
| MCP/read surfaces | MCP initialize/tools-list clearly communicate read-only mode and disabled write/provider/shell surfaces. |
