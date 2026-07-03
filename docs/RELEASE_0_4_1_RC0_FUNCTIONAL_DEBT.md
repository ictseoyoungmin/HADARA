# 0.4.1-rc.0 Functional Debt

## Purpose

This document tracks reviewer and dogfood feedback that should become functional work for `0.4.1-rc.0`, after stable `0.4.0` publication.

## Debt Queue

| ID | Area | Debt | Why It Matters | Target |
|---|---|---|---|---|
| FD-001 | Docs governance | Implement the planned `docs.complete-spec` command. | Completed implementation specs need an explicit lifecycle transition instead of remaining in active routing forever. | `0.4.1-rc.0` |
| FD-002 | Docs governance | Implement the planned `docs.mark-drift` command. | Drift metadata is already in registry entries, but operators still lack a focused command to mark existing documents. | `0.4.1-rc.0` |
| FD-003 | Required Reading | Define the completed-spec Required Reading lifecycle from `docs/REQUIRED_READING_LIFECYCLE_FOLLOWUP.md`. | Completed specs should move from active/default routing to historical or implemented-reference routing without manual guesswork. | `0.4.1-rc.0` |
| FD-004 | Product docs | Separate product documentation from HADARA-dev internal development and audit documents. | New users should land on Getting Started and Lifecycle Quickstart first; internal contracts should be discoverable but not mixed into onboarding. | `0.4.1-rc.0` |
| FD-005 | Docs registry projection | Review whether `docs/DOC_REGISTRY.md` should remain optional generated projection or become self-registered. | Current docs doctor can report the projection as unregistered; that is accepted behavior today but confusing in docs-governance work. | `0.4.1-rc.0` |
| FD-006 | Command help vocabulary | Generalize controlled-value diagnostics beyond `docs.register` where other commands enforce closed token sets. | T-0494 fixes the acute docs-register loop; the same pattern should be audited across command families. | `0.4.1-rc.0` |

## Current Resolution

| Item | State | Notes |
|---|---|---|
| `docs.register` controlled-value diagnostics | In Progress in T-0494 | This is handled immediately because it caused a real agent-loop failure during post-0.4.0 docs cleanup. |
| Auto-correction for aliases | Deferred | T-0494 reports suggestions only; automatic token rewriting remains a separate design decision. |

## Review Trigger

Before preparing `0.4.1-rc.0`, open capsules for FD-001 through FD-006 or explicitly reclassify any item as deferred with evidence.
