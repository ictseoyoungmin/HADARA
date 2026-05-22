# Risks

| Risk | Mitigation |
|---|---|
| Preflight is mistaken for shell execution. | Report explicitly includes `willExecute: false`. |
| Denied commands do not map to CLI policy exit code. | Set exit code `2` for denied preflight. |
| Scope expands into approval prompts. | Only model `requires_approval`; do not implement prompting. |

