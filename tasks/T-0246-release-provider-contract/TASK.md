# T-0246 Release Provider Contract

## Metadata

| Field | Value |
|---|---|
| ID | T-0246 |
| Title | Release Provider Contract |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Define release-provider abstraction before Python release execution work. | Preserve npm behavior while making provider support levels explicit in release dry-run output. |

## Scope

| In Scope | Reason |
|---|---|
| `ReleaseProvider` interface and capability model. | Needed before non-npm release providers can be added safely. |
| `NpmReleaseProvider` wraps existing npm planning/status. | Keeps current npm-primary behavior behind the provider boundary. |
| `PythonReleaseProvider` reports detect/preview-only capability. | Establishes a safe placeholder before T-0247 parser work. |
| Release dry-run exposes `providerCapabilities`. | Operators can see detect/build/smoke/artifact/publish support by provider. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Python package metadata parsing beyond existing `pyproject.toml` presence detection. | Deferred to T-0247. |
| Python build, twine, pip smoke, PyPI token loading, or publish. | Explicitly out of scope for this provider-contract capsule. |
| Docker image build or GitHub Release creation. | Existing deferred/non-mutating release boundaries stay unchanged. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | Task created with HADARA CLI. |
| 2026-06-04 | Done | Finished task capsule. | `hadara task finish --execute` |

