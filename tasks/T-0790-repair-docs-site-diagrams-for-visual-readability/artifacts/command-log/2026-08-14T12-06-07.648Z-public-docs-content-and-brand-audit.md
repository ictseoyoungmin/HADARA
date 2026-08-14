# Public Documentation Content and Brand Audit

## Outcome

The sidebar brand is text-only, and all twelve public pages now have a distinct primary responsibility. Versioned implementation vocabulary and duplicate deep explanations were removed without deleting public command, file, evidence, or lifecycle contracts that readers need.

## Page ownership

| Page | Primary responsibility |
|---|---|
| Home | Product orientation and the human/agent interaction model. |
| Getting Started | Install, plain interactive init, generated core files, and the first post-init request. |
| What is HADARA? | Product boundary, agent connection, authority/projection model, and supported work styles. |
| Project Protocol Files | Responsibilities and relationships of repository-level protocol files. |
| Task Capsules | Literal task-local file anatomy, authored examples, status families, and handoff semantics. |
| Evidence & Projections | Human-facing evidence authority, failure history, and projection model. |
| Lifecycle Workflow | End-to-end orient-to-close narrative and cross-session continuity. |
| Init Reference | Non-default presets, reviewed non-interactive execution, and existing-project adoption. |
| Task Commands | Atomic status, create, and close command contracts. |
| Evidence & Validation | Agent-facing validation and evidence command contracts. |
| Approval Boundaries | Consequential external actions and narrow human authority. |
| Limits & Recovery | Setup, close, concurrency, and current product recovery boundaries. |

## Removed duplication

- The operating-model diagram now has one narrative owner on Home; What is HADARA keeps the complementary three-layer table.
- Init Reference no longer repeats the core generated-file inventory owned by Getting Started.
- Workflow no longer repeats the reviewed close command block owned by Task Commands.
- Home's evidence section now routes to Evidence & Projections instead of restating its authority rules.
- What is HADARA routes first-time users to Getting Started instead of repeating the four-step human journey.

## Removed implementation vocabulary

Public copy no longer exposes:

- `Init v1`;
- `Evidence v2` or legacy result compatibility language;
- `presetOrigin`;
- an internal HANDOFF conflict issue code;
- “current built CLI” generation lineage;
- internal operation-marker terminology.

User-meaningful exact contracts remain: actual generated filenames, public commands, Task Capsule sections, evidence outcomes and byte binding, close states, plan-hash review, and controlled handoff values.

## Brand change

- Removed the decorative diamond `H` component and its CSS.
- Preserved the `HADARA` / `Documentation` text lockup.
- Desktop browser inspection confirmed balanced sidebar alignment without a blank emblem slot.

## Validation

- `npm test` in `docs/site`: passed
- `npm run build` in `docs/site`: passed
- Content regression enforces text-only branding, one operating-model owner, absence of internal generation vocabulary, and Getting Started / Init Reference ownership.
- Headless Edge desktop review passed for Home and Init Reference after waiting for the page transition to complete.

T-0790 remains open for human visual review.
