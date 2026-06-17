# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Direct `appendEvidenceWithResult({ result:'failed', outcome:'passed' })` fails with `EVIDENCE_RESULT_OUTCOME_MISMATCH`. | Done | Focused test in `tests/unit/evidence-json.test.ts`; `ev:T-0332:5423461e33ee464ebb680fa5`. |
| AC-2 | Core writer mismatch fails before `EVIDENCE.md` or `evidence.jsonl` append. | Done | Focused direct writer test asserts no JSONL append and no Markdown row for the rejected summary. |
| AC-3 | JSON collect report paths that call the core writer directly return `EVIDENCE_RESULT_OUTCOME_MISMATCH` issues. | Done | Focused collect-report test passed. |
| AC-4 | CLI `evidence add-command` continues to use the same compatibility rule. | Done | Built CLI mismatch smoke rejected with `EVIDENCE_RESULT_OUTCOME_MISMATCH`; `ev:T-0332:c212c78562c04c6da413ded7`. |
| AC-5 | Work Item B implementation status is reviewed and residual deferred items are documented. | Done | Review recorded in `DECISIONS.md` and `HANDOFF.md`: initial writer stabilization is implemented; rebuild/check-id/subject/addCommand v2 report naming remain deferred candidate scope. |
