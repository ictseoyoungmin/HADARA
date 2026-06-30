# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Legacy sidecar-oriented helper tests and upgrade-scaffold behavior may need a later cleanup pass. | Full-suite compatibility can surface legacy assumptions after the create-path change. | Medium | Kept lifecycle/read-model compatibility focused and recorded upgrade-scaffold as later legacy-boundary scope. | Accepted residual |
| Close-source hashing still lists legacy sidecar paths. | Future 0.4 capsules may carry stable missing-file hash entries until close-source contract work lands. | Medium | Leave close-proof placement/source contract to T-04A11/T-04A12. | Follow-up |
