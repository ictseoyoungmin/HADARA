# Decisions

| Decision | Rationale |
|---|---|
| Add `health` instead of changing `ok`. | `ok` remains report generation success; `health` tells dashboards whether project state is complete or degraded. |
| Preserve raw status labels separately from normalized keys. | Dashboards need stable keys, while operators may need to inspect exact source status text. |
| Use a committed sample fixture. | It lets future UI work start from a stable contract without invoking live CLI code. |
