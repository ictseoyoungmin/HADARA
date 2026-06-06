# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Supersede the rc.0 publish candidate with `hadara@0.2.0-rc.1`. | Accepted | T-0272 through T-0274 fixed installed-package recycle findings targeted before rc.1, so the publish-ready package should include those fixes. | `package.json`, README, release notes/readiness docs. |
| D-2 | Remove the source package's runtime dependency on `hadara@^0.2.0-rc.0`. | Accepted | The HADARA CLI package should not depend on a previous published copy of itself; this would make rc.1 installs pull stale rc.0 package contents unnecessarily. | `package.json`, `package-lock.json`, package smoke. |
| D-3 | Keep actual npm publish as an operator-only manual helper step. | Accepted | The user explicitly wants to log in and run `--execute`; this agent pass must prepare evidence and docs without registry mutation or token handling. | `scripts/release/manual-publish-rc.sh`, T-0275 evidence. |
