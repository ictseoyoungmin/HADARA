# HADARA 0.4.0 Productization Redesign Specs

This package rewrites the HADARA redesign specs as a **breaking 0.4.0 productization protocol line**.

The design intentionally removes the dual-layout / legacy migration model. A HADARA 0.4 project has one project scaffold model, one Task Capsule schema, one close-source contract, and one read-map model.

Canonical location:

```text
docs/specs/0.4.0/productization-redesign/
```

## Core Decisions

- HADARA 0.4.0 is a breaking project protocol line.
- 0.4 mutation commands must not silently mutate 0.3.x projects.
- The 0.4 Task Capsule is the only task schema for new 0.4 projects.
- There is no user-facing `compact` / `expanded` layout selection.
- `hadara task create "title" --json` creates the 0.4 Task Capsule.
- `AGENTS.md` is an invariant / safety contract only, not a command cookbook.
- `AGENTS.md` keeps compact Required Reading, reading tiers, and top-level safety rules.
- `docs/HADARA_WORKFLOW.md` owns project start, lifecycle, context, evidence, repair, docs read-map, document timing, and useful CLI guidance.
- Authoring ownership guidance is centralized in `docs/HADARA_WORKFLOW.md` and registries, not repeated as long comments in every Task Capsule.
- `docs/specs/**` documents are design source documents governed by registry metadata, not filename conventions.
- `TASK.md` has exactly one canonical TaskStatus owner.
- Close proof is projected into `EVIDENCE.md`, not written into close-source docs.
- `evidence.jsonl` remains canonical append-only evidence.
- `docs/TASK_BOARD.md` is an index / consistency source, not a whole-file close-source hash.
- Task-local `HANDOFF.md` is continuation guidance and is not a default raw close-source file.
- Generated product defaults must stay generic and must not include HADARA-dev-specific validation, Docker, npm, release, repository, or project-history details.

## Important CLI Note

This spec package separates:

- **current known 0.3.4 CLI baseline** — commands already documented in the repository at the time this package was drafted;
- **proposed 0.4.0 CLI surfaces** — commands or diagnostics that must be implemented by this redesign.

No `--layout compact`, `--layout expanded`, `task layout`, or `task migrate-layout` surface is part of this redesign.
