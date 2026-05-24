# Risks

| Risk | Mitigation |
|---|---|
| `/tmp/hadara` can become stale after workspace edits. | Resync from `/workspace` before validation or CLI creation. |
| Mounted workspace cannot safely host `node_modules`. | Run dependency installation inside container-local `/tmp/hadara`. |
