# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0389 |
| TaskStatus | Done |
| Last Updated | 2026-06-20 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| `ContextPackItem.sourceHash` now prefers current raw-sliceable item file text when available. | `ev:T-0389:7e68c43ca20f44409d090d95` |
| Missing/non-sliceable paths retain graph node source-hash fallback. | `ev:T-0389:61eafa48eb174f6ea4051e36` |
| Focused and full Docker validation passed. | `ev:T-0389:61eafa48eb174f6ea4051e36`, `ev:T-0389:7e68c43ca20f44409d090d95` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run `task next --json` or choose the next release/readiness capsule. | T-0389 is a small 0.3.3 dogfood hardening follow-up. | docs/AGENT_HANDOFF.md, docs/PROJECT_STATE.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `context pack --task T-0388 --json` took about 30s on the mounted workspace during dogfooding. | Explicit broad context-pack reads remain slower on mounted filesystems when cache freshness misses. | Keep default `session start` bounded; use explicit warm/status/full-profile commands when broad scans are acceptable. |
