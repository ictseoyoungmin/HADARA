# RELEASE_NOTES

## 0.2.0-rc.0

Release-candidate freeze target for Phase 6 and Phase 6.1 work. This is a dry-run/readiness freeze until an explicit later publish capsule approves mutation.

Highlights:

- Adds workflow compression primitives for task completion, finish/ready/close, handoff suggestions, and operator-facing command reports.
- Adds multi-agent-compatible metadata foundations, including actor context fields, mutation vocabulary separation, sync-dist before-hash guarding, close evidence race recheck, and task create collision guarding.
- Refreshes package, clean-checkout, release-artifact, release dry-run, and publish dry-run evidence for the current source checkout.

Boundaries:

- This RC target does not claim full multi-agent runtime safety, lock-safe shared execution across all commands, or a complete multi-agent controller.
- Publish execution, registry mutation, GitHub Release creation, Docker image build/push, PyPI publish/token loading, and release mutation remain out of scope.

## 0.1.0-rc.0

First npm release candidate for early CLI evaluation.
