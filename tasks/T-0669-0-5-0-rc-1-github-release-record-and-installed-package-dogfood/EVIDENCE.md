# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0669:9d08f787f7d64d85ad72c1b3 | passed | release | Operator completed npm publish for hadara@0.5.0-rc.1 and GitHub Release publication for v0.5.0-rc.1. npm publish output verified hadara@0.5.0-rc.1 through npm view; GitHub release commands returned URLs https://github.com/ictseoyoungmin/HADARA/releases/tag/untagged-3edb4f10a11c31b94152 and https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.5.0-rc.1, with the tagged release URL being the public v0.5.0-rc.1 release. |
| ev:T-0669:374d423870f14757ada477b2 | passed | release | Verified public release state from the workspace: npm view hadara@0.5.0-rc.1 returned version=0.5.0-rc.1 with dist-tags latest=0.4.6 and next=0.5.0-rc.1; curl -I -L https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.5.0-rc.1 returned HTTP/2 200. |
| ev:T-0669:39c8691d556943e68141f1fa | passed | validation | Docker installed-package dogfood passed in hadara-dev after installing public hadara@next from npm. Installed version reported packageVersion=0.5.0-rc.1; npm registry returned version=0.5.0-rc.1, latest=0.4.6, next=0.5.0-rc.1; fresh basic, standard, and governed projects passed init, task status, task create, context pack, and docs doctor; installed package recycle --execute for hadara@next expected 0.5.0-rc.1 passed with 75 command ids and no release/publish mutation. |
| ev:T-0669:92db1f03c50a4c369243c453 | passed | validation | Resolved first Docker dogfood harness failure by changing the script to run installed CLI commands from each scenario project cwd and by creating T-0001 before context pack; rerun passed all installed-package dogfood checks. |
| ev:T-0669:9bb85237a11344139325cc60 | passed | validation | docs doctor --scope all returned ok:true, health healthy, currentnessVerdict clean, requiredReadingIssues 0, canonicalConflicts 0, currentnessIssues 0, semanticDriftIssues 0 after recording npm/GitHub publication and Docker installed-package dogfood. |
| ev:T-0669:b8a55ca31ab1472f84a8b6d9 | passed | validation | Task finalize done-level readiness for T-0669 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:77a0833d8c2f40df5f5d22c43900bb3cf5af86f5beaad3954ec4720955f87afc |
| ev:T-0669:3cca113dbc7e48f7812bacda | passed | validation | Task finalize done-level readiness for T-0669 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:db376041e69b8816a2496fd3da15382d9ed8b5437a8a8b3e4e373c37ad1434ef |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0669:e1422f1a5e4a4bf8a241975b |
| close evidence | passed | ev:T-0669:1da2a500861e4e0996f73d0f |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0669:3f0ed20525474cc5b33780b6 | blocked | First Docker installed-package dogfood attempt exposed an invalid harness assumption: the script passed unsupported --root options and ran context pack without a task id, so the installed CLI correctly treated cwd=/tmp and context pack returned CONTEXT_PACK_TASK_NOT_FOUND. The script was corrected to run commands from each scenario cwd and to create T-0001 before context pack. | Resolved | ev:T-0669:92db1f03c50a4c369243c453 |
<!-- /hadara:slot -->
