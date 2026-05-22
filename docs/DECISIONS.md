# DECISIONS

## D-0001: TypeScript + Node.js for bootstrap

Reason:
- Cross-platform CLI and dashboard sharing.
- Easy packaging with portable Node runtime.
- Strong ecosystem for provider SDKs and test runners.

## D-0002: Harness-first development

Reason:
- LLM output is non-deterministic.
- Agent loop must be tested with MockProvider and ScriptedProvider before real model integration.

## D-0003: Separate portable store and project store

Reason:
- USB/portable state should not pollute project history.
- Project handoff state must be committed so external agents can continue.

## D-0004: Public evidence artifact baseline policy

Reason:
- Public Task Capsule artifacts are committed project state, so they must not copy secret-like content.
- Binary evidence needs a dedicated sanitized/private workflow; until then, public artifacts are limited to UTF-8 text.
