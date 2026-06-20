# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Make `task finalize` evaluate only the next necessary lifecycle reports. | Accepted | Fresh Draft tasks only need finish diagnostics; ready/close/audit composition is slower and can surface irrelevant guidance before finish is satisfied. | `ev:T-0399:ac178da8a71f482a9d8e702a` |
| D-2 | Reuse a single close dry-run to derive readiness. | Accepted | `task ready` already depends on close plan state, so deriving it from the already-built close report removes duplicate close-plan work in finalize without changing ready semantics. | `ev:T-0399:c213cedb4cfe4d20a8858fd9` |
| D-3 | Add evidence-quality repair guidance as additive issue/next-action metadata. | Accepted | Weak Done evidence needs a direct `evidence add-command --result passed --category validation` repair path, not another readiness rerun. | `ev:T-0399:c213cedb4cfe4d20a8858fd9` |
