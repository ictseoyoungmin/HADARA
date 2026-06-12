# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `package.json` and `package-lock.json` target `0.3.0-rc.2`. | Done | package files updated and built CLI reports `0.3.0-rc.2`. |
| AC-2 | README and release readiness distinguish current published rc.1 from source rc.2 before publish. | Done | README keeps install/npx examples on rc.1 and labels rc.2 as source candidate; Release Readiness records rc.2 source and rc.1 published. |
| AC-3 | Release notes summarize T-0303 through T-0309 user-facing workflow UX changes. | Done | `docs/RELEASE_NOTES.md` has a `0.3.0-rc.2` entry covering context, docs timing, task finish, hints, Required Reading tiers, and atomic migration/docs cleanup writes. |
| AC-4 | Full Docker/check validation, package smoke, clean-checkout smoke, release artifact, strict gate, release dry-run, and publish dry-run pass. | Done | Docker full check passed; release artifact/package/clean smoke passed after environment reruns; strict gate, release dry-run, and publish dry-run passed. |
| AC-5 | Manual helper task/version guard is checked against mismatched and current T-0310 inputs. | Done | `bash -n` passed; `manual-publish-rc.sh T-0301` rejected mismatched rc.1 capsule for package `0.3.0-rc.2`; T-0310 TASK.md contains the package version for the helper guard. |
| AC-6 | Extra rc.2 workflow UX smokes cover fresh init/docs, protocol migration execute, and task finish row preservation. | Done | Temp smokes passed for basic init/doctor/docs required-reading context tier, legacy protocol migrate dry-run/execute, and task finish preserving Notes/extra cells. |
| AC-7 | Evidence is attached and shared state docs are updated. | Done | Evidence records and artifacts are attached; shared state docs updated before finish/close. |
