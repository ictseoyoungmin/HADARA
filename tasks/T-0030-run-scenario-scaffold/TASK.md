# T-0030 Run Scenario Scaffold

## Goal

Add a helper that scaffolds deterministic `hadara run` script and fake-shell fixture files from a task id and shell command.

## Scope

- Add `hadara run scaffold --task <task-id> --command <command> [--stdout <text>] [--stderr <text>] [--exit-code <n>] [--json]`.
- Create scenario files under `.hadara/scenarios/`.
- Generate a ScriptedProvider script that requests the fake shell command and then finishes from fixture output.
- Generate fake-shell fixtures for the requested command.
- Return stable JSON metadata for generated paths.
- Add focused tests.

## Out of Scope

- Real shell execution.
- Running the generated scenario automatically.
- Scenario editing UI.
- General scenario schema registry.

## Status

Done
