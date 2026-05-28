# Risks

| Risk | Mitigation |
|---|---|
| Dry-run could be mistaken for real package smoke | Report `mode: "dry-run"`, `readOnly: true`, all execution markers false, and document T-0131/future smoke boundaries. |
| Public output could leak local source/workspace paths | Redact absolute paths and test that private path fragments are absent. |
| The command could accidentally write artifacts or evidence | Keep implementation to report construction only; no filesystem writes except read-only package metadata checks. |
