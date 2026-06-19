# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| TD-1 | Reject over-budget context slice payloads instead of truncating raw text. | Accepted | Byte truncation can break line/source fidelity; C4 promises bounded original text. | User request; C4 spec. |
| TD-2 | Deny `.hadara/local/**` in raw context slice by default. | Accepted | Local cache/private state is derived or local-only and not canonical project source text. | C6 cache-is-not-truth rule. |
| TD-3 | Treat `In Progress` acceptance rows as incomplete for Done tasks. | Accepted | Acceptance drift is serious in HADARA and should fail before close. | T-0370 AC-6 drift. |
