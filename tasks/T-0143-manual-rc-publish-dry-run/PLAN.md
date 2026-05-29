# Plan

1. Prepare a Node 22 container for manual RC dry-run.
2. Run `scripts/release/manual-publish-rc.sh T-0143` in dry-run mode.
3. Record fresh package-smoke, clean-checkout, and release-artifact evidence.
4. Fix any helper issues found before actual publish.
5. Add a task-local GitHub Release note file and make the helper consume it with `--github-release-note`.
6. Validate script syntax and record evidence.
