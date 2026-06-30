# MEMORY

## 2026-06-30 Docker Rebuild

- When the `hadara-dev` container is missing, recreate it with the SOP `docker run -dit --name hadara-dev ... node:22-bookworm bash`.
- On mounted `/mnt/f` workspaces, `docker exec ... tar -C /workspace .` can stall while walking the mount. If the worktree is clean, `git archive HEAD -o /tmp/hadara-dev-head.tar`, `docker cp` into the container, then extract/build in `/tmp/hadara` is faster and still reproducible.
