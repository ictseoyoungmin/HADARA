# HADARA 0.3.1 Phase 8 State Governance Program

## Status

Planned specification for the 0.3.1 line.

Phase 8 promotes the temporary Work Item A and Work Item F design notes into an implementation program. It is the first post-0.3.0 line and should not be treated as an npm prerelease label by itself.

## Release Rule

Phase 8 implementation may produce a 0.3.1 release candidate only after the planned rc1 implementation capsules close valid and an explicit release-readiness capsule approves packaging work.

Do not publish after individual Phase 8 implementation tasks. Publish remains approval-gated and release-capsule scoped.

## Thesis

HADARA 0.3.0 made the command, lifecycle, document registry, managed section, and release surfaces coherent enough for real agent use.

The 0.3.1 problem is subtler:

```text
HADARA can prove a task is Done and closed, but humans and agents can still leave
nearby Markdown state with stale lifecycle language.
```

Phase 8 optimizes for:

```text
status token clarity
close-state separation
document ownership clarity
operator-safe handoff state updates
installed-package recycle friction cleanup
read-only state consistency projection
advisory state verification
```

## Product Positioning

HADARA remains a project-local operating layer for evidence-backed agentic development.

For 0.3.1, the product promise is:

```text
HADARA tells an agent:
1. which status tokens are persistent,
2. which close states are derived from evidence,
3. which Markdown sections a worker may edit,
4. which status docs disagree,
5. which package-recycle findings are real product risks,
6. and which verification reports are advisory versus blocking.
```

## Source Inputs

| Source | Role |
|---|---|
| `docs/specs/tmp_dir_hadara_work_items_architecture_specs/shared/00_Shared_Schema_Glossary.md` | Source glossary for TaskStatus, CloseState, document ownership, and write boundaries. |
| `docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/A_Stable_Recycle_Findings_Cleanup_and_Status_Governance.md` | Source design for status governance and installed-package findings cleanup. |
| `docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/F_State_Consistency_Projection.md` | Source design for state consistency projection. |
| `tasks/T-0317-stable-0-3-0-post-publish-installed-package-recycle/FINDINGS.md` | Concrete dogfood findings that motivate Phase 8. |
| `docs/specs/0.3.0/` | Phase 7 structure and spec authoring precedent. |

## Phase Map

| Phase | Name | Primary Outcome |
|---|---|---|
| Phase 8.0 | Planning Staging and Registration Reset | Stage 0.3.1 specs, retire completed 0.3.0 implementation specs from active Required Reading, and route handoff to Phase 8. |
| Phase 8.1 | Status Token and Document Ownership Governance | Define and publish the canonical TaskStatus, CloseState, DocStatus, evidence outcome, ownership, and write-boundary policy in current docs. |
| Phase 8.2 | Task Handoff Close-State Governance | Make task-local handoff current-state distinguish persistent TaskStatus from derived CloseState and prevent stale pending-close wording. |
| Phase 8.3 | Installed-Package Findings Cleanup | Resolve or explicitly document the stable 0.3.0 exact npx/global PATH ambiguity and governed docs doctor warning. |
| Phase 8.4 | State Consistency Projection | Add a read-only projection that compares Task Board, task capsules, Project State, Agent Handoff, docs registry, release readiness, and close proof. |
| Phase 8.5 | State Verify and Advisory Gate Integration | Surface the projection through existing project-health or CI advisory reports without adding automatic repair. |

## Dependency Rules

Implement in order:

```text
8.0 planning staging
  -> 8.1 status/ownership policy
  -> 8.2 task handoff close-state governance
  -> 8.3 installed-package findings cleanup
  -> 8.4 state consistency projection
  -> 8.5 advisory integration
```

Rules:

| Rule | Reason |
|---|---|
| Do not implement state projection before status tokens are defined. | Projection issues need unambiguous token families. |
| Do not make `Closed` a persistent TaskStatus. | Close proof is derived from evidence and audit. |
| Do not make `audit-close` write Markdown. | It is a read-only proof check. |
| Do not let projection become a new source of truth. | It must be rebuildable from committed artifacts. |
| Do not fix installed-package findings by hiding failed evidence. | Failed or environment-bound findings remain visible and resolved explicitly. |
| Do not add automatic repair in Phase 8.4 or 8.5. | Repair is a later dry-run-first work item. |

## Non-Goals for Phase 8

| Non-Goal | Reason |
|---|---|
| Full project context graph | Work Item C is later and depends on status governance. |
| Code symbol indexing | Work Item D is later. |
| Context pack/session start | Work Item E is later. |
| Semantic retrieval | Work Item I is later and advisory only. |
| Automatic broad Markdown repair | State projection should explain drift first. |
| Release target config stabilization | Work Item H is independent and later. |
| CI template generation | Work Item G is independent and later. |
| Publish automation | Publish remains approval-gated. |

## Worker Ergonomics

Phase 8 specs should reduce the amount of judgment a worker spends at task start.

Each implementation capsule should state:

```text
Read first:
  - exact Phase 8 spec
  - exact current task capsule
  - exact code/doc files if implementation is required

Do not read by default:
  - completed Phase 7 release specs unless debugging history
  - temporary Work Item source notes after Phase 8 specs are staged
  - dashboard/TUI/MCP docs unless the capsule explicitly touches them

Validate with:
  - focused unit tests for the touched surface
  - git diff --check
  - task ready/close/audit for the capsule
```

## Canonical Status Model

Phase 8 keeps two state families separate.

| Family | Meaning | Source |
|---|---|---|
| `TaskStatus` | Persistent task status in `TASK.md` and `docs/TASK_BOARD.md`. | CLI task lifecycle bookkeeping. |
| `CloseState` | Derived proof state from close evidence and audit. | `task status`, `task audit-close`, proof status, or `state verify` read models. |

The desired task-local handoff current-state shape is:

```md
| Field | Value |
|---|---|
| Task | T-XXXX |
| TaskStatus | Done |
| Last Updated | YYYY-MM-DD |
```

Close proof state is intentionally omitted from the close-source handoff table. Operators should read it from audit/proof/state projection surfaces after close evidence is appended.

## 0.3.1 rc1 Boundary

The first 0.3.1 release candidate line should be scoped to status governance and state projection only.

The rc1 plan lives under:

```text
docs/specs/0.3.1/rc1/
```

## Documentation Registration Rule

After Phase 8 specs are staged:

| Document Set | Registration Direction |
|---|---|
| Completed 0.3.0 implementation specs | Remove from active Required Reading rows; keep as historical files. |
| Temporary Work Item A/F notes | Treat as source notes superseded by Phase 8 specs; do not make them default reading. |
| `docs/specs/0.3.1/00_HADARA_0_3_1_Phase_8_State_Governance_Program.md` | Register as conditional Required Reading for Phase 8 work. |
| `docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md` | Register as conditional Required Reading for 0.3.1 rc1 implementation work. |

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | Phase 8 program specs exist under `docs/specs/0.3.1/`. |
| AC-2 | Work Item A/F source notes are represented as concrete Phase 8 specs. |
| AC-3 | rc1 implementation docs split the work into capsule-sized tasks. |
| AC-4 | Persistent TaskStatus and derived CloseState are separate in the spec. |
| AC-5 | State projection is explicitly read-only and not a new source of truth. |
| AC-6 | Required Reading registration points future workers at Phase 8 docs, not completed 0.3.0 implementation specs. |

## Validation

Docs-only staging should run:

```bash
git diff --check
hadara docs list --json
hadara docs doctor --json
hadara docs required-reading --json
hadara harness validate --task T-0318 --level draft --json
```

Runtime implementation capsules will define focused TypeScript tests separately.
