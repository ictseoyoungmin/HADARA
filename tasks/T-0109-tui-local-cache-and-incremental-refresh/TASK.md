# T-0109 TUI Local Cache and Incremental Refresh

## Goal

Add a HADARA-native local cache layer for the terminal TUI so expensive read-model loads can be reused or refreshed incrementally while keeping the cache local, ignored, and outside committed project evidence.

## Scope

- Add `src/tui/cache.ts` with `.hadara/local/tui/` cache root resolution, `hadara.tui.cache.v1` internal records, task summary indexes, hash/mtime invalidation, and refresh modes.
- Support full, fast, detail, and none refresh semantics through an explicit cached read-model helper.
- Wire `hadara tui --cache` as an opt-in interactive terminal acceleration path while keeping default TUI and snapshot mode cache-free.
- Add focused tests for cache boundary, invalidation, selected-detail refresh, context-export exclusion, and CLI opt-in behavior.
- Record 1000-capsule benchmark evidence.

## Out of Scope

- TUI visual parity/theme work.
- Mouse or resize support.
- CLI subprocess compatibility adapter.
- Making `hadara.tui.cache.v1` a public registered schema or release gate.
- Any TUI task mutation, evidence attachment, handoff update, shell execution, provider call, MCP call, dashboard/server behavior, or release/package behavior.

## Status

Done
