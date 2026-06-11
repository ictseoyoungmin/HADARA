# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `AGENTS.md` | HADARA protocol, required reading, Task Capsule lifecycle, evidence and state-doc requirements. | Read |
| `docs/PROJECT_STATE.md` | T-0296 prepared `0.3.0-rc.0` source candidate; publish remains approval-gated. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff still pointed at T-0296 as latest completed release-hardening baseline. | Read |
| `docs/TASK_BOARD.md` | T-0297 created for prepublish cleanup. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Docker validation and close-source lifecycle rules. | Read |
| `docs/DEVELOPMENT_SLICES.md` | Phase 7.6 is complete through T-0296; this task is a follow-up cleanup. | Read |
| `docs/TEST_STRATEGY.md` | Docker is primary validation path; release evidence remains local and read-only until operator approval. | Read |
| `docs/RELEASE_READINESS.md` | Manual publish path requires fresh capsule, clean worktree, npm login, and approval-gated helper. | Read |
| Reviewer feedback attachment | Identified package README blocker, optional `task complete` wording, stale T-0296 handoff, duplicate Phase 7 specs, and final readiness rerun. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The npm package page will render root `README.md` after publish. | `package.json` `files` includes `README.md`; reviewer feedback. | Install instructions could remain pointed at an older RC. |
| Canonical Phase 7 specs are already staged under `docs/specs/0.3.0/`. | `docs/PROJECT_STATE.md`; repository tree. | Removing the copied bundle would lose information if canonical specs were incomplete. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not run real `npm publish`. | `docs/RELEASE_READINESS.md`; user asked for instructions after processing. | Provide commands only. |
| Do not write token values or private auth logs. | `AGENTS.md`; release readiness boundary. | Public evidence must stay reduced. |
| Use Docker validation and refresh `dist` after CLI/test changes. | `docs/TEST_STRATEGY.md`; `AGENTS.md`. | Release helper expects built CLI. |
