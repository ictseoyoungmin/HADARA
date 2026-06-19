# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara context slice --path <path> --symbol <name> --json` returns a bounded original-text symbol neighborhood when C2 finds the symbol. | Met | Unit test and built CLI symbol smoke; `ev:T-0370:70db496bc8f5489c8a6cb5b1`. |
| AC-2 | Missing symbols return structured `CONTEXT_SLICE_SYMBOL_NOT_FOUND` issues without mutation. | Met | `tests/unit/context-slice.test.ts`; `ev:T-0370:70db496bc8f5489c8a6cb5b1`. |
| AC-3 | `hadara context slice --task T-XXXX --candidate <candidate-id> --json` resolves C3 `sliceCandidates[]` and delegates to explicit-range, managed-section, or symbol-neighborhood behavior. | Met | Injected unit test and built CLI candidate smoke; `ev:T-0370:70db496bc8f5489c8a6cb5b1`. |
| AC-4 | Unknown candidates return structured candidate issues without broad reads or mutation. | Met | `tests/unit/context-slice.test.ts`; `ev:T-0370:70db496bc8f5489c8a6cb5b1`. |
| AC-5 | `hadara.contextSlice.v1`, CLI metadata, and docs include symbol and context-candidate strategy support. | Met | Schema/registry/docs updates plus focused schema/registry tests; `ev:T-0370:70db496bc8f5489c8a6cb5b1`. |
| AC-6 | Docker validation, built CLI smoke, evidence, shared docs, and close audit are complete. | In Progress | Validation/evidence/shared docs done; close/audit pending. Evidence: `ev:T-0370:70db496bc8f5489c8a6cb5b1`, `ev:T-0370:1e6a0f08e520489f9d6f3100`. |
