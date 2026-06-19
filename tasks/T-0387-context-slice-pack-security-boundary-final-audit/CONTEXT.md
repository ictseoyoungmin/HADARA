# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Session context entry point and read-routing anchor from AGENTS.md. | Read |
| docs/PROJECT_STATE.md | Current project state and latest context-routing line status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, active task, known validation constraints. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules, Docker preference, evidence/close expectations. | Read |
| docs/SECURITY_MODEL.md | Raw read and local/private boundary constraints. | Read |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | Context pack candidate and read-boundary expectations. | Read |
| docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md | Raw slice adapter security boundary and bounded original-text contract. | Read |
| docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md | Current implementation audit and remaining T-0387 cleanup scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `context pack` slice candidates should not advertise paths that `context slice` will deny. | T-0387 scope and T-0376 review feedback. | Operators could copy a suggested command that fails or exposes boundary drift. |
| The existing public `.hadara` allowlist is intentional. | Current `context slice` behavior and security boundary review. | Over-tightening could hide compact context anchor/docs-registry paths that are treated as project-local public context. |
| Read commands must remain cache-write-free. | Context-routing specs and AGENTS.md workflow. | Hidden writes would violate cache-is-not-truth and explicit-warm boundaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not add an `--allow-local-cache` raw slice flag in 0.3.3. | T-0387 scope. | Keep raw source reads narrow by default. |
| Keep cache files lower authority than source files. | C6 cache specs and security model. | `.hadara/local/cache/**` must not become a context pack raw source. |
| Use Docker validation and refreshed `dist` for CLI code changes. | AGENTS.md and implementation SOP. | Host Node/npm state is not the baseline. |
