# Command Portfolio Reduction Inventory

## Purpose

This inventory turns the current HADARA command surface into a reduction plan before 0.5.x. It is based on the built command registry and `src/services/capability-registry.ts`, not on stale hand-written help text.

This capsule does not remove commands. It classifies each command so follow-up capsules can reduce surface area without breaking the stable 0.4.1 release line.

## Current Shape

| Metric | Value |
|---|---|
| Total current commands | 73 |
| Default-help commands | 10 |
| Stable commands | 57 |
| Experimental commands | 16 |
| Primary commands | 6 |
| Diagnostic commands | 26 |
| Conditional commands | 19 |
| Release-only commands | 7 |
| Dev-only commands | 3 |
| Integration-only commands | 5 |
| Advanced commands | 7 |

## Family Distribution

| Family | Count | Read |
|---|---:|---|
| project-health | 17 | Too broad; includes context, slice, debt, status, and cache surfaces. |
| docs-governance | 14 | The largest consolidation target after project-health. |
| capsule-lifecycle | 10 | Primary loop is clean, but evidence/proof helpers overlap. |
| proof-diagnostics | 7 | Mostly useful, but proof/status/ci overlap should shrink. |
| release-package | 7 | Keep for release safety, but service boundaries overlap. |
| start | 5 | Mostly core. |
| integrations | 5 | Keep opt-in; Hermes-only surfaces need usage proof. |
| dev-validation | 3 | Keep scoped to HADARA-dev. |
| advanced | 2 | Review carefully; hidden does not mean free. |
| ui | 2 | Keep hidden unless product direction changes. |
| install | 1 | Weak product value today. |

## Recommendation Vocabulary

| Action | Meaning |
|---|---|
| Keep | Core user or agent workflow. Do not remove before 0.5. |
| Keep/Scoped | Useful, but keep out of default paths and avoid expanding. |
| Keep/Advanced | Niche, experimental, or operator-only; retain but do not advertise broadly. |
| Merge | Candidate to fold into another command as an option/subreport, then remove or redirect. |
| Deprecate? | Standalone value is doubtful; require usage proof or replace with docs/internal helper. |
| Review | Needs a specific follow-up decision before changing. |

## All Commands

| ID | Family | Req | Importance | Default | Action | Rationale |
|---|---|---|---|---|---|---|
| `help` | start | primary | P0 | yes | Keep | Ordinary user/agent path or command discovery. |
| `commands` | start | primary | P0 | yes | Keep | Ordinary user/agent path or command discovery. |
| `schema` | start | diagnostic | P2-diagnostic | yes | Keep | Controlled vocabulary lookup fixed real dogfood friction. |
| `slice.list` | project-health | conditional | P2-conditional | no | Keep/Advanced | State-first slice prototype is useful but should remain advanced until adopted outside HADARA-dev. |
| `slice.add` | project-health | conditional | P2-conditional | no | Keep/Advanced | Write surface for the slice prototype; keep scoped and dry-run/drift guarded. |
| `slice.set` | project-health | conditional | P2-conditional | no | Keep/Advanced | Write surface for the slice prototype; keep scoped and dry-run/drift guarded. |
| `slice.migrate` | project-health | conditional | P2-conditional | no | Keep/Advanced | Migration-only command; do not advertise as ordinary workflow. |
| `slice.render` | project-health | conditional | P2-conditional | no | Keep/Advanced | Explicit projection repair command; keep hidden. |
| `version` | project-health | diagnostic | P2-diagnostic | no | Keep/Scoped | Important for installed-package and dist freshness diagnostics. |
| `doctor` | project-health | diagnostic | P2-diagnostic | yes | Keep | Main project health entry point. |
| `init` | start | conditional | P2-conditional | yes | Keep | Product bootstrap path. |
| `init.doctor` | project-health | diagnostic | P2-diagnostic | no | Review | Could fold into `doctor` unless profile-specific scaffold drift needs its own surface. |
| `init.upgrade` | start | conditional | P2-conditional | no | Deprecate? | Scaffold upgrade is useful but broad; consider `doctor` suggestion plus explicit remediate path. |
| `init.enable-integration` | integrations | integration-only | P2-integration | no | Deprecate? | Integration docs registration may be better as docs guidance or `mcp.serve`/Hermes docs. |
| `task.create` | capsule-lifecycle | primary | P0 | yes | Keep | Core capsule lifecycle. |
| `task.list` | capsule-lifecycle | conditional | P2-conditional | no | Merge | Fold into `task status` selection/list mode or keep as compatibility redirect. |
| `task.status` | capsule-lifecycle | primary | P0 | yes | Keep | Main work cockpit and replacement for removed lifecycle surfaces. |
| `task.finalize` | capsule-lifecycle | primary | P0 | yes | Keep | Main close path and proof boundary. |
| `task.close-source` | capsule-lifecycle | diagnostic | P2-diagnostic | no | Keep/Scoped | Low-level close debugging; hide from normal lifecycle. |
| `validation.run` | capsule-lifecycle | primary | P0 | yes | Keep | Main evidence-producing validation wrapper. |
| `evidence.add-command` | capsule-lifecycle | conditional | P2-conditional | no | Keep/Scoped | Necessary fallback for already-run checks and release/operator evidence. |
| `evidence.list` | capsule-lifecycle | conditional | P2-conditional | no | Keep/Scoped | Durable evidence id discovery. |
| `evidence.summary` | capsule-lifecycle | conditional | P2-conditional | no | Merge | Fold compact summary into `evidence list --summary` or `task status --summary-json`. |
| `evidence.project` | capsule-lifecycle | conditional | P2-conditional | no | Keep/Scoped | Projection repair; useful but rare. |
| `evidence.lint` | proof-diagnostics | diagnostic | P2-diagnostic | no | Keep/Scoped | Required for evidence debugging and finalize internals. |
| `evidence.migrate` | advanced | advanced | P3-advanced | no | Review | Historical migration only; keep only if hash-guarded migration remains a product promise. |
| `proof.status` | proof-diagnostics | diagnostic | P2-diagnostic | yes | Merge | Overlaps `task status --detail full` and `task finalize --json`; remove from default help first. |
| `proof.explain` | proof-diagnostics | diagnostic | P2-diagnostic | no | Merge | Fold blocker explanation into `task status --detail full`. |
| `ci.gate` | proof-diagnostics | diagnostic | P2-diagnostic | no | Merge | CI gate overlaps `release.gate`, `state.verify`, and finalize diagnostics. |
| `state.verify` | proof-diagnostics | diagnostic | P2-diagnostic | no | Keep/Scoped | Useful project-level consistency read model. |
| `context.graph` | project-health | diagnostic | P2-diagnostic | no | Keep/Advanced | Specialized context-routing read model; retain but keep off default path. |
| `context.pack` | project-health | diagnostic | P2-diagnostic | no | Keep/Advanced | Useful for bounded agent context; discovery should improve before removal. |
| `context.slice` | project-health | diagnostic | P2-diagnostic | no | Keep/Advanced | Raw bounded read tool; keep because it solves a distinct problem. |
| `session.start` | project-health | diagnostic | P2-diagnostic | no | Keep/Advanced | Useful as startup packet, but dogfood shows agents rarely call it directly. |
| `context.cache.status` | project-health | diagnostic | P2-diagnostic | no | Keep/Advanced | Cache diagnostics only; could later merge under `context cache`. |
| `context.cache.warm` | project-health | diagnostic | P2-diagnostic | no | Keep/Advanced | Explicit cache mutation; keep advanced. |
| `debt.list` | project-health | conditional | P2-conditional | no | Keep/Advanced | Product debt read model; keep but avoid default path. |
| `debt.show` | project-health | conditional | P2-conditional | no | Merge | Fold into `debt list --id <id>` or richer list filters. |
| `protocol.doctor` | proof-diagnostics | diagnostic | P2-diagnostic | no | Keep/Scoped | Deep protocol diagnostics beyond `doctor`; keep hidden. |
| `protocol.remediate` | docs-governance | conditional | P2-conditional | no | Keep/Advanced | Guarded repair path; keep only with before-hash friction. |
| `protocol.migrate` | docs-governance | conditional | P2-conditional | no | Keep/Advanced | Migration-only; keep hidden and dry-run-first. |
| `docs.list` | docs-governance | diagnostic | P2-diagnostic | no | Merge | Fold into `docs doctor/list` unified registry report. |
| `docs.doctor` | docs-governance | diagnostic | P2-diagnostic | no | Keep/Scoped | Main docs registry diagnostic. |
| `docs.explain` | docs-governance | diagnostic | P2-diagnostic | no | Merge | Fold into `docs doctor --path` or `docs list --path`. |
| `docs.read-map` | docs-governance | diagnostic | P2-diagnostic | no | Merge | Fold into `docs required-reading --json` or `context pack` metadata. |
| `docs.inbox` | docs-governance | diagnostic | P2-diagnostic | no | Merge | Fold into `docs doctor` as unregistered/current inbox section. |
| `docs.register` | docs-governance | conditional | P2-conditional | no | Keep/Scoped | Required mutation path for docs registry corrections. |
| `docs.complete-spec` | docs-governance | conditional | P2-conditional | no | Keep/Scoped | Important lifecycle path for Required Reading demotion. |
| `docs.managed.list` | docs-governance | diagnostic | P2-diagnostic | no | Merge | Fold into `docs doctor --managed` or `docs list --managed`. |
| `docs.managed.explain` | docs-governance | diagnostic | P2-diagnostic | no | Merge | Fold into managed/list detail mode. |
| `docs.patch` | docs-governance | advanced | P3-advanced | no | Deprecate? | Managed-section patching is risky and likely better internalized. |
| `docs.mark` | docs-governance | advanced | P3-advanced | no | Keep/Scoped | Registry correction path is needed, but keep guarded. |
| `docs.required-reading` | docs-governance | diagnostic | P2-diagnostic | no | Keep/Advanced | Useful read-routing report; keep hidden from ordinary users. |
| `tools.list` | integrations | integration-only | P2-integration | no | Merge | Compatibility projection overlaps `commands --json`; keep only if MCP clients require it. |
| `policy.preflight-shell` | advanced | advanced | P3-advanced | no | Keep/Advanced | Distinct security diagnostic; hidden is acceptable. |
| `harness.validate` | proof-diagnostics | diagnostic | P2-diagnostic | no | Keep/Scoped | Diagnostic-only after finalize absorbed readiness proof. |
| `dev.docker-check` | dev-validation | dev-only | P1-dev | no | Keep/Scoped | HADARA-dev validation path; keep out of product onboarding. |
| `hermes.detect` | integrations | integration-only | P2-integration | no | Deprecate? | Hermes-specific surface lacks current product pull. |
| `hermes.export-context` | integrations | integration-only | P2-integration | no | Deprecate? | Local-cache write for an integration path with unclear current usage. |
| `mcp.serve` | integrations | integration-only | P2-integration | no | Keep/Scoped | Actual integration runtime entry point. |
| `status` | project-health | conditional | P2-conditional | no | Keep/Scoped | Operations read model; may later absorb project-health summaries. |
| `install.plan` | install | advanced | P3-advanced | no | Deprecate? | Installer plan has weak current product value. |
| `smoke.run` | dev-validation | dev-only | P1-dev | no | Merge | Fold core smoke profiles into `dev docker-check` or package smoke. |
| `smoke.clean-checkout` | dev-validation | dev-only | P1-dev | no | Keep/Advanced | Release/development safety check; hidden and explicit. |
| `smoke.package` | release-package | release-only | P1-release | no | Keep/Scoped | Canonical package smoke after old `package smoke` removal. |
| `package.recycle` | release-package | release-only | P1-release | no | Keep/Scoped | Public installed-package confidence path. |
| `release.dry-run` | release-package | release-only | P1-release | no | Merge | Fold into `release.gate --mode strict` or release prepare helper. |
| `release.closeout` | release-package | release-only | P1-release | no | Merge | Fold into release state sync/post-publish capsule tooling. |
| `release.publish` | release-package | release-only | P1-release | no | Keep/Advanced | Keep approval-gated, but do not expand. |
| `release.artifact` | release-package | release-only | P1-release | no | Keep/Scoped | Release helper depends on explicit artifact build. |
| `release.gate` | release-package | release-only | P1-release | no | Keep/Scoped | Strict release readiness gate; keep. |
| `dashboard.serve` | ui | advanced | P3-advanced | no | Keep/Advanced | Product UI surface is paused but real. |
| `tui` | ui | advanced | P3-advanced | no | Keep/Advanced | Hidden operator UI; keep only if future product direction uses it. |

## First Reduction Cuts

These are the safest follow-up slices because they are read-only or already hidden from default help:

| Slice | Commands | Proposed Landing |
|---|---|---|
| Proof read-model merge | `proof.status`, `proof.explain`, `ci.gate` | Remove `proof.status` from default help, fold explanation into `task status --detail full`, decide whether CI needs a separate non-human contract. |
| Evidence helper merge | `evidence.summary` | Add compact summary mode to `evidence.list` or `task status --summary-json`, then redirect. |
| Docs diagnostics merge | `docs.list`, `docs.explain`, `docs.read-map`, `docs.inbox`, `docs.managed.list`, `docs.managed.explain` | Unify under `docs doctor` / `docs list` with filters, then redirect old names. |
| Project-health merge | `task.list`, `debt.show`, `init.doctor` | Prefer `task status`, `debt list --id`, and root `doctor` detail sections. |
| Weak standalone deprecations | `install.plan`, `hermes.detect`, `hermes.export-context`, `init.enable-integration`, `docs.patch` | Require usage proof; otherwise replace with docs/internal helpers and redirect stubs for one minor. |
| Release consolidation later | `release.dry-run`, `release.closeout`, release evidence services | Do not do as a pure refactor; consolidate when next release code change is required. |

## Target Shape

| Band | Current | Target Before 0.5 |
|---|---:|---:|
| Total command ids | 73 | 50-58 |
| Default-help commands | 10 | 7-8 |
| Primary commands | 6 | 6 |
| Diagnostic commands | 26 | 12-16 |
| Docs-governance commands | 14 | 7-9 |
| Project-health commands | 17 | 10-12 |

The target keeps the core loop intact: `help`, `commands`, `schema`, `doctor`, `init`, `task create`, `task status`, `validation run`, and `task finalize`. Reduction should happen around duplicate diagnostics and weak standalone integration/installer surfaces, not around the primary task lifecycle.
