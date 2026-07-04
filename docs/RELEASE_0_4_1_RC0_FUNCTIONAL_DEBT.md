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
| FD-006 | Command help vocabulary | Generalize controlled-value diagnostics beyond `docs.register` where other commands enforce closed token sets. | T-0494 fixes the acute docs-register loop; the same pattern should be audited across command families. | `0.4.1-rc.0` |
| FD-007 | Handoff workflow | Fix `handoff update` so it patches the current profile/project handoff instead of overwriting it with unrelated generic placeholders. | Stable 0.4.0 use found this was the highest-friction repeated bug; it forced manual AGENT_HANDOFF rewrites. | `0.4.1-rc.0` |
| FD-008 | Docs registry correction | Add a general registry metadata correction path such as `docs.mark --status <any>` with guards or `docs.register --force-update`. | Operators need a CLI path for ordinary mistakes such as canonical -> reference without hand-editing `.hadara/docs-registry.json`. | `0.4.1-rc.0` |
| FD-009 | Task schema vocabulary | Surface TASK.md controlled tokens for Inputs / Constraints and Risks / Follow-ups before finalize failure. | Users currently learn role/state tokens by failing harness/finalize after writing prose. | `0.4.1-rc.0` |
| FD-010 | Lifecycle ergonomics | Consider a guarded low-ceremony finalize path for obvious clean cases, such as `task finalize --execute --auto`. | Dry-run -> copy plan hash -> execute is safe but repetitive across many small known-good capsules. | `0.4.1-rc.0` |

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
| Auto-correction for aliases | Deferred | T-0494 reports suggestions only; automatic token rewriting remains a separate design decision. |

## Review Trigger

Before preparing `0.4.1-rc.0`, open capsules for FD-001 through FD-010 or explicitly reclassify any item as deferred with evidence.
