# Context

T-0048 made `tools/list` reflect `--enable-evidence-attach`, but `initialize` still reported fixed read-only metadata. External MCP clients need accurate startup metadata before they decide which operations are safe.
