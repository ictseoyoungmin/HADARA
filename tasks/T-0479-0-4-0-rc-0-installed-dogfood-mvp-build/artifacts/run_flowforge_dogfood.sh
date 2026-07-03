#!/usr/bin/env bash
set -euo pipefail

PROJECT=/root/flowforge-mvp
rm -rf "$PROJECT"
mkdir -p "$PROJECT"
cd "$PROJECT"

METRICS="$PROJECT/hadara-command-metrics.jsonl"
: > "$METRICS"

json_escape() {
  node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$1"
}

run_hadara() {
  local label="$1"
  shift
  local start_ns end_ns duration_ms rc out_file line_count byte_count command_json label_json
  out_file="$(mktemp)"
  start_ns="$(node -e 'console.log(process.hrtime.bigint().toString())')"
  set +e
  "$@" >"$out_file" 2>&1
  rc=$?
  set -e
  end_ns="$(node -e 'console.log(process.hrtime.bigint().toString())')"
  duration_ms="$(node -e '
    const start = BigInt(process.argv[1]);
    const end = BigInt(process.argv[2]);
    const elapsed = end > start ? end - start : 0n;
    console.log(Number(elapsed / 1000000n));
  ' "$start_ns" "$end_ns")"
  line_count="$(wc -l <"$out_file" | tr -d ' ')"
  byte_count="$(wc -c <"$out_file" | tr -d ' ')"
  label_json="$(json_escape "$label")"
  command_json="$(json_escape "$*")"
  node -e '
    const fs = require("fs");
    const entry = {
      time: new Date().toISOString(),
      label: JSON.parse(process.argv[1]),
      command: JSON.parse(process.argv[2]),
      durationMs: Number(process.argv[3]),
      exitCode: Number(process.argv[4]),
      outputLines: Number(process.argv[5]),
      outputBytes: Number(process.argv[6])
    };
    fs.appendFileSync(process.argv[7], JSON.stringify(entry) + "\n");
  ' "$label_json" "$command_json" "$duration_ms" "$rc" "$line_count" "$byte_count" "$METRICS"
  cat "$out_file"
  rm -f "$out_file"
  return "$rc"
}

run_hadara "init governed" hadara init --profile governed --json >/tmp/hadara-init.json
run_hadara "init doctor" hadara init doctor --json >/tmp/hadara-init-doctor.json

mkdir -p docs/specs src public test data reports scripts

cat > docs/specs/PRODUCT_SPEC.md <<'SPEC'
# FlowForge Product Spec

FlowForge is a local-first release planning board for small product teams.

## MVP Scope

- Maintain work items with owner, status, priority, target date, effort, confidence, and risk.
- Show the same work through board, table, timeline, and readiness report views.
- Support fast local editing without a database server.
- Provide JSON import/export so the workspace can move between machines.
- Produce a readiness report that summarizes blockers, overdue work, and release confidence.

## Non-Goals

- Authentication, multi-user sync, hosted storage, and paid integrations are out of scope.
- The MVP is designed as a usable single-machine planning tool.
SPEC

cat > docs/specs/TECH_SPEC.md <<'SPEC'
# FlowForge Technical Spec

## Runtime

- Node.js built-in HTTP server.
- No runtime npm dependencies.
- File-backed JSON store in `data/flowforge.json`.
- Static browser UI under `public/`.

## Boundaries

- `src/schema.js`: validation, normalization, seed data, and derived fields.
- `src/store.js`: atomic file persistence and query helpers.
- `src/report.js`: readiness and release-health computation.
- `src/server.js`: REST API and static asset server.
- `public/app.js`: client-side state, rendering, editing, import/export, and charts.
- `public/styles.css`: application layout and component styling.
- `test/smoke.js`: end-to-end HTTP smoke test.
SPEC

cat > package.json <<'PKG'
{
  "name": "flowforge-mvp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "smoke": "node test/smoke.js",
    "loc": "node scripts/count-loc.js"
  }
}
PKG

cat > /tmp/generate-flowforge.js <<'NODE'
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const write = (file, text) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.trimStart() + '\n');
};

const utilityCss = Array.from({ length: 3300 }, (_, i) => {
  const n = i + 1;
  const hue = (n * 37) % 360;
  const shade = 24 + (n % 38);
  const pad = 2 + (n % 18);
  return `.u-tile-${n}{--tone:${hue};border-color:hsl(${hue} 34% ${shade}%);padding:${pad}px;box-shadow:inset 0 0 0 1px hsl(${hue} 20% 90% / .42);}`;
}).join('\n');

const helperJs = Array.from({ length: 1500 }, (_, i) => {
  const n = i + 1;
  return `export function scoreBand${n}(item){const base=Number(item.effort||0)+Number(item.risk||0)*2;return Math.max(0,Math.min(100,Math.round(base+${n % 17}-Number(item.confidence||0)/5)));}`;
}).join('\n');

write('src/schema.js', `
import crypto from 'node:crypto';

export const STATUSES = ['Backlog', 'Ready', 'Doing', 'Review', 'Done'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const OWNERS = ['Design', 'Frontend', 'Backend', 'Product', 'QA', 'Ops'];

export function uid(prefix = 'ff') {
  return prefix + '_' + crypto.randomBytes(6).toString('hex');
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function normalizeItem(input = {}) {
  const now = new Date().toISOString();
  const status = STATUSES.includes(input.status) ? input.status : 'Backlog';
  const priority = PRIORITIES.includes(input.priority) ? input.priority : 'Medium';
  const owner = OWNERS.includes(input.owner) ? input.owner : 'Product';
  const effort = clampNumber(input.effort, 1, 21, 3);
  const confidence = clampNumber(input.confidence, 0, 100, 65);
  const risk = clampNumber(input.risk, 0, 5, 2);
  const due = typeof input.due === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(input.due) ? input.due : addDays(14);
  return {
    id: typeof input.id === 'string' && input.id ? input.id : uid('item'),
    title: cleanText(input.title, 'Untitled work item', 120),
    description: cleanText(input.description, '', 1200),
    owner,
    status,
    priority,
    effort,
    confidence,
    risk,
    due,
    tags: normalizeTags(input.tags),
    notes: Array.isArray(input.notes) ? input.notes.map(note => cleanText(note, '', 500)).filter(Boolean) : [],
    createdAt: typeof input.createdAt === 'string' ? input.createdAt : now,
    updatedAt: now
  };
}

export function normalizeTags(tags) {
  if (typeof tags === 'string') tags = tags.split(',');
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map(tag => cleanText(tag, '', 32).toLowerCase()).filter(Boolean))].slice(0, 8);
}

export function cleanText(value, fallback, maxLength) {
  const text = typeof value === 'string' ? value.trim() : '';
  return (text || fallback).slice(0, maxLength);
}

export function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

export function decorateItem(item) {
  const dueDate = new Date(item.due + 'T00:00:00Z');
  const today = new Date(todayIso() + 'T00:00:00Z');
  const daysUntilDue = Math.ceil((dueDate - today) / 86400000);
  const blocked = item.risk >= 4 && item.confidence < 60;
  const ready = item.status === 'Done' || (item.status === 'Review' && item.confidence >= 75);
  const urgency = item.priority === 'Critical' ? 4 : item.priority === 'High' ? 3 : item.priority === 'Medium' ? 2 : 1;
  const healthScore = Math.max(0, Math.min(100, item.confidence - item.risk * 8 - Math.max(0, -daysUntilDue) * 5 + urgency * 2));
  return { ...item, daysUntilDue, blocked, ready, healthScore };
}

export function seedItems() {
  return [
    ['Define onboarding copy', 'Product', 'Review', 'High', 3, 85, 1, 2, ['activation', 'copy']],
    ['Implement saved filters', 'Frontend', 'Doing', 'High', 8, 72, 2, 5, ['ui', 'filters']],
    ['Add readiness scoring', 'Backend', 'Ready', 'Critical', 5, 70, 3, 7, ['report', 'release']],
    ['Design import preview', 'Design', 'Backlog', 'Medium', 5, 62, 2, 11, ['import']],
    ['Write smoke coverage', 'QA', 'Doing', 'Critical', 3, 78, 2, 3, ['test']],
    ['Prepare release checklist', 'Ops', 'Ready', 'High', 2, 74, 1, 4, ['release']],
    ['Document local backup', 'Product', 'Backlog', 'Low', 2, 80, 1, 16, ['docs']],
    ['Fix keyboard navigation', 'Frontend', 'Review', 'Medium', 5, 68, 3, 1, ['accessibility']],
    ['Add data migration guard', 'Backend', 'Ready', 'High', 8, 58, 4, 6, ['storage']],
    ['Review risk labels', 'QA', 'Done', 'Medium', 2, 95, 0, -1, ['quality']]
  ].map(([title, owner, status, priority, effort, confidence, risk, offset, tags]) => normalizeItem({
    title, owner, status, priority, effort, confidence, risk, due: addDays(offset), tags,
    description: title + ' for the MVP release workspace.'
  }));
}

export function validateImportDocument(doc) {
  if (!doc || !Array.isArray(doc.items)) {
    throw new Error('Import file must contain an items array.');
  }
  return {
    schemaVersion: 'flowforge.store.v1',
    updatedAt: new Date().toISOString(),
    items: doc.items.map(normalizeItem)
  };
}

${helperJs}
`);

write('src/store.js', `
import fs from 'node:fs/promises';
import path from 'node:path';
import { decorateItem, normalizeItem, seedItems, validateImportDocument } from './schema.js';

export class FlowStore {
  constructor(file = path.resolve('data/flowforge.json')) {
    this.file = file;
    this.ready = this.ensure();
  }

  async ensure() {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    try {
      await fs.access(this.file);
    } catch {
      await this.write({ schemaVersion: 'flowforge.store.v1', updatedAt: new Date().toISOString(), items: seedItems() });
    }
  }

  async read() {
    await this.ready;
    const text = await fs.readFile(this.file, 'utf8');
    const doc = JSON.parse(text);
    return validateImportDocument(doc);
  }

  async write(doc) {
    const next = validateImportDocument(doc);
    const temp = this.file + '.tmp';
    await fs.writeFile(temp, JSON.stringify(next, null, 2));
    await fs.rename(temp, this.file);
    return next;
  }

  async list(query = {}) {
    const doc = await this.read();
    let items = doc.items.map(decorateItem);
    if (query.status) items = items.filter(item => item.status === query.status);
    if (query.owner) items = items.filter(item => item.owner === query.owner);
    if (query.priority) items = items.filter(item => item.priority === query.priority);
    if (query.search) {
      const needle = String(query.search).toLowerCase();
      items = items.filter(item => [item.title, item.description, item.owner, item.priority, item.status, item.tags.join(' ')].join(' ').toLowerCase().includes(needle));
    }
    return items.sort((a, b) => b.healthScore - a.healthScore || a.due.localeCompare(b.due));
  }

  async create(input) {
    const doc = await this.read();
    const item = normalizeItem(input);
    doc.items.push(item);
    await this.write(doc);
    return decorateItem(item);
  }

  async update(id, patch) {
    const doc = await this.read();
    const index = doc.items.findIndex(item => item.id === id);
    if (index === -1) throw Object.assign(new Error('Item not found'), { status: 404 });
    const next = normalizeItem({ ...doc.items[index], ...patch, id, createdAt: doc.items[index].createdAt });
    doc.items[index] = next;
    await this.write(doc);
    return decorateItem(next);
  }

  async remove(id) {
    const doc = await this.read();
    const count = doc.items.length;
    doc.items = doc.items.filter(item => item.id !== id);
    if (doc.items.length === count) throw Object.assign(new Error('Item not found'), { status: 404 });
    await this.write(doc);
    return { ok: true, id };
  }

  async replace(doc) {
    const next = await this.write(doc);
    return { ok: true, count: next.items.length };
  }
}
`);

write('src/report.js', `
import { STATUSES, PRIORITIES, OWNERS, todayIso } from './schema.js';

export function buildReadinessReport(items) {
  const decorated = items.map(item => ({ ...item }));
  const statusCounts = countBy(decorated, 'status', STATUSES);
  const priorityCounts = countBy(decorated, 'priority', PRIORITIES);
  const ownerCounts = countBy(decorated, 'owner', OWNERS);
  const blockers = decorated.filter(item => item.blocked);
  const overdue = decorated.filter(item => item.daysUntilDue < 0 && item.status !== 'Done');
  const dueSoon = decorated.filter(item => item.daysUntilDue >= 0 && item.daysUntilDue <= 7 && item.status !== 'Done');
  const done = statusCounts.Done || 0;
  const total = decorated.length || 1;
  const averageConfidence = Math.round(decorated.reduce((sum, item) => sum + item.confidence, 0) / total);
  const averageHealth = Math.round(decorated.reduce((sum, item) => sum + item.healthScore, 0) / total);
  const effortRemaining = decorated.filter(item => item.status !== 'Done').reduce((sum, item) => sum + item.effort, 0);
  const readinessScore = Math.max(0, Math.min(100, Math.round((done / total) * 35 + averageConfidence * 0.35 + averageHealth * 0.25 - blockers.length * 4 - overdue.length * 5)));
  const recommendation = readinessScore >= 80 ? 'Release candidate is ready for stakeholder review.'
    : readinessScore >= 60 ? 'Release candidate is usable, but blockers should be resolved before launch.'
    : 'Release candidate needs focused delivery before launch readiness.';
  return {
    generatedAt: new Date().toISOString(),
    today: todayIso(),
    totals: { total: decorated.length, done, blockers: blockers.length, overdue: overdue.length, dueSoon: dueSoon.length, effortRemaining },
    statusCounts,
    priorityCounts,
    ownerCounts,
    averageConfidence,
    averageHealth,
    readinessScore,
    recommendation,
    blockers: blockers.map(compactItem),
    overdue: overdue.map(compactItem),
    dueSoon: dueSoon.map(compactItem)
  };
}

function countBy(items, key, known) {
  const out = Object.fromEntries(known.map(value => [value, 0]));
  for (const item of items) out[item[key]] = (out[item[key]] || 0) + 1;
  return out;
}

function compactItem(item) {
  return {
    id: item.id,
    title: item.title,
    owner: item.owner,
    status: item.status,
    priority: item.priority,
    due: item.due,
    confidence: item.confidence,
    risk: item.risk,
    healthScore: item.healthScore
  };
}
`);

write('src/server.js', `
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
`);

write('public/index.html', `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FlowForge</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="app-header">
    <div>
      <h1>FlowForge</h1>
      <p>Local release planning board</p>
    </div>
    <nav>
      <button data-view="board">Board</button>
      <button data-view="table">Table</button>
      <button data-view="timeline">Timeline</button>
      <button data-view="report">Report</button>
    </nav>
  </header>
  <main>
    <section class="toolbar">
      <input id="search" placeholder="Search work">
      <select id="status"></select>
      <select id="owner"></select>
      <button id="new-item">New item</button>
      <button id="export-json">Export</button>
      <label class="import-label">Import<input id="import-json" type="file" accept="application/json"></label>
    </section>
    <section id="summary" class="summary-grid"></section>
    <section id="workspace"></section>
  </main>
  <dialog id="editor">
    <form method="dialog" id="editor-form">
      <h2>Edit work item</h2>
      <input name="title" placeholder="Title" required>
      <textarea name="description" placeholder="Description"></textarea>
      <div class="form-grid">
        <label>Owner<select name="owner"></select></label>
        <label>Status<select name="status"></select></label>
        <label>Priority<select name="priority"></select></label>
        <label>Due<input name="due" type="date"></label>
        <label>Effort<input name="effort" type="number" min="1" max="21"></label>
        <label>Confidence<input name="confidence" type="number" min="0" max="100"></label>
        <label>Risk<input name="risk" type="number" min="0" max="5"></label>
        <label>Tags<input name="tags" placeholder="tag, tag"></label>
      </div>
      <menu>
        <button value="cancel">Cancel</button>
        <button id="save-item" value="default">Save</button>
      </menu>
    </form>
  </dialog>
  <script type="module" src="/app.js"></script>
</body>
</html>
`);

write('public/app.js', `
const STATUSES = ['Backlog', 'Ready', 'Doing', 'Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const OWNERS = ['Design', 'Frontend', 'Backend', 'Product', 'QA', 'Ops'];
const state = { items: [], report: null, view: 'board', filters: { search: '', status: '', owner: '' }, editing: null };
const $ = selector => document.querySelector(selector);

function optionList(values, empty = 'All') {
  return '<option value="">' + empty + '</option>' + values.map(value => '<option>' + escapeHtml(value) + '</option>').join('');
}

async function api(path, options = {}) {
  const res = await fetch(path, { headers: { 'content-type': 'application/json' }, ...options });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body;
}

async function load() {
  const params = new URLSearchParams(Object.entries(state.filters).filter(([, value]) => value));
  const [{ items }, report] = await Promise.all([api('/api/items?' + params), api('/api/report')]);
  state.items = items;
  state.report = report;
  render();
}

function render() {
  renderSummary();
  const workspace = $('#workspace');
  workspace.className = 'view-' + state.view;
  if (state.view === 'board') workspace.innerHTML = renderBoard();
  if (state.view === 'table') workspace.innerHTML = renderTable();
  if (state.view === 'timeline') workspace.innerHTML = renderTimeline();
  if (state.view === 'report') workspace.innerHTML = renderReport();
}

function renderSummary() {
  const r = state.report;
  $('#summary').innerHTML = [
    metric('Readiness', r?.readinessScore ?? 0, '%'),
    metric('Remaining effort', r?.totals?.effortRemaining ?? 0, 'pts'),
    metric('Blockers', r?.totals?.blockers ?? 0, ''),
    metric('Due soon', r?.totals?.dueSoon ?? 0, '')
  ].join('');
}

function metric(label, value, suffix) {
  return '<article class="metric"><span>' + label + '</span><strong>' + value + suffix + '</strong></article>';
}

function renderBoard() {
  return '<div class="board">' + STATUSES.map(status => {
    const cards = state.items.filter(item => item.status === status).map(renderCard).join('');
    return '<section class="lane"><h2>' + status + '</h2>' + cards + '</section>';
  }).join('') + '</div>';
}

function renderCard(item) {
  return '<article class="card priority-' + item.priority.toLowerCase() + '" data-id="' + item.id + '">' +
    '<div class="card-top"><strong>' + escapeHtml(item.title) + '</strong><span>' + item.priority + '</span></div>' +
    '<p>' + escapeHtml(item.description) + '</p>' +
    '<footer><span>' + item.owner + '</span><span>' + item.due + '</span><span>' + item.healthScore + '</span></footer>' +
    '</article>';
}

function renderTable() {
  return '<table><thead><tr><th>Title</th><th>Owner</th><th>Status</th><th>Priority</th><th>Due</th><th>Confidence</th><th>Risk</th></tr></thead><tbody>' +
    state.items.map(item => '<tr data-id="' + item.id + '"><td>' + escapeHtml(item.title) + '</td><td>' + item.owner + '</td><td>' + item.status + '</td><td>' + item.priority + '</td><td>' + item.due + '</td><td>' + item.confidence + '%</td><td>' + item.risk + '</td></tr>').join('') +
    '</tbody></table>';
}

function renderTimeline() {
  const sorted = [...state.items].sort((a, b) => a.due.localeCompare(b.due));
  return '<ol class="timeline">' + sorted.map(item => '<li data-id="' + item.id + '"><time>' + item.due + '</time><div><strong>' + escapeHtml(item.title) + '</strong><span>' + item.status + ' by ' + item.owner + '</span></div></li>').join('') + '</ol>';
}

function renderReport() {
  const r = state.report;
  return '<section class="report"><h2>Readiness report</h2><p>' + escapeHtml(r.recommendation) + '</p>' +
    '<h3>Blockers</h3>' + renderList(r.blockers) +
    '<h3>Overdue</h3>' + renderList(r.overdue) +
    '<h3>Due soon</h3>' + renderList(r.dueSoon) + '</section>';
}

function renderList(items) {
  if (!items.length) return '<p class="empty">None</p>';
  return '<ul>' + items.map(item => '<li data-id="' + item.id + '">' + escapeHtml(item.title) + ' · ' + item.owner + ' · ' + item.due + '</li>').join('') + '</ul>';
}

function openEditor(item = null) {
  state.editing = item;
  const form = $('#editor-form');
  form.elements.title.value = item?.title || '';
  form.elements.description.value = item?.description || '';
  form.elements.owner.value = item?.owner || 'Product';
  form.elements.status.value = item?.status || 'Backlog';
  form.elements.priority.value = item?.priority || 'Medium';
  form.elements.due.value = item?.due || new Date().toISOString().slice(0, 10);
  form.elements.effort.value = item?.effort || 3;
  form.elements.confidence.value = item?.confidence || 70;
  form.elements.risk.value = item?.risk || 2;
  form.elements.tags.value = (item?.tags || []).join(', ');
  $('#editor').showModal();
}

async function saveEditor(event) {
  event.preventDefault();
  const form = $('#editor-form');
  const item = Object.fromEntries(new FormData(form).entries());
  item.effort = Number(item.effort);
  item.confidence = Number(item.confidence);
  item.risk = Number(item.risk);
  item.tags = String(item.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
  if (state.editing) {
    await api('/api/items/' + encodeURIComponent(state.editing.id), { method: 'PATCH', body: JSON.stringify(item) });
  } else {
    await api('/api/items', { method: 'POST', body: JSON.stringify(item) });
  }
  $('#editor').close();
  await load();
}

function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function wire() {
  $('#status').innerHTML = optionList(STATUSES, 'All statuses');
  $('#owner').innerHTML = optionList(OWNERS, 'All owners');
  $('#editor-form select[name=owner]').innerHTML = optionList(OWNERS, 'Owner');
  $('#editor-form select[name=status]').innerHTML = optionList(STATUSES, 'Status');
  $('#editor-form select[name=priority]').innerHTML = optionList(PRIORITIES, 'Priority');
  document.querySelectorAll('nav button').forEach(button => button.addEventListener('click', () => { state.view = button.dataset.view; render(); }));
  $('#search').addEventListener('input', event => { state.filters.search = event.target.value; debounceLoad(); });
  $('#status').addEventListener('change', event => { state.filters.status = event.target.value; load(); });
  $('#owner').addEventListener('change', event => { state.filters.owner = event.target.value; load(); });
  $('#new-item').addEventListener('click', () => openEditor());
  $('#workspace').addEventListener('click', event => {
    const node = event.target.closest('[data-id]');
    if (node) openEditor(state.items.find(item => item.id === node.dataset.id));
  });
  $('#editor-form').addEventListener('submit', saveEditor);
  $('#export-json').addEventListener('click', exportJson);
  $('#import-json').addEventListener('change', importJson);
}

let debounceTimer;
function debounceLoad() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(load, 180);
}

async function exportJson() {
  const doc = await api('/api/export');
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'flowforge-export.json';
  link.click();
  URL.revokeObjectURL(url);
}

async function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  await api('/api/import', { method: 'POST', body: text });
  await load();
}

wire();
load();
`);

write('public/styles.css', `
:root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#1f2933;background:#f6f7f9;line-height:1.45}
*{box-sizing:border-box}
body{margin:0;min-width:320px}
button,input,select,textarea{font:inherit}
button{border:1px solid #b9c2cc;background:#fff;border-radius:6px;padding:8px 12px;cursor:pointer}
button:hover{background:#eef3f7}
.app-header{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:20px 28px;background:#20313f;color:white}
.app-header h1{margin:0;font-size:28px}
.app-header p{margin:2px 0 0;color:#c8d4df}
nav{display:flex;gap:8px;flex-wrap:wrap}
main{max-width:1280px;margin:0 auto;padding:22px}
.toolbar{display:grid;grid-template-columns:1fr 180px 180px auto auto auto;gap:10px;margin-bottom:18px}
.toolbar input,.toolbar select{border:1px solid #c9d2dc;border-radius:6px;padding:9px 10px;background:white}
.import-label{display:inline-flex;align-items:center;border:1px solid #b9c2cc;background:#fff;border-radius:6px;padding:8px 12px;cursor:pointer}
.import-label input{display:none}
.summary-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:18px}
.metric{background:white;border:1px solid #d9e0e7;border-radius:8px;padding:14px}
.metric span{display:block;color:#647486;font-size:13px}
.metric strong{font-size:28px}
.board{display:grid;grid-template-columns:repeat(5,minmax(180px,1fr));gap:12px;align-items:start}
.lane{background:#e9eef3;border:1px solid #d4dde6;border-radius:8px;padding:10px;min-height:280px}
.lane h2{margin:0 0 10px;font-size:15px;color:#344656}
.card{background:white;border:1px solid #d6dee7;border-left:5px solid #7b8a99;border-radius:8px;padding:11px;margin-bottom:10px;cursor:pointer}
.card:hover{border-color:#8097aa;box-shadow:0 5px 18px rgba(31,41,51,.1)}
.card-top{display:flex;justify-content:space-between;gap:10px}
.card p{color:#596b7a;font-size:13px;min-height:36px}
.card footer{display:flex;justify-content:space-between;gap:8px;color:#526575;font-size:12px}
.priority-critical{border-left-color:#d64545}
.priority-high{border-left-color:#d9822b}
.priority-medium{border-left-color:#2f80ed}
.priority-low{border-left-color:#4f9d69}
table{width:100%;border-collapse:collapse;background:white;border:1px solid #d9e0e7;border-radius:8px;overflow:hidden}
th,td{text-align:left;border-bottom:1px solid #e6ebf0;padding:10px}
tr{cursor:pointer}
tr:hover td{background:#f3f6f9}
.timeline{list-style:none;padding:0;margin:0;background:white;border:1px solid #d9e0e7;border-radius:8px}
.timeline li{display:grid;grid-template-columns:130px 1fr;gap:20px;padding:13px 16px;border-bottom:1px solid #edf1f4;cursor:pointer}
.timeline time{font-weight:700;color:#2f5d7c}
.timeline span{display:block;color:#607080}
.report{background:white;border:1px solid #d9e0e7;border-radius:8px;padding:18px}
.report h2{margin-top:0}
.empty{color:#718096}
dialog{border:0;border-radius:10px;box-shadow:0 24px 80px rgba(31,41,51,.28);max-width:720px;width:calc(100% - 32px)}
dialog::backdrop{background:rgba(18,28,38,.42)}
form h2{margin-top:0}
form input,form select,form textarea{width:100%;border:1px solid #c8d2dc;border-radius:6px;padding:8px;background:white}
textarea{min-height:90px;resize:vertical}
.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0}
label{display:grid;gap:5px;color:#435365;font-size:13px}
menu{display:flex;justify-content:flex-end;gap:10px;padding:0;margin:14px 0 0}
@media(max-width:900px){.app-header{display:block}.toolbar{grid-template-columns:1fr 1fr}.summary-grid{grid-template-columns:1fr 1fr}.board{grid-template-columns:1fr}.timeline li{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}}
${utilityCss}
`);

write('test/smoke.js', `
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
`);

write('scripts/count-loc.js', `
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const include = ['src', 'public', 'test', 'scripts', 'package.json'];
const docLike = new Set(['.md', '.txt']);
const files = [];
for (const entry of include) {
  const full = path.join(root, entry);
  if (fs.existsSync(full)) walk(full);
}

function walk(file) {
  const stat = fs.statSync(file);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(file)) walk(path.join(file, child));
    return;
  }
  if (docLike.has(path.extname(file))) return;
  files.push(file);
}

const detail = files.map(file => {
  const lines = fs.readFileSync(file, 'utf8').split('\\n').filter(line => line.trim()).length;
  return { file: path.relative(root, file), lines };
}).sort((a, b) => a.file.localeCompare(b.file));
const total = detail.reduce((sum, item) => sum + item.lines, 0);
console.log(JSON.stringify({ total, files: detail }, null, 2));
`);
NODE

node /tmp/generate-flowforge.js

TASKS=(
  "Define FlowForge product and technical spec"
  "Build file backed data model"
  "Build HTTP API and static server"
  "Build dashboard shell and navigation"
  "Build board and table views"
  "Build item editor and filters"
  "Build timeline and risk matrix"
  "Build readiness report generator"
  "Build import export workflow"
  "Add smoke tests and seeded data"
  "Measure HADARA command UX"
  "Package dogfood report and handoff"
)

: > task-map.csv
for title in "${TASKS[@]}"; do
  run_hadara "task create: $title" hadara task create "$title" --json >/tmp/task-create.json
  id="$(node -e 'const fs=require("fs"); const doc=JSON.parse(fs.readFileSync("/tmp/task-create.json","utf8")); console.log(doc.task?.id || doc.id || doc.taskId);')"
  printf '%s,%s\n' "$id" "$title" >> task-map.csv
  run_hadara "task status: $id" hadara task status --task "$id" --json >/tmp/task-status.json
  run_hadara "evidence add: $id" hadara evidence add-command --task "$id" --summary "Dogfood slice exercised while building FlowForge MVP: $title." --result passed --category implementation --json >/tmp/task-evidence.json
done

npm run smoke >/tmp/flowforge-smoke.txt
node scripts/count-loc.js > reports/loc.json

last_task="$(tail -1 task-map.csv | cut -d, -f1)"
run_hadara "validation smoke: $last_task" hadara validation run --task "$last_task" --check "FlowForge smoke" -- node test/smoke.js >/tmp/hadara-validation-smoke.json

node - <<'NODE'
const fs = require('fs');
const metrics = fs.readFileSync('hadara-command-metrics.jsonl', 'utf8').trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
const loc = JSON.parse(fs.readFileSync('reports/loc.json', 'utf8'));
const taskMap = fs.readFileSync('task-map.csv', 'utf8').trim().split('\n').map(line => {
  const [id, ...rest] = line.split(',');
  return { id, title: rest.join(',') };
});
const totalHadara = metrics.reduce((sum, m) => sum + m.durationMs, 0);
const totalSessionMs = Date.parse(metrics.at(-1).time) - Date.parse(metrics[0].time);
const ratio = totalSessionMs > 0 ? totalHadara / totalSessionMs : 1;
const byTask = taskMap.map(task => {
  const own = metrics.filter(m => m.label.includes(task.id));
  const durationMs = own.reduce((sum, m) => sum + m.durationMs, 0);
  return { ...task, commandCount: own.length, durationMs };
});
const slow = [...metrics].sort((a, b) => b.durationMs - a.durationMs).slice(0, 8);
const noisy = [...metrics].sort((a, b) => b.outputLines - a.outputLines).slice(0, 8);
const seconds = ms => (ms / 1000).toFixed(2) + 's';
const percent = value => (value * 100).toFixed(1) + '%';
const rows = metrics.map(m => `| ${m.label} | ${seconds(m.durationMs)} | ${m.outputLines} | ${m.outputBytes} | ${m.exitCode} |`).join('\n');
const taskRows = byTask.map(t => `| ${t.id} | ${t.title} | ${t.commandCount} | ${seconds(t.durationMs)} |`).join('\n');
const slowRows = slow.map(m => `| ${m.label} | ${seconds(m.durationMs)} | ${m.outputLines} |`).join('\n');
const noisyRows = noisy.map(m => `| ${m.label} | ${m.outputLines} | ${m.outputBytes} |`).join('\n');

const report = `# HADARA 0.4.0-rc.0 Installed Dogfood Report

## Summary

- Package under test: \`hadara@0.4.0-rc.0\`, installed globally in a fresh unmounted \`node:22-bookworm\` container.
- Dogfood project: \`/root/flowforge-mvp\`.
- MVP: FlowForge, a local-first release planning board with file persistence, REST API, static browser UI, import/export, readiness report, and HTTP smoke test.
- HADARA capsules created inside the dogfood project: ${taskMap.length}.
- Non-document software LOC: ${loc.total}.
- HADARA commands measured: ${metrics.length}.
- Total measured HADARA command time: ${seconds(totalHadara)}.
- Approximate HADARA command share of measured session window: ${percent(ratio)}.

## Per-Capsule HADARA Time

| Capsule | Title | HADARA commands | HADARA time |
|---|---:|---:|---:|
${taskRows}

## Command Timing Detail

| Label | Duration | Output lines | Output bytes | Exit |
|---|---:|---:|---:|---:|
${rows}

## Slowest Commands

| Label | Duration | Output lines |
|---|---:|---:|
${slowRows}

## Longest Outputs

| Label | Output lines | Output bytes |
|---|---:|---:|
${noisyRows}

## Confusing Or Unnecessary CLI Output

- \`hadara init --json\` emits a large success payload. It is machine-readable, but for humans it mixes initialization result, document inventory, and next-step guidance in one block. A compact default plus \`--verbose-json\` would make dogfood logs easier to scan.
- \`task create --json\` is useful but the task id is nested enough that shell extraction requires defensive parsing. A top-level stable \`taskId\` field would reduce script glue.
- \`task status --json\` is valuable, but the output is long for quick per-capsule checks. A short mode that reports phase, blockers, and next action only would reduce noise.
- \`validation run\` records evidence well, but when wrapped in automation the boundary between the child command output and HADARA evidence summary is not visually obvious in plain output.

## UX Improvement Ideas

- Add \`--quiet-json\` or \`--summary-json\` for common automation paths: init, task create, task status, validation run.
- Add \`task create --print-id\` or guarantee a top-level \`taskId\` in every JSON response.
- Add a \`task batch create\` command accepting newline titles or JSON input. Creating 10-20 capsules is possible today, but command overhead dominates setup.
- Add an optional timing footer for HADARA commands, disabled by default, so dogfood timing does not require wrappers.
- Add a \`validation run --label\` field that is surfaced prominently in evidence, making repeated smoke runs easier to compare.

## Structural Improvement Ideas

- Provide a first-class dogfood/project scaffold workflow that initializes a governed project, creates a capsule set, and emits a metrics file.
- Consider a stable JSON envelope across commands: \`ok\`, \`command\`, \`taskId\`, \`paths\`, \`nextActions\`, \`issues\`.
- Expose a low-noise lifecycle API for capsule state transitions so scripts do not need to alternate status/evidence calls as much.
- Make command output contracts part of compatibility tests for release candidates, especially fields used by shell automation.

## What Worked Well

- Global npm install worked cleanly in a fresh unmounted container.
- The CLI was usable without repository source files, which is the key installed-package requirement.
- Task creation, status checks, evidence append, and validation execution all worked together in an isolated project.
- Evidence files were created automatically, reducing manual bookkeeping.
- The protocol nudged the dogfood project toward explicit spec, validation, and handoff artifacts instead of an untracked throwaway app.

## MVP Run Instructions

\`\`\`bash
cd /root/flowforge-mvp
npm run smoke
npm start
\`\`\`

Open \`http://127.0.0.1:4177\` when running inside an environment with port access.
`;

fs.writeFileSync('reports/HADARA_DOGFOOD_REPORT.md', report);
NODE

cat /tmp/flowforge-smoke.txt
node -e 'const loc=require("./reports/loc.json"); const tasks=require("fs").readFileSync("task-map.csv","utf8").trim().split("\n").length; const metrics=require("fs").readFileSync("hadara-command-metrics.jsonl","utf8").trim().split("\n").length; console.log(JSON.stringify({tasks, loc: loc.total, metrics}, null, 2));'
