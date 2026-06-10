# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| The publish helper runs `npm run check` on the operator's machine, not in this container. | If the operator's environment cannot build/test, the helper aborts at step 1 before publishing. | Medium | The operator published rc.1 and rc.2 with this same helper, so their environment works. Run the helper without `--execute` first to confirm all steps pass. | Mitigated |
| Host `/mnt/f` cannot build (empty/symlink-broken node_modules). | Running the helper directly on the `/mnt/f` host would fail at `npm run check`. | High on host | Run the helper from a working environment (the operator's normal publish env or a clean `npm ci` checkout), not the raw `/mnt/f` host shell. | Documented |
| `release artifact --execute` is not pre-run here. | A worktree/packaging issue could only surface during the helper run. | Low | `release dry-run` reports readiness=ready with 0 blockers; the helper builds + verifies the artifact and checksum before publish. | Mitigated |
| Worktree must be clean before the helper. | The helper aborts on any dirty/untracked file. | Certain | The operator commits this capsule and the state-doc updates first (the intended flow). | By design |
