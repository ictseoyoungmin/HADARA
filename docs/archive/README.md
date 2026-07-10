# HADARA Documentation Archive

This directory preserves completed or superseded planning material without presenting it as current implementation guidance.
Archive files are never default required reading. Use them only for historical investigation or when a current document links to a specific record.

## Committed archive map

| Previous location | Archive location | Reason |
|---|---|---|
| `docs/specs/0.3.0/` | `docs/archive/specs/0.3.0/` | Completed Phase 7 and 0.3.0 planning. |
| `docs/specs/0.3.1/` | `docs/archive/specs/0.3.1/` | Completed Phase 8/state-governance planning. |
| `docs/specs/0.3.3/` | `docs/archive/specs/0.3.3/` | Implemented context, lifecycle, and dogfood specifications. |
| `docs/specs/0.3.4/` | `docs/archive/specs/0.3.4/` | Completed agent-UX hardening specification. |
| `docs/specs/0.4.0/` | `docs/archive/specs/0.4.0/` | Implemented 0.4.0 productization and state-first design. |
| completed agent-UX / proof-reliability plans | `docs/archive/specs/agent-ux/`, `docs/archive/specs/rc3-proof-reliability/` | Completed supporting workstreams. |
| tracked root next/handoff refactor plan | `docs/archive/specs/root/` | Completed command-priority refactor planning. |
| `docs/REFACTOR_LOG.md` | `docs/archive/history/REFACTOR_LOG.md` | Historical log already classified never-default. |

Current `docs/specs/` retains only the active 0.4.1 scope line and the future 0.5 RFC line.

## Workspace-only archive

Previously ignored or untracked local planning/evaluation material is preserved under `docs/archive/local-specs/` (plus the pre-existing permission-bound `docs/archive/specs/temp_plan/`) and remains ignored by Git. This prevents local evaluation artifacts and image baselines from becoming release contents while removing them from active spec discovery.

## Rules

- Do not add archive documents to default Required Reading.
- Do not edit archived source to make it look current; add a current decision or spec instead.
- Active documents and command registry entries must use the archive path when they intentionally reference preserved history.
- Historical Task Capsules may keep their original path text; this map is the compatibility pointer.
