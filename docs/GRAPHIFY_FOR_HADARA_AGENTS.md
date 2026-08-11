# Graphify for HADARA Agents

Graphify is a local, generated code/document relationship map. Use it to shorten repository orientation and refactoring impact analysis. It is an exploration aid, not a source of truth and not a replacement for the HADARA Task Capsule, project documents, source code, tests, or evidence.

## When to use it

Use Graphify before broad reading when you need to:

- locate the architectural hubs around a file, function, or class;
- find importers and likely regression tests before changing an API;
- trace a relationship between two known modules;
- identify a narrow set of files to read before implementation;
- check whether a refactor left the generated relationship map stale.

Do not use it as the only check for runtime behavior, authorization, provider behavior, dynamic loading, or task acceptance.

## Safety and authority boundary

`graphify-out/` is local generated state and is ignored by this repository. Graphify may read project files and its update/watch/export commands may write only generated Graphify output, but generated output must not be committed as HADARA project truth. Do not run Graphify over secret stores or broad paths outside the project boundary.

Authority order remains:

1. current source files and tests;
2. active Task Capsule and linked project specifications;
3. HADARA CLI/read models and recorded evidence;
4. Graphify's generated relationship projection.

If Graphify disagrees with source or task evidence, Graphify is stale or incomplete and must lose the decision.

## Document recency and authority

Graphify does not decide whether a document is current. If an archived, historical, superseded, or task-fixture document is included in the graph, its connections can make it look as relevant as a current document.

Treat these as routing signals, not current instructions:

- `docs/archive/**` and `docs/history/**` are historical unless a task explicitly links them for investigation;
- documents marked `historical`, `superseded`, or `archived` in the HADARA docs registry are not current design authority;
- `tasks/**` contains capsule history and fixtures; only the explicitly selected active capsule owns current task intent;
- a path under `docs/**` is not automatically authoritative just because Graphify found it.

Before following a document returned by Graphify, route it through HADARA:

```bash
hadara task status --task T-XXXX --json
hadara docs read-map --task T-XXXX --json
hadara docs explain docs/path/from-graphify.md --json
```

Use the current Task Capsule, active/linked registry documents, source, and tests as the current reading set. Read an old document only to understand history or an explicitly linked decision; never promote it to current guidance merely because it has a strong graph connection.

## Start and freshness check

Run commands from the project root:

```bash
command -v graphify || true
graphify --help
graphify check-update .
```

If `graphify-out/graph.json` already exists, use it for read-only exploration first. Resolve the executable through `command -v graphify`; if a user-local fallback is needed, use `"$HOME/.local/bin/graphify"` rather than a machine-specific absolute path.

Refresh the local code graph after source changes when the relationship view matters:

```bash
graphify update .
```

Use `graphify update . --force` only when deletions or a refactor intentionally make the rebuilt graph smaller. This changes generated local state, not source files. Avoid `watch` in ordinary agent work because it creates a long-running process and continuously mutates local generated output.

## Core commands

Prefer exact file or symbol labels over broad natural-language nouns.

```bash
# One file or symbol and its immediate relationships
graphify explain "context-graph.ts"
graphify explain "handleTaskCommand()"

# Reverse impact analysis; repeat --relation to narrow the edge type
graphify affected "context-graph.ts" --depth 2 --relation imports_from
graphify affected "validateSchema()" --depth 2

# Shortest relationship between two known nodes
graphify path "context-cache-store.ts" "session-start.ts" --undirected

# Most connected architectural hubs
graphify god-nodes --top 20

# A bounded natural-language traversal; increase budget only when needed
graphify query "What connects context graph cache to session start?" --budget 1200

# Inspect graph quality and measure the current projection
graphify diagnose multigraph --json --max-examples 10
graphify benchmark graphify-out/graph.json
```

`explain` is usually the best first command. `affected` is the best refactoring follow-up. `path` is useful when both endpoints are known. `query` is convenient for orientation but can start from common words such as `server`, `cache`, or `store` and return unrelated tests or fixtures.

## Refactoring workflow

### Add a function or class

1. Run `explain` on the nearest existing module and its public entry point.
2. Run `path` from the intended module to the CLI/service/test boundary.
3. Read the source and neighboring tests selected by the graph.
4. Implement the change in the active Task Capsule.
5. Run focused tests/typecheck and refresh Graphify if the new relationship matters.

### Change or rename a function/class

1. Run `explain "symbol()"` to see callers, containing file, and related tests.
2. Run `affected "symbol()" --depth 2` to collect reverse consumers.
3. Check string registries, command tables, schemas, and dynamic imports with `rg`; Graphify may not model them reliably.
4. Make the change, run focused validation, then run the relevant HADARA validation command and record evidence.

### Move, split, or remove a file

1. Run `explain "old-file.ts"` and `affected "old-file.ts"` before editing.
2. Use `path` to check important consumers and tests.
3. Perform the source change and update imports/registries explicitly.
4. Run `graphify update . --force` if the graph must reflect removed nodes.
5. Treat a clean graph update as supplemental evidence only; tests and typecheck decide correctness.

## HADARA-specific usage patterns

For context-routing work, these commands proved useful in the HADARA-dev graph:

```bash
graphify explain "context-graph.ts"
graphify explain "context-cache-store.ts"
graphify affected "context-graph.ts" --depth 2 --relation imports_from
graphify path "context-cache-store.ts" "session-start.ts" --undirected
graphify explain "server.ts"                         # resolves src/mcp/server.ts here
graphify god-nodes --top 15
```

The resulting map showed `context-graph.ts` imported by cache, code-index, context-pack, session-start, and extractor modules; `context-cache-store.ts` was a high-degree hub; and the MCP server connected through its registry and dispatch modules. These are good candidates for focused reading, not proof of runtime call order.

For a normal HADARA task, the complete sequence is:

```bash
hadara task status --json
hadara task status --task T-XXXX --json
graphify explain "target-file.ts"
graphify affected "target-file.ts" --depth 2
rg -n "targetSymbol|registryKey|schemaName" src tests docs
# edit only the active Task Capsule scope
hadara validation run --task T-XXXX --check "Focused validation" --update-task -- <command>
hadara task close --task T-XXXX --dry-run --json
```

Keep Graphify commands and conclusions in the Task Capsule's study/validation notes when they affected scope or review. Do not hand-edit `evidence.jsonl`; use the HADARA evidence/validation commands for durable evidence.

## Known limitations

- The graph is static and may miss runtime dispatch, dependency injection, string-based registries, configuration, generated code, and provider/network behavior.
- Broad queries are noisy. The current HADARA-dev graph contains source, tests, tools, task artifacts, and documents; generic labels can select unrelated fixtures.
- A graph can be stale after edits. Run `check-update` and refresh when needed.
- Graph diagnostics may report dangling endpoints or relation variants. Treat these as projection-quality warnings, not source defects.
- `benchmark` reports a workload-specific token reduction estimate. It is not a product performance guarantee.
- Graphify cannot establish whether a change satisfies HADARA acceptance criteria, security boundaries, evidence requirements, or close readiness.

When a result matters, open the cited file/line, inspect the active capsule and linked docs, then validate behavior through the repository's normal tests and HADARA evidence flow.
