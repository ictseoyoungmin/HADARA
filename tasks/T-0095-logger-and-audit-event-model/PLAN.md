# Plan

1. Read required HADARA protocol docs, T-0094 handoff, and v1.0 logger/audit planning notes.
2. Define the event model/schema as the smallest useful logger/audit slice.
3. Update existing audit writes to emit structured event-compatible records without changing user-facing CLI output.
4. Add focused tests for event normalization, redaction, schema registration, and audit compatibility.
5. Run Docker validation, attach evidence, and update project tracking docs.
