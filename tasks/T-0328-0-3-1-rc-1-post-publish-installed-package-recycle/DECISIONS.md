# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat temp-prefix installed-bin execution as the canonical consumer proof for `hadara@0.3.1-rc.1`. | Accepted | It avoids stale global PATH and npx cache ambiguity while proving the published package tree directly. | `command:T-0328:published-cli-surface-recycle` |
| D-2 | Exercise broad CLI command families with safe read/dry-run or disposable-project writes instead of release/server mutation. | Accepted | The task validates installed command dispatch without publishing again, leaving server and nested-Docker behavior bounded to environment checks. | `command:T-0328:published-cli-surface-recycle`; `FINDINGS.md` |
