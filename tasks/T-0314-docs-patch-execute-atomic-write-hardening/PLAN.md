# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and active capsule. | Done | `.hadara/context/HADARA_CONTEXT.md`, state docs, SOP, task workflow docs, and T-0314 scaffold reviewed. |
| 2 | Implement atomic managed patch execute write. | Done | `src/services/managed-sections.ts` now uses `atomicWriteTextFile()`. |
| 3 | Add focused regression coverage. | Done | `tests/unit/docs-patch.test.ts` covers atomic rename failure preservation and temp cleanup. |
| 4 | Run focused, full, and built CLI validation. | Done | `command:T-0314:validation`. |
| 5 | Update capsule and shared handoff state. | Done | T-0314 capsule docs, Project State, Agent Handoff, and Development Slices updated. |
