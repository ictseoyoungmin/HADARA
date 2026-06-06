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
| Init | Passed with UX note | `init --profile governed --json` succeeds but emits text because `init` has no JSON contract. |
| Doctor/status | Passed with warnings | Doctor becomes ok after `hermes export-context`; status works but parses toy Project State phase as `| Field | Value |`. |
| Task create/list/status | Passed | Template create, list, and workbench status work with actionable next actions. |
| Evidence add/list/lint | Passed | v2 persisted ids, evidence list, and semantic lint worked; later passed operation evidence resolved earlier failed operation evidence. |
| Finish/ready/close/audit/complete | Passed | Task lifecycle reached `closed-valid` and `task complete` reached stage `complete`. |
| Handoff update/suggest | Passed with UX note | `handoff update` writes successfully but has no JSON output; `handoff suggest` can emit HADARA-dev-specific Phase 6 wording in a generic toy project. |
| Policy | Passed | `policy preflight-shell` correctly requires approval in assisted mode. |
| Hermes/context | Passed | Detect/export work; export creates `.hadara/context/HADARA_CONTEXT.md` and fixes doctor project-context. |
| MCP stdio | Passed | Initialize and tools/list returned read-only metadata and tool schemas. |
| Dashboard/TUI | Passed with UX note | Dashboard `/api/status` and TUI snapshot work; TUI fast path showed proof deferred/unknown immediately after close. |
| Run scaffold/run | Partially failed | Generated scaffold script failed in assisted mode as expected, but also failed in trusted mode because the generated second-step match expects raw stdout while actual observation is JSON. A manually fixed script passed. |
| Release/package/install | Passed as dry-run surfaces | Release/package dry-runs block appropriately for the toy package without mutation; install plan reports planned writes without executing. |
| Smoke/debt/run-state | Passed | Core smoke, debt list, and run-state show worked. |

## Bugs / Improvement Candidates

| Priority | Finding | Impact | Suggested Follow-up |
|---|---|---|---|
| High | `run scaffold` generates a script whose second match expects raw stdout, but `run` feeds the provider a JSON fake-shell observation. | Scaffolded deterministic runs fail even in trusted mode unless the user edits the generated script. | Change scaffold step 2 to match a stable observation-envelope substring or generate a matcher compatible with fake-shell observations. |
| Medium | Fresh governed init followed by `init doctor --json` warns `INIT_OLD_PROFILE_NAME` for generated `docs/IMPLEMENTATION_SOP.md`. | New users see a warning immediately after init. | Refresh generated SOP text or init-doctor detection so fresh scaffold is warning-clean. |
| Medium | `status --json` and dashboard `/api/status` parse Project State phase as `| Field | Value |` in a fresh toy scaffold. | Operator status looks misleading in new projects. | Harden Project State phase extraction for table-first scaffold docs. |
| Medium | `handoff suggest` emits HADARA-dev-specific text such as “Continue Phase 6” in a generic toy project. | Generic projects receive confusing suggestions. | Make handoff suggestion copy project-profile aware and avoid HADARA-dev roadmap assumptions. |
| Low | `init --profile governed --json` accepts the flag but emits text. | Minor JSON consistency surprise. | Either document no JSON for `init`, reject `--json`, or add JSON output. |
| Low | `handoff update` only emits text. | Harder to use in automation compared with newer JSON-first lifecycle surfaces. | Add optional `--json` report for handoff update. |
| Low | `doctor` reports `project-context` missing until `hermes export-context`, but the path points only at `.hadara`. | The missing target is ambiguous. | Report `.hadara/context/HADARA_CONTEXT.md` or provide a next action. |
| Low | `task status` can show `closed-valid` while `ready:false` after post-close failed evidence. | Semantically correct but potentially confusing. | Add a clearer “closed proof valid, current readiness stale/blocked” summary. |
| Low | T-0271 evidence lint on the mounted HADARA-dev workspace took roughly 30 seconds for one record, and `task finish --json` took roughly two minutes before returning a simple two-write plan. | Operators may perceive simple lifecycle checks as hung. | Inspect whether evidence lint/task finish perform broader project reads than needed on mounted filesystems. |

## Positive Findings

| Area | Observation |
|---|---|
| Install path | Published package installs and runs quickly from a clean toy project. |
| Lifecycle UX | Task status and ready/finish/close reports provide useful blockers, write boundaries, and next commands. |
| Evidence semantics | Failed evidence is blocked while unresolved and resolved after later passed same-category evidence. |
| Safety posture | Release publish dry-run, release dry-run, package smoke dry-run, install plan, MCP default mode, and policy preflight all avoid mutation and expose privacy/safety metadata. |
| MCP/read surfaces | MCP initialize/tools-list clearly communicate read-only mode and disabled write/provider/shell surfaces. |
