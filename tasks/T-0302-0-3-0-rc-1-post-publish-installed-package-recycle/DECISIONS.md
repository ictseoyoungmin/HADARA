# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep only reduced recycle artifacts in the repository. | Accepted | The full temp dogfood projects are noisy and reproducible from the artifact reports. | `artifacts/recycle/recycle-key-artifacts.tgz`. |
| D-2 | Treat fresh-init doctor exit 7 as adoption friction, not a release-blocking rc.1 regression. | Accepted | Init succeeds, docs surfaces work, adding the expected context file makes doctor pass, and successful task lifecycle dogfood passed 10/10. | `artifacts/recycle/FINDINGS.md`. |
