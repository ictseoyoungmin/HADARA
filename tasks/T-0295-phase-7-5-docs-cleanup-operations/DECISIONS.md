# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `docs mark --execute` registry-only. | Accepted | Phase 7.5 cleanup status is metadata; document body or Required Reading edits must use the managed patch boundary. | `tests/unit/docs-mark.test.ts`; built CLI smoke |
| D-2 | Keep `docs archive` dry-run only. | Accepted | Archive execution would move/delete documents and needs stronger review gates than Phase 7.5 requires. | `tests/unit/docs-archive.test.ts` |
| D-3 | Require registered replacement targets for superseded docs. | Accepted | Prevents stale registry states that point at missing or untracked replacements. | `tests/unit/docs-mark.test.ts`; `tests/unit/docs-doctor.test.ts` |
| D-4 | Require explicit `--force-canonical` before superseding canonical docs. | Accepted | Canonical docs are protocol/state anchors and should not be silently retired. | `tests/unit/docs-mark.test.ts` |
