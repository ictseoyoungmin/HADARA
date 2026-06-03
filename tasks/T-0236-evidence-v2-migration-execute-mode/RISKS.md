# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Hash guard is bypassed or too weak. | Migration could overwrite changed evidence. | Medium | Require `--before-hash` equal to current source hash before any write. | Mitigated in design/tests. |
| Execute rewrites unrelated files. | Violates HADARA bounded-write protocol. | Low | Service writes only selected `evidence.jsonl`; tests assert `EVIDENCE.md` is unchanged. | Mitigated in design/tests. |
| Invalid or mismatched lines are silently dropped. | Evidence history could be lost. | Medium | Execute refuses any skipped record except already-v2 lines. | Mitigated in design/tests. |
| Existing v2 records are reformatted or changed. | Durable ids/fingerprints could drift. | Medium | Preserve original v2 JSONL lines during mixed migration. | Mitigated in implementation. |
| `EVIDENCE.md` still lacks v2 ids. | Operators need JSONL/read-model output for durable ids. | High | Keep Markdown rewrite as separate future capsule. | Open follow-up. |
