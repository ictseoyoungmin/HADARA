# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release artifact execution refuses dirty git worktrees before npm pack. | Done | Built CLI returned `RELEASE_ARTIFACT_WORKTREE_DIRTY` with `npmPackExecuted:false`. |
| AC-2 | Guard is covered by tests and full validation. | Done | `tests/unit/release-artifact.test.ts` covers dirty worktree refusal; Docker sync-build passed 92 files / 612 tests. |
| AC-3 | Failed refresh evidence is resolved as expected guard behavior. | Done | Later passed release evidence records the intentional guard block. |
| AC-4 | Handoff records that actual release artifact refresh is deferred until a clean worktree. | Done | `HANDOFF.md` and `docs/AGENT_HANDOFF.md` updated. |
