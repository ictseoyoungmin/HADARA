# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use numeric T-0155 as the logical T-0154a follow-up. | Accepted | Existing Task Capsule and Task Board parsers expect `T-\d{4}` IDs; a literal `T-0154a` directory would be invisible to current checks. | Task Capsule creation and parser review. |
| D-2 | Keep expanded project-doc drift mostly warning-level. | Accepted | `protocol doctor` is a diagnostic surface, while harness validation remains the hard completion gate. | T-0154 doctor exit policy. |
