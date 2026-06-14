# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `docs patch --execute` uses the shared atomic text write helper instead of direct overwrite. | Met | `src/services/managed-sections.ts`; `command:T-0314:validation`. |
| AC-2 | Execute write failure reports an error and preserves the target file. | Met | `tests/unit/docs-patch.test.ts`; focused tests passed. |
| AC-3 | Targeted and full validation pass with refreshed built output. | Met | Docker focused 4 files / 31 tests; Docker full 118 files / 763 tests; `distLooksStale:false`. |
| AC-4 | Built CLI dry-run/hash/execute smoke passes for `docs patch`. | Met | Built smoke returned `{"ok":true,"issues":0,"changed":true,"contains":true}`. |
| AC-5 | Evidence and handoff are updated. | Met | `command:T-0314:validation`; Project State, Agent Handoff, and Development Slices updated. |
