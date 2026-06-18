# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Extract release checks from level-2 headings in `docs/RELEASE_READINESS.md`. | Accepted | The current release-readiness document is heading/bullet based, not a structured table. Level-2 headings are stable enough for first-pass context graph routing. | docs/RELEASE_READINESS.md |
| D-2 | Connect only explicit known command mentions and explicit `ev:T-*` ids. | Accepted | Context graph edges should be defensible and avoid heuristic over-linking. | `tests/unit/context-graph-release-extractors.test.ts`; `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |
