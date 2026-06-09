# T-0284 Implement evidence append idempotency and locking

## Metadata

| Field | Value |
|---|---|
| ID | T-0284 |
| Title | Implement evidence append idempotency and locking |
| Status | Done |
| Created | 2026-06-09 |
| Updated | 2026-06-09 |

## Goal

| Goal | Notes |
|---|---|
| Evidence append hardening | Make evidence writes idempotent only when explicitly keyed, lock task-scoped appends, and return the exact appended or existing record to JSON callers. |

## Scope

| In Scope | Reason |
|---|---|
| Evidence append service | Remove the append-then-read-last race and guard JSONL/Markdown writes with a task-local lock. |
| Evidence CLI surface | Add optional `--idempotency-key` support to evidence write commands. |
| Focused tests | Cover explicit-key dedupe and keyless append-only behavior. |
| Command docs/templates | Document the new idempotency option where evidence command usage is described. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad evidence proof/freshness features | Covered by a later rc3 proof-status capsule. |
| Distributed locking | This slice is local-filesystem locking only, matching the rc3 reliability spec. |
| Evidence schema migration | Existing records remain readable; no broad migration is performed. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-09 | Draft | Initial task scaffold. | Scaffold created. |
| 2026-06-09 | In Progress | Implementing rc3 evidence append idempotency and locking from the dogfooding reliability spec. | Pending validation. |
| 2026-06-09 | Done | Evidence append idempotency, task-scoped locking, CLI idempotency key support, docs/templates, focused tests, and built-CLI smoke are complete. | T-0284 evidence records; `/tmp` build and focused tests passed; Docker baseline blocked by daemon timeout. |
