# Risks

| Risk | Mitigation |
|---|---|
| Hermes JSON/text output could drift during extraction. | Move existing branch behavior intact and run built CLI smokes. |
| Handoff update could write unexpected docs during smoke testing. | Run smoke in Docker-copied workspace and record only command behavior. |
