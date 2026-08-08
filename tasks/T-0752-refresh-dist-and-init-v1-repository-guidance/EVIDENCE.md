# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0752:df33fdbff0e740038afef91f | passed | validation | Validation "Init v1 repository guidance" passed; failureClass: none; command: bash -lc ! rg -n "HADARA_CONTEXT/--profile (basic/standard/governed)" AGENTS.md docs/HADARA_WORKFLOW.md .hadara/context/READ_MAP.md && test -f .hadara/context/READ_MAP.md && test ! -e .hadara/context/HADARA_CONTEXT.md; argvHash: sha256:5a8af84cd4821135d168ed715d5ce5ca154d1ad6dfb23cbe075634ab3fecacdb; exitCode: 0; signal: null; durationMs: 125; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0752:b07acdfa107040658d1d13f2 | passed | validation | Validation "Dist build and version" passed; failureClass: none; command: bash -lc npm run build && test "$(node dist/cli/main.js version)" = "0.5.0-rc.2"; argvHash: sha256:67c22c275b92cea2c80c0eb3aea767c15c3e35c437ee925e5ceb03a54da6bd72; exitCode: 0; signal: null; durationMs: 7628; stdoutHash: sha256:e7a675731cbde9a55b6c9c5606633909473aed9c0298f173862f9588cbc128c7; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0752:b8c58b836c174580a6752615 | passed | validation | Validation "Fresh Init v1 governed fixture" passed; failureClass: none; command: bash -lc tmp=$(mktemp -d); trap "rm -rf \"$tmp\"" EXIT; plan=$(node dist/cli/main.js init --preset governed --project "$tmp" --json); hash=$(printf "%s" "$plan" / node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(JSON.parse(s).planHash))'); node dist/cli/main.js init --preset governed --project "$tmp" --execute --plan-hash "$hash" --json >/dev/null; test -f "$tmp/.hadara/context/READ_MAP.md"; test ! -e "$tmp/.hadara/context/HADARA_CONTEXT.md"; node dist/cli/main.js init doctor --project "$tmp" --json / node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s); if (!r.ok) process.exit(1);})' ; argvHash: sha256:e95feb9746bcd8bf49b17260755c901b312e2b71516a838cb8d7714669301ee2; exitCode: 0; signal: null; durationMs: 354; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0752:8fbde46b75754123a9fa3e5a | passed | validation | Task closePlan done-level readiness for T-0752 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:9953fb3ba3eae0865b52c115a09d6e04547bd6e9b0ee93a249aa20ac637741ad |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0752:da6753381686442ca2fe3da0 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
