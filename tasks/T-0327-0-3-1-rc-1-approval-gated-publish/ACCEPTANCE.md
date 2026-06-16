# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Helper publish execute completes for `hadara@0.3.1-rc.1` after explicit operator confirmation. | Done | `command:T-0327:npm-publish` |
| AC-2 | `npm view hadara@0.3.1-rc.1 version --registry=https://registry.npmjs.org` returns `0.3.1-rc.1`. | Done | `command:T-0327:registry-tarball-verify` |
| AC-3 | No GitHub Release, Docker, PyPI, installer, or MCP release/package mutation occurs unless explicitly requested. | Done | `command:T-0327:npm-publish`; GitHub Release draft was not requested. |
| AC-4 | npm dist-tags preserve stable `latest` on `0.3.0` and expose rc1 as `next`. | Done | `command:T-0327:npm-dist-tag-corrected` |
| AC-5 | Shared docs hand off to T-0328 post-publish installed-package recycle. | Done | Release readiness, Project State, Agent Handoff, and Task Board updated for T-0328 handoff. |
