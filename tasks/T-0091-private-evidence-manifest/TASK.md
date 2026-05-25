# T-0091 Private Evidence Manifest

## Goal

Add a private evidence manifest path for private evidence collection without committing private artifact contents, private source paths, or machine-local state.

## Scope

- Create a private evidence manifest model under the private portable data store.
- When private evidence has a readable source path, copy the private artifact bytes to the private portable store and record a SHA-256 hash.
- Keep committed Task Capsule evidence Markdown and `evidence.jsonl` sanitized and free of private paths/raw content.
- Audit private evidence manifest writes to the private portable audit store.
- Add tests proving private evidence manifest creation, hashing, audit, and context-export exclusion.

## Out of Scope

- Encrypting private evidence content.
- Exposing private evidence manifests through MCP or broad read APIs.
- Changing public evidence artifact policy.
- Persisting machine-local source paths in committed project files.
- Adding provider, shell execution, dashboard, or broad MCP write behavior.

## Status

Done
