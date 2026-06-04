# T-0244 Multi-Ecosystem Release Target Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0244 |
| Title | Multi-Ecosystem Release Target Model |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Introduce a release target descriptor model without expanding release mutation. | Current release/package readiness is npm-primary; this capsule records that truth while allowing read-only detection of other ecosystems. |

## Scope

| In Scope | Reason |
|---|---|
| Wrap current npm package metadata in a `ReleaseTargetDescriptor`. | Keeps npm as the active primary provider while avoiding hard-coded target semantics in release dry-run output. |
| Keep GitHub Release and Docker target descriptors explicit. | GitHub Release is secondary and Docker remains deferred. |
| Detect `pyproject.toml` as a read-only Python preview target. | Addresses multi-ecosystem reviewer feedback without claiming PyPI support. |
| Add descriptor schema coverage and focused tests. | Prevents report drift and keeps target fields stable for future providers. |
| Mark package smoke as npm-provider-specific metadata. | Clarifies that `hadara package smoke` currently executes npm pack/install smoke only. |
| Update release readiness and project-state docs. | Operator docs must not overstate Python, Docker, or GitHub Release execution support. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| PyPI publish, Python build, pip install smoke, or twine checks. | This capsule is a read-only preview model, not a Python release implementation. |
| Poetry, Hatch, uv, Cargo, Maven, or generic archive execution providers. | Future provider capsules should add each ecosystem deliberately. |
| Docker build/publish or GitHub Release creation. | Existing release mutation boundary remains blocked/approval-gated. |
| Changing historical package-smoke evidence categories. | Existing evidence remains compatible; provider metadata adds precision for new reports. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-04 | In Progress | Scope fixed to release target descriptors, npm provider metadata, and Python preview-only detection. | Capsule update |
| 2026-06-04 | Done | Finished task capsule. | `hadara task finish --execute` |

