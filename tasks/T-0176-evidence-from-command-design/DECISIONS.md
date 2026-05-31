# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0176-1 | Keep `evidence from-command` unimplemented in Phase 3. | Accepted | Shell-executing evidence capture needs a separate high-risk implementation capsule. | Design doc and CLI contract. |
| D-0176-2 | Require dry-run/execute separation and policy preflight for any future implementation. | Accepted | Preserves HADARA's explicit execution and evidence safety model. | Design safety gates. |
