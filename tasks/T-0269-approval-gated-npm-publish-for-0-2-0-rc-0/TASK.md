# T-0269 Approval-Gated npm Publish for 0.2.0-rc.0

## Metadata

| Field | Value |
|---|---|
| ID | T-0269 |
| Title | Approval-Gated npm Publish for 0.2.0-rc.0 |
| Status | Draft |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Prepare the approval-gated npm publish path for `hadara@0.2.0-rc.0`. | Recheck release dry-run/publish dry-run readiness, confirm token/approval conditions, update README for publish-state install guidance, and stop before any real publish mutation unless explicitly approved. |

## Scope

| In Scope | Reason |
|---|---|
| Clean HEAD and readiness checks. | Publish must start from a clean committed source state. |
| Release dry-run and publish dry-run rechecks. | Confirms readiness before any approval-gated mutation path. |
| Token/approval condition check by name only. | Confirms publish blockers without exposing token values. |
| README install/npx guidance update for `0.2.0-rc.0`. | Aligns public docs with the intended RC publish state. |
| Publish evidence planning. | Defines what must be attached after an approved publish. |
| Handoff/project/release docs updates. | Keeps current state honest while publish remains blocked. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No publish execution | Template boundary. |
| No token value disclosure | Token presence may be checked by name, but token values must not be printed or committed. |
| No registry mutation | Template boundary. |
| No GitHub Release creation | Template boundary. |
| No Docker image build | Template boundary. |
| No PyPI upload | Template boundary. |
| No release mutation without explicit operator approval | T-0269 can prepare and report; real npm publish requires a separate explicit approval step and fresh evidence after README changes are committed. |

## Status

Draft

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold from template. | Template defaults. |
| 2026-06-05 | Draft | Created approval-gated publish capsule and confirmed pre-capsule HEAD was clean. | `git status --short` returned no output before T-0269 task creation. |
| 2026-06-05 | Draft | Re-ran release dry-run and publish dry-run. | Release dry-run ready; publish dry-run ok with token absence warnings only. |
| 2026-06-05 | Draft | Updated README for `0.2.0-rc.0` publish-state install guidance and top asset placement. | `README.md`, `docs/assets/hadara_sub_right_name.png`. |
