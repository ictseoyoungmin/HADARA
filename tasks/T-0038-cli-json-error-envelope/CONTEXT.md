# Context

Review feedback found that JSON-mode commands can still fall through to raw `[HADARA] ERROR` stderr when argument parsing happens before command-specific try/catch blocks.

This task creates a shared fallback JSON error envelope for early/global CLI failures.
