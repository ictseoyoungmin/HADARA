# Risks

| Risk | Mitigation |
|---|---|
| Static serving could accidentally become arbitrary file serving. | Use explicit route allowlisting only. |
| Users may mistake fixture data for live project state. | Keep fixture metadata and command output clear that this is sample-backed. |
