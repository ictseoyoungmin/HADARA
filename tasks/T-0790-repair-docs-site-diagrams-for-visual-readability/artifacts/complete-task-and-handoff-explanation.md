# Complete TASK.md and HANDOFF.md Public Explanation

## Requirement

`TASK.md` and `HANDOFF.md` are primary Task Capsule contracts. Their public documentation must not reduce either file to a short conceptual excerpt or imply that one is merely a summary of the other.

## Content change

- Removed the deliberately abridged TASK/HANDOFF examples.
- Explained every `TASK.md` section independently: Identity, Goal, Scope, Plan, Acceptance, Validation, Inputs / Constraints, Changes, Risks / Follow-ups, Close Summary, and History.
- Distinguished Acceptance criteria from executed Validation checks.
- Explained that Close Summary is only the Task Board Result projection source and never replaces the full task contract or evidence.
- Explained every `HANDOFF.md` section independently: Identity, Last Completed, Pre-Close Operator Action, Post-Close Continuation, and Carry Forward Warnings.
- Documented how handoff routing changes across open-and-waiting, ready-to-close, and closed-valid phases.
- Explained that Last Completed is a durable locator rather than a replacement for TASK.md.
- Added complete authored TASK.md and HANDOFF.md examples with every generated section and table column present.

## Regression contract

The public content test now requires:

- the complete TASK and HANDOFF section titles;
- both complete examples;
- the literal Close Summary section;
- absence of the previous abridged-example language;
- all generated TASK and HANDOFF sections and controlled continuation columns.

## Validation

| Check | Result |
|---|---|
| `npm test` in `docs/site` | Passed. |
| `npm run build` in `docs/site` | Passed; TypeScript and Vite production build completed. |
| `git diff --check` | Passed before evidence capture. |
| Headless Edge, 1920 by 6000 | Passed. The Task Capsules page rendered the detailed prose, full TASK example, HANDOFF explanation, phase table, navigation, and long code blocks without observed horizontal overflow or broken page composition. |

The user visual-review gate remains open; this agent-side rendering check does not close T-0790.
