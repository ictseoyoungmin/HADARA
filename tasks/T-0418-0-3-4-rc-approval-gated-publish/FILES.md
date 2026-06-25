# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| tasks/T-0418-0-3-4-rc-approval-gated-publish/* | Update | Scope and evidence for approval-gated npm RC publish. | In Progress |
| tasks/T-0418-0-3-4-rc-approval-gated-publish/PUBLISH_OPERATOR_STEPS.md | Add | Exact operator publish and verification commands. | Done |
| docs/AGENT_HANDOFF.md | Update if publish completes or handoff changes. | Keep next-agent state accurate. | Pending |
| docs/PROJECT_STATE.md | Update if publish completes or task state changes. | Track release-line state. | Pending |
| docs/TASK_BOARD.md | Update if task state changes. | Track active publish capsule. | Pending |
| docs/RELEASE_READINESS.md | Update after publish verification. | Record published RC status and dist-tags. | Blocked on operator publish |
| README.md / docs/RELEASE_NOTES.md | Update only after publish if package-facing status must change. | Avoid claiming unpublished package is available. | Blocked on operator publish |
