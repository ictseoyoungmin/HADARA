# Risks

| Risk | Mitigation |
|---|---|
| External agents may read stale paths from a manually edited active-run manifest. | Resolve canonical Task Capsule path from `taskId`, use it in resume guidance, and warn on mismatch. |
| Schema fixtures may be mistaken for runtime schema enforcement. | Keep fixture status explicit; runtime validation remains deferred. |
| `run-state resume` may sound executable. | Strengthen help and contract wording that it is read-only guidance only. |
