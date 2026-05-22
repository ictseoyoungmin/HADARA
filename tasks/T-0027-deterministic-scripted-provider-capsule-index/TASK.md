# T-0027 Deterministic Scripted Provider and Capsule Evidence Index

## Goal

Fix deterministic harness behavior by making `ScriptedProvider` consume script steps in order and ensuring new Task Capsules include an empty `evidence.jsonl`.

## Scope

- Change `ScriptedProvider` from script-wide `find()` matching to sequential step consumption.
- Return structured non-retriable provider errors when the current step is exhausted or mismatched.
- Create empty `evidence.jsonl` files in new Task Capsules.
- Update regression tests for sequential script behavior and empty evidence indexes.

## Out of Scope

- Init profile improvements.
- Done-level harness validation.
- Run scenario scaffold helpers.
- Real provider adapters or real shell execution.

## Status

Done
