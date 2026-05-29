# Files

| Path | Action | Reason |
|---|---|---|
| `scripts/release/manual-publish-rc.sh` | Updated | Adds local tarball path normalization, GitHub Release note file support, and optional token env authentication for `gh`. |
| `docs/TASK_BOARD.md` | Updated | Marks T-0143 as Done and records npm-only RC publish completion. |
| `docs/PROJECT_STATE.md` | Updated | Records that `hadara@0.1.0-rc.0` is published on npm and keeps installer/README/GitHub work deferred. |
| `docs/DEVELOPMENT_SLICES.md` | Updated | Adds the T-0143 manual npm publish slice. |
| `docs/V1_0_CAPSULE_BACKLOG.md` | Updated | Adds the T-0143 npm publish backlog completion row. |
| `docs/VALIDATION_HISTORY.md` | Updated | Records npm publish validation, registry verification, and latest T-0143 release evidence. |
| `docs/AGENT_HANDOFF.md` | Updated | Updates current state, last completed tasks, validation baseline, and next recommended install/docs capsule. |
| `dist-release/hadara-0.1.0-rc.0.tgz` | Generated | Retained local npm release candidate tarball produced by the manual publish helper. |
| `dist-release/hadara-0.1.0-rc.0.tgz.sha256` | Generated | Retained checksum for the local release candidate tarball. |
| `dist-release/hadara-0.1.0-rc.0.tgz.manifest.json` | Generated | Retained release artifact manifest for inspection and optional GitHub Release asset upload. |
| `tasks/T-0143-manual-rc-publish-dry-run/TASK.md` | Updated | Defines T-0143 as npm-only RC publish scope and marks the capsule Done. |
| `tasks/T-0143-manual-rc-publish-dry-run/PLAN.md` | Updated | Records the manual publish/dry-run plan and helper follow-up steps. |
| `tasks/T-0143-manual-rc-publish-dry-run/CONTEXT.md` | Updated | Describes the npm-only release candidate context and deferred install/docs work. |
| `tasks/T-0143-manual-rc-publish-dry-run/ACCEPTANCE.md` | Updated | Tracks completed publish, deferred GitHub/install/README scope, and handoff completion. |
| `tasks/T-0143-manual-rc-publish-dry-run/TESTS.md` | Updated | Records required manual publish, npm tarball dry-run, and helper syntax checks. |
| `tasks/T-0143-manual-rc-publish-dry-run/RISKS.md` | Updated | Records 2FA/token, GitHub draft, tarball path, and deferred install/docs risk mitigations. |
| `tasks/T-0143-manual-rc-publish-dry-run/DECISIONS.md` | Updated | Records npm-only actual mutation, GitHub draft preparation, token-env handling, and deferred installer/README work. |
| `tasks/T-0143-manual-rc-publish-dry-run/HANDOFF.md` | Updated | Summarizes npm publish completion, registry verification, and next install/docs capsule. |
| `tasks/T-0143-manual-rc-publish-dry-run/GITHUB_RELEASE_NOTE.md` | Added | Provides reproducible GitHub Release draft notes for `v0.1.0-rc.0`. |
| `tasks/T-0143-manual-rc-publish-dry-run/EVIDENCE.md` | Updated | Records dry-run evidence and helper fix verification. |
| `tasks/T-0143-manual-rc-publish-dry-run/evidence.jsonl` | Updated | Records public evidence entries for the manual RC dry-run. |
| `tasks/T-0143-manual-rc-publish-dry-run/artifacts/package-smoke/2026-05-29T02-15-40.993Z-summary.json` | Added | Public reduced package-smoke evidence from the initial manual dry-run attempt. |
| `tasks/T-0143-manual-rc-publish-dry-run/artifacts/clean-checkout-smoke/2026-05-29T02-16-49.438Z-summary.json` | Added | Public reduced clean-checkout smoke evidence from the initial manual dry-run attempt. |
| `tasks/T-0143-manual-rc-publish-dry-run/artifacts/release-artifact/2026-05-29T02-16-52.312Z-report.json` | Added | Public reduced release-artifact evidence from the initial manual dry-run attempt. |
| `tasks/T-0143-manual-rc-publish-dry-run/artifacts/package-smoke/2026-05-29T02-47-32.361Z-summary.json` | Added | Fresh public reduced package-smoke evidence from the npm publish execution attempt. |
| `tasks/T-0143-manual-rc-publish-dry-run/artifacts/clean-checkout-smoke/2026-05-29T02-48-03.419Z-summary.json` | Added | Fresh public reduced clean-checkout smoke evidence from the npm publish execution attempt. |
| `tasks/T-0143-manual-rc-publish-dry-run/artifacts/release-artifact/2026-05-29T02-48-07.351Z-report.json` | Added | Fresh public reduced release-artifact evidence from the npm publish execution attempt. |
