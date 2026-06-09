# T-0288 rc3 proof reliability hardening patch

## Metadata

| Field | Value |
|---|---|
| ID | T-0288 |
| Title | rc3 proof reliability hardening patch |
| Status | Done |
| Created | 2026-06-09 |
| Updated | 2026-06-09 |

## Goal

| Goal | Notes |
|---|---|
| Close the rc3 review's blocking gaps and high-value hardening items before publish. | Real multi-process evidence append regression coverage and a CI gate strict empty-scope guard, plus lock diagnostics, proof freshness source accuracy, and idempotent non-JSON evidence UX. |

## Scope

| In Scope | Reason |
|---|---|
| CI gate strict empty-scope guard (`CI_GATE_NO_DONE_TASKS`, `CI_GATE_TASK_NOT_FOUND`, `--allow-empty`). | Strict gate must not pass with nothing validated; review blocking item. |
| Real multi-process parallel evidence append regression test. | rc3's core bug was parallel evidence writes; review blocking item. |
| Evidence append lock stale-lock metadata and clearer timeout diagnostics. | Operator recoverability for fail-closed stale locks. |
| Proof freshness `checkedSources` reflects the real close-relevant source set. | Avoid under-reporting the inputs that drive freshness. |
| Non-JSON `evidence add-command` / `collect` idempotent no-op messaging. | Avoid implying "updated" when a same-key record already exists. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Crash-atomic EVIDENCE.md/evidence.jsonl transaction (full journaling). | Lock serializes writers but does not make the two appends crash-atomic; tracked as residual risk for a follow-up capsule. |
| Automatic stale-lock removal. | rc3 keeps diagnosable fail-closed behavior; auto-cleanup is riskier and deferred. |
| Publish/registry mutation. | Operator-gated; this capsule is source hardening only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-09T00:00:00.000Z | Draft | Initial task scaffold. | Scaffold. |
| 2026-06-09T00:00:01.000Z | In Progress | Implementing rc3 hardening patch from review findings. | Focused vitest and built-CLI smokes passed; see EVIDENCE.md. |
| 2026-06-09T00:00:02.000Z | Done | rc3 hardening patch implemented and validated. | Full suite 103 files / 692 tests in /tmp npm-ci copy; built-CLI smokes; see EVIDENCE.md. |
