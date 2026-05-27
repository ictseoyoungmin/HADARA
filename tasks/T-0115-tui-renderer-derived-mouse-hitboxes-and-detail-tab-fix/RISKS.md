# Risks

| Risk | Mitigation |
|---|---|
| Hitboxes drift from rendered text in compact or wide layout. | Generate hitboxes inside the snapshot renderer from the same layout branches that produce text. |
| Snapshot consumers treat new metadata as public API. | Keep schema name internal and preserve deterministic `text`/`lines`; document that hitboxes are internal presentation metadata. |
| Mouse clicks accidentally trigger writes. | Route actions only through existing read-only state transitions and focused terminal tests. |
