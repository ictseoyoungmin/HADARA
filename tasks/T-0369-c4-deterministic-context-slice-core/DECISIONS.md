# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement C4 core as a single-file, read-only slice service shared by CLI and future surfaces. | Accepted | This keeps the hot path O(one file read) and avoids forcing context graph rebuilds for raw text retrieval. | `src/context/context-slice.ts`, `src/cli/context.ts` |
| D-2 | Return original source text only, with source hash and line bounds, and avoid summaries or proof claims. | Accepted | C4 must be deterministic and auditable; summaries belong to later context-pack/agent layers. | `src/schemas/context-slice.schema.json`, `tests/unit/context-slice.test.ts` |
| D-3 | Reuse the existing managed-section parser instead of duplicating marker parsing. | Accepted | Existing parser already owns HADARA marker semantics and keeps managed-section slicing aligned with docs patch/list behavior. | `src/context/context-slice.ts`, `tests/unit/context-slice.test.ts` |
| D-4 | Defer symbol and context-pack candidate slicing to follow-up C4 capsules. | Accepted | Symbol slicing needs additional C2 range lookup, and candidate slicing needs C3 candidate-id lookup; mixing them into the core reader would widen this capsule. | TASK Out of Scope, command registry notes |
