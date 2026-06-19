# T-0378 Bounded C5 Session Start MVP

## Metadata

| Field | Value |
|---|---|
| ID | T-0378 |
| Title | Bounded C5 Session Start MVP |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Add a bounded read-only `hadara session start --json` MVP. | Compose the existing C3 context pack and state projection into a session-start packet without independent scans, writes, shell execution, or hidden cache updates. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.sessionStart.v1` service/report. | C5 needs a high-level resume packet that agents can call instead of broad manual reads. |
| Public `hadara session start --json` CLI command. | The spec names this as the C5 consumer surface. |
| Strict bounded defaults and degraded metadata. | Mounted workspaces must not hang when warm cache is absent or partial. |
| Schema, command registry, and focused tests. | The new public JSON surface needs contract coverage. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Cache writes or background warm. | Read commands must remain non-mutating; cache writes stay under explicit warm execute. |
| Broad raw source slices. | Session start should return read plans and slice commands, not raw source text. |
| Model summarization or provider calls. | C5 MVP is deterministic and local. |
| Full performance harness changes. | Existing C6 performance script remains the measurement surface; this task adds bounded behavior and smokes. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | task create |
| 2026-06-19 | In Progress | Started bounded C5 Session Start MVP implementation. | T-0378 |
| 2026-06-19 | Done | Implemented bounded default `hadara session start --json`, schema/registry coverage, Docker validation, built smoke, and shared docs. | `ev:T-0378:b3e1cc3b1b6d44b4a68c9bf0`, `ev:T-0378:2c321128b97c4efda50ee1ba`, `ev:T-0378:dd42b8f8ded34d988a2090a1` |
<!-- hadara:managed:end task-status-history -->
