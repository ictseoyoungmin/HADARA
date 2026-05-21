# Files

| Path | Action | Reason |
|---|---|---|
| src/providers/provider-contract.ts | Updated | Add ProviderError code vocabulary and request metadata for timeout, retry, and fallback models. |
| src/providers/scripted-provider.ts | Added | Provide deterministic provider behavior for harness/replay workflows before real adapters. |
| tests/contract/provider-contract.test.ts | Updated | Cover ScriptedProvider responses, stream invariants, and normalized unmatched-script errors. |
