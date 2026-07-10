# Deterministic Context Slice Raw Adapter Spec

## Status

Merged final planning specification.

## Goal

Provide source-addressed original text slices from selected large files, logs, source files, tests, and Markdown docs.

This feature should reduce token waste without summarizing content.

## Core Principle

Do not summarize.

Return original text with:

```text
path
sourceHash
startLine
endLine
strategy
reason
confidence
```

## Dependency

Works best after:

```text
Context Pack
Code Link Layer
Managed sections
```

Can also be used standalone for explicit path/range slicing.

## Non-Goals

- No summarization.
- No proof claims based on slices alone.
- No source mutation.
- No evidence append.
- No validation execution.
- No broad file discovery beyond explicit path or context pack candidates.
- No local/remote model.
- No vector retrieval.

## CLI Surface

```bash
hadara context slice --path <path> --from <line> --to <line> --json
hadara context slice --path <path> --symbol <name> --json
hadara context slice --path <path> --keyword <text> --window 40 --json
hadara context slice --path <path> --tail 200 --json
hadara context slice --path <path> --managed-section <section-id> --json
hadara context slice --task T-XXXX --candidate <candidate-id> --json
```

All commands are read-only.

## JSON Contract

### `hadara.contextSlice.v1`

```ts
export interface ContextSliceReport {
  schemaVersion: 'hadara.contextSlice.v1';
  command: 'context.slice';
  ok: boolean;
  generatedAt: string;
  path: string;
  sourceHash: string;
  lineCount: number;
  strategy:
    | 'explicit-range'
    | 'symbol-neighborhood'
    | 'keyword-window'
    | 'tail-window'
    | 'diff-hunk'
    | 'managed-section'
    | 'context-candidate';
  slices: ContextSlice[];
  summary: {
    sliceCount: number;
    totalLines: number;
    truncated: boolean;
  };
  issues: ContextSliceIssue[];
}
```

### ContextSlice

```ts
export interface ContextSlice {
  id: string;
  startLine: number;
  endLine: number;
  text: string;
  reason: string;
  confidence: 'explicit' | 'derived' | 'heuristic';
  sourceHash: string;
}
```

### Issue

```ts
export interface ContextSliceIssue {
  severity: 'info' | 'warning' | 'error';
  code:
    | 'CONTEXT_SLICE_FILE_NOT_FOUND'
    | 'CONTEXT_SLICE_OUTSIDE_PROJECT'
    | 'CONTEXT_SLICE_RANGE_INVALID'
    | 'CONTEXT_SLICE_RANGE_CLAMPED'
    | 'CONTEXT_SLICE_TOO_LARGE'
    | 'CONTEXT_SLICE_SYMBOL_NOT_FOUND'
    | 'CONTEXT_SLICE_KEYWORD_NOT_FOUND'
    | 'CONTEXT_SLICE_BINARY_REJECTED'
    | 'CONTEXT_SLICE_DEGRADED';
  message: string;
  path?: string;
  fixHint?: string;
}
```

## Strategy Details

### explicit-range

Input:

```bash
--from 120 --to 180
```

Rules:

- 1-indexed line numbers.
- default max lines: 300.
- invalid range returns error unless clamping is explicitly allowed.

### symbol-neighborhood

Input:

```bash
--symbol appendEvidenceWithResult
```

Rules:

- Use Code Link Layer symbol index if available.
- Include symbol body if line range known.
- If exact body unavailable, include a bounded neighborhood.
- If symbol not found, return `CONTEXT_SLICE_SYMBOL_NOT_FOUND`.

### keyword-window

Input:

```bash
--keyword "EVIDENCE_RESULT_OUTCOME_MISMATCH" --window 40
```

Rules:

- Find exact substring first.
- Default max windows: 3.
- Merge overlapping windows.
- Return original text only.

### tail-window

Input:

```bash
--tail 200
```

Rules:

- Return last N lines.
- Useful for logs.
- Default max tail: 500 lines.

### managed-section

Input:

```bash
--managed-section task-handoff-current-state
```

Rules:

- Parse managed section marker.
- Return exact managed section boundaries.
- Include marker lines by default.
- If marker malformed, return issue.

### context-candidate

Input:

```bash
--task T-XXXX --candidate <candidate-id>
```

Rules:

- Candidate id must come from context pack.
- Use candidate strategy and path.
- Reject unknown candidates.

## Safety Rules

- Reject paths outside project root.
- Reject binary files.
- Enforce max line and max byte budgets.
- Do not read ignored dependency/cache directories unless explicitly allowed and safe.
- Never mutate files.
- Never append evidence.
- Never treat a slice as proof.

## Development Plan

1. Implement safe file containment and text/binary detection.
2. Implement explicit range slicing.
3. Implement tail slicing.
4. Implement keyword window slicing.
5. Implement managed section slicing.
6. Add symbol slicing after Code Link Layer.
7. Add context candidate slicing after Context Pack.
8. Add docs and tests.

## Tests

```bash
npm run test:focused -- tests/unit/context-slice.test.ts
npm run build
npm test
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| CS-AC1 | Explicit line-range slicing works. |
| CS-AC2 | Keyword-window slicing works and merges overlaps. |
| CS-AC3 | Tail-window slicing works. |
| CS-AC4 | Managed-section slicing works. |
| CS-AC5 | Paths outside project are rejected. |
| CS-AC6 | Binary files are rejected. |
| CS-AC7 | Output includes sourceHash/startLine/endLine/text. |
| CS-AC8 | No summarization occurs. |
| CS-AC9 | Command is read-only. |
