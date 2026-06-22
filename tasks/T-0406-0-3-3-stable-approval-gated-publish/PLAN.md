# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read T-0405 readiness handoff and release docs. | Done | `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md`, `tasks/T-0405-0-3-3-stable-release-readiness-refresh/HANDOFF.md` |
| 2 | Stage T-0406 publish capsule and package-facing docs. | Done | T-0406 capsule docs, `README.md`, `docs/RELEASE_READINESS.md` |
| 3 | Operator logs into npm and runs publish helper. | Done | `ev:T-0406:8f35fa0295e34e93973136fa` |
| 4 | Verify npm registry and dist-tags after publish. | Done | `ev:T-0406:630c4761c6c44250943f86e0` |
| 5 | Attach evidence, update shared state, and finalize. | Done | `ev:T-0406:b284424247cc414ba9787fc4`; close is handled by guarded finalize after this doc update. |
