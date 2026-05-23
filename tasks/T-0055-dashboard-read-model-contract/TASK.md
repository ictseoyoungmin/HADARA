# T-0055 Dashboard Read Model Contract

## Goal

Define how the future HADARA dashboard consumes Operations Status JSON without implementing dashboard UI.

## Scope

- Add dashboard field mapping for the operations home view.
- Document empty and degraded-state behavior.
- Document color/status semantics.
- Map dashboard areas back to the reference mockup.
- Add a sample `hadara.ops.status.v1` fixture.
- Add `health` to Operations Status JSON.
- Split true raw status counts from normalized status counts.

## Out of Scope

- Dashboard HTML implementation.
- React/Vite project setup.
- Dashboard routing or state management.
- Live MCP process monitoring.
- Provider calls.
- Shell execution.

## Status

Done
