# Decisions

- The minimal loop uses a tiny JSON envelope for fake shell requests: `{"type":"tool_request","tool":"fake_shell","command":"..."}`.
- `hadara run` remains deterministic in this slice by requiring `--script <script.json>` rather than selecting real provider adapters.
- Fake shell observations are fed back as `tool` messages, and denied tool observations mark the run `ok: false` even if the provider later returns a final response.
