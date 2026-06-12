# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Registry package differs from source expectations. | Users would install a broken or metadata-poor rc.1. | Low | Verified npm view metadata, npx, global install, help, docs, migration, and lifecycle surfaces from the published package. | Mitigated |
| Fresh init appears unhealthy because doctor expects a context file not created by init. | New users may see an immediate non-zero doctor after successful init. | Medium | Recorded as adoption friction in `FINDINGS.md`; no blocker-level package regression found. | Open follow-up candidate |
| Temporary dogfood artifacts are too large/noisy for repository history. | Capsule becomes hard to review. | Medium | Kept reduced reports and a compressed key artifact bundle only. | Mitigated |
