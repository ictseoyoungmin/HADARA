# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Code index exposes default budget metadata matching the C6 spec defaults. | Done | `CODE_INDEX_DEFAULT_BUDGETS`; focused tests; built include-code budget smoke. |
| AC-2 | Code index limits indexed files, total bytes, and single-file full reads with explicit warning issues and degraded summary. | Done | `tests/unit/code-index.test.ts`; `CODE_INDEX_TOO_LARGE` tests. |
| AC-3 | Context graph include-code surfaces budget degradation through its existing code-index state source/issues. | Done | `codeIndexStateSource()` includes `budget`; built include-code budget smoke. |
| AC-4 | Focused/full validation and built CLI smokes are recorded as evidence. | Done | `ev:T-0359:5bd5521857864638b2abde7a`. |
| AC-5 | Shared state docs and task handoff point to the next C3 context-pack capsule after close. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, task `HANDOFF.md`. |
