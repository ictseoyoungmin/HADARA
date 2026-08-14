# Lifecycle Implementation Marker Validation

## Scope

The complete agent lifecycle command traces now identify the non-CLI implementation interval between Task Capsule creation and validation or close.

## Marker

```shell
# Agent implementation work: update source, tests, and task-owned docs inside the capsule.
```

## Public pages

- `home`
- `workflow`
- `cli-task-lifecycle`

Each marker follows `hadara task create` and precedes the next validation or close command. This prevents the trace from implying that lifecycle work consists only of consecutive CLI invocations.

## Validation

- `npm test` in `docs/site`: passed
- `npm run build` in `docs/site`: passed
- Content regression checks marker presence and ordering in all three traces.

Human visual review remains pending, and T-0790 remains open.
