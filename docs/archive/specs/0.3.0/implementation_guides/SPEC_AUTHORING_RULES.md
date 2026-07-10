# Phase 7 Spec Authoring Rules

## Purpose

Phase 7 specs must give implementers a concrete frame, not vague feature requests.

Every Phase 7 spec should answer:

```text
What files change?
What types are expected?
What CLI commands exist?
What JSON schemas are introduced?
What behavior is explicitly allowed/disallowed?
What tests prove the behavior?
What acceptance criteria close the task?
```

## Required Sections for New Phase 7 Specs

Use this structure:

```md
# Phase 7.x — Name

## Status
## Problem
## Goal
## Non-Goals
## Existing Surface Integration
## Files to Add or Change
## Type / Schema Model
## CLI Behavior
## JSON Contracts
## Safety and Boundary Rules
## Tests
## Documentation Updates
## Acceptance Criteria
## Validation
```

## Required Specificity

Avoid vague language:

```text
Bad: Implement a docs registry.
Good: Add `.hadara/docs-registry.json` with `schemaVersion: hadara.docs.registry.v1`, implement `docs list/doctor/explain`, seed it from init profiles, and test missing registry/missing file/canonical conflict cases.
```

```text
Bad: Improve help.
Good: Replace default flat help with registry-backed lifecycle help; add `hadara commands --json`; assert every public dispatchable command has one registry entry.
```

## Schema Rule

Every new public JSON report needs:

```text
- schema fixture under src/schemas/
- schema-index entry
- docs/SCHEMAS.md update
- focused contract test
- CLI smoke evidence
```

## Write Boundary Rule

Every write-capable command must state:

```text
- default mode: dry-run or execute
- exact files it may write
- whether before-hash is required
- what happens on hash mismatch
- whether it can touch user-authored prose
- whether it can run external subprocesses
```

## Documentation Honesty Rule

Docs must distinguish:

```text
planned
implemented
published
operator-approved
```

Do not describe planned commands as available.
Do not describe source candidates as published unless publish evidence exists.
Do not imply Phase 7.x labels are npm prerelease labels.
