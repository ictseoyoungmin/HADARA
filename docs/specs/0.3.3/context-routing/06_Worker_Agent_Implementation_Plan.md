# Worker Agent Implementation Plan

## Purpose

This document tells a worker agent how to implement the context routing specs without reading every future roadmap document.

## Required Reading

For any context-routing task, read:

```text
docs/PROJECT_STATE.md
docs/AGENT_HANDOFF.md
docs/TASK_BOARD.md
docs/IMPLEMENTATION_SOP.md
docs/TASK_WORKFLOW_COMMANDS.md
docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md
the active spec file only
```

Do not read all context-routing specs unless the task is an architecture review.

## Implementation Phases

### Phase C1 — Project Context Graph Foundation + State Projection

Read:

```text
01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md
```

Suggested capsules:

1. Schema/types and fixture design.
2. Extractor contract.
3. Task Board + Task Capsule extractors.
4. Docs registry + command registry extractors.
5. Evidence extractor.
6. Managed section + decision + known problem extractors.
7. Release readiness extractor.
8. State projection and consistency diagnostics.
9. Graph builder and task context report.
10. CLI/read surface integration and tests.

### Phase C2 — Code Link Layer

Read:

```text
02_Code_Link_Layer_Spec.md
```

Suggested capsules:

1. Code index schema and ignore rules.
2. Import/export extraction.
3. Symbol extraction.
4. Command implementation/test file hints.
5. Test relation edges.
6. Context graph integration.

### Phase C3 — Context Pack

Read:

```text
03_Context_Pack_and_Session_Start_Spec.md
```

Suggested capsules:

1. Context pack schema and ranking.
2. Context pack from graph only.
3. State projection integration.
4. Code-aware context pack.
5. Slice candidate output.
6. Docs and examples.

### Phase C4 — Deterministic Context Slice

Read:

```text
04_Deterministic_Context_Slice_Raw_Adapter_Spec.md
```

Suggested capsules:

1. Safe line reader and source hashing.
2. Explicit range + tail slicing.
3. Keyword window slicing.
4. Managed section slicing.
5. Symbol slicing after Code Link Layer.
6. Context pack slice candidate integration.

### Phase C5 — Session Start

Read:

```text
03_Context_Pack_and_Session_Start_Spec.md
```

Suggested capsules:

1. Session start schema.
2. Current state composition.
3. Context pack consumption.
4. Lifecycle command suggestions.
5. Known-problem/proof/handoff integration.
6. Installed-package recycle.

### Phase C6 — Cache and Performance

Read:

```text
05_Indexing_Cache_Invalidation_and_Performance_Spec.md
07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md
```

Suggested capsules:

1. Source manifest and shared discovery.
2. Cache store and status read model.
3. Extractor shards and invalidation.
4. Fast cold build and graph budgets.
5. Code index cache integration.
6. Context pack warm path.
7. Optional cache warm command.

## General Rules

### Keep all context commands read-only

No graph, pack, slice, or session-start command should mutate project files.

### Do not create new truth

Graph, state projection, code index, context pack, and cache are projections.

### Prefer additive fields

Before adding new commands, consider adding context fields to:

```text
task status
status
docs required-reading
protocol doctor
```

### Command registry required

Any new public command must have command registry metadata:

```text
family
scope
requiredness
writeBoundary
actor
help text
JSON contract
```

### Source-addressed output

Any selected context from files should include:

```text
path
sourceHash
lineStart / lineEnd when applicable
reason
confidence
```

### Evidence required

Every implementation capsule must record:

```text
focused tests
full validation or documented fallback
CLI smoke when adding a command
docs update evidence
```

## Validation Baseline

Use Docker baseline when possible:

```bash
npm run dev:docker-sync-build
```

Focused examples:

```bash
npm run test:focused -- tests/unit/context-graph.test.ts
npm run test:focused -- tests/unit/state-projection.test.ts
npm run test:focused -- tests/unit/code-index.test.ts
npm run test:focused -- tests/unit/context-pack.test.ts
npm run test:focused -- tests/unit/context-slice.test.ts
npm run test:focused -- tests/unit/context-cache.test.ts
```

## Release Decision

These specs do not require immediate publish per capsule.

Publish only after:

```text
runtime command surface changes
package-facing README changes
generated init docs change
CLI JSON contracts change
```

and after release-readiness/recycle tasks are complete.

## Done Criteria for Each Capsule

- Scope implemented.
- Tests passed.
- Docs updated.
- Evidence appended.
- `task finish` / `task ready` / `task close` / `task audit-close` passed.
- Handoff points to next capsule.
