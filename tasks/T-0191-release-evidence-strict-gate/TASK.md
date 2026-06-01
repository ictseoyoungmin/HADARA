# T-0191 Release Evidence Strict Gate

## Metadata

| Field | Value |
|---|---|
| ID | T-0191 |
| Title | Release Evidence Strict Gate |
| Status | Done |
| Created | 2026-06-01T03:31:00Z |
| Updated | 2026-06-01T03:39:52Z |

## Goal

| Goal | Notes |
|---|---|
| Apply strict release evidence proof checks to release readiness gates. | Release readiness must not accept summary/path wording alone for package smoke, clean-checkout smoke, or release artifact evidence. |

## Scope

| In Scope | Reason |
|---|---|
| Reuse the shared release proof predicate and artifact validation for release gate checks. | Keeps release readiness aligned with Phase 4 evidence semantics. |
| Add focused regression coverage for summary-only release evidence rejection. | Prevents conservative free-text/path matching from silently returning. |
| Tighten public docs that describe failed evidence resolution. | Reviewer feedback called out wording that could be read as conservative keyword matching. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Evidence v2 writer or migration implementation. | Covered by the T-0190 plan and deferred. |
| Publish, package execution, GitHub Release creation, Docker image build, or MCP release expansion. | Release gate work remains read-only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01T03:31:00Z | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-06-01T03:39:52Z | Done | Strict release evidence checks implemented and validated. | Docker sync-build passed with 79 files / 547 tests. |
