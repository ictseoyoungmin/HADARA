# SECURITY_MODEL

## Default Mode

| Mode | Rule | Approval Boundary |
|---|---|---|
| Assisted development | Read, edit, and validate deliberately. | Ask for explicit approval before risky mutation. |

## Invariants

| Invariant | Rule | Evidence |
|---|---|---|
| Secrets | Do not write secrets, private logs, environment dumps, or token values into committed files. | Review changed files before completion. |
| Local state | Keep machine-local state under ignored local paths such as `.hadara/local/`. | `.gitignore` includes HADARA local state. |
| Evidence | Public evidence must be reduced and safe to commit. | Evidence files do not contain private logs or secrets. |
| Commands | Do not run dangerous or destructive commands unless explicitly requested and approved. | Risky commands are recorded in task evidence. |

## Special Checks

| Check Type | Add To | When Required |
|---|---|---|
| Security smoke | `docs/TEST_STRATEGY.md` | The project has documented security boundaries. |
| Secret scan | `docs/TEST_STRATEGY.md` | The project handles credentials, tokens, private logs, or environment dumps. |
| Permission review | Task Capsule evidence | A change modifies write, delete, publish, or deploy behavior. |
