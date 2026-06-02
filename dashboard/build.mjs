// Builds the HADARA Operator Console into a single self-contained static asset:
//   dashboard/src/*.tsx + dashboard/app.css  ->  docs/design/dashboard/index.html
//
// The output inlines all JS and CSS (no external/CDN resources) so it serves
// unchanged under the existing dashboard CSP (default-src 'self'; script-src
// 'self' 'unsafe-inline'; ...). esbuild + preact are resolved from DASH_DEPS
// (a node_modules dir) because this NTFS mount cannot host an npm install.
//
// Usage:
//   DASH_DEPS=/path/to/node_modules node dashboard/build.mjs
// or via Docker (see scripts/dashboard-build.sh).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const depsDir = process.env.DASH_DEPS || path.join(repoRoot, 'node_modules');

const esbuildEntry = pathToFileURL(path.join(depsDir, 'esbuild', 'lib', 'main.js')).href;
const esbuild = await import(esbuildEntry);

const entry = path.join(repoRoot, 'dashboard', 'src', 'app.tsx');
const cssPath = path.join(repoRoot, 'dashboard', 'app.css');
const templatePath = path.join(repoRoot, 'dashboard', 'index.template.html');
const fixturePath = path.join(repoRoot, 'docs', 'design', 'fixtures', 'hadara.ops.status.sample.json');
const outPath = path.join(repoRoot, 'docs', 'design', 'dashboard', 'index.html');

const result = await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  jsx: 'automatic',
  jsxImportSource: 'preact',
  nodePaths: [depsDir],
  legalComments: 'none',
  write: false,
  loader: { '.ts': 'ts', '.tsx': 'tsx' }
});

const js = result.outputFiles[0].text;
const css = readFileSync(cssPath, 'utf8');
const template = readFileSync(templatePath, 'utf8');

// Inline fallback fixture kept byte-aligned with the served sample fixture.
const fixture = readFileSync(fixturePath, 'utf8').trim();

// Guard: the authored bundle must contain no external/CDN resource references.
for (const needle of ['src="http', "src='http", 'href="http', "href='http", 'unpkg.com', 'jsdelivr', 'cdn.']) {
  if (js.includes(needle)) {
    throw new Error(`Build produced an external resource reference (${needle}); CSP requires self-only assets.`);
  }
}

const html = template
  .replace('/*__HADARA_CSS__*/', () => css)
  .replace('/*__HADARA_FALLBACK__*/', () => fixture)
  .replace('/*__HADARA_JS__*/', () => js);

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, html, 'utf8');

console.log(`[dashboard] built ${outPath}`);
console.log(`[dashboard] js ${(js.length / 1024).toFixed(1)} kB · css ${(css.length / 1024).toFixed(1)} kB · total ${(html.length / 1024).toFixed(1)} kB`);
