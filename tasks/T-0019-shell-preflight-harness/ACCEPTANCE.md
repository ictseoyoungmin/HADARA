# Acceptance Criteria

- [x] Fake shell harness never executes real shell commands.
- [x] Fake shell harness returns configured command output only when policy preflight status is `allowed`.
- [x] Approval-required commands return a structured `requires_approval` result without command output lookup.
- [x] Denied commands return a structured `policy_denied` result with the policy exit code.
- [x] Missing fake commands return a deterministic nonzero result after policy allows execution.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached to `EVIDENCE.md` and `evidence.jsonl`.
- [x] Handoff is updated.
