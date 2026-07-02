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

