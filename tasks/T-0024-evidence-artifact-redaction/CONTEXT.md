# Context

T-0023 confined CLI file inputs to project-root realpaths. Public evidence artifacts still need content policy because copying an in-workspace log can commit secrets into `tasks/T-*/artifacts/`.

Existing behavior:

- Evidence summaries pass through `redactSecrets()`.
- Public artifacts are copied into Task Capsule artifact storage.
- Private evidence suppresses artifact path publication and does not copy artifacts.

T-0024 keeps the safe default small: public artifacts must be text and must not contain configured secret-like patterns.
