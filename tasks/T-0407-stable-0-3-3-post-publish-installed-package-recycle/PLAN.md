# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current release handoff/readiness context. | Done | `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md`, `tasks/T-0406-0-3-3-stable-approval-gated-publish/HANDOFF.md` |
| 2 | Stage T-0407 installed-package recycle capsule docs. | Done | `TASK.md`, `ACCEPTANCE.md`, `TESTS.md` |
| 3 | Verify npm registry and install `hadara@latest` in a temp consumer prefix. | Done | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| 4 | Run installed-bin lifecycle/context/init/cache smokes in a disposable project. | Done | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| 5 | Attach evidence, update shared state, finalize, and commit. | Done | `ev:T-0407:339f60f3bccd4aa09b5fcfaa`; close proof generated after this doc update. |
