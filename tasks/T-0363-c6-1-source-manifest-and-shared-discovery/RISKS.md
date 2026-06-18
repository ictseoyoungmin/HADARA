# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Metadata-only comparison can miss content changes that preserve size and mtime. | Cache consumers may reuse stale extraction data in rare edge cases. | Medium | Carry forward prior content hashes only when metadata matches; defer content-hash computation to warm cache/index paths that can pay the read cost. | Open for C6.2/C6.3 |
| A broad recursive walk can still be expensive on mounted filesystems. | First manifest build may remain slower than desired on `/mnt/f`. | Medium | Ignore local/cache/build directories, classify only relevant sources, enforce budgets, and reuse the manifest in later cache paths. | Mitigated in C6.1 foundation |
| Schema drift could break future cache consumers. | Graph/code-index/cache integration may disagree on manifest shape. | Low | Register schema runtime/index fixtures and add focused schema/discovery tests. | Mitigated |
| Cache write boundaries could blur with read-only context commands. | Context commands might mutate local state unexpectedly. | Low | This slice adds no cache writes or public read command mutation; C6.2 must define explicit cache store/status semantics. | Mitigated |
