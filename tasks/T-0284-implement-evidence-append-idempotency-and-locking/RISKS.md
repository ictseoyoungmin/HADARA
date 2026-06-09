# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docker baseline unavailable during this session. | Full repository confidence is lower than a normal Docker sync-build. | Medium | Accepted risk for T-0284 blocked evidence `ev:T-0284:d850455e2a7949a98657f6c4`: `/tmp` validation copy build and focused tests passed, `git diff --check` passed, and built CLI idempotency smoke passed; rerun Docker baseline later if daemon responsiveness returns. | Accepted |
| Local lock is not distributed. | It does not protect multiple machines or remote filesystems coordinating writes. | Low | Spec and docs state the lock is local-filesystem scoped; rc3 need is local parallel HADARA writes. | Accepted |
| Existing malformed evidence JSONL can still throw during duplicate lookup. | A corrupt evidence index can block writes with an unstructured parse error. | Low | Existing evidence lint/remediation surfaces remain responsible for malformed JSONL; this capsule does not broaden migration behavior. | Accepted |
