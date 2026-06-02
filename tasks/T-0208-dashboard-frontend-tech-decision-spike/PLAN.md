# Plan

| Step | Status | Evidence |
|---|---|---|
| Confirm approach B with the owner. | Done | Owner selected B. |
| Build esbuild+preact pipeline emitting one self-contained asset. | Done | dashboard/build.mjs inlines JS/CSS/fallback into docs/design/dashboard/index.html. |
| Add external-resource guard and Docker build runner. | Done | build.mjs guard; scripts/dashboard-build.sh (node:22-bookworm). |
| Record the decision and dependency model. | Done | DECISIONS.md D-0011; package.json/lock updated. |
