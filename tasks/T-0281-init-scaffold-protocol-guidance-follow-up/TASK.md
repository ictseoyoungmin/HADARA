# T-0281 Init scaffold protocol guidance follow-up

## Metadata

| Field | Value |
|---|---|
| ID | T-0281 |
| Title | Init scaffold protocol guidance follow-up |
| Status | Done |
| Created | 2026-06-07 |
| Updated | 2026-06-07 |

## Goal

| Goal | Notes |
|---|---|
| Align generated init protocol guidance with current lifecycle and experiment needs. | Add concise generated-doc guidance for evidence integrity, direct harness diagnostics, project-specific document registration, and multi-language local artifacts without changing runtime lifecycle semantics. |

## Scope

| In Scope | Reason |
|---|---|
| Generated `.gitignore` common multi-language local artifacts. | Prevent venv, Python caches, pytest/mypy/ruff caches, and SQLite scratch DBs from polluting initialized projects. |
| Generated SOP and AGENTS evidence rules. | Make the anti-false-completion discipline explicit for people and agents. |
| Generated workflow and validation docs. | Clarify that `task ready`/`task close` include done-level validation while `harness validate` remains a direct diagnostic command. |
| Close-source stability guidance in generated and root workflow docs. | Prevent unnecessary ready/close/audit repetition by making the "finalize docs before close" invariant explicit. |
| Root protocol docs mirror the generated guidance where applicable. | Keep HADARA-dev current docs consistent with generated scaffold expectations. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New lifecycle command behavior. | This task is documentation/template guidance only. |
| Broad init redesign or profile changes. | The basic/standard/governed profile split remains unchanged. |
| Historical task migration. | Existing historical capsules are not rewritten. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-07 | Draft | Initial task scaffold. | `task create` |
| 2026-06-07 | In Progress | Scope set for init scaffold protocol guidance follow-up. | T-0281 capsule docs |
| 2026-06-07 | Done | Finished task capsule. | `hadara task finish --execute` |
