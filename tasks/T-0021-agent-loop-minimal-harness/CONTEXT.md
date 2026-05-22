# Context

- `docs/AGENT_HANDOFF.md` recommends a minimal agent loop harness after T-0020.
- Existing deterministic building blocks are `ScriptedProvider`, provider fallback executor, and `runFakeShellCommand`.
- Host WSL lacks a working Linux `node`; Docker copy-then-validate is the known validation path.
