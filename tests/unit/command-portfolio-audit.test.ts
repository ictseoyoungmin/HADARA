import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createCommandPortfolioAuditReport } from '../../src/services/lifecycle-guide';

const CONFUSABLE_PAIRS = [
  ['task.close', 'task.audit-close'],
  ['task.status', 'task.close'],
  ['release.gate', 'task.close']
];

describe('Phase 7.2 command portfolio audit', () => {
  it('records current confusable command decisions', () => {
    const report = createCommandPortfolioAuditReport();

    expect(report).toMatchObject({
      schemaVersion: 'hadara.command_portfolio_audit.v1',
      command: 'command.portfolio-audit',
      ok: true,
      issues: []
    });

    for (const pair of CONFUSABLE_PAIRS) {
      expect(
        report.decisions.some((decision) => pair.every((commandId) => decision.commands.includes(commandId))),
        `${pair.join(' vs ')} should be covered`
      ).toBe(true);
    }
  });

  it('records canonical, alias, diagnostic, advanced, dev-only, and release-only decisions in docs', () => {
    const content = fs.readFileSync(path.join(process.cwd(), 'docs', 'archive', 'retired-2026-07-26', 'COMMAND_PORTFOLIO_AUDIT.md'), 'utf8');

    expect(content).toContain('## Primary Lifecycle Commands');
    expect(content).toContain('## Diagnostic Commands');
    expect(content).toContain('## Project/Release/Dev/UI/Integration Commands');
    expect(content).toContain('## Deprecation Candidates');
    expect(content).toContain('`task.status`');
    expect(content).toContain('`task.show`');
    expect(content).toContain('`harness.validate`');
    expect(content).toContain('`dev.docker-check`');
    expect(content).toContain('`release.gate`');
    expect(content).toContain('documents command roles only');
    expect(content).toContain('No current CLI command writes or generates handoff fragments');
  });

  it('keeps the lifecycle guide document aligned with the report primary path', () => {
    const content = fs.readFileSync(path.join(process.cwd(), 'docs', 'archive', 'retired-2026-07-26', 'LIFECYCLE_GUIDE.md'), 'utf8');
    const report = createCommandPortfolioAuditReport();

    for (const commandId of report.primaryCommandIds) expect(content).toContain(`\`${commandId}\``);
    for (const diagnosticId of report.diagnosticCommandIds) expect(content).toContain(`\`${diagnosticId}\``);
  });
});
