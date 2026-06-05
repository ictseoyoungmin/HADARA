# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Delete only the four unused root bootstrap launcher files in T-0270. | Accepted | They are no longer active README/package/release entrypoints, while broader repo skeleton cleanup would need separate ownership. | Reference search and package metadata check. |
| D-2 | Preserve Hermes and `.hadara` context files in this capsule. | Accepted | They remain compatibility/context documentation rather than disposable bootstrap launchers. | File inventory check. |
| D-3 | Leave historical spec references intact. | Accepted | They describe earlier portable launcher/package plans and changing them would be broad documentation archaeology. | Focused reference search. |
