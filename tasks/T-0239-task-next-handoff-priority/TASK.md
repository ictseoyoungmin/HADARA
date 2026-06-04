# T-0239 Task Next Handoff Priority

## Metadata

| Field | Value |
|---|---|
| ID | T-0239 |
| Title | Task Next Handoff Priority |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Make `task next` respect current handoff priority before legacy Task Board fallback. | The current HADARA-dev `task next` points at old Partial backlog even though handoff names the current roadmap direction. |

## Scope

| In Scope | Reason |
|---|---|
| Add and follow a scoped task-next handoff-priority refactor spec. | Recommendation policy needs to be explicit before implementation. |
| Update `hadara.task.next.v1` additively so handoff current work can be the primary recommendation. | Preserve compatibility while making the session entry point reliable. |
| Keep legacy incomplete Task Board rows visible as fallback/backlog. | Operators still need to see old Partial rows without letting them override current handoff. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Reclassifying, closing, or deleting old Task Board rows such as T-0006. | That is separate remediation work. |
| Automatically creating a new Task Capsule from `task next`. | `task next` remains read-only. |
| Rewriting roadmap/handoff documents from the command. | This capsule changes the read model only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-04 | In Progress | Scope fixed to handoff-first `task next` policy and additive report metadata. | Capsule update |
| 2026-06-04 | Done | Handoff-first `task next` policy implemented, documented, and validated. | Focused Docker tests, Docker sync-build, and built CLI smoke evidence. |
