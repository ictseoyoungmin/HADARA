# Decisions

## D-001: Design Before Execution

T-0125 defines the future executable package-smoke boundary before adding any command that creates package artifacts. This keeps the current release gate read-only and avoids silently introducing release/package execution through a planning capsule.

## D-002: Reduced Public Evidence, Private Raw Artifacts

Future executable package smoke evidence should commit only reduced public JSON/text summaries that pass existing public artifact policy. Raw package tarballs, install directories, npm logs, and full command transcripts belong in disposable workspace or ignored private/local storage unless a later capsule explicitly defines a safe public copy.

## D-003: Stable Readiness Marker

The release gate should use a stable check code for missing executable package-smoke artifact-boundary documentation so advisory and strict modes can report the same problem at different severities.
