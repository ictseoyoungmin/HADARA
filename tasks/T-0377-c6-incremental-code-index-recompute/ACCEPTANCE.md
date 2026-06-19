# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `context cache warm --execute` can rebuild the code-index shard by reusing unchanged per-file code extraction summaries from local cache. | Met | `ev:T-0377:0dc1b0f01e0f4902aebe2b82`; `ev:T-0377:b6d0843a157743f7b681170c` |
| AC-2 | A changed source/test file invalidates and recomputes only its per-file summary while unrelated cached file summaries remain reusable. | Met | `ev:T-0377:0dc1b0f01e0f4902aebe2b82` |
| AC-3 | Missing, corrupt, or schema-mismatched per-file summaries fall back to live extraction for the affected files and produce clear cache metadata/issues without making cache authoritative. | Met | `ev:T-0377:0dc1b0f01e0f4902aebe2b82` |
| AC-4 | Read commands remain non-mutating: `context graph --include-code` may consume fresh merged code-index shards but does not write per-file cache records. | Met | `ev:T-0377:811d2af2ef5142b4be235cc2`; existing T-0375/T-0376 read-command no-write regressions remain in suite |
| AC-5 | Focused tests, build/check, built CLI smokes, evidence, shared docs, and lifecycle pre-close docs are complete. | Met | `ev:T-0377:d6bf4440e99f41938bef26e7`; `ev:T-0377:96876f787b9c4600a3b65f28`; finish executed |
