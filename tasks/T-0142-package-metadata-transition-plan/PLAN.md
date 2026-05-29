# Plan

1. Read the release/package metadata handoff, readiness docs, and active T-0141 follow-up notes.
2. Transition `package.json` and `package-lock.json` to `0.1.0-rc.0`, `private: false`, and the existing runtime/documentation `files` whitelist.
3. Update release-readiness docs and gate predicates so release-candidate metadata is accepted only with matching public evidence.
4. Refresh package-smoke, release-artifact, clean-checkout, release dry-run, and release publish dry-run evidence without executing publish/deploy mutation.
5. Run focused tests, full check, and done-level harness validation.
6. Update task capsule docs plus project board/state/slices/handoff.
