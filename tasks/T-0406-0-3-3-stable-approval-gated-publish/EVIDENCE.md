# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-22T10:16:50.289Z | command-log | Staged T-0406 stable 0.3.3 approval-gated publish capsule and package-facing docs; git diff whitespace check and stale wording scan passed; publish execution remains pending operator npm login and explicit approval. | passed | public | evidence.jsonl |
| 2026-06-22T10:45:52.612Z | command-log | Operator published hadara@0.3.3 to npm with tag latest; npm publish completed and helper verified npm view returned 0.3.3; GitHub Release draft was not requested. | passed | public | evidence.jsonl |
| 2026-06-22T10:45:52.612Z | command-log | Verified npm registry after stable publish: npm view hadara@0.3.3 version returned 0.3.3 and npm dist-tags returned latest=0.3.3, next=0.3.3-rc.0. | passed | public | evidence.jsonl |
| 2026-06-22T10:45:52.613Z | command-log | Installed hadara@0.3.3 from npm into a temporary consumer prefix and executed the installed bin; version reported packageVersion 0.3.3 and help lifecycle returned ok:true. | passed | public | evidence.jsonl |
| 2026-06-22T10:50:22.940Z | command-log | Task close validation for T-0406 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:df67ed9d30c68adb78ef10d93ed84b37ab5b3ed4ab4589d450ba1810c14f8a6d. | passed | public | evidence.jsonl |
| 2026-06-22T10:52:31.068Z | command-log | Task close validation for T-0406 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:3c321d04e2e8f6d5f883e8d41e544fbee8954f44ff5b5811bf3576983c18c35e. | passed | public | evidence.jsonl |
