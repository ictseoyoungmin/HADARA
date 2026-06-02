# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Collapse the two diagnostic chip strips into one ambient provenance badge. | Accepted | Provenance should be ambient, not the headline (P4). | ui.tsx ProvenanceBadge. |
| D-2 | Add an AbortController timeout so a stalled read degrades instead of freezing at "Loading...". | Accepted | Found during live-render testing; prevents permanent loading state. | model.ts tryFetchJson. |
