# T-0024 Evidence Artifact Redaction

## Goal

Prevent public evidence artifacts from copying secrets or binary/private data into committed Task Capsule artifact storage.

## Scope

- Add reusable secret detection alongside existing summary redaction.
- Scan public text artifact contents before copying.
- Reject public artifacts when secret-like values are detected.
- Reject binary public artifacts until a safe binary policy exists.
- Preserve private evidence behavior: no committed artifact copy.
- Record policy in task and project security docs.

## Out of Scope

- Sanitized artifact copy generation.
- Encryption for private evidence.
- Full binary/screenshot artifact pipeline.
- CLI args parser extraction.

## Status

Done
