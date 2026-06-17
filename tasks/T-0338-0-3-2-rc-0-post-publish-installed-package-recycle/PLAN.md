# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read T-0338 spec and current post-publish handoff. | Done | `docs/specs/0.3.2/capsules/T-0338_0_3_2_rc0_Post_Publish_Installed_Package_Recycle.md`; 0.3.2 worker/design docs |
| 2 | Verify registry metadata and dist-tags for `hadara@0.3.2-rc.0`. | Done | `npm --cache /tmp/hadara-npm-cache view hadara@0.3.2-rc.0 version dist-tags --json` returned version `0.3.2-rc.0`, `latest=0.3.0`, `next=0.3.2-rc.0` |
| 3 | Install `hadara@0.3.2-rc.0` into a temp prefix and run installed-bin version/help/docs smokes. | Done | Installed bin reported `packageVersion: "0.3.2-rc.0"`; lifecycle help and commands registry executed |
| 4 | Verify installed Evidence v2 list/add-command exact resolution workflow. | Done | Text list exposed `[ev:T-0001:05029b568eb84972838e4b79] ... validation/failed`; JSON exposed durable id fields; `--resolves ev:T-0001:05029b568eb84972838e4b79` appended passed evidence |
| 5 | Run fresh init and disposable lifecycle smokes, then clean up temp folders. | Done | Fresh init/docs passed; disposable lifecycle smoke reached `closed-valid`; `/tmp/hadara-t0338-recycle` and `/tmp/hadara-npm-cache` removed |
| 6 | Document findings, evidence, and stable/rc1 decision inputs. | Done | `ev:T-0338:59d881bdd12749f6a3a1ea87` |
