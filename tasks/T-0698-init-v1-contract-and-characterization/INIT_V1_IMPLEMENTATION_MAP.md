# Init v1 Implementation Map

## Authority

| Document | Role |
|---|---|
| `docs/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | Frozen product, ownership, persistence, planner, apply, routing, and migration-boundary contract. |
| `docs/specs/0.5/redesign/HADARA_INIT_V1_ACCEPTANCE.md` | Frozen P0/P1/P2, E2E, regression, non-functional, evidence, and release-gate contract. |

The acceptance document wins when this map is incomplete. This map assigns work; it does not weaken or reinterpret the source contracts.

## Current Implementation Characterization

| Area | Current 0.5.x behavior | Init v1 disposition |
|---|---|---|
| Product model | `basic`, `standard`, and `governed` are runtime-facing `InitProfile` values. | Replace with `minimal`, `standard`, and `governed` init-time presets; keep `basic` only as a deprecated minimal alias. |
| Greenfield command | `initProject()` writes a fresh scaffold immediately, including during JSON invocation. | JSON/non-interactive invocation must return a zero-write `hadara.init.plan.v1`; apply requires its hash. |
| Scaffold | Creates `.hadara/scaffold.json`, `.hadara/docs-registry.json`, `.hadara/slot-registry.json`, `.hadara/state/current.json`, profile-specific state/handoff docs, and legacy Task Board columns. | Create only the frozen core manifest and preset optional scaffold; runtime paths remain lazy. |
| Project configuration | Profile authority is spread across scaffold, current-state, registry, and generated Markdown. | Add `.hadara/project.json` as the minimal static configuration with no current task/release/validation fields. |
| Document registry | `.hadara/docs-registry.json` v3 combines desired-state, project identity, tiers, and current routing behavior. | Add `.hadara/documents.json` v1 with exact TargetRef routing; legacy registry becomes migration input only. |
| Brownfield | Existing roots receive a zero-write adoption report with snapshot/plan hashes, symlink/managed-marker collision checks, and reviewed execute. | Preserve these safety guarantees while replacing the action/report schema and removing automatic document registration. |
| Writes | Multi-file adoption uses temp files, rename, and best-effort rollback. | Add project-level serialization, full source/hash recheck, accurate partial-apply reporting, and recoverable transaction state. |
| Upgrade | Requires a target profile and can merge profile metadata/seed registry entries. | Remove configuration switching; upgrade only schemas, missing core artifacts, managed templates/blocks, ignore lines, and projections. |
| CLI output | Follow-up plain output is `passed|failed | command | N actions | N issues`. | Emit explicit `dry-run`, `applied`, or `no-op` facts and accurate counts. |
| Task Board | Header is `ID | Title | Status | Capsule | Notes`; lifecycle finish can record Done before close proof and close does not own Result. | Migrate to `ID | Title | Status | Targets | Capsule | Result`; only valid close records Done and optional Close Summary projection. |
| Task routing | Current task status uses current docs registry/read maps and legacy Task metadata. | Add exact TargetRef plus ordered required-document routing and implicit project target. |
| Preserved guarantees | Unknown-option validation, non-overwrite on simple fresh writes, brownfield dry-run, source/plan hashes, symlink-parent rejection, malformed marker rejection, temp/rename writes, rollback attempt, and local-first operation already have coverage. | Reuse and strengthen these paths instead of replacing them gratuitously. |

## Ordered Capsule Program

Eight capsules, including T-0698, cover the current frozen contract. This is below the user maximum of 100 and keeps each capsule large enough to deliver a coherent, independently validated behavior boundary.

| Order | Capsule | Scope | Primary acceptance |
|---:|---|---|---|
| 1 | T-0698 Init v1 Contract and Characterization | Track both specifications unchanged, inventory legacy behavior/safety, and freeze this implementation map. | M0/M1; all areas assigned; characterization evidence. |
| 2 | Init v1 Core Model and Planner | Canonical preset expansion; artifact manifest; `hadara.project.v1`; `hadara.documents.v1`; TargetRef validation; init plan/report schemas; deterministic plan hash; dry-run/no-op/error output; CLI option contract. | A, B, E, F, I-001, M, O-001/002/003/004, Q-001/002/003, S. |
| 3 | Init v1 Safe Apply Transaction | Greenfield and brownfield classification/apply; mixed block, managed template, scaffold-once, ignore patch, projection writer; root/symlink/case/nested safety; lock, rollback, recovery, accurate partial report. | B-003/004/005, C-001/002/003, I-002/003/004, J, N, P, NF-001/002/004/005/006. |
| 4 | Init v1 Re-init and Upgrade Ownership | Already-initialized no-op, partial-install diagnostics, missing core repair, managed-only upgrades, optional-document preservation, projection regeneration, configuration-change refusal. | C-004/006/007, K, L, O-003/004/005, E2E-004/010, REG-001/003/005. |
| 5 | Init v1 Task Board and Close Projection | New Board schema/parser/writer, Task targets projection, Close Summary interface, Result normalization, close-proof ordering, drift diagnostics, migration of existing rows without data loss. | C-005, D, Q-004, REG-007. |
| 6 | Init v1 Document Routing | Documents registry services/commands, exact TargetRef matching, requiredDocuments, deterministic order, status warnings/blockers, READ_MAP projection, stale verdicts, unregistered isolation. | F, G, H, Q, R, E2E-002/006/007/008/009, REG-006. |
| 7 | Init v1 Legacy Compatibility Isolation | Bounded adapters for legacy profile/config/registry/current-state artifacts; no legacy authority leaks into new persistence; explicit migration diagnostics. Exact field mapping remains gated on `HADARA_INIT_LEGACY_MIGRATION_SPEC`. | Legacy boundary, NF-007, REG-004, OPEN-LEGACY-01. |
| 8 | Init v1 Full Acceptance and Installed Dogfood | Source and built CLI suites, isolated package installation, three presets, adoption, upgrade, lifecycle/routing integration, concurrency/failure fixtures, package file-list audit, final result report. | All P0/P1/P2, E2E-001 through E2E-013, REG, NF, release gate. |

## Acceptance Ownership Matrix

| Acceptance group | Owning capsule(s) |
|---|---|
| A — Product model and preset | 2, verified again in 8 |
| B — Core scaffold and manifest | 2, 3, verified again in 8 |
| C — Artifact ownership and upgrade | 3, 4, 5, 6 |
| D — Task Board and close projection | 5 |
| E — Project configuration | 2 |
| F — Document registry and TargetRef | 2, 6 |
| G — Document routing | 6 |
| H — Preset optional documents | 2, 3, 6 |
| I — Greenfield init | 2, 3 |
| J — Brownfield adoption | 3 |
| K — Re-init | 4 |
| L — Init upgrade | 4 |
| M — Planner and report | 2, 3 |
| N — Transaction and concurrency | 3 |
| O — CLI errors | 2, 3, 4, 6 |
| P — Path and project root | 3 |
| Q — Session bootstrap | 2, 5, 6 |
| R — Stale and document lifecycle | 6 |
| S — Schema minimization | 2, audited again in 7 and 8 |
| E2E | 3 through 8, full installed replay in 8 |
| REG | Owning behavior capsule, full replay in 8 |
| NF | Every production capsule, full audit in 8 |

## Compatibility and Scope Rules

- New projects must not write legacy core artifacts.
- Existing 0.5.x projects remain readable while migration adapters exist, but legacy artifacts are not copied into the new v1 persistence schema unless the frozen contract defines the field.
- `presetOrigin` is informational only.
- `governed` installs documentation scaffold only; it does not activate approval, organization-role, or release-gate behavior.
- URL/external connector routing, nested workspace projects, policy engines, and feature/document-pack mutation command names remain outside this program.
- The separate legacy migration specification is required before destructive cleanup or exact field-by-field conversion. Until then, legacy files are preserved and diagnosed.
- Every production capsule refreshes `dist` from the validated build before built-CLI smokes and commits only after its own acceptance passes.
