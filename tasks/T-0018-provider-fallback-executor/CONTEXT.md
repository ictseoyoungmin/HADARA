# Context

- `docs/AGENT_HANDOFF.md` recommends provider fallback executor or minimal ShellTool/TestTool harness next.
- T-0004 completed ProviderClient contract hardening but explicitly left fallback executor out of scope.
- MockProvider and ScriptedProvider exist and are sufficient for deterministic fallback tests.
- Real network providers remain out of scope.

