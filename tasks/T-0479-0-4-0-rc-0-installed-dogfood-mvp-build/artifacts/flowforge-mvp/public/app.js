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

