import { describe, expect, it } from 'vitest';
import { isInside, resolveHadaraPaths } from '../../src/core/paths';

describe('resolveHadaraPaths', () => {
  it('separates portable data root from project repo root', () => {
    const paths = resolveHadaraPaths({
      portableRoot: '/usb/HADARA',
      projectRoot: '/projects/demo'
    });

    expect(paths.dataRoot).toBe('/usb/HADARA/data');
    expect(paths.projectDocsDir).toBe('/projects/demo/docs');
    expect(paths.projectTasksDir).toBe('/projects/demo/tasks');
  });

  it('detects path containment', () => {
    expect(isInside('/repo', '/repo/src/index.ts')).toBe(true);
    expect(isInside('/repo', '/other/file.ts')).toBe(false);
  });
});
