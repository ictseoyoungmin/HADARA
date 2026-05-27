# Risks

| Risk | Mitigation |
|---|---|
| Renderer and terminal state could disagree about visible task rows. | Put the height policy in shared constants and use it from both snapshot and terminal reducer options. |
| Work-card text could accidentally bypass read-model-first boundaries. | Use only existing `TuiReadModel` detail files, evidence records, and active-run resume projection already loaded by the read model. |
| Simplifying Resume Signals could hide operational state. | Keep detailed active-run/debt/release information in existing read-model surfaces and Next Recommended card; only align this Overview card with the mockup. |
| Moving search handling before numeric panel shortcuts could make panel switching unavailable after search. | Keep Enter/Escape as search completion/cancel controls and add a regression that `1` switches panels again after search exits. |
