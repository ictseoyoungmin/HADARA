# Context

T-0046 documented `hadara.evidence.attach` as a future write-capable MCP tool but did not implement or advertise it.

T-0047 adds guard tests so future work cannot accidentally expose evidence attachment before a dedicated implementation capsule enables write behavior and proves the safety gates.
