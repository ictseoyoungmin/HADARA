# Context

External review identified five issues after the CLI extraction pass: unchecked permission mode casts, fake-shell non-zero exits not failing the overall agent loop, unchecked evidence result values, stale run scaffold files, and task create positional/global flag mixing.

This task hardens those runtime paths before moving on to Hermes/MCP expansion.
