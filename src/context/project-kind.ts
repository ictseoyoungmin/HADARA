import fs from 'node:fs';
import path from 'node:path';

export function isHadaraSourceCheckout(projectRoot: string): boolean {
  if (fs.existsSync(path.join(projectRoot, 'src', 'services', 'capability-registry.ts'))) return true;
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) return false;
  try {
    const parsed = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as { name?: unknown };
    return parsed.name === 'hadara';
  } catch {
    return false;
  }
}
