# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm view exact version | Confirm `hadara@0.3.4-rc.0` is absent before publish. | Yes | Passed: E404 absent | `ev:T-0418:847b8df0510f4010a451a67a` |
| npm dist-tag view | Confirm current npm tags before publish. | Yes | Passed: `latest=0.3.3`, `next=0.3.3-rc.0` | `ev:T-0418:847b8df0510f4010a451a67a` |
| release publish dry-run | Confirm publish gate/readiness without mutation. | Yes | Passed on ext4 copy | `ev:T-0418:5050dfc2b6694a3195d8d29a` |
| prepare publish environment | Build a clean ext4 clone for operator publish. | Yes | Passed after recreating interrupted clone | `ev:T-0418:d834f79b3a96479098c96d4d` |
| refresh stale publish clone | Resolve helper preflight failure caused by stale `/root/hadara-publish` clone. | Yes | Passed: clone refreshed to `f097ad5`, rebuilt, version/gate passed | `ev:T-0418:e5dcae54f6fa43309b713862` |
| git diff --check | Catch whitespace errors in T-0418 prep docs. | Yes | Passed | `ev:T-0418:3a63626f562e4bd0906b1f34` |
| post-publish npm view/dist-tags | Verify published version and npm dist-tags after operator publish. | Yes | Passed: npm publish completed; npm view verified `hadara@0.3.4-rc.0`; dist-tags returned `next=0.3.4-rc.0`, `latest=0.3.3`. | `ev:T-0418:0a5bb04d6fbd4487ad7f22c5`, `ev:T-0418:b9edbf6b2cf14e74869eece6` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| GitHub Release draft | No | Not requested for this RC publish capsule. | Skipped by helper | `ev:T-0418:0a5bb04d6fbd4487ad7f22c5` |
| Docker/PyPI publish | No | Explicitly out of scope. | Not Run | Out of scope |
