# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `docs.register` invalid controlled-token issues now include `field`, `received`, `allowedValues`, and optional `suggestion`. | `ev:T-0494:e05199a733814fbe97abda8a`, `ev:T-0494:87f93c47f42448a0a0fcdf27` |
| `help command docs.register` and `docs register --help` both print the controlled vocabulary. | `ev:T-0494:e05199a733814fbe97abda8a`, `ev:T-0494:87f93c47f42448a0a0fcdf27` |
| `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` captures reviewer and dogfood functionality to route into `0.4.1-rc.0`. | `ev:T-0494:26e15e37462143e08ef4d154` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Choose the next `0.4.1-rc.0` docs-governance capsule from the functional debt document. | The acute docs-register loop is fixed; remaining work is planned command implementation and docs lifecycle cleanup. | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md`, `docs/REQUIRED_READING_LIFECYCLE_FOLLOWUP.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| T-0494 does not auto-correct aliases. | Operators still need to rerun with the suggested token. | Keep suggestions explicit until alias rewriting has its own acceptance and safety boundary. |
| Host workspace still lacks local `vitest`/`tsc` dependencies. | Host focused validation fails without Docker/ext4 setup. | Use the Docker/ext4 validation path or install host dependencies intentionally. |
