# Decisions

- Scope the guard to done-level validation only, because draft tasks are expected to have Draft rows.
- Require exactly one Task Board row for the validated task id to catch accidental duplicate append behavior.
- Check status and capsule path, but do not validate every historical Task Board row in this slice.
