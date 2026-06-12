# T-0310 0.3.0-rc.2 Readiness and Publish Preparation

## Metadata

| Field | Value |
|---|---|
| ID | T-0310 |
| Title | 0.3.0-rc.2 Readiness and Publish Preparation |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.3.0-rc.2` for approval-gated npm publish. | Bump source/package metadata, align release docs, refresh release evidence, and prove publish dry-run without external mutation. |

## Scope

| In Scope | Reason |
|---|---|
| Package metadata and lockfile version bump to `0.3.0-rc.2`. | Establish the rc.2 source candidate before release evidence refresh. |
| README, release notes, release readiness, and helper example alignment. | Distinguish current published rc.1 from source rc.2 and keep operator publish instructions current. |
| Full Docker/check validation plus package, clean-checkout, release artifact, strict gate, release dry-run, and publish dry-run evidence. | Re-prove the rc.2 source state after T-0303 through T-0309 changes. |
| Extra workflow UX smokes for fresh init/docs, protocol migration execute, and task finish row preservation. | Cover the rc.2 user-facing workflow hardening surfaces. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No publish execution | Template boundary. |
| No npm publish unless the operator explicitly approves and runs the helper in execute mode. | T-0310 defaults to readiness and publish dry-run evidence. |
| No token loading | Template boundary. |
| No registry mutation | Template boundary. |
| No GitHub Release creation | Template boundary. |
| No Docker image build | Template boundary. |
| No PyPI upload | Template boundary. |
| No release mutation | Template boundary. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold from template. | Template defaults. |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
