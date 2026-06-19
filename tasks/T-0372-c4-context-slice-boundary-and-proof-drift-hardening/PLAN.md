# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project, task workflow, C4, C6, validation, and security docs. | Done | Required-reading review in this session. |
| 2 | Enforce `MAX_SLICE_BYTES` as an error with no returned raw slice text when the payload is too large. | Done | `src/context/context-slice.ts`; `tests/unit/context-slice.test.ts`; `ev:T-0372:153fbfd1cc37407a99fd7ec1`. |
| 3 | Block raw context-slice reads from `.hadara/local/**` by default. | Done | `src/context/context-slice.ts`; `tests/unit/context-slice.test.ts`; `ev:T-0372:153fbfd1cc37407a99fd7ec1`. |
| 4 | Repair T-0370 AC-6 and harden Done-level acceptance validation against `In Progress` rows. | Done | T-0370 `ACCEPTANCE.md`; `src/harness/validate.ts`; `src/services/protocol-consistency.ts`; `ev:T-0372:153fbfd1cc37407a99fd7ec1`. |
| 5 | Run focused Docker validation, built CLI smokes, and `git diff --check`. | Done | `ev:T-0372:153fbfd1cc37407a99fd7ec1`. |
| 6 | Update capsule docs and shared state before finish/ready/close. | Done | T-0372 docs, Project State, Agent Handoff, and Development Slices updated. |
