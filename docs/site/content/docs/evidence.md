---
id: evidence
group: Core model
label: Evidence & Projections
short: Canonical append-only proof and the human-readable view over it.
eyebrow: Verification model
title: Agents record evidence. Humans inspect the projection.
lead: HADARA keeps evidence as append-only machine-authoritative history, then exposes a human-readable projection so people can review validation, close proof, and unresolved failure without typing evidence commands or editing the log.
callout: In ordinary use, a human should never need to type evidence records. `evidence.jsonl` is agent/tool-written canonical history; `EVIDENCE.md` is the review surface.
audience: shared
order: 6
---

## 01 · Canonical
### `evidence.jsonl` is the authority
Evidence is append-only. Failed or blocked history is not rewritten away. New records resolve, supersede, or accept residuals through explicit relationships.

## 02 · Project
### `EVIDENCE.md` is for people
Current Task Capsule source scaffolds `EVIDENCE.md` with the sentence “This file is a human-readable projection from `evidence.jsonl`” and immediately marks it “Do not hand-edit this file.”

## 03 · Audit
### Close proof can become stale
A close proof is valid only for the source and validation identity it audited. Later close-source drift changes the derived close state rather than silently rewriting history.

## Canonical state versus human-readable projection

```text
Agent / validation tool
        │
        │ append
        ▼
  evidence.jsonl              ← canonical append-only evidence
        │
        │ project / summarize
        ▼
   EVIDENCE.md                ← human-readable projection
        │
        ▼
  Human review
```

A **human-readable projection** is a representation designed for inspection rather than authority. It may summarize, group, or format canonical records, but it must not invent successful evidence, hide unresolved failure, or become a second independently edited evidence database.

For `EVIDENCE.md` specifically:

- the human reads it;
- HADARA/agent tooling maintains it through supported paths;
- `evidence.jsonl` remains canonical;
- failed/blocked evidence must stay visible until explicitly resolved or dispositioned;
- durable relationships use persisted `ev:` evidence identities rather than vague text matching.

## What humans should expect to see

A useful projection answers questions such as:

| Question | Projection should expose |
|---|---|
| What was actually checked? | Validation summary and outcome. |
| Did anything fail or block? | Failed/blocked/residual records remain visible. |
| What proves acceptance? | Durable evidence references tied to the relevant criteria. |
| Is the task really closed? | Close proof and current derived close state. |
| Did proof go stale? | Currentness mismatch rather than an old success presented as current. |

## What the agent does behind the scenes

The detailed Evidence & Validation protocol page documents the CLI used by agents and integrations. Conceptually, the loop is simply:

```text
run a real check → append reduced evidence → reference durable IDs → close/audit against current state
```

The human does not need to reproduce that sequence at a shell prompt. The important human contract is that the resulting proof is inspectable and that failure history has not been silently erased.
