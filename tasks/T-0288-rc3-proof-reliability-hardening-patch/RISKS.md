# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| EVIDENCE.md and evidence.jsonl appends are lock-serialized but not crash-atomic. | A crash between the two appends can leave a half-written pair (one human row without a JSONL record, or vice versa). | Low | Lock removes interleaving; residual single-writer crash window remains. Follow-up capsule should make append crash-atomic (journal or JSONL-canonical with rebuildable EVIDENCE.md). | Open / deferred |
| Stale append lock still requires manual cleanup. | A killed writer leaves the lock directory; later writers fail closed after the 5s timeout. | Low | Timeout error now names the lock path and the `lock.json` owner pid for diagnosis; auto-removal intentionally deferred. | Mitigated (diagnosable) |
| Parallel regression test depends on tsx being installed. | Without `tsx` the multi-process test cannot spawn workers. | Low | Test resolves the tsx bin and `skipIf` skips cleanly when absent; tsx is a devDependency present in the npm-ci/Docker baseline. | Mitigated |
| Reproducible Docker `npm run dev:docker-sync-build` baseline not run this session. | rc3 publish readiness prefers the Docker baseline. | Low | Full `npm test` (103 files / 692 tests) plus tsc build passed in a `/tmp` npm-ci copy as the equivalent fallback; operator should still run the Docker baseline before publish. | Mitigated (equivalent fallback) |
