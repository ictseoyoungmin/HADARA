# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Migration corrupts user-authored docs by rewriting too broadly. | Existing project context could be lost or misleading. | Medium | Limit writes to explicit action paths, use dry-run-first plans, before-hash execute, and per-action hash/existence conflict checks. | Mitigated |
| Project and task migrations become conflated. | Operators could accidentally mass-update historical capsules. | Medium | `--task` plans only selected Task Capsule writes and skips project docs registry/SOP changes. | Mitigated |
| README points users at unpublished rc.1. | Public install command fails. | High before fix | README now separates source candidate rc.1 from published npm rc.0 install. | Mitigated |
| rc.1 package metadata still points at development repo. | npm package page sends users to the less natural repo. | Medium | `package.json` and release artifact staging constants now point at public `HADARA`. | Mitigated |
| Migration is mistaken for release readiness. | Operator could publish without later verification. | Medium | Spec, README, capsule scope, and handoff keep npm publish out of T-0299. | Mitigated |
