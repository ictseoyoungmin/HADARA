# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| T-0358-D1 | Keep code-aware graph output opt-in with `--include-code`; default graph output remains C1-only. | Accepted | The C2 spec says graph integration must be additive and prefers the `context graph --include-code` option. | `02_Code_Link_Layer_Spec.md` CLI Surface and Graph Integration sections. |
| T-0358-D2 | Do not add dedicated `hadara code` commands in this capsule. | Accepted | The dedicated commands are candidates only, and this capsule can satisfy C2 integration through the existing context graph command. | `02_Code_Link_Layer_Spec.md` CLI Surface section. |
