# T-0018 Provider Fallback Executor

## Goal

Add deterministic provider fallback orchestration on top of the existing ProviderClient contract before real provider adapters.

## Scope

- Add a provider fallback executor for chat requests.
- Try providers in order until one succeeds.
- Return attempt metadata for success and failure paths.
- Preserve existing ProviderClient contract types.
- Add contract tests using MockProvider and ScriptedProvider.

## Out of Scope

- Real network provider adapters.
- Cost accounting.
- Streaming fallback orchestration.
- Provider profile configuration.
- Agent controller integration.

## Status

Done
