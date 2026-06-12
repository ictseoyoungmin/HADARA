import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

interface SchemaIndex {
  schemaVersion: string;
  schemas: Array<{
    id: string;
    path: string;
    status: string;
    owner: string;
    notes: string;
  }>;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

describe('schema fixtures', () => {
  it('keeps the schema index aligned with parseable JSON Schema fixtures', () => {
    const root = process.cwd();
    const index = readJson<SchemaIndex>(path.join(root, 'src', 'schemas', 'schema-index.json'));

    expect(index.schemaVersion).toBe('hadara.schema.index.v1');
    expect(index.schemas.map((entry) => entry.id).sort()).toEqual([
      'hadara.active_run.projection.v1',
      'hadara.active_run.resume.v1',
      'hadara.actor_context.v1',
      'hadara.cleanCheckoutSmoke.v1',
      'hadara.command_help.v1',
      'hadara.command_portfolio_audit.v1',
      'hadara.commands.registry.v1',
      'hadara.context.export.v1',
      'hadara.dashboard.bootstrap.v1',
      'hadara.dashboard.core.v1',
      'hadara.dashboard.task_detail.v1',
      'hadara.dashboard.timeline.v1',
      'hadara.dev.docker_check.v1',
      'hadara.docs.archivePlan.v1',
      'hadara.docs.doctor.v1',
      'hadara.docs.explain.v1',
      'hadara.docs.list.v1',
      'hadara.docs.mark.v1',
      'hadara.docs.patchPlan.v1',
      'hadara.docs.requiredReading.v1',
      'hadara.event.v1',
      'hadara.evidence.lint.v1',
      'hadara.evidence.list.v1',
      'hadara.evidence.migration_preview.v1',
      'hadara.featureSmoke.v1',
      'hadara.handoff.suggestion.v1',
      'hadara.harness.validate.v1',
      'hadara.install.plan.v1',
      'hadara.lifecycle.guide.v1',
      'hadara.next_action.v1',
      'hadara.packageSmoke.v1',
      'hadara.plan_context.v1',
      'hadara.privateEvidence.v1',
      'hadara.protocol.consistency.v1',
      'hadara.protocol.migration.v1',
      'hadara.protocol.remediation.v1',
      'hadara.provider.call.v1',
      'hadara.provider.config.v1',
      'hadara.releaseArtifact.manifest.v1',
      'hadara.releaseArtifact.v1',
      'hadara.releaseDryRun.v1',
      'hadara.releaseGate.v1',
      'hadara.releasePublish.v1',
      'hadara.runtime.version.v1',
      'hadara.smokeEvidenceSummary.v1',
      'hadara.task.audit_close.v1',
      'hadara.task.close.v1',
      'hadara.task.complete_flow.v1',
      'hadara.task.create.v1',
      'hadara.task.finish.v1',
      'hadara.task.next.v1',
      'hadara.task.ready.v1',
      'hadara.task.upgrade_scaffold.v1',
      'hadara.task.workbench.v1',
      'hadara.tools.list.v1',
      'hadara.write.preflight.v1'
    ]);

    for (const entry of index.schemas) {
      const schemaPath = path.join(root, entry.path);
      expect(fs.existsSync(schemaPath), `${entry.path} should exist`).toBe(true);
      const schema = readJson<Record<string, any>>(schemaPath);
      expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
      expect(schema.$id).toBe(entry.id);
      expect(schema['x-hadara-schema-id']).toBe(entry.id);
      expect(schema.properties?.schemaVersion?.const).toBe(entry.id);
      expect(schema.required).toContain('schemaVersion');
      if (schema.properties?.command?.const) {
        expect(schema.required).toContain('command');
        expect(schema.required).toContain('issues');
      }
      expect(entry.status).toBe('fixture');
      expect(entry.owner).toMatch(/^[a-z-]+\/[a-z-]+/);
    }
  });
});
