# Context

Host Node/npm is not reliable in this workspace, and direct `npm ci` on the mounted workspace can fail on symlink creation. Reusing a long-lived Docker container with dependency work under `/tmp/hadara` is faster and more stable than rebuilding from scratch for every CLI action.
