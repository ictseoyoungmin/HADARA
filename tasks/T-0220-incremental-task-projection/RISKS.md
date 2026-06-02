# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation could not run because Docker escalation is currently blocked by usage limit. | TypeScript/Vitest regressions may remain until the next approved Docker run. | Medium | Added focused tests and ran `git diff --check`; carry validation gap forward to T-0221. | Open |
| Directory discovery still stats every task file. | NTFS refresh may remain costly with thousands of capsules. | Medium | This slice avoids rereading unchanged bodies; future warm indexes or filesystem relocation may still be needed for extreme mounts. | Open |
| mtime/size signals can theoretically miss same-size same-timestamp edits. | A changed task could be reused incorrectly. | Low | Spec allows mtime/size source signals; future stronger content hashing can be added if needed. | Accepted |
