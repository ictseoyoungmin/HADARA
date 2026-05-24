# T-0071 Reusable Docker Development Container

## Goal

Document and validate a reusable Docker container workflow for HADARA development.

## Scope

- Keep a `hadara-dev` Docker container running for repeated local work.
- Document how to build/test in container-local storage.
- Document how to create Task Capsules through the HADARA CLI with `--project /workspace`.
- Prefer CLI-created Task Capsules in agent instructions.

## Out of Scope

- Changing CLI behavior.
- Requiring all contributors to use Docker when host Node/npm works.
- Committing container-local state or dependencies.

## Status

Done
