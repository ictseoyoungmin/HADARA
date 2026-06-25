# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prepare `0.3.4-rc.0` as agent UX hardening, not a broad feature release. | Accepted | The 0.3.4 line is based on HADARA development dogfooding findings: make the existing lifecycle/context/release flows easier for agents to use. | docs/RELEASE_NOTES.md |
| D-2 | Keep stable install examples on `hadara@0.3.3` until the approval-gated rc publish completes. | Accepted | README is uploaded to npm and must not imply unpublished `0.3.4-rc.0` is installable from the registry. | README.md |
| D-3 | Defer npm publish to a follow-up capsule with explicit operator approval. | Accepted | Release mutation must remain separated from source readiness. | docs/RELEASE_READINESS.md |
