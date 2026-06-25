# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and active T-0413 routing. | Read |
| docs/TASK_BOARD.md | Task queue and T-0413 capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation preference. | Read |
| docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md | Defines T-0413 installed-package recycle script UX workstream. | Read |
| docs/RELEASE_READINESS.md | Existing release and installed-package recycle history. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON command contract and write-boundary documentation. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Published-package recycle should be distinct from source tarball package smoke. | Existing `package smoke` builds/installs source tarballs; T-0413 asks for post-publish consumer-path recycle. | Overloading package-smoke would blur source-vs-registry proof boundaries. |
| Execute mode may require npm registry/network availability. | Release operator workflow after npm publish. | Validation uses fake runner tests and dry-run built smoke; live registry execution remains operator/environment dependent. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Default mode must not use network or install packages. | HADARA dry-run-first release boundary. | `package recycle --json` only returns a planned report. |
| Execute must not publish or mutate release targets. | Release readiness no-mutation boundary. | Report execution flags hard-code publish/release mutation false. |
| Public reports must stay reduced. | Evidence/privacy model. | Raw npm logs, package contents, private paths, and secrets are omitted. |
