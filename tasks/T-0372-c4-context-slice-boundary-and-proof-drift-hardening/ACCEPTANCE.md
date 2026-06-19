# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Context slice returns `ok:false`, `CONTEXT_SLICE_TOO_LARGE`, and no `slices[]` text when total payload bytes exceed the C4 byte budget. | Met | Unit test and built CLI smoke; `ev:T-0372:153fbfd1cc37407a99fd7ec1`. |
| AC-2 | Context slice rejects `.hadara/local/**` paths by default with `CONTEXT_SLICE_OUTSIDE_PROJECT`. | Met | Unit test and built CLI smoke; `ev:T-0372:153fbfd1cc37407a99fd7ec1`. |
| AC-3 | Done-level harness/protocol validation catches `ACCEPTANCE.md` table rows still marked `In Progress`. | Met | Harness/protocol tests; `ev:T-0372:153fbfd1cc37407a99fd7ec1`. |
| AC-4 | T-0370 AC-6 drift is repaired with stable wording that does not depend on volatile close evidence ids. | Met | T-0370 `ACCEPTANCE.md`; `ev:T-0372:153fbfd1cc37407a99fd7ec1`. |
| AC-5 | Validation evidence is attached and shared state docs are updated before finish/ready/close. | Met | `ev:T-0372:153fbfd1cc37407a99fd7ec1`; shared docs updated. |
