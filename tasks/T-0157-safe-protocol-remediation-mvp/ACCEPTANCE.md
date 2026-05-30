# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dry-run remediation reports planned actions and writes nothing by default. | Done | Unit test and built CLI temp-fixture smoke. |
| AC-2 | Execute mode can add a missing Task Board row for an existing Task Capsule. | Done | Unit test and built CLI temp-fixture smoke. |
| AC-3 | Execute mode can insert the missing Decisions table frame without deleting legacy prose. | Done | Unit test and built CLI temp-fixture smoke. |
| AC-4 | Execute mode can add or update the exact Project State HADARA profile row. | Done | Unit test and built CLI temp-fixture smoke. |
| AC-5 | Execute mode can create a missing task `evidence.jsonl` file. | Done | Unit test and built CLI temp-fixture smoke. |
| AC-6 | Unsupported fixes and missing required options fail with CLI errors. | Done | Unit and CLI tests. |
| AC-7 | Docker validation, built CLI smokes, evidence, and handoff are recorded. | Done | `EVIDENCE.md` 2026-05-30T09:12:11.532Z and 2026-05-30T09:14:55.846Z. |
