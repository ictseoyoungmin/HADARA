import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;

async function json(path, options = {}) {
  const res = await fetch(base + path, { headers: { 'content-type': 'application/json' }, ...options });
  const body = await res.json();
  assert.ok(res.ok, body.error || path);
  return body;
}

try {
  const health = await json('/api/health');
  assert.equal(health.ok, true);
  const before = await json('/api/items');
  assert.ok(before.items.length >= 8);
  const created = await json('/api/items', {
    method: 'POST',
    body: JSON.stringify({ title: 'Smoke import preview', owner: 'QA', status: 'Ready', priority: 'High', due: '2030-01-01', effort: 3, confidence: 88, risk: 1, tags: ['smoke'] })
  });
  assert.equal(created.title, 'Smoke import preview');
  const updated = await json('/api/items/' + encodeURIComponent(created.id), { method: 'PATCH', body: JSON.stringify({ status: 'Done', confidence: 96 }) });
  assert.equal(updated.status, 'Done');
  const report = await json('/api/report');
  assert.ok(report.readinessScore >= 0);
  const exported = await json('/api/export');
  assert.ok(Array.isArray(exported.items));
  const removed = await json('/api/items/' + encodeURIComponent(created.id), { method: 'DELETE' });
  assert.equal(removed.ok, true);
  console.log('FlowForge smoke passed', JSON.stringify({ items: before.items.length, readiness: report.readinessScore }));
} finally {
  await new Promise(resolve => server.close(resolve));
}

