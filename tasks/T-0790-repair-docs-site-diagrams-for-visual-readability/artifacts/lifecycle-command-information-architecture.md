# Lifecycle and Task Command Information Architecture

## Problem

`Lifecycle Workflow` and `Task Lifecycle` both appeared to describe the same loop. Their intended distinction existed only implicitly through sidebar grouping and scattered prose, so the site could read as two incomplete lifecycle narratives.

The workflow page also exposed an internal diagnostic-routing caveat that did not help a normal reader understand HADARA.

## Resolution

### Lifecycle Workflow

Owns the end-to-end operating narrative:

1. orient;
2. establish the bounded contract;
3. implement;
4. validate;
5. preserve evidence;
6. close with proof.

It explains stage relationships, durable cross-session state, failure history, and the stop boundary.

### Task Commands

The former `Task Lifecycle` navigation label is now `Task Commands`. This page is explicitly an atomic command reference for:

- `task status`;
- `task create`;
- `task close`.

It defines when each operation is called, what it reads or writes, and what success or failure means. It links back to Lifecycle Workflow for sequence and to Evidence & Validation for proof-producing command semantics.

## Removed public prose

The workflow page no longer mentions the diagnostic `context graph` projection or removed `context pack` routing. Public current-state guidance stops at status, the selected Task Capsule, and registered read-map sources.

## Validation

- `npm test` in `docs/site`: passed
- `npm run build` in `docs/site`: passed
- Content regression enforces the distinct labels, narrative/atomic ownership statements, all six workflow concepts, and absence of the removed diagnostic prose.

T-0790 remains open for human visual review.
