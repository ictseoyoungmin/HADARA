# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Implement one public command id, `context.graph`, with `--task` selecting task mode. | Accepted | The spec lists full and task-scoped graph as variants of `hadara context graph`; one schema already carries optional task context. | ev:T-0352:d70ee6360acf43948d7cf620 |
| D2 | Keep the command read-only and return JSON by default for both JSON and text mode initially. | Accepted | The surface is a machine-readable routing report; no mutation, validation execution, cache write, or evidence append belongs here. | ev:T-0352:d70ee6360acf43948d7cf620 |
| D3 | Register the command as diagnostic/project-health metadata, not primary lifecycle. | Accepted | Context graph is useful for workers and reviewers but does not replace task lifecycle commands. | ev:T-0352:d70ee6360acf43948d7cf620 |
