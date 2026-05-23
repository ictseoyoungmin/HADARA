# Context

T-0064 freezes v0.3 around read-only operations-layer surfaces. External agents should not infer HADARA state by scraping whichever capsule or handoff file was most recently visible. Context export must tell them to prefer stable CLI JSON and MCP read tools, then fall back to documents when MCP is unavailable.
