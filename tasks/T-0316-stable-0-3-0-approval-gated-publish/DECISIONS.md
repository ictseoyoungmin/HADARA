# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Stage README as post-publish stable package content before npm publish. | Accepted | npmjs renders the README from the published tarball; leaving "after publish" wording would be confusing immediately after successful publish. | User request / README.md |
| D-2 | Keep actual publish evidence out of T-0315 and attach it only to T-0316. | Accepted | T-0315 is a closed readiness capsule; T-0316 owns release mutation and registry verification. | AGENT_HANDOFF / TASK.md |
