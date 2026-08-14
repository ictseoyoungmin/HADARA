# T-0790 Repair docs site diagrams for visual readability

## Identity

| Field | Value |
|---|---|
| ID | T-0790 |
| Title | Repair docs site diagrams for visual readability |
| Status | Done |
| Created | 2026-08-13T10:10Z |
| Updated | 2026-08-14T13:09Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Repair the absorbed docs site's visual and information hierarchy so native diagrams and Markdown stay legible, project protocol files are explained, and public pages separate human understanding from agent-only or internal release detail. | Do not close until the user visually reviews the rendered site. |

## Scope

| Boundary | Items |
|---|---|
| In | Native HTML/CSS diagram design, Markdown renderer fidelity, compact hero/overview typography, project protocol and complete Task Capsule explanations, command-executor labeling, public product-boundary cleanup, site build/test, and evidence. |
| Out | Closing this capsule before user visual review, external Pages deployment, runtime/CLI behavior changes, and release publication. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Read diagram-design and immersive-web-simulation-forge guidance; inspect the rendered defect. | Done |
| 2 | Replace both fixed SVGs with readable native HTML/CSS diagrams using card, rail, and detail-panel composition. | Done |
| 3 | Restructure page explanations around human setup, agent protocol, canonical state, and public product scope. | Done |
| 4 | Reduce hero and overview typography and restore the supported-workflows image. | Done |
| 5 | Explain `AGENTS.md`, `HADARA_WORKFLOW.md`, `READ_MAP.md`, `TASK.md`, and `HANDOFF.md`; remove stale/internal public sections. | Done |
| 6 | Harden Markdown inline/block rendering and inspect representative dark-theme pages at 1440px. | Done |
| 7 | Run build/tests, record evidence, and prepare the rendered site for user visual review. | Done |
| 8 | Reconcile the four public documentation/projection P2 findings from current-build dogfood. | Done |
| 9 | Replace the Task Capsule explanation with the exact fresh `task create` file and section anatomy. | Done |
| 10 | Mark the implementation-work interval explicitly in complete agent lifecycle command traces. | Done |
| 11 | Separate the lifecycle narrative from the atomic task-command reference and remove internal diagnostic-routing prose. | Done |
| 12 | Separate first-run Getting Started guidance from the detailed Init reference and remove public upgrade-repair prose. | Done |
| 13 | Remove the sidebar emblem and audit all public copy for duplicated ownership, versioned internals, and unnecessary implementation language. | Done |
| 14 | Remove public release-gate, external-authority, and deployment-control claims, including the Approval Boundaries page. | Done |
| 15 | Expand `TASK.md` and `HANDOFF.md` into complete independent contract explanations with no abbreviated authored examples. | Done |
| 16 | Fact-check the complete TASK/HANDOFF explanation against fresh current-source create and closed-valid execution, then obtain human close authorization. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Operating-model diagram uses native responsive cards, readable labels, and distinct information/review paths without text overflow. | Met | `ev:T-0790:2df11f208a0343b2a41946bb` | `NativeDiagram`; `operating-model` |
| AC-2 | Lifecycle diagram keeps all six stages visible in a rail and exposes readable stage detail without fixed-SVG text overflow. | Met | `ev:T-0790:2df11f208a0343b2a41946bb` | `NativeDiagram`; `agent-lifecycle` |
| AC-3 | Site test/build pass after the diagram changes. | Met | `ev:T-0790:e53886a8bd664c6fafa45939` | Docker native-ext4 validation |
| AC-4 | User visually reviews the rendered site before task close. | Met | `ev:T-0790:66fb5559ca4d40bcb5976123` | Human review and close authorization after the final fact check |
| AC-5 | Every shell transcript declares whether the human, coding agent, or release operator runs it, and the rendered command section uses matching language. | Met | `ev:T-0790:f7981a05760f4528a2ddddf3` | `commandAudience`; `commandSectionCopy()` |
| AC-6 | Page heroes and overview cards use compact document typography instead of oversized display headings. | Met | `ev:T-0790:2df11f208a0343b2a41946bb` | `.article-hero`; `#principles`; `.principle-card` |
| AC-7 | The What is HADARA page restores the two supported workflows image and explains canonical authority by domain. | Met | `ev:T-0790:dd333ff265264a6fbef0249e` | `what-is-hadara.md`; optimized `two-supported-work-styles.webp` |
| AC-8 | Public docs explain repository instructions, workflow routing, read maps, the bounded task contract, and phase-aware handoff. | Met | `ev:T-0790:ba48b7ea84f7480e9b5713d4` | `project-protocol-files.md`; `task-capsules.md` |
| AC-9 | Markdown headings, tables, ordered/unordered lists, inline code, emphasis, quotes, and dividers render with distinct readable semantics. | Met | `ev:T-0790:ba48b7ea84f7480e9b5713d4` | `docs-content.ts`; `App.tsx`; `globals.css` |
| AC-10 | Internal release-readiness implementation detail and obsolete lifecycle-command prose are absent; public docs do not replace them with general release or external-action authority claims. | Met | `ev:T-0790:26418babd32640b9b9b6f7fc` supersedes the intermediate public-boundary design in `ev:T-0790:ba48b7ea84f7480e9b5713d4` | Content regression; no approval/release boundary page |
| AC-11 | Public protocol docs explain `TASK_BOARD.md` as the project-level capsule index and distinguish it from the selected `TASK.md` contract. | Met | `ev:T-0790:2df11f208a0343b2a41946bb` | `project-protocol-files.md`; `workflow.md` |
| AC-12 | Native diagram rendering replaces the two legacy SVG references and remains readable in 1920px light-theme browser captures. | Met | `ev:T-0790:2df11f208a0343b2a41946bb` | content contract; Headless Edge captures |
| AC-13 | Page-level audience badges are absent, and the Home CTA buttons remain clearly legible at desktop and mobile widths. | Met | `ev:T-0790:50161e7c57eb49f382f61371` | `App.tsx`; `.hero-actions` |
| AC-14 | The native diagrams expose focal/store/external roles, labeled flow, guarded-write semantics, lifecycle invariants, and responsive mobile composition without changing the docs visual identity. | Met | `ev:T-0790:50161e7c57eb49f382f61371` | `NativeDiagram`; `globals.css`; v3 reference |
| AC-15 | Section headings containing protocol filenames use compact document hierarchy and integrated, borderless monospace labels rather than oversized inline-code pills. | Met | `ev:T-0790:551733da6a394e17981e0323` | `.section-heading h2`; `.section-heading h2 code` |
| AC-16 | The lifecycle diagram presents six connected stages as its primary process, keeps selected-stage detail subordinate, and shows durable state as the foundation shared across sessions. | Met | `ev:T-0790:f3b4fa37ba794067a0eca176` | `NativeDiagram`; `.stage-rail`; `.stage-detail`; `.persistence-band` |
| AC-17 | Public onboarding explains preset differences, observable init changes, agent-runtime connection, representative Task Capsule/evidence output, recovery paths, concurrency boundaries, and current product limits. | Met | `ev:T-0790:dd333ff265264a6fbef0249e` | Getting Started; What is HADARA; Task Capsules; Evidence; Limits & Recovery |
| AC-18 | Public routing, evidence mutation, reviewed close, and close-recovery descriptions agree with documents and read models generated by the current built CLI. | Met | `ev:T-0790:0facea36a2274112b9787a54` resolves the P1 portion of `ev:T-0790:ee7cd612a4024064b6b902a9` | T-0791 corrected the runtime/scaffold contracts; repeated current-build dogfood and docs-site test/build passed. |
| AC-19 | Public docs distinguish the compact READ_MAP projection from rich CLI routing, represent validation evidence density honestly, explain Task Board target/result lineage, and document valid HANDOFF disposition/create-task combinations. | Met | `ev:T-0790:92cc664f679347a98ad3107b` | P2-1 through P2-4 from the current-build audit; byte-bound reconciliation report |
| AC-20 | The Task Capsules page distinguishes literal fresh `task create` output from fully authored state, enumerates every initial surface, explains every TASK/HANDOFF section and phase, and presents complete examples without omitted sections. | Met | `ev:T-0790:7a709405b4f1427ba545a307` supersedes `ev:T-0790:b94af8f2685442ef8c66b22b` and resolves `ev:T-0790:509ef66ee20247dcb4b2340d` | Fresh current-source create, vocabulary, reviewed close, closed-valid projections, content regression, and byte-bound report |
| AC-21 | Complete agent lifecycle command traces show where scoped implementation work occurs between capsule creation and validation or close. | Met | `ev:T-0790:a278e3b48df24e2eb21c8164` | Home; Workflow; Task Commands; byte-bound report |
| AC-22 | Lifecycle Workflow owns the end-to-end operating narrative, while Task Commands owns only atomic status/create/close semantics; internal diagnostic-routing prose is absent from the public site. | Met | `ev:T-0790:204487ee986246479239af50` | Workflow; Task Commands; content contract; byte-bound report |
| AC-23 | Getting Started stops at plain interactive init, explains the resulting core files, and hands off to the agent; Init Reference owns preset, automation, and existing-project details without public upgrade-repair prose. | Met | `ev:T-0790:b42576ec13e74069bb1e1d87` | Getting Started; Init Reference; Limits & Recovery; content contract; byte-bound report |
| AC-24 | The sidebar brand is text-only, public docs contain no versioned Init/Evidence/legacy implementation vocabulary, and overview/reference pages avoid repeating content owned by a dedicated page. | Met | `ev:T-0790:86f5815942534f0d9ba9dcfa` | App chrome; all public docs; content contract; browser review; byte-bound report |
| AC-25 | Public docs do not claim that HADARA owns release gates, publishing/deployment authority, or general external-action approval; the development-only release tooling is not projected as a user product surface. | Met | `ev:T-0790:26418babd32640b9b9b6f7fc` | What is HADARA; Home; diagrams; workflow/reference pages; content contract; browser review; byte-bound report |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm test` and `npm run build` in `docs/site/` | Yes | Passed | Docker native-ext4: 7 contract tests and Vite production build passed. | `ev:T-0790:e53886a8bd664c6fafa45939` |
| `npm test` and `npm run build` after information-architecture and typography changes | Yes | Passed | Host dependency install: content contract passed; TypeScript and Vite production build passed; supported-workflows image emitted. | `ev:T-0790:f7981a05760f4528a2ddddf3` |
| Headless Edge visual QA at 1440px, `git diff --check`, and evidence lint | Yes | Passed | Overview hierarchy, both SVGs, command ownership copy, and supported-workflows artwork rendered correctly; evidence lint reported zero issues. | `ev:T-0790:0301561b06494c93bf521fcf` |
| Public information architecture and Markdown rendering QA | Yes | Passed | Intermediate content contract, TypeScript/Vite build, and dark-theme captures passed; its temporary Approval Boundaries page was later removed by the product-authority correction. | `ev:T-0790:ba48b7ea84f7480e9b5713d4`; current boundary `ev:T-0790:26418babd32640b9b9b6f7fc` |
| Native diagram, Task Board explanation, and compact hero/overview QA | Yes | Passed | Native content contract, TypeScript/Vite build, diff check, and 1920px light-theme Headless Edge captures passed for Project Protocol Files, What is HADARA, and Lifecycle Workflow. | `ev:T-0790:2df11f208a0343b2a41946bb` |
| Audience badge, CTA, and v3 schematic hardening QA | Yes | Passed | Content regression, TypeScript/Vite build, diff/evidence checks, and Headless Edge captures passed at 1920px and 500px light-theme widths after final connector alignment and mobile-width correction. | `ev:T-0790:50161e7c57eb49f382f61371` |
| Protocol filename heading hierarchy QA | Yes | Passed | Filename headings now use borderless monospace labels; content tests, TypeScript/Vite build, diff check, and 1920px long-page light-theme visual inspection passed without observed awkward wrapping. | `ev:T-0790:551733da6a394e17981e0323` |
| Connected lifecycle process QA | Yes | Passed | After resolving one stale test-label expectation, content tests, TypeScript/Vite build, diff check, and 1920px desktop plus 500px mobile Edge captures passed; no stage or contract text overflow was observed. | `ev:T-0790:f3b4fa37ba794067a0eca176` resolves `ev:T-0790:55427c4b0d8f42a38f25541c` |
| Onboarding, agent connection, output examples, recovery, and image-delivery QA | Yes | Passed | Content tests, TypeScript/Vite build, diff check, and successful Edge review of four representative pages passed. The 2.0 MB PNG was replaced by a 132,792-byte WebP. | `ev:T-0790:dd333ff265264a6fbef0249e` resolves `ev:T-0790:539210cb3b574cc9bb7e2de4` |
| Current-build Init and capsule document dogfood | Yes | Passed | The original audit exposed five P1 discrepancies; T-0791 fixed them, repeated fresh Init plus two capsule paths, proved prewrite semantic blocking, closed-valid, and zero-write retry, and reconciled the public prose. | `ev:T-0790:0facea36a2274112b9787a54` resolves `ev:T-0790:ee7cd612a4024064b6b902a9` |
| P2 public projection reconciliation | Yes | Passed | P2-1 through P2-4 now describe exact Markdown/CLI routing boundaries, representative evidence density, Task Board lineage, and HANDOFF controlled relationships; content test, production build, and full-height 1920px Edge inspection passed. | `ev:T-0790:92cc664f679347a98ad3107b`; byte-bound report |
| Fresh task-create content reconciliation | Yes | Passed | Current rebuilt CLI created a disposable standard project and T-0001; the page now mirrors every initial section, actual table header, zero-byte evidence log, and Draft/project/- Task Board state. Content tests, production build, and 1920x6000 Edge rendering passed. | `ev:T-0790:4ce9d78c741241699771867a`; byte-bound report |
| Lifecycle implementation marker | Yes | Passed | Home, Workflow, and Task Commands now place an explicit implementation-work comment after `task create` and before validation or close; the content contract verifies marker presence and ordering, and the production build passed. | `ev:T-0790:a278e3b48df24e2eb21c8164`; byte-bound report |
| Lifecycle information architecture | Yes | Passed | Lifecycle Workflow now owns the six-stage end-to-end narrative, Task Commands owns atomic status/create/close semantics, internal diagnostic prose is absent, and content tests plus production build passed. | `ev:T-0790:204487ee986246479239af50`; byte-bound report |
| Getting Started / Init Reference separation | Yes | Passed | Getting Started now stops at plain init, generated core files, and After init; Init Reference owns presets, plan-hash automation, and adoption; public upgrade prose is absent; content tests and production build passed. | `ev:T-0790:b42576ec13e74069bb1e1d87`; byte-bound report |
| Public content and brand audit | Yes | Passed | Removed the sidebar emblem, eliminated versioned implementation vocabulary and duplicate deep explanations, locked page ownership and text-only branding in content tests, passed production build, and visually reviewed Home plus Init Reference in Headless Edge. | `ev:T-0790:86f5815942534f0d9ba9dcfa`; byte-bound report |
| Release/external-authority claim removal | Yes | Passed | Deleted Approval Boundaries and removed release-gate, publishing/deployment authority, and external-action control wording from public pages and diagrams; content regression, production build, and desktop Home rendering passed. | `ev:T-0790:26418babd32640b9b9b6f7fc`; byte-bound report |
| Complete TASK/HANDOFF contract fact check | Yes | Passed | The first semantic review found and preserved an invalid source role, non-Done final History row, and misleading pre-close status; corrected examples then passed fresh current-source init/create, controlled vocabulary, reviewed close, closed-valid post-close projections, content tests, production build, and diff check. | `ev:T-0790:7a709405b4f1427ba545a307` resolves `ev:T-0790:509ef66ee20247dcb4b2340d` and supersedes `ev:T-0790:b94af8f2685442ef8c66b22b` |
| User visual review of local site | Yes | Passed | The user completed iterative visual/content review and authorized close after the final factual verification passed. | `ev:T-0790:66fb5559ca4d40bcb5976123` |
| Final current-source validation | Yes | Passed | Source/tools typechecks, 1,062 main tests, 145 HADARA-dev tests, docs-site test/build, diff check, and the closed-valid TASK/HANDOFF fixture passed. The initial sandbox-only `git init` EPERM is preserved and resolved by the unrestricted rerun. | `ev:T-0790:600dc4105d504b7e831916ef` resolves `ev:T-0790:e5ccd152fae141c68febf9c9` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/skills/diagram-design/SKILL.md` | design | active | Architecture diagram type, 4px grid, orthogonal connectors, text safety, and taste gate. |
| `.hadara/skills/immersive-web-simulation-forge/SKILL.md` | design | active | Inspect → classify → repair → recapture visual QA loop. |
| `temp/HADARA_0.5_Timeline_and_Master_Roadmap.html` | reference | active | Adopted its native card/rail/detail composition, not its tiny annotation typography or release-internal content. |
| `temp/HADARA_Runtime_Master_Plan_v3_2026-08-12.html` | reference | active | Adopted focal/store/external role semantics, labeled connectors, state-rail grammar, and invariant summaries while retaining the docs paper/gold/teal visual language and readable type. |

## Changes

| Area | Summary |
|---|---|
| Diagram composition | Replaced both fixed SVGs with responsive native HTML/CSS: an authority-flow card system and an interactive six-stage connected process with a compact stage contract. |
| Page structure | Added page-specific explanations for authority, capsule anatomy, agent CLI lifecycle, evidence binding, and release-state transitions. |
| Command ownership | Added explicit human and agent-protocol command ownership metadata and rendered copy. |
| Visual hierarchy | Reduced hero, overview heading, and card scale; increased native-diagram support text to readable sizes; restored the two supported-workflows image. |
| Section typography | Removed generic inline-code pills from filename-bearing section headings, reduced their scale, widened their measure, and retained ordinary code pills in body prose. |
| Lifecycle hierarchy | Replaced the vertical tab-menu composition with a connected desktop process, a subordinate reads-to-produces contract, a durable foundation path, and a mobile vertical flow. |
| Diagram hardening | Removed decorative audience badges; enlarged Home CTAs; added schematic role legend, guarded-write and review flow, connected lifecycle rail, protocol surface, invariant, and guarantee summaries with desktop/mobile recomposition. |
| Project protocol | Added a dedicated explanation of `AGENTS.md`, `HADARA_WORKFLOW.md`, `TASK_BOARD.md`, `READ_MAP.md`, `TASK.md`, `HANDOFF.md`, and their session-ingress relationship. |
| Public boundary | Removed release-operator implementation material, obsolete command catalogue prose, and the later generic external-action approval surface; public docs make no release/deploy authority claim. |
| Markdown rendering | Preserved inline Markdown in tables, section headings, and overview cards; added nested subheadings, blockquotes, dividers, visible list markers, and rich-content search. |
| Onboarding and init | Added practical preset selection, observable init writes, adoption boundaries, and the transition from human setup to agent-operated lifecycle work. |
| Agent compatibility | Defined the coding-agent contract as repository instruction discovery or explicit routing, workspace access, and local CLI execution without a required model vendor or plugin. |
| Concrete outputs and navigation | Added complete `TASK.md` and `HANDOFF.md` examples, a representative `EVIDENCE.md` example, and links to Evidence plus Limits & Recovery from related pages. |
| Recovery and delivery | Added failure, concurrency, and current-limit guidance; replaced the 2.0 MB supported-workflows PNG with a 132,792-byte WebP and guarded it with a content regression test. |
| Current-build audit | Dogfooded `hadara@0.5.0-rc.6` from init through three capsule states and recorded byte-bound generated-document/read-model findings without changing runtime or public prose. |
| Current-build reconciliation | T-0791 corrected generated preset/routing guidance, selected-status evidence mutation metadata, reviewed close actions, and virtual post-close HANDOFF preflight; public docs now match the rebuilt CLI and the repeated dogfood artifact is byte-bound. |
| P2 projection fidelity | Distinguished compact READ_MAP Markdown from rich CLI routing, made the Evidence example representative of actual validation summaries, documented Task Board target/result lineage and TASK Close Summary, and fixed HANDOFF disposition/create-task explanations. |
| Literal Task Capsule anatomy | Replaced the conceptual-only capsule description with the exact fresh `task create` section inventory, initial evidence state, Task Board row, complete section-by-section TASK/HANDOFF contracts, full generated table shapes, and complete authored examples. |
| TASK/HANDOFF contract depth | Explained each TASK section's writing and proof role, each HANDOFF section's phase-dependent meaning, and the open/waiting, ready-to-close, and closed-valid routing transition without using summary excerpts as substitutes. |
| TASK/HANDOFF factual reconciliation | Corrected the complete examples to use the valid `constraint` source role, pre-close `Draft` identities, and a final `Done` History row; documented exact guarded close projections after proving them in a fresh current-source closed-valid fixture. |
| Lifecycle implementation interval | Inserted a consistent agent implementation-work comment between capsule creation and validation or close in all complete public lifecycle command traces, with ordering locked by content regression. |
| Lifecycle information architecture | Kept Lifecycle Workflow as the end-to-end narrative, renamed the duplicate-sounding Task Lifecycle navigation item to Task Commands, narrowed it to atomic status/create/close contracts, and removed internal diagnostic-routing prose. |
| Setup information architecture | Shortened Getting Started to install, plain init, generated files, and After init; renamed the detailed page Init Reference and limited it to presets, non-interactive reviewed execution, and existing-project adoption; removed public init-upgrade prose. |
| Public copy and branding | Removed the decorative sidebar H emblem; assigned each public page one primary content owner; removed Init/Evidence generation labels, compatibility internals, and close issue-code wording; eliminated duplicate operating-model, init-file, close-command, evidence, and first-user explanations. |
| Product authority boundary | Removed the Approval Boundaries page and all public claims that HADARA owns release gates, publishing/deployment authority, or general external-action approval; retained only project-local lifecycle write integrity and generic waiting/blocker semantics. |
| Validation | Docker and host site test/build, current-source protocol fixture, reviewed closed-valid fixture close, browser checks, evidence lint, and human visual review passed. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Visual review is required before close. | Closed | `ev:T-0790:66fb5559ca4d40bcb5976123` |
| RF-2 | Risk | Fresh generated routing/workflow and selected-task/close read models disagreed with current public guidance; one post-write close blocker entered non-resumable recovery-required state. | Mitigated | `ev:T-0790:0facea36a2274112b9787a54`; T-0791 prewrite HANDOFF validation |
| RF-3 | Follow-up | Audit P2-5 and P2-6 require generated-workflow and canonical management-metadata source changes outside this public-docs capsule. | Open | Future runtime/scaffold capsule after T-0790 visual review |

## Close Summary
Rebuilt the public documentation site around readable native diagrams and accurate agent-operated protocol guidance, reconciled generated runtime behavior, completed current-source TASK/HANDOFF fact checking, and passed automated plus human visual validation.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-13 | Draft | Initial task scaffold. |
| 2026-08-13 | Draft | Expanded the visual repair to page information architecture, command ownership, compact overview typography, and supported-workflows image restoration at user request. |
| 2026-08-13 | Draft | Added project-protocol and Task Capsule explanations, removed public release-operator/stale command detail, and hardened Markdown rendering after human review. |
| 2026-08-13 | Draft | Explained `TASK_BOARD.md`, replaced both legacy SVGs with native card/rail diagrams based on the roadmap's composition method, and compacted page heroes plus overview typography. |
| 2026-08-14 | Draft | Removed page audience badges, enlarged Home CTAs, and hardened native diagrams using v3 schematic roles, labeled state flow, invariants, and responsive visual QA. |
| 2026-08-14 | Draft | Repaired oversized filename section headings by separating heading-code typography from body inline-code pills and verified the full protocol page at 1920px. |
| 2026-08-14 | Draft | Rebuilt the lifecycle visual hierarchy around a connected six-stage process, compact stage contract, durable foundation, and responsive vertical mobile flow. |
| 2026-08-14 | Draft | Added preset/init guidance, vendor-neutral agent connection, real protocol-output examples, recovery/current-limit documentation, inline page routing, and an optimized WebP asset; automated and rendered-page QA passed, while human visual approval remains pending. |
| 2026-08-14 | Draft | Dogfooded the current RC6 build in disposable projects from init through Draft, resolved-evidence, closed-valid, idempotent retry, and post-write recovery-required states; recorded unresolved generated-document and read-model mismatches as failed bound evidence. |
| 2026-08-14 | Draft | Reconciled public routing and recovery prose after T-0791 fixed all five P1 runtime/scaffold findings; repeated current-build dogfood, site content tests, and production build passed. Human visual approval remains the only open gate. |
| 2026-08-14 | Draft | Reconciled audit P2-1 through P2-4 in public docs, added focused content regressions, and passed production build plus full-height desktop rendering checks; P2-5/P2-6 remain explicit runtime follow-up. |
| 2026-08-14 | Draft | Re-ran current-build standard init and task create in a disposable project, rewrote Task Capsule documentation from the literal generated files, and passed exact-content, build, and full-height rendering checks. |
| 2026-08-14 | Draft | Marked the non-CLI implementation interval in every complete agent lifecycle command trace; content regression and production build passed, while human visual review remains pending. |
| 2026-08-14 | Draft | Separated lifecycle narrative from atomic task-command reference, removed internal diagnostic-routing prose, and passed content regression plus production build; human visual review remains pending. |
| 2026-08-14 | Draft | Separated first-run Getting Started from Init Reference, removed public upgrade-repair prose, and passed content regression plus production build; human visual review remains pending. |
| 2026-08-14 | Draft | Removed the sidebar emblem and completed a twelve-page ownership/internal-vocabulary audit; content tests, production build, and representative desktop browser review passed, while human visual review remains pending. |
| 2026-08-14 | Draft | Removed Approval Boundaries and all release/external-authority product claims from public docs and diagrams; content tests, production build, and desktop browser review passed, while human visual review remains pending. |
| 2026-08-14 | Draft | Replaced abbreviated TASK/HANDOFF examples with complete independent contract explanations and full generated-shape examples; content tests, production build, diff check, and long-page browser review passed, while human visual review remains pending. |
| 2026-08-14 | Draft | Current-source fact checking found three semantic problems in the first complete examples, preserved the failed result, corrected controlled values and lifecycle state, and proved the revision through reviewed closed-valid execution. |
| 2026-08-14 | Done | Human visual review and conditional close authorization completed; final typechecks, 1,062 main tests, 145 HADARA-dev tests, docs-site validation, evidence reconciliation, and close-source prose are current. |
