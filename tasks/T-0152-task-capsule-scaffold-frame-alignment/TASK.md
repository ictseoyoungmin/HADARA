# T-0152 Task Capsule Scaffold Frame Alignment

## Metadata

| Field | Value |
|---|---|
| ID | T-0152 |
| Title | Task Capsule Scaffold Frame Alignment |
| Status | Done |
| Created | 2026-05-30 |
| Updated | 2026-05-30 |

## Goal

| Goal | Notes |
|---|---|
| Modernize newly generated Task Capsule files into table-first v2 frames. | This starts Phase 2 Project Protocol Consistency by making future capsule records easier for agents and doctors to parse. |

## Scope

| In Scope | Reason |
|---|---|
| Assimilate the Phase 2 protocol consistency plan into tracked docs. | Agents should follow main docs rather than relying only on the spec file. |
| Update new Task Capsule scaffold templates. | Future capsules should start with canonical tables for metadata, plan, context, acceptance, tests, risks, decisions, evidence, and handoff. |
| Preserve legacy capsule validation compatibility. | Existing capsules should not fail merely because they use old frames. |
| Add focused tests for scaffold frames and harness compatibility. | The change affects task creation and validation behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Auto-migrating existing Task Capsules. | Phase 2 reserves migration for a future non-destructive upgrade/remediation command. |
| Implementing protocol doctor or remediation commands. | Those are planned follow-up capsules T-0153 through T-0156. |
| Registering protocol consistency schemas. | T-0157 owns the JSON contract fixture work. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-30T05:57:58Z | Draft | Capsule opened and implementation started from Phase 2 plan. | Focused tests pending. |
| 2026-05-30T06:04:22Z | Done | Phase 2 docs assimilated, v2 scaffold implemented, compatibility preserved, and validation passed. | T-0152 evidence records. |
| 2026-05-30T06:32:00Z | Done | Dist/bin reflection verified after follow-up review. | `node dist/cli/main.js task create` smoke passed in hadara-dev and hadara-recycle. |
