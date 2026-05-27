# Risks

| Risk | Mitigation |
|---|---|
| Fixture could be mistaken for real shell or provider dogfooding. | Keep the replay inside deterministic temp-project tests and document shell execution, provider calls, MCP writes, and release/package execution as out of scope. |
| The fixture could drift from current protocol docs. | Assert key context export guidance and run done-level harness validation in the fixture. |
| Temp-project helpers could bypass the user-facing CLI path too much. | Exercise the same shared services and stores used by CLI/MCP read surfaces: context export, policy service, evidence store, handoff writer, Task Capsule creation, and harness validation. |
