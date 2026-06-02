# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `.hadara/local/cache/dashboard` projection store service exists. | Done | `src/services/dashboard-projection-store.ts` resolves the local root and reads/writes projection records. |
| AC-2 | Writes are boundary-checked and atomic. | Done | Store root/path checks reject traversal and outside roots; writes use temp-file plus rename. |
| AC-3 | Projection records are redacted and rebuildable local cache. | Done | Records use redacted project references and reject serialized raw project-root paths before writing. |
| AC-4 | Context export and git boundaries are preserved. | Done | `.gitignore` already ignores `.hadara/local/`; focused test asserts context export excludes projection cache markers. |
| AC-5 | Tests or explicit constraints are recorded. | Done | Focused test file added; `git diff --check` passed; full Docker validation blocked by external approval usage limit and recorded in TESTS/RISKS. |
| AC-6 | Evidence is attached. | Done | Public command evidence attached with `evidence.add-command` at 2026-06-02T02:55:34.424Z. |
| AC-7 | Handoff is updated. | Done | Task handoff records T-0218 as next step and carries forward the Docker validation gap. |
