# HADARA Documentation Site

This is the absorbed static documentation site for HADARA. It lives under the
main repository so the RC6 source candidate contains the exact site runtime,
Markdown content, assets, and content-contract tests used to build the public
documentation surface.

The site is a separate nested frontend and is not part of the root HADARA npm
package. External GitHub Pages publication is a separate operator capsule.

```bash
cd docs/site
npm ci
npm test
npm run build
```

Markdown under `content/docs/` is canonical site content. The Vite metadata
plugin reads the root `package.json` version, so the visible HADARA version is
not maintained independently.

## GitHub Pages

The repository workflow at `.github/workflows/docs-pages.yml` builds this site
and deploys `docs/site/dist` to GitHub Pages on pushes to `main` or a manual
workflow dispatch.

After the workflow is committed, enable it once in the repository settings:

`Settings → Pages → Build and deployment → Source → GitHub Actions`

The project site URL is:

`https://ictseoyoungmin.github.io/HADARA/`
