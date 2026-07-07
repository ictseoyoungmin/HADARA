import { describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import {
  ACCEPTANCE_STATUS_TOKENS,
  createVocabularyReport,
  findVocabularyDomain,
  SOURCE_DOCUMENT_STATUS_TOKENS,
  VOCABULARY_DOMAINS
} from '../../src/services/controlled-vocabulary';
import { DOCS_REGISTER_ALLOWED_VALUES } from '../../src/services/docs-registry';

describe('controlled vocabulary (FD-006 / FD-009)', () => {
  it('keeps domain ids unique and non-empty', () => {
    const ids = VOCABULARY_DOMAINS.map((entry) => entry.domain);
    expect(new Set(ids).size).toBe(ids.length);
    for (const entry of VOCABULARY_DOMAINS) {
      expect(entry.allowed.length).toBeGreaterThan(0);
      expect(entry.surface).not.toBe('');
      expect(entry.field).not.toBe('');
    }
  });

  it('shares docs domains with the docs-registry allowed values (same source)', () => {
    expect(findVocabularyDomain('docs.status')?.allowed).toBe(DOCS_REGISTER_ALLOWED_VALUES.status);
    expect(findVocabularyDomain('docs.kind')?.allowed).toBe(DOCS_REGISTER_ALLOWED_VALUES.kind);
    expect(findVocabularyDomain('docs.readTier')?.allowed).toBe(DOCS_REGISTER_ALLOWED_VALUES.readTier);
  });

  it('lists all domains without a filter and validates the report schema', () => {
    const report = createVocabularyReport();
    assertSchema('hadara.schema.vocabulary.v1', report);
    expect(report.ok).toBe(true);
    expect(report.filter).toBeNull();
    expect(report.domains).toHaveLength(VOCABULARY_DOMAINS.length);
  });

  it('returns a single domain for a valid filter', () => {
    const report = createVocabularyReport('task.risk.state');
    assertSchema('hadara.schema.vocabulary.v1', report);
    expect(report.ok).toBe(true);
    expect(report.domains).toHaveLength(1);
    expect(report.domains[0].allowed).toEqual(['Open', 'Accepted', 'Mitigated', 'Deferred', 'Closed', 'Superseded', 'Rejected']);
  });

  it('exposes human-friendly TASK.md aliases for acceptance and input state', () => {
    expect(ACCEPTANCE_STATUS_TOKENS).toContain('Done');
    expect(SOURCE_DOCUMENT_STATUS_TOKENS).toContain('active');
    expect(createVocabularyReport('task.acceptance.state').domains[0].allowed).toContain('Done');
    expect(createVocabularyReport('task.source.state').domains[0].allowed).toContain('active');
  });

  it('rejects an unknown domain with structured allowed values (dogfoods the diagnostics pattern)', () => {
    const report = createVocabularyReport('task.bogus');
    assertSchema('hadara.schema.vocabulary.v1', report);
    expect(report.ok).toBe(false);
    const issue = report.issues[0];
    expect(issue.code).toBe('SCHEMA_DOMAIN_NOT_FOUND');
    expect(issue.received).toBe('task.bogus');
    expect(issue.allowedValues).toContain('task.risk.state');
  });
});
