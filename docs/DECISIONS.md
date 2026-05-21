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
