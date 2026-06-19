# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Default Session Start may consume warm graph-core cache only when cached source-manifest fast freshness is a hit. | Accepted | This gives C5 richer warmed context without reintroducing default live graph scans on mounted workspaces. If the proof is missing, Session Start keeps the bounded no-live fallback. | `ev:T-0379:fb174f9ca4254d2b9aa4bec9` |
| D-2 | `--include-code` Session Start consumes a fresh code-index shard read-only when available, but does not live-build code index by default. | Accepted | Code-aware context can be fast after explicit warm execute, while missing/stale code cache degrades instead of making the default startup path scan source files. | `ev:T-0379:fb174f9ca4254d2b9aa4bec9` |
