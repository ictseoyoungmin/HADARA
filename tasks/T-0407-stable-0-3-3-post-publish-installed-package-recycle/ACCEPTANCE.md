# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `npm view hadara@0.3.3 version` returns `0.3.3`. | Met | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| AC-2 | npm dist-tags verify `latest=0.3.3` and `next=0.3.3-rc.0`. | Met | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| AC-3 | Temporary-prefix `hadara@latest` install succeeds and installed `hadara version --json` reports `packageVersion:"0.3.3"`. | Met | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| AC-4 | Installed `hadara help lifecycle` works. | Met | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| AC-5 | Installed `hadara init` works in a disposable project. | Met | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| AC-6 | Installed task lifecycle/finalize default flow works in the disposable project. | Met | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| AC-7 | Installed context graph, pack, slice, cache status/warm, and session start smokes work in the disposable project. | Met | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| AC-8 | Temporary consumer paths are cleaned up. | Met | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| AC-9 | Evidence is attached and T-0407 is ready for guarded close validation. | Met | `EVIDENCE.md`, `evidence.jsonl`; close proof is generated after this doc update. |
