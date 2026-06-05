# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Duplicate no-op could bypass readiness checks. | Close evidence could look current without validation. | Medium | Idempotency planning is computed only after done validation, evidence lint, and protocol doctor run. | Mitigated |
| Supersedes tags could hide the wrong close proof. | Audit could prefer stale evidence. | Medium | Audit selects latest non-superseded record and tests cover changed-source supersedes. | Mitigated |
| Legacy close records may not have durable ids. | Older records cannot always be superseded by id. | Medium | Compatibility fallback detects duplicate keys from summary hashes; supersedes ids are emitted where v2 ids exist. | Accepted |
| Close source hash includes Task Board. | Adding the next task can make the previous close proof stale. | High | T-0256 surfaces this as stale/supersedes metadata; handoff records T-0255 as expected stale after T-0256 Task Board changes. | Accepted |
