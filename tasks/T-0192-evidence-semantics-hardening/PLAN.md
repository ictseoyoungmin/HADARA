# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | AGENTS-required docs and current Phase 4 handoff reviewed. |
| 2 | Harden normalized evidence identity. | Done | `sourceLine`, `fingerprint`, `idSource`, and `idStability` added. |
| 3 | Preserve lint parser source lines. | Done | Evidence lint passes actual JSONL line numbers into the normalizer. |
| 4 | Align release dry-run candidate selection. | Done | Dry-run now uses `isStrictReleaseEvidenceProof` before freshness checks. |
| 5 | Update docs/contracts and validate. | Done | Docker sync-build passed with 79 files / 548 tests. |
