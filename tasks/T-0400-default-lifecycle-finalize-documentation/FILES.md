# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| README.md | Update | Present finalize-first as the 0.3.3 primary capsule lifecycle. | Done |
| AGENTS.md | Update | Require agents to use `task lifecycle` and reviewed `task finalize` by default. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Update | Make finalize-first the standard task loop while retaining low-level proof-boundary semantics. | Done |
| docs/IMPLEMENTATION_SOP.md | Update | Align implementation workflow and validation guidance with finalize execute. | Done |
| docs/COMMAND_SURFACE.md | Update | Show the 0.3.3 primary agent loop with lifecycle/finalize. | Done |
| docs/LIFECYCLE_GUIDE.md | Update | Replace the old primary guide table with phase-check/finalize steps. | Done |
| docs/COMMAND_PORTFOLIO_AUDIT.md | Update | Reclassify lifecycle command portfolio around finalize-first defaults. | Done |
| src/services/capability-registry.ts | Update | Promote `task.lifecycle` and `task.finalize` to primary/default help; move low-level proof commands out of default help. | Done |
| src/services/lifecycle-guide.ts | Update | Build primary lifecycle JSON projection from the 0.3.3 finalize-first path. | Done |
| src/cli/help.ts | Update | Render lifecycle help without old low-level execute sequence as the primary path. | Done |
| src/cli/init.ts | Update | Generate finalize-first workflow docs in new projects. | Done |
| tests/unit/help.test.ts | Update | Assert help and JSON projection expose lifecycle/finalize and omit old primary low-level execute examples. | Done |
| tests/unit/lifecycle-guide.test.ts | Update | Assert primary path is task lifecycle/finalize based. | Done |
| tests/unit/command-registry.test.ts | Update | Assert registry requiredness/default-help classification. | Done |
| tests/unit/command-portfolio-audit.test.ts | Validate | Existing audit alignment validates updated command portfolio docs. | Done |
| tests/unit/init.test.ts | Update | Assert generated init profile docs contain finalize-first guidance. | Done |
| tests/unit/task-workflow-docs.test.ts | Update | Assert workflow docs instruct default finalize path and low-level proof-boundary separation. | Done |
| tasks/T-0400-default-lifecycle-finalize-documentation/* | Add | Capsule docs and evidence for this change. | Done |
