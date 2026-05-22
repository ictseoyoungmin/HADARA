# Context

- T-0021 added the bounded deterministic agent loop with `ScriptedProvider` and fake-shell observations.
- T-0023 hardened CLI file input boundaries.
- T-0024 added public evidence artifact redaction and binary rejection.
- T-0025 added strict CLI argument helpers.
- `docs/DEVELOPMENT_SLICES.md` lists Agent loop evidence attachment as slice 13.

The current slice should only attach deterministic fake-shell loop outputs as evidence. It must not add real shell execution or network provider behavior.
