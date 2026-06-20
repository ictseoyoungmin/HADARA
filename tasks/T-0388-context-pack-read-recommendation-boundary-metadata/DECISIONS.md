# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `sourceAccess.rawSlice` metadata to every builder-produced `ContextPackItem`. | Accepted | This separates graph relevance from raw slice readability without changing ranking membership. | `ev:T-0388:d63eccfe33c34ca3a3990647` |
| D-2 | Preserve `readFirst` / `readIfNeeded` item selection. | Accepted | Excluding non-sliceable paths could hide relevant context; consumers can now filter by metadata. | `ev:T-0388:d63eccfe33c34ca3a3990647` |
| D-3 | Keep `sliceCandidates` restricted to raw-sliceable paths. | Accepted | Suggested slice commands must remain executable through the raw slice adapter. | `ev:T-0388:d63eccfe33c34ca3a3990647` |
