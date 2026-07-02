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
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(line => line.trim()).length;
  return { file: path.relative(root, file), lines };
}).sort((a, b) => a.file.localeCompare(b.file));
const total = detail.reduce((sum, item) => sum + item.lines, 0);
console.log(JSON.stringify({ total, files: detail }, null, 2));

