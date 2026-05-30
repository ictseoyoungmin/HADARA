# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara protocol doctor --scope profile --json` returns a profile-scoped report. | Done | Built CLI smoke returned `scope: "profile"`, `ok: true`, and 0 issues for this governed repo. |
| AC-2 | Basic-to-governed profile drift produces specific manual remediation hints for `docs/PROJECT_STATE.md`, `docs/IMPLEMENTATION_SOP.md`, and `AGENTS.md`. | Done | `tests/unit/protocol-consistency.test.ts` covers governed doc-set with stale basic metadata and target-path remediation checks. |
| AC-3 | Mixed or partial profile doc sets produce missing-doc remediation guidance without automatic writes. | Done | `tests/unit/protocol-consistency.test.ts` covers partial governed doc-set warnings and manual missing-doc remediation. |
| AC-4 | `--task` and `--scope` remain mutually exclusive and unsupported scopes still fail. | Done | CLI test coverage and built CLI conflict smoke returned `CLI_OPTION_INVALID_VALUE`. |
| AC-5 | Docker validation and built CLI smokes are recorded. | Done | `EVIDENCE.md` entries at 2026-05-30T08:28:39.267Z, 2026-05-30T08:28:51.526Z, and 2026-05-30T08:31:43.011Z. |
| AC-6 | Project tracking docs and handoff are updated. | Done | Task Board, Project State, Development Slices, and AGENT_HANDOFF updated for T-0156 completion. |
