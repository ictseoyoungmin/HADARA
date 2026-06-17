# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `npm view hadara@0.3.2 version` returns `0.3.2`. | Done | `ev:T-0341:3208efa9002b47cc8ea68363` |
| AC-2 | `npm dist-tag ls hadara` shows `latest=0.3.2` and `next=0.3.2-rc.0`. | Done | `ev:T-0341:3208efa9002b47cc8ea68363` |
| AC-3 | Temp-prefix installed `hadara@latest` reports `packageVersion:"0.3.2"` and `build.distLooksStale:false`. | Done | `ev:T-0341:3208efa9002b47cc8ea68363` |
| AC-4 | Installed `hadara init --profile governed --json` succeeds in a disposable project. | Done | `ev:T-0341:3208efa9002b47cc8ea68363` |
| AC-5 | Installed `evidence list --task <fixture-task> --json` exposes durable evidence id metadata. | Done | `ev:T-0341:3208efa9002b47cc8ea68363` |
| AC-6 | Installed `evidence add-command --resolves <durable-ev-id> --json` succeeds with a passed validation record. | Done | `ev:T-0341:3208efa9002b47cc8ea68363` |
| AC-7 | Installed minimal lifecycle smoke reaches ready/close/audit with `audit-close` passing. | Done | `ev:T-0341:3208efa9002b47cc8ea68363` |
| AC-8 | Disposable temp folders are removed and findings are documented. | Done | `ev:T-0341:3208efa9002b47cc8ea68363` |
| AC-9 | Task evidence, handoff, and shared state docs are updated before close. | Done | T-0341 close-source docs |
