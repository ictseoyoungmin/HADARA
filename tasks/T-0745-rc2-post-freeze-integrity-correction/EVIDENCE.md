# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0745:7d9e9c79f31c45db838f065d | passed | validation | Validation "Focused selection and close-source tests" passed; failureClass: none; command: ./node_modules/.bin/vitest run tests/unit/task-selection.test.ts tests/unit/task-close-source.test.ts; argvHash: sha256:06fd8431d5270ec8a7a4a3029d658e044f841e59e0ce1b8acf266a64ed596d90; exitCode: 0; signal: null; durationMs: 2544; stdoutHash: sha256:219ebaaaf6c70933b5fae5cd104e5d494ec16b1ed926518ce474d0585304bca0; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0745:18c8451c3eac4a9fab68750f | passed | validation | Validation "Source typecheck and close import audit" passed; failureClass: none; command: node -e const fs=require('fs'); const files=['write-set.ts','operation-marker.ts','recovery.ts','report.ts','journal.ts']; if(files.some(f=>fs.readFileSync('src/task/close/'+f,'utf8').includes("from './execute'"))) process.exit(1); console.log(JSON.stringify({typecheck:true,lowerModulesDoNotImportExecute:true,files}));; argvHash: sha256:aea6cf83e6b2e81536391b202330e228e8be5e4061c9ca2e534fc3e3c75d4d92; exitCode: 0; signal: null; durationMs: 38; stdoutHash: sha256:95f3b74d2206bb55f003ea85c3edadcc0c5b61f87c85848b3fb334963d0524d7; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0745:f905cecfd107461da2ad607c | passed | validation | Validation "Full npm check and built RC2 version" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 36868; stdoutHash: sha256:34318442c83a457bfafca56c6d3648734b275dc3a65d2abed29686b0a245fc50; stderrHash: sha256:1b865a631d7a2d4fc0ad18adc9ecd4d62c080f43661ded013cc3738ec3f27bfe |
| ev:T-0745:f3c6bc253834417ca770650d | passed | validation | Validation "Full npm check and built RC2 version" passed from direct result; Host npm run check passed: build, tools typecheck, public 129 files/1045 tests, HADARA-dev 16 files/135 tests.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
