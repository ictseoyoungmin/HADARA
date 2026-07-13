# T-0590 Dogfood Report

## Summary

0.4.5 docs registry staged work was dogfooded across fresh `basic`, `standard`, and `governed` projects using the built development CLI from `dist/cli/main.js`.

## Checks

| Check | Result | Notes |
|---|---|---|
| Fresh `hadara init` for `basic` | Passed | `tasks/` exists; `tasks/.gitkeep` is not generated. |
| Fresh `hadara init` for `standard` | Passed | `tasks/` exists; `tasks/.gitkeep` is not generated. |
| Fresh `hadara init` for `governed` | Passed | `tasks/` exists; `tasks/.gitkeep` is not generated. |
| `docs doctor --scope all` after fresh init | Passed | All three profiles reported clean docs health. |
| `docs register --execute` for a project-authored guide | Passed | Registered docs defaulted to `owner: project`, `origin.type: project-authored`, and `editPolicy: agent-editable-with-review`. |
| Scaffold seed ownership | Passed | Seed docs such as `docs/HADARA_WORKFLOW.md` remained `owner: hadara-docs` with `generatedBy: hadara init`. |
| `docs render --execute --before-hash` in fresh projects | Passed | Explicit render created or refreshed `docs/DOC_REGISTRY.md` through the guarded mutation path. |
| HADARA-dev `docs render` | Passed | The repository `docs/DOC_REGISTRY.md` projection was refreshed from `.hadara/docs-registry.json`; a follow-up dry-run reported `already-current`. |
| HADARA-dev `docs doctor --scope all` | Passed | Health stayed clean after projection refresh. |

## Observations

The registry is now usable without raw JSON edits for the common desired-state cleanup path:

- `docs update` for field correction
- `docs archive` for non-default historical retention
- `docs supersede` for replacement linkage
- `docs unregister` for stale desired-state deletion
- `docs render` for projection sync

Full v3 writer migration is still intentionally deferred. The compatibility writer still preserves `profiles`, while v3 read-model normalization accepts `applicableProfiles`.
