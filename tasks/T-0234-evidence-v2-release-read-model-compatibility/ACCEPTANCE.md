# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Package smoke and clean-checkout smoke evidence attachments write v2 through the canonical writer. | Done | `attachReducedSmokeEvidence()` uses `appendEvidenceTextArtifact()` and focused smoke tests expect v2 records. |
| AC-2 | Release artifact evidence attachment writes v2 through the canonical writer. | Done | `attachReleaseArtifactEvidence()` uses `appendEvidenceTextArtifact()` and release artifact tests expect v2 records. |
| AC-3 | Release readiness reads v1/v2 mixed evidence and accepts v2 persisted ids as strict proof when linked artifact checks pass. | Done | `release-dry-run` v2 fixture passes; operational debt/release gate suite still passes. |
| AC-4 | Existing v1 release evidence fixtures remain compatible. | Done | Existing release dry-run and operational debt v1 fixture tests still pass. |
| AC-5 | Focused and full validation are recorded. | Done | Focused suite passed 7 files / 73 tests; Docker sync-build passed 91 files / 600 tests. |
| AC-6 | Handoff and roadmap docs are updated. | Done | Project State, Agent Handoff, Development Slices, and Task Board updated. |
