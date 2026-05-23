# Risks

| Risk | Mitigation |
|---|---|
| Guard tests create false confidence without checking runtime exposure. | Test both `tools/list` and `tools/call`. |
| Reserved issue codes imply write tools are available. | Keep tests and docs explicit that evidence attach remains unimplemented. |
| Runtime accidentally gains write behavior. | Assert `hadara.evidence.attach` is absent from advertised tool schemas. |
