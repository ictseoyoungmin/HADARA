# HADARA 0.3.0-rc.1 Post-Publish Recycle Findings

## Environment

- Container: hadara-recycle
- Package: hadara@0.3.0-rc.1
- Root: /tmp/hadara-recycle/0.3.0-rc.1

## Confirmed

- npm registry exposes 0.3.0-rc.1 as latest.
- package metadata includes description, keywords, repository, homepage, and bugs pointing at the public HADARA repository.
- npx smoke and global install smoke reached the installed CLI and reported version 0.3.0-rc.1.
- help, help lifecycle, and commands --json worked during the first recycle pass.

## Findings

1. Fresh init followed by doctor returns non-zero because .hadara/context/HADARA_CONTEXT.md is missing.
   - basic/standard/governed init commands succeed.
   - doctor exits 7 with project-context missing until the context file exists.
   - This is a post-init adoption friction point: either init should create the context file for profiles that require doctor-clean, or doctor/docs should frame the missing context as expected setup work.

2. Protocol migrate evidence preservation was explicitly checked with before/after SHA.
   - See protocol-migrate-*.json and step-status.tsv for command outcomes.

3. Ten temporary dogfood capsules were attempted under dogfood-hadara-workflow-audit.
   - See dogfood-task-log.tsv for each lifecycle command status.

## Successful Lifecycle Follow-Up

A second dogfood project, `dogfood-hadara-workflow-success`, filled the standard capsule docs and used validation-like command evidence. After replacing the remaining Out of Scope placeholder, all 10 temporary capsules passed:

- `task ready --level done`: 10/10 passed
- `task close` dry-run: 10/10 passed
- `task close --execute`: 10/10 passed
- `task audit-close`: 10/10 passed

See `dogfood-success-rerun-task-log.tsv`.

## Bug/Friction Assessment

- Confirmed blocker-level product regression: none found in the post-publish package for the requested core surfaces.
- Adoption friction found: fresh `hadara init --profile basic|standard|governed` followed immediately by `hadara doctor --json` exits 7 because `.hadara/context/HADARA_CONTEXT.md` is absent.
- Workflow friction found during dogfooding: done-level close gates are strict and require non-placeholder capsule docs plus substantive evidence. This is expected for HADARA-dev quality gates, but fresh users need clear guidance.
