# T-0275 Release Candidate 0.2.0-rc.1 Publish Readiness

## Metadata

| Field | Value |
|---|---|
| ID | T-0275 |
| Title | Release Candidate 0.2.0-rc.1 Publish Readiness |
| Status | Done |
| Created | 2026-06-06 |
| Updated | 2026-06-06 |

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.2.0-rc.1` so the operator can log in to npm and run the approval-gated manual publish helper. | Supersede the rc.0 publish candidate after T-0272 through T-0274 fixes, refresh package/release evidence, and stop before any registry or GitHub mutation. |

## Scope

| In Scope | Reason |
|---|---|
| rc.1 package metadata alignment. | Publish should target the fixed source state, not the superseded rc.0 candidate. |
| README/release docs/manual helper wording for rc.1. | Operators need install examples and publish instructions to match the intended version and task capsule. |
| Package self-dependency cleanup. | The source package must not publish with a runtime dependency on the previous `hadara` RC. |
| Fresh package smoke, clean-checkout smoke, release artifact, release dry-run, and publish dry-run evidence. | These are the evidence gates needed before an operator runs the manual publish helper after npm login. |
| Optional GitHub Release draft note preparation. | Keep the secondary release path ready without creating a release. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No publish execution | Template boundary. |
| No token loading | Template boundary. |
| No registry mutation | Template boundary. |
| No GitHub Release creation | Template boundary. |
| No Docker image build | Template boundary. |
| No PyPI upload | Template boundary. |
| No release mutation | Template boundary. |
| No npm login or token setup | Operator-only boundary; token values must not enter repository files or public evidence. |
| No `npm publish` | The operator will run the manual helper with `--execute` after reviewing the completed capsule. |
| No git push or tag push | Publishing source control state is an operator action unless explicitly requested. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold from template. | Template defaults. |
| 2026-06-06 | Draft | Created T-0275 and started rc.1 publish-readiness alignment. | `hadara task create --from release-read-model`. |
| 2026-06-06 | Done | Finished task capsule. | `hadara task finish --execute` |
