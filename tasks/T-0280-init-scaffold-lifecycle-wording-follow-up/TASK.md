# T-0280 Init scaffold lifecycle wording follow-up

## Metadata

| Field | Value |
|---|---|
| ID | T-0280 |
| Title | Init scaffold lifecycle wording follow-up |
| Status | Done |
| Created | 2026-06-07 |
| Updated | 2026-06-07 |

## Goal

| Goal | Notes |
|---|---|
| Align generated init wording and current release docs with the post-rc.1 lifecycle and PyPI state. | Fix stale `hadara init` scaffold wording after T-0279 and reflect that `hadara==0.2.0rc1` is published on PyPI as well as TestPyPI. |

## Scope

| In Scope | Reason |
|---|---|
| `src/cli/init.ts` generated Markdown templates. | Future `hadara init` output must describe the current task workflow accurately. |
| Init tests. | Generated scaffold wording needs regression coverage. |
| Current release/status docs. | README, SOP, Project State, PyPI runbook, and handoff should not say rc.1 or PyPI are still pending. |
| T-0280 capsule docs and evidence. | HADARA protocol requires task-local scope, checks, and handoff. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Changing task lifecycle command behavior. | This is a wording/docs follow-up only. |
| Publishing npm, PyPI, TestPyPI, Docker, or GitHub Releases. | The user reported PyPI publish status; this task only records and aligns docs/tests. |
| Rewriting historical task evidence for T-0276 through T-0278. | Those records correctly describe what happened in those completed capsules at the time. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-07 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-07 | In Progress | Started follow-up wording alignment after reviewing generated init scaffolds. | T-0280 scope update |
| 2026-06-07 | Done | Finished task capsule. | `hadara task finish --execute` |
