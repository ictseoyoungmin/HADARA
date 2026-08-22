#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const fail = (message, code = 1) => {
  console.error(message);
  process.exit(code);
};
const hash = (file) => `sha256:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
const inside = (root, candidate) => {
  const rel = path.relative(path.resolve(root), path.resolve(candidate));
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
};
const parseJson = (file, label) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { fail(`${label} is invalid JSON: ${error.message}`); }
};

function findEvidence(indexPath, key, { missingCode = 3 } = {}) {
  if (!fs.existsSync(indexPath)) process.exit(missingCode);
  const matches = [];
  for (const [index, line] of fs.readFileSync(indexPath, 'utf8').split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    let record;
    try { record = JSON.parse(line); }
    catch (error) { fail(`evidence.jsonl line ${index + 1} is invalid JSON: ${error.message}`); }
    if (record?.schemaVersion === 'hadara.evidence.v2' && record.idempotencyKey === key) matches.push(record);
  }
  if (matches.length === 0) process.exit(missingCode);
  if (matches.length !== 1) fail(`expected exactly one canonical evidence record for ${key}, found ${matches.length}`);
  return matches[0];
}

function resolveNpm(args) {
  const [indexPath, taskDir, key, convenienceReport, tarball, checksum, manifest, expectedTask, expectedPackage, expectedVersion, sourceCommit, releaseInputHash, githubRepo, gitRemote] = args;
  const record = findEvidence(indexPath, key);
  if (record.visibility !== 'public' || record.outcome !== 'passed') fail(`canonical npm publication evidence ${record.id ?? '<unknown>'} is not public passed evidence`);
  if (!Array.isArray(record.artifacts) || record.artifacts.length !== 1) fail(`canonical npm publication evidence ${record.id ?? '<unknown>'} must bind exactly one report`);
  const binding = record.artifacts[0];
  if (typeof binding?.path !== 'string' || typeof binding.sha256 !== 'string' || typeof binding.byteLength !== 'number') fail('canonical npm publication artifact binding is incomplete');
  const boundReport = path.resolve(taskDir, binding.path);
  if (!inside(taskDir, boundReport)) fail('canonical npm publication artifact escapes the task capsule');
  if (!fs.existsSync(boundReport)) fail(`canonical npm publication artifact is missing: ${binding.path}`);
  const bytes = fs.readFileSync(boundReport);
  if (hash(boundReport) !== binding.sha256 || bytes.byteLength !== binding.byteLength) fail('canonical npm publication artifact no longer matches its evidence byte binding');
  if (fs.existsSync(convenienceReport)) {
    const local = fs.readFileSync(convenienceReport);
    if (!local.equals(bytes)) fail(`convenience npm publication report differs from canonical byte-bound evidence: ${convenienceReport}`);
  }

  const report = parseJson(boundReport, 'canonical npm publication report');
  if (report.schemaVersion !== 'hadara.releaseOperatorPublication.v1') fail('canonical npm publication report has unexpected schemaVersion');
  if (report.package?.name !== expectedPackage || report.package?.version !== expectedVersion) fail(`canonical npm publication report package identity does not match ${expectedPackage}@${expectedVersion}`);
  if (report.package?.npmMutationPerformed !== true || report.package?.observedVersion !== expectedVersion) fail('canonical npm publication report does not prove the expected npm mutation');
  if (typeof report.package?.registry !== 'string' || !report.package.registry || typeof report.package?.distTag !== 'string' || !report.package.distTag) fail('canonical npm publication report is missing registry/dist-tag destination');
  if (report.github?.mutationPerformed === true) fail('canonical npm publication report already records GitHub mutation');
  if (report.github?.repository !== githubRepo || report.github?.gitRemote !== gitRemote) fail('canonical npm publication report GitHub destination differs from the requested destination');
  if (report.lineage?.taskId !== expectedTask || report.lineage?.artifactSourceCommit !== sourceCommit || report.lineage?.releaseInputHash !== releaseInputHash) fail('canonical npm publication lineage differs from retained artifact lineage');

  const expectedAssets = [tarball, checksum, manifest];
  if (!Array.isArray(report.github?.assets) || report.github.assets.length !== expectedAssets.length) fail('canonical npm publication report must bind exactly three release assets');
  for (const file of expectedAssets) {
    if (!fs.existsSync(file)) fail(`retained release asset is missing: ${file}`);
    const name = path.basename(file);
    const asset = report.github.assets.find((item) => item?.name === name);
    if (!asset) fail(`canonical npm publication report is missing release asset ${name}`);
    const actual = hash(file);
    if (asset.sha256 !== actual) fail(`npm-published asset ${name} does not match retained bytes: expected ${asset.sha256 ?? '<missing>'}, actual ${actual}`);
    if (asset.uploaded !== false) fail(`npm-only asset ${name} must not claim GitHub upload`);
  }
  const before = report.package.distTagsBefore ?? {};
  const after = report.package.distTagsAfter ?? {};
  process.stdout.write([boundReport, record.id ?? '', report.package.observedVersion, report.package.registry, report.package.distTag, JSON.stringify(before), JSON.stringify(after)].join('\t') + '\n');
}

function assertGithubAbsent(args) {
  const [indexPath, key] = args;
  if (!fs.existsSync(indexPath)) return;
  let record;
  try { record = findEvidence(indexPath, key, { missingCode: 0 }); }
  catch { return; }
  if (record) fail(`canonical GitHub publication evidence already exists: ${record.id ?? '<unknown>'}; do not repeat the GitHub mutation`);
}

const [mode, ...args] = process.argv.slice(2);
if (mode === 'resolve-npm') resolveNpm(args);
else if (mode === 'assert-github-absent') assertGithubAbsent(args);
else fail(`unknown recovery verification mode: ${mode ?? '<missing>'}`);
