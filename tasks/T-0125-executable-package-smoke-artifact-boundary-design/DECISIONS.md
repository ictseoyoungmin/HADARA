# Decisions

## D-001: Design Before Execution

T-0125 defines the future executable package-smoke boundary before adding any command that creates package artifacts. This keeps the current release gate read-only and avoids silently introducing release/package execution through a planning capsule.

## D-002: Reduced Public Evidence, Private Raw Artifacts

Future executable package smoke evidence should commit only reduced public JSON/text summaries that pass existing public artifact policy. Raw package tarballs, install directories, npm logs, and full command transcripts belong in disposable workspace or ignored private/local storage unless a later capsule explicitly defines a safe public copy.

## D-003: Stable Readiness Marker

The release gate should use `PACKAGE_SMOKE_ARTIFACT_BOUNDARY` as the user-facing check code and map failed/warning results to `PACKAGE_SMOKE_ARTIFACT_BOUNDARY_UNCLEAR` as the issue code. This keeps passed release reports from showing a failure-oriented check code while preserving a stable failure code for automation.
