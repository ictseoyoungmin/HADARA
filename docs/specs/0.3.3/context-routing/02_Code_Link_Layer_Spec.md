# Code Link Layer Spec

## Status

Merged final planning specification.

## Goal

Extend the Project Context Graph with deterministic source/test/symbol links.

The goal is to help agents avoid scanning unrelated source files and tests.

## Dependency

Requires Project Context Graph Foundation.

## Non-Goals

- No source modification.
- No deep whole-program semantic analysis.
- No multi-language support in first implementation.
- No raw line slicing in this spec.
- No proof claim based only on code links.
- No release/publish behavior.
- No local/remote model.
- No vector search.

## Initial Language Scope

Start with TypeScript and JavaScript.

The first implementation should target HADARA's own codebase.

## Input Sources

| Source | Use |
|---|---|
| `src/**/*.ts` | SourceFile nodes and symbol extraction. |
| `src/**/*.js` | SourceFile nodes and symbol extraction. |
| `tests/**/*.test.ts` | TestFile nodes and test relation extraction. |
| `tests/**/*.spec.ts` | TestFile nodes. |
| `tests/fixtures/**` | Fixture nodes. |
| `package.json` | Script/test metadata and package surface. |
| `tsconfig.json` | Source inclusion hints. |
| command registry | Command -> implementation file hints. |
| docs registry | Docs that describe command/source surfaces. |
| evidence records | Evidence -> validated command/file/test edges. |

## Ignore Rules

Never index:

```text
node_modules/
dist/
coverage/
.git/
.hadara/local/
.hadara/tmp/
.pytest_cache/
.mypy_cache/
.ruff_cache/
.venv/
venv/
```

All local cache paths must use:

```text
.hadara/local/cache/context/
```

Do not use `.hadara/cache/`.

## JSON Contract

### `hadara.codeIndex.v1`

```ts
export interface CodeIndexReport {
  schemaVersion: 'hadara.codeIndex.v1';
  command: 'code.index';
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  sourceHash: string;
  files: CodeFileNode[];
  symbols: CodeSymbolNode[];
  edges: CodeEdge[];
  summary: {
    sourceFiles: number;
    testFiles: number;
    fixtureFiles: number;
    configFiles: number;
    symbols: number;
    edges: number;
    degraded: boolean;
  };
  cache?: ContextCacheMetadata;
  issues: CodeIndexIssue[];
}
```

### CodeFileNode

```ts
export interface CodeFileNode {
  id: string; // file:<portable-path>
  path: string;
  kind: 'source' | 'test' | 'fixture' | 'script' | 'config' | 'unknown';
  language: 'typescript' | 'javascript' | 'json' | 'markdown' | 'unknown';
  hash: string;
  lineCount: number;
  exports: string[];
  imports: string[];
  commandFamilies: string[];
}
```

### CodeSymbolNode

```ts
export interface CodeSymbolNode {
  id: string; // symbol:<path>#<name>
  name: string;
  kind:
    | 'function'
    | 'class'
    | 'type'
    | 'interface'
    | 'const'
    | 'handler'
    | 'unknown';
  path: string;
  exported: boolean;
  line?: number;
  endLine?: number;
}
```

### CodeEdge

```ts
export interface CodeEdge {
  id: string;
  from: string;
  to: string;
  type:
    | 'IMPORTS'
    | 'EXPORTS'
    | 'DEFINES_SYMBOL'
    | 'TESTS_FILE'
    | 'IMPLEMENTS_COMMAND'
    | 'REFERENCED_BY_DOC'
    | 'VALIDATED_BY_EVIDENCE';
  confidence: 'explicit' | 'derived' | 'heuristic';
  reason: string;
  source: {
    path: string;
    line?: number;
    hash?: string;
    extractor: string;
  };
}
```

### Issue

```ts
export interface CodeIndexIssue {
  severity: 'info' | 'warning' | 'error';
  code:
    | 'CODE_INDEX_FILE_READ_FAILED'
    | 'CODE_INDEX_PARSE_DEGRADED'
    | 'CODE_INDEX_TOO_LARGE'
    | 'CODE_INDEX_UNSUPPORTED_LANGUAGE'
    | 'CODE_INDEX_IMPORT_UNRESOLVED';
  message: string;
  path?: string;
  fixHint?: string;
}
```

## Extraction Rules

### File classification

| Pattern | Kind |
|---|---|
| `src/**/*.ts` | source |
| `src/**/*.js` | source |
| `tests/**/*.test.ts` | test |
| `tests/**/*.spec.ts` | test |
| `tests/fixtures/**` | fixture |
| `scripts/**` | script |
| `package.json` | config |
| `tsconfig.json` | config |

### Import extraction

Support these patterns:

```ts
import x from './x';
import { x } from './x';
export { x } from './x';
const x = require('./x');
```

Resolve relative imports where possible.

Do not fail the index if an import cannot be resolved. Add warning.

### Exported symbol extraction

Initial patterns:

```ts
export function name
export class name
export interface name
export type name
export const name
export async function name
```

### Command implementation links

Prefer explicit command registry metadata:

```ts
implementationFiles?: string[];
testFiles?: string[];
```

Heuristic mapping from command family to handler file is allowed only as `heuristic` confidence.

Examples:

```text
command:evidence.list -> src/cli/evidence.ts
command:task.close -> src/cli/task.ts
command:release.dry-run -> src/release/*
```

### Test relation edges

| Signal | Confidence |
|---|---|
| test imports source file | explicit |
| command registry testFiles hint | explicit |
| test file name matches source file | derived |
| test text mentions command id | heuristic |
| evidence references test path | explicit |

## Graph Integration

Code nodes and edges should be merged into the existing Context Graph.

New node types may be added by extension:

```text
SourceFile
TestFile
FixtureFile
ConfigFile
Symbol
```

Do not change the C1 graph contract in a breaking way. Additive extension only.

## CLI Surface

Prefer additive graph option:

```bash
hadara context graph --include-code --json
hadara context graph --task T-XXXX --include-code --json
```

Dedicated candidates:

```bash
hadara code index --json
hadara code explain --path src/cli/evidence.ts --json
```

Do not add dedicated commands unless command registry placement is clear.

## Development Plan

1. Define code index schema.
2. Implement ignore rules.
3. Implement file discovery.
4. Implement import extraction.
5. Implement exported symbol extraction.
6. Add command registry implementation/test hints.
7. Add test relation heuristics.
8. Merge code index into graph as additive extension.
9. Add performance budget/degraded mode.
10. Add docs and tests.

## Tests

```bash
npm run test:focused -- tests/unit/code-index.test.ts tests/unit/context-graph-code.test.ts
npm run build
npm test
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| CL-AC1 | Source/test/config/fixture files are identified. |
| CL-AC2 | Basic imports and exported symbols are extracted. |
| CL-AC3 | Command registry may explicitly link commands to implementation/test files. |
| CL-AC4 | Test relation edges include confidence metadata. |
| CL-AC5 | Context graph can include code candidates additively. |
| CL-AC6 | Dependency/cache/generated directories are ignored. |
| CL-AC7 | No writes occur. |
| CL-AC8 | Unsupported language features degrade with warnings. |
