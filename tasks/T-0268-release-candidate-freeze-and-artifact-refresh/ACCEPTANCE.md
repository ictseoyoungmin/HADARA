# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release report/read-model behavior is implemented without publish or registry mutation. | Done | Release artifact and publish dry-run reports show no publish, GitHub Release, Docker build, or target execution. |
| AC-2 | Release boundary docs and schema fixtures are updated when output changes. | Done | README, release readiness docs, release notes, release/package-smoke tests, and RC metadata read-model checks updated. |
| AC-3 | Focused release/schema tests, full Docker check, and built CLI dry-run smoke are recorded. | Done | T-0268 evidence includes focused/full Docker validation, focused hotfix Docker checks, release dry-run, and publish dry-run. |
| AC-4 | Evidence is attached. | Done | `evidence.jsonl`, `EVIDENCE.md`, and public reduced artifacts under `artifacts/` are present and lint clean. |
| AC-5 | Handoff is updated. | Done | Shared docs and handoff updated during final lifecycle close. |
