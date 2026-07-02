import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlowStore } from './store.js';
import { buildReadinessReport } from './report.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const store = new FlowStore();
const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8']
]);

export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/health') return sendJson(res, { ok: true, app: 'flowforge', time: new Date().toISOString() });
      if (url.pathname === '/api/items' && req.method === 'GET') return sendJson(res, { items: await store.list(Object.fromEntries(url.searchParams.entries())) });
      if (url.pathname === '/api/items' && req.method === 'POST') return sendJson(res, await store.create(await readJson(req)), 201);
      if (url.pathname.startsWith('/api/items/') && req.method === 'PATCH') return sendJson(res, await store.update(decodeURIComponent(url.pathname.split('/').pop()), await readJson(req)));
      if (url.pathname.startsWith('/api/items/') && req.method === 'DELETE') return sendJson(res, await store.remove(decodeURIComponent(url.pathname.split('/').pop())));
      if (url.pathname === '/api/report') return sendJson(res, buildReadinessReport(await store.list()));
      if (url.pathname === '/api/export') return sendJson(res, await store.read());
      if (url.pathname === '/api/import' && req.method === 'POST') return sendJson(res, await store.replace(await readJson(req)));
      return serveStatic(url.pathname, res);
    } catch (error) {
      sendJson(res, { error: error.message || 'Server error' }, error.status || 500);
    }
  });
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

function sendJson(res, payload, status = 200) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(payload, null, 2));
}

async function serveStatic(requestPath, res) {
  const clean = requestPath === '/' ? '/index.html' : requestPath;
  const file = path.normalize(path.join(publicDir, clean));
  if (!file.startsWith(publicDir)) return sendJson(res, { error: 'Invalid path' }, 400);
  const data = await fs.readFile(file);
  res.writeHead(200, { 'content-type': mime.get(path.extname(file)) || 'application/octet-stream' });
  res.end(data);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4177);
  createServer().listen(port, () => console.log('FlowForge listening on http://127.0.0.1:' + port));
}

