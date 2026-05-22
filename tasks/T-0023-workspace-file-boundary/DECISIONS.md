# Decisions

- Workspace file inputs must resolve via realpath containment before read/copy.
- Absolute paths are allowed only when they point inside the project root.
- `hadara run --max-steps` is bounded to integers from 1 through 32.
