# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task finalize` provides actionable weak-evidence repair guidance. | Met | `ev:T-0399:c213cedb4cfe4d20a8858fd9` |
| AC-2 | `task finalize` avoids unnecessary ready/close/audit report construction when finish is still required or blocked. | Met | `ev:T-0399:ac178da8a71f482a9d8e702a` |
| AC-3 | Additive schema and unit coverage are updated. | Met | `ev:T-0399:c213cedb4cfe4d20a8858fd9` |
| AC-4 | Full Docker validation, built smoke, and diff hygiene are recorded. | Met | `ev:T-0399:8aa7e7dc564e429393a1ea67`, `ev:T-0399:ac178da8a71f482a9d8e702a`, `ev:T-0399:cda485bcea7242448c0da511` |
| AC-5 | Failed first full-run timeout is recorded honestly and resolved by retry evidence. | Met | `ev:T-0399:eba26dcf11c5461395d90965`, `ev:T-0399:8aa7e7dc564e429393a1ea67` |
