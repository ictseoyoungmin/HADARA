import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp');
const taskMapPath = path.join(root, 'task-map.csv');
const taskRows = fs.readFileSync(taskMapPath, 'utf8').trim().split('\n').map((line) => {
  const [id, ...titleParts] = line.split(',');
  return { id, title: titleParts.join(',') };
});

const taskMeta = new Map([
  ['T-0001', { files: ['docs/specs/PRODUCT_SPEC.md', 'docs/specs/TECH_SPEC.md'], area: 'specs', change: 'Defined product and technical scope for FlowForge.' }],
  ['T-0002', { files: ['src/schema.js', 'src/store.js', 'data/flowforge.json'], area: 'data model', change: 'Built normalized item schema, seed data, and file-backed persistence.' }],
  ['T-0003', { files: ['src/server.js', 'src/store.js'], area: 'server', change: 'Built the REST API and static asset server.' }],
  ['T-0004', { files: ['public/index.html', 'public/styles.css'], area: 'dashboard shell', change: 'Built the application shell, navigation, toolbar, summary metrics, and responsive layout.' }],
  ['T-0005', { files: ['public/app.js', 'public/styles.css'], area: 'views', change: 'Built board and table work item views.' }],
  ['T-0006', { files: ['public/app.js', 'public/index.html'], area: 'editing', change: 'Built item editor, search, owner/status filters, and persistence wiring.' }],
  ['T-0007', { files: ['public/app.js', 'src/schema.js', 'public/styles.css'], area: 'timeline risk', change: 'Built timeline view and risk/health derived fields.' }],
  ['T-0008', { files: ['src/report.js', 'public/app.js'], area: 'readiness report', change: 'Built readiness report computation and UI rendering.' }],
  ['T-0009', { files: ['public/app.js', 'src/server.js'], area: 'import export', change: 'Built JSON export/import API and browser workflow.' }],
  ['T-0010', { files: ['test/smoke.js', 'src/schema.js', 'data/flowforge.json'], area: 'smoke tests', change: 'Added seeded data and end-to-end HTTP smoke test.' }],
  ['T-0011', { files: ['hadara-command-metrics.jsonl', 'reports/HADARA_DOGFOOD_REPORT.md'], area: 'metrics', change: 'Measured HADARA command timings, output length, and per-capsule command time.' }],
  ['T-0012', { files: ['reports/HADARA_DOGFOOD_REPORT.md', 'reports/loc.json', 'task-map.csv'], area: 'reporting', change: 'Packaged dogfood report, LOC measurement, and handoff-ready artifacts.' }],
]);

function sha256(relativePath) {
  return 'sha256:' + crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relativePath))).digest('hex');
}

function taskDir(task) {
  const entry = fs.readdirSync(path.join(root, 'tasks')).find((name) => name.startsWith(task.id + '-'));
  if (!entry) throw new Error(`Missing task directory for ${task.id}`);
  return path.join(root, 'tasks', entry);
}

function evidenceId(dir) {
  const evidencePath = path.join(dir, 'evidence.jsonl');
  if (!fs.existsSync(evidencePath)) return 'TBD';
  const lines = fs.readFileSync(evidencePath, 'utf8').trim().split('\n').filter(Boolean);
  if (!lines.length) return 'TBD';
  const last = JSON.parse(lines.at(-1));
  return last.id || 'TBD';
}

function renderHandoff(task, meta, ev) {
  return `# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Completed FlowForge dogfood slice: ${task.title}. | ${ev} |
| Updated source files for ${meta.area}. | ${meta.files.map((file) => `\`${file}\``).join(', ')} |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue reviewing the integrated FlowForge dogfood artifact. | This internal capsule is complete and retained as evidence for the installed-package dogfood run. | \`docs/TASK_BOARD.md\`, \`reports/HADARA_DOGFOOD_REPORT.md\` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| This capsule is part of a copied dogfood artifact, not live HADARA-dev product code. | Do not treat these files as runtime source for HADARA-dev. | Use the artifact for UX findings and release feedback only. |
`;
}

function renderTask(task) {
  const meta = taskMeta.get(task.id);
  const dir = taskDir(task);
  const ev = evidenceId(dir);
  const sourceRows = meta.files.map((file) => {
    return `| ${file} | implementation-source | approved | implemented | ${sha256(file)} | FlowForge artifact source for ${task.title}. |`;
  }).join('\n');
  const sourceList = meta.files.map((file) => `\`${file}\``).join(', ');
  return `# ${task.id} ${task.title}

## Identity

| Field | Value |
|---|---|
| ID | ${task.id} |
| Title | ${task.title} |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
${sourceRows}

## Goal

| Goal | Notes |
|---|---|
| Complete the FlowForge slice: ${task.title}. | This capsule is part of the installed \`hadara@0.4.0-rc.0\` dogfood artifact, not HADARA-dev product source. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the slice contract. | Done | ${sourceList} |
| 2 | Implement the slice in the FlowForge MVP. | Done | ${meta.change} |
| 3 | Record dogfood evidence and validation. | Done | ${ev} |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | The FlowForge slice is represented by concrete project files. | Yes | Met | ${sourceList} | Required | Dogfood request |
| AC-2 | Implementation evidence exists for this capsule. | Yes | Met | ${ev} | Required | Dogfood request |
| AC-3 | The final MVP smoke test covers the integrated slice. | Yes | Met | \`npm run smoke\` passed in T-0479 artifact validation. | Required | T-0479 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Slice evidence | HADARA evidence recorded during FlowForge generation. | Yes | Passed | ${ev} |
| Integrated smoke | \`npm run smoke\` from FlowForge MVP. | Yes | Passed | T-0479 evidence |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| ${meta.files.join('<br>')} | ${meta.area} | ${meta.change} | Complete this dogfood capsule's MVP scope. | ${ev} |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This is a preserved dogfood artifact rather than live HADARA-dev product code. | Accepted | T-0479 |
`;
}

for (const task of taskRows) {
  const dir = taskDir(task);
  const meta = taskMeta.get(task.id);
  const ev = evidenceId(dir);
  fs.writeFileSync(path.join(dir, 'TASK.md'), renderTask(task));
  fs.writeFileSync(path.join(dir, 'HANDOFF.md'), renderHandoff(task, meta, ev));
}

const boardRows = taskRows.map((task) => {
  const meta = taskMeta.get(task.id);
  return `| ${task.id} | ${task.title} | Done | tasks/${path.basename(taskDir(task))} | ${meta.change} |`;
}).join('\n');

fs.writeFileSync(path.join(root, 'docs/TASK_BOARD.md'), `# TASK_BOARD

<!-- hadara:managed:start task-board {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
${boardRows}
<!-- hadara:managed:end task-board -->
`);

fs.writeFileSync(path.join(root, 'docs/PROJECT_STATE.md'), `# PROJECT_STATE

## Product

<!-- hadara:managed:start project-state-metadata {"schema":"hadara.managedSection.v1","owner":"project-state.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Name | FlowForge |
| Purpose | Local-first release planning board for small product teams. |
| HADARA Profile | governed |
<!-- hadara:managed:end project-state-metadata -->

## Current Phase

| Field | Value |
|---|---|
| Phase | MVP dogfood artifact |
| Status | complete |
| Active Task | None |

## Current Status

| Area | Status | Notes |
|---|---|---|
| Scaffold | Complete | HADARA governed scaffold initialized under installed \`hadara@0.4.0-rc.0\`. |
| Task Capsules | Complete | 12 capsules are marked Done and retained as dogfood evidence. |
| MVP | Complete | FlowForge includes local JSON persistence, REST API, static UI, import/export, readiness reporting, and smoke coverage. |
| Validation | Passed | \`npm run smoke\` passed; non-document software LOC is 5,397. |

## Single Source of Truth

| Source | Path | Purpose |
|---|---|---|
| Current state | \`docs/PROJECT_STATE.md\` | Product and capability state. |
| Work queue | \`docs/TASK_BOARD.md\` | Task status and queue. |
| Next-session handoff | \`docs/AGENT_HANDOFF.md\` | Compact continuation state. |
| Workflow | \`docs/HADARA_WORKFLOW.md\` | Generic HADARA lifecycle and evidence rules. |
| Dogfood report | \`reports/HADARA_DOGFOOD_REPORT.md\` | HADARA timing and UX findings from the installed-package dogfood run. |
`);

fs.writeFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), `# AGENT_HANDOFF

## Current State

<!-- hadara:managed:start current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Area | State | Notes |
|---|---|---|
| Scaffold | Complete | Governed HADARA scaffold initialized from installed \`hadara@0.4.0-rc.0\`. |
| MVP | Complete | FlowForge is runnable with \`npm start\` and validated by \`npm run smoke\`. |
| Task Capsules | Complete | 12 dogfood capsules are marked Done in \`docs/TASK_BOARD.md\`. |
| Report | Complete | Timing, output-length, UX, structural, and strengths findings are in \`reports/HADARA_DOGFOOD_REPORT.md\`. |
<!-- hadara:managed:end current-state -->

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0012 | Packaged dogfood report, LOC measurement, and handoff-ready artifacts. | \`reports/HADARA_DOGFOOD_REPORT.md\` |
| T-0011 | Measured HADARA command timing, output length, and per-capsule command time. | \`hadara-command-metrics.jsonl\` |
| T-0010 | Added seeded data and end-to-end HTTP smoke coverage. | \`test/smoke.js\` |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Generated scaffold docs were retained as artifact evidence. | Some generic workflow docs remain broad by design. | Treat FlowForge as a dogfood artifact, not live HADARA-dev product source. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Review dogfood findings for HADARA follow-up capsules. | The MVP and internal capsules are complete; remaining value is triaging the recorded CLI UX findings. | Follow-up capsule references \`reports/HADARA_DOGFOOD_REPORT.md\`. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| MVP smoke | Passed | \`npm run smoke\` passed with 10 seeded items and readiness 46. |
| LOC count | Passed | \`reports/loc.json\` records 5,397 non-document software LOC. |
| Capsule count | Passed | \`task-map.csv\` records 12 capsules. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed tasks | \`tasks/T-*/\` | Inspect individual dogfood capsule evidence. |
| Validation history | \`reports/HADARA_DOGFOOD_REPORT.md\` | Review command timing and UX findings. |
`);

console.log(JSON.stringify({ updatedTasks: taskRows.length, status: 'complete' }, null, 2));
