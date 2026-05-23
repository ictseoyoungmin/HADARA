# Decisions

| Decision | Rationale |
|---|---|
| Use a single static HTML file. | T-0056 should avoid build tooling and backend scope. |
| Keep an inline fallback fixture. | Opening the HTML directly from disk can block relative fetches in some browsers. |
| Show fixture provenance in the dashboard. | Operators should not mistake the sample dashboard for live status. |
