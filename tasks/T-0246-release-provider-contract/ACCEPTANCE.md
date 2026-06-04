# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `ReleaseProvider` interface exists with provider support states for detect, buildPlan, smokePlan, artifactPlan, and publishPlan. | Done | `src/services/release-targets.ts`. |
| AC-2 | Existing npm target logic is represented through `NpmReleaseProvider` without changing npm-primary behavior. | Done | `release-dry-run.test.ts` descriptor/provider checks passed. |
| AC-3 | `PythonReleaseProvider` is detect/preview-only and performs no Python build, smoke, token, or publish action. | Done | Provider capabilities report unsupported plan/publish fields; T-0247 is explicitly referenced as parser follow-up. |
| AC-4 | `hadara release dry-run --json` includes `providerCapabilities` and remains schema-valid. | Done | Focused schema tests and built CLI smoke passed provider output check. |
| AC-5 | Tests or explicit constraints are recorded. | Done | `TESTS.md` latest results and evidence record. |
| AC-6 | Evidence is attached and handoff/state docs are updated. | Done | Evidence `ev:T-0246:1eeb1dc217644a9f8e105a2d`; handoff/state docs updated. |
