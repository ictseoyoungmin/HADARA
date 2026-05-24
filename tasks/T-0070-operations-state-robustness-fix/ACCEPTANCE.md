# Acceptance Criteria

- [x] Malformed `.hadara/local/state/active-run.json` produces a degraded active run warning instead of throwing from Operations Status JSON.
- [x] Active run projection warns when the active task id has no matching Task Capsule.
- [x] Active run tests write the actual generated task id into handoff.
- [x] Premature acceptance warns when acceptance is checked and either status is not Done or no valid evidence records exist.
- [x] Invalid evidence JSONL lines do not satisfy the evidence-backed acceptance check.
- [x] Shared `extractSection()` matches heading lines rather than arbitrary body text.
- [x] Focused validation passes.
- [x] Done-level capsule validation passes.
