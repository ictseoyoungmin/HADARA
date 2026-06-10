# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Run all release smokes in the `hadara-dev` Docker container, not the host. | Accepted | Host `/mnt/f` lacks a working node_modules/build; the small-model T-0289 attempt failed at `npm ci` for exactly this reason. The container reproduces a working environment. | package smoke + clean-checkout smoke evidence. |
| D-2 | Do not run `release artifact --execute` in this capsule. | Accepted | It requires a clean worktree; the readiness capsule itself dirties the tree. The manual publish helper runs it after the operator commits. Release readiness is proven by `release dry-run` readiness=ready. | release dry-run evidence. |
| D-3 | Do not publish; leave publish to the operator running the helper with `--execute`. | Accepted | Registry mutation is operator-gated and approval-gated; the helper enforces clean worktree, npm auth, `npm run check`, and an interactive confirmation. | manual-publish-rc.sh review. |
| D-4 | Record honest smoke results, including any failures. | Accepted | AGENTS.md forbids replacing failed checks with optimistic summaries; the prior T-0289 attempt over-claimed completion. | evidence.jsonl. |
