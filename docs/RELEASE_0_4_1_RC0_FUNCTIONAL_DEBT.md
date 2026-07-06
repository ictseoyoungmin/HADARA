# 0.4.1-rc.0 Functional Debt

## Purpose

This document tracks reviewer and dogfood feedback that should become functional work for `0.4.1-rc.0`, after stable `0.4.0` publication.

## Debt Queue

| ID | Area | Debt | Why It Matters | Target |
|---|---|---|---|---|
| FD-001 | Docs governance | Implement the planned `docs.complete-spec` command. | Completed implementation specs need an explicit lifecycle transition instead of remaining in active routing forever. | Done in T-0495 |
| FD-002 | Docs governance | Implement the planned `docs.mark-drift` command. | Drift metadata is already in registry entries, but operators still lack a focused command to mark existing documents. | `0.4.1-rc.0` |
| FD-003 | Required Reading | Define the completed-spec Required Reading lifecycle from `docs/REQUIRED_READING_LIFECYCLE_FOLLOWUP.md`. | Completed specs should move from active/default routing to historical or implemented-reference routing without manual guesswork. | `0.4.1-rc.0` |
| FD-004 | Product docs | Separate product documentation from HADARA-dev internal development and audit documents. | New users should land on Getting Started and Lifecycle Quickstart first; internal contracts should be discoverable but not mixed into onboarding. | `0.4.1-rc.0` |
| FD-005 | Docs registry projection | Review whether `docs/DOC_REGISTRY.md` should remain optional generated projection or become self-registered. | Current docs doctor can report the projection as unregistered; that is accepted behavior today but confusing in docs-governance work. | `0.4.1-rc.0` |
| FD-006 | Command help vocabulary | Generalize controlled-value diagnostics beyond `docs.register` where other commands enforce closed token sets. | T-0494 fixes the acute docs-register loop; T-0497 adds the shared vocabulary source and `hadara schema` lookup surface. | Done in T-0497 |
| FD-007 | Handoff workflow | Remove the broken `handoff update` write command and keep `handoff suggest` as the read-only aid for reviewed handoff edits. | Stable 0.4.0 use found the write command was the highest-friction repeated bug; removing it is safer than preserving an unreliable shared-doc writer. | Done in T-0496 |
| FD-008 | Docs registry correction | Add a general registry metadata correction path such as `docs.mark --status <any>` with guards or `docs.register --force-update`. | Operators need a CLI path for ordinary mistakes such as canonical -> reference without hand-editing `.hadara/docs-registry.json`; T-0497 implements guarded `docs mark --correction`. | Done in T-0497 |
| FD-009 | Task schema vocabulary | Surface TASK.md controlled tokens for Inputs / Constraints and Risks / Follow-ups before finalize failure. | Users currently learn role/state tokens by failing harness/finalize after writing prose; T-0497 surfaces these tokens through `hadara schema` and structured harness diagnostics. | Done in T-0497 |
| FD-010 | Lifecycle ergonomics | Consider a guarded low-ceremony finalize path for obvious clean cases, such as `task finalize --execute --auto`. | Dry-run -> copy plan hash -> execute is safe but repetitive across many small known-good capsules; T-0499 implements guarded `task finalize --execute --auto`. | Done in T-0499 |
| FD-011 | Release gate | Add a command-surface/dist drift check to package smoke. | Stable 0.4.0 shipped a dist-only `handoff update` writer absent from the dev tree; T-0496 removed the instance, but the class of "published surface differs from source surface" has no release gate. T-0499 implements the gate: installed registry ids vs source registry plus installed routing parity (spike decision recorded in T-0499). | Done in T-0499 |
| FD-012 | Slices state prototype | Prototype `.hadara/state/slices.json` as canonical slice state with `docs/DEVELOPMENT_SLICES.md` as a fully generated projection. | First bounded state-first experiment; gates the 0.5 state-first RFC (`docs/specs/0.5/state-first/RFC.md` section 9) and fixes the current `rows: 0` DEVELOPMENT_SLICES parsing failure. | `0.4.1-rc.0` |
| FD-013 | Lifecycle surface | Remove the low-level lifecycle command surface (`task finish`, `task ready`, `task close`, `task audit-close`, `task complete`) after FD-010 lands. | Once `--auto` covers low-ceremony closes, standalone write steps outside the finalize snapshot guard are unprotected paths and surface-drift debt; read-only ones duplicate `task status --detail full`. Recovery flows must complete through finalize alone (see `docs/specs/0.4.1/rc0-scope.md` item 6). | `0.4.1-rc.0` (after FD-010) |

## Keep / Preserve

| Area | Positive Feedback | Preserve In Future Changes |
|---|---|---|
| Task Capsule lifecycle | `task create -> status -> finalize dry-run -> finalize execute` fit milestone slices well and kept 9 tasks scoped. | Keep task capsules as the primary work unit. |
| Validation evidence | `validation run` was useful because it executes real commands and records evidence ids in TASK.md Validation. | Do not regress evidence-backed validation or TASK.md sync ergonomics. |
| Finalize safety | dry-run + plan hash + execute prevented stale close mistakes. | Any low-ceremony path must preserve current stale-plan protection internally. |
| Docs registry | Registry separated 17 large specs from HADARA scaffold docs and made `docs.doctor` useful. | Keep registry-first docs governance. |
| Task Board sync | finish/close updated Task Board status automatically. | Keep status bookkeeping command-owned. |
| TASK.md schema | Goal/Scope/Plan/Acceptance/Validation/Changes/Risks produced useful later-readable records. | Keep the schema, but expose controlled tokens earlier. |

## Current Resolution

| Item | State | Notes |
|---|---|---|
| `docs.register` controlled-value diagnostics | Completed in T-0494 | Invalid docs-register tokens now return allowed values and suggestions. |
| `docs.complete-spec` lifecycle command | Completed in T-0495 | Implements FD-001 as the first `0.4.1-rc.0` docs-governance command. |
| `handoff update` write command | Completed in T-0496 | The executable command, registry entry, write-preflight support, and primary lifecycle step were removed; `handoff suggest` remains read-only. |
| Finalize --auto and command-surface drift gate | Completed in T-0499 | Implements FD-010/FD-011 with the guarded single-call close path and the package-smoke command-surface-drift step. |
| Vocabulary diagnostics and registry correction | Completed in T-0497 | Implements FD-006/FD-008/FD-009 with shared controlled vocabulary, `hadara schema`, structured TASK.md/docs token diagnostics, and guarded `docs mark --correction`. |
| Auto-correction for aliases | Deferred | T-0494 reports suggestions only; automatic token rewriting remains a separate design decision. |

## Review Trigger

Before preparing `0.4.1-rc.0`, open capsules for FD-001 through FD-013 or explicitly reclassify any item as deferred with evidence. FD-011/FD-012/FD-013 carry capsule-level contracts (acceptance criteria and evidence plans) in `docs/specs/0.4.1/rc0-scope.md`; FD-013 must not start before FD-010 is done.
