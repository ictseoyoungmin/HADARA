# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation was previously blocked. | TypeScript/Vitest regressions could have remained before the follow-up validation window. | Medium | Docker sync-build passed 90 files / 582 tests with built CLI smoke `ok:true`; validation gap is closed for this follow-up. | Closed |
| Directory discovery still stats every task file. | NTFS refresh may remain costly with thousands of capsules, and should not run automatically on serve-start. | Medium | This slice avoids rereading unchanged bodies; T-0219 follow-up keeps serve-start warmup core-only and yields manual refresh between major stages, while future warm indexes/worker offload may still be needed for extreme mounts. | Tracked |
| mtime/size signals can theoretically miss same-size same-timestamp edits. | A changed task could be reused incorrectly. | Low | Spec allows mtime/size source signals; future stronger content hashing can be added if needed. | Accepted |
