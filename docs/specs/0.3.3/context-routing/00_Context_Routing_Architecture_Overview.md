# Context Routing Architecture Overview

## Status

Merged final planning specification.

## Purpose

This document defines HADARA's context-routing architecture.

The purpose is to reduce token waste for coding agents by selecting the right project context deterministically, instead of making agents repeatedly read broad Markdown and source files.

## Thesis

```text
HADARA should make context selection explicit, bounded, explainable, deterministic, and evidence-backed.
```

## Problem

AI coding agents often spend excessive tokens because context discovery is structurally inefficient:

```text
1. Read README.
2. Read broad docs.
3. Search source files.
4. Re-open files already inspected.
5. Re-read task/handoff/project state.
6. Run a command, hit a blocker, then read more docs.
7. Close or finish, discover state drift, then patch Markdown manually.
```

The root issue is weak context routing.

HADARA should answer:

```text
For this task, which documents, evidence records, commands, source files, tests, and line ranges are actually relevant?
```

## Core Product Direction

HADARA is not an agent runtime.

HADARA should become a project-local context routing layer for agentic development:

```text
Task state
+ document status
+ command lifecycle
+ evidence/proof state
+ release state
+ code/test links
+ source-addressed slices
= bounded agent context
```

## Core Principle

```text
Graph is not truth.
Graph is a rebuildable projection.
```

Canonical inputs remain:

```text
tasks/
docs/
docs registry
command registry
evidence.jsonl
managed section markers
release readiness artifacts
source files
test files
```

Derived outputs include:

```text
Project Context Graph
State Projection
Task Context Report
Code Index
Context Pack
Context Slice
Session Start packet
Dashboard/TUI/MCP read models
```

## No Local Model Rule

This line does not use:

```text
local LLMs
remote LLMs
embedding services
vector databases
semantic retrieval
```

The first implementation must be deterministic and explainable.

Optional semantic retrieval may be considered later, but it must remain advisory and must not satisfy proof/evidence/release gates.

## No Summarization Rule

HADARA should not summarize source content as the primary mechanism.

Instead, it should select original project context and, where useful, return source-addressed original text slices:

```text
path
sourceHash
startLine
endLine
strategy
reason
confidence
```

This preserves auditability and makes it clear what the agent actually read.

## Architecture Layers

```text
C1 Project Context Graph Foundation + State Projection
  - Task, document, evidence, command, release, known-problem graph
  - Derived state consistency projection

C2 Code Link Layer
  - Source files, test files, symbols, imports, command implementation hints

C3 Context Pack
  - Bounded read plan for a task/request

C4 Deterministic Context Slice
  - Original text line-range extraction

C5 Session Start
  - New-session bootstrap packet consuming context pack, graph, proof, handoff

C6 Cache / Invalidation / Performance
  - Local rebuildable cache and source manifest hardening
```

## Product UX Hierarchy

| Surface | Role |
|---|---|
| Raw graph | Diagnostic/developer read model. |
| Task context report | First graph-derived agent report. |
| Context pack | Intended primary agent UX after graph/code link exist. |
| Context slice | Original text line-range adapter used by context pack or explicit commands. |
| Session start | High-level resume packet; consumer of context pack/state/proof/handoff. |

## Non-Goals

- No new source of truth.
- No local/remote model dependency.
- No vector search.
- No automatic code modification.
- No validation execution from context commands.
- No evidence append from context commands.
- No document patching from context commands.
- No release mutation.
- No broad source scan as the first implementation.
- No proof claims based only on graph, code links, or slices.

## Required Safety Properties

| Property | Requirement |
|---|---|
| Rebuildability | Graph/cache must be rebuildable from committed artifacts and source files. |
| Explainability | Every selected context item must include reason and confidence. |
| Source-addressability | Slices must include path, hash, and line range. |
| Drift avoidance | Graph/state projection must not become new truth. |
| Boundedness | Context pack must cap read-first items and identify excluded docs. |
| Read-only behavior | Context routing commands do not mutate files. |

## Implementation Sequence

The recommended sequence is:

```text
C1 Project Context Graph Foundation + State Projection
C2 Code Link Layer
C3 Context Pack
C4 Deterministic Context Slice
C5 Session Start
C6 Cache / Invalidation / Performance Hardening
```

A minimal source manifest/cache can be introduced earlier if C1/C2 performance requires it, but cache must remain optional and non-authoritative.

## Versioning Guidance

This line changes public read models and likely adds CLI surfaces. It should use an RC cycle before a stable release.

Recommended shape:

```text
context-routing implementation
-> release readiness
-> rc publish
-> installed-package recycle
-> stable decision
```
