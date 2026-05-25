import { describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import {
  assertProviderCallSchema,
  assertProviderConfigSchema,
  createProviderCallReport,
  createProviderConfig,
  normalizeProviderConfig,
  ProviderCallReportError,
  ProviderConfigError
} from '../../src/providers/provider-preparation';

describe('provider adapter preparation contracts', () => {
  it('creates schema-valid provider config without secret values or default real provider', () => {
    const config = createProviderConfig({
      providers: [
        {
          id: 'openai-compatible-local',
          kind: 'openai-compatible',
          enabled: false,
          baseUrlEnv: 'HADARA_OPENAI_BASE_URL',
          apiKeyEnv: 'HADARA_OPENAI_API_KEY',
          model: 'local-model',
          capabilities: {
            supportsStreaming: true,
            supportsToolCalling: false,
            supportsReasoning: false,
            supportsVision: false
          },
          localOnly: true,
          costProfile: 'unknown'
        }
      ]
    });

    expect(config.defaultProvider).toBeNull();
    expect(JSON.stringify(config)).not.toContain('sk-');
    expect(validateSchema('hadara.provider.config.v1', config).ok).toBe(true);
  });

  it('rejects provider config fields that look like stored secret values', () => {
    expect(() =>
      normalizeProviderConfig({
        id: 'bad-provider',
        kind: 'openai-compatible',
        model: 'model',
        apiKey: 'sk-testtesttesttesttest'
      } as any)
    ).toThrow(ProviderConfigError);
  });

  it('rejects unknown provider config fields instead of copying or warning later', () => {
    expect(() =>
      createProviderConfig({
        providers: [],
        defaultProvider: null,
        apiKey: 'sk-testtesttesttesttest'
      } as any)
    ).toThrow('provider config contains unsupported field(s): apiKey');

    expect(() =>
      normalizeProviderConfig({
        id: 'bad-provider',
        kind: 'openai-compatible',
        model: 'model',
        capabilities: {
          supportsStreaming: true,
          token: 'sk-testtesttesttesttest'
        }
      } as any)
    ).toThrow('provider capabilities contains unsupported field(s): token');
  });

  it('rejects invalid provider ids, kinds, booleans, and cost profiles at runtime', () => {
    expect(() =>
      normalizeProviderConfig({
        id: 'bad provider',
        kind: 'openai-compatible',
        model: 'model'
      })
    ).toThrow('provider id must match');

    expect(() =>
      normalizeProviderConfig({
        id: 'bad-provider',
        kind: 'mystery-provider',
        model: 'model'
      } as any)
    ).toThrow('provider kind must be one of');

    expect(() =>
      normalizeProviderConfig({
        id: 'bad-provider',
        kind: 'openai-compatible',
        model: 'model',
        enabled: 'yes'
      } as any)
    ).toThrow('enabled must be a boolean');

    expect(() =>
      normalizeProviderConfig({
        id: 'bad-provider',
        kind: 'openai-compatible',
        model: 'model',
        costProfile: 'expensive'
      } as any)
    ).toThrow('costProfile must be one of');
  });

  it('rejects invalid environment variable references', () => {
    expect(() =>
      normalizeProviderConfig({
        id: 'bad-provider',
        kind: 'openai-compatible',
        model: 'model',
        apiKeyEnv: 'sk-testtesttesttesttest'
      })
    ).toThrow('apiKeyEnv must be an environment variable name');
  });

  it('creates schema-valid provider call reports without prompt or response content', () => {
    const report = createProviderCallReport({
      provider: 'scripted',
      request: {
        messages: [
          { role: 'system', content: 'secret=sk-testtesttesttesttest' },
          { role: 'user', content: 'hello provider' }
        ]
      },
      response: {
        provider: 'scripted',
        model: 'scripted-model',
        content: 'private answer content',
        finishReason: 'stop',
        usage: {
          outputTokens: 3
        }
      }
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.provider.call.v1',
      provider: 'scripted',
      model: 'scripted-model',
      ok: true,
      input: {
        messages: 2
      },
      output: {
        finishReason: 'stop',
        approxTokens: 3
      },
      issues: []
    });
    expect(JSON.stringify(report)).not.toContain('hello provider');
    expect(JSON.stringify(report)).not.toContain('private answer content');
    expect(JSON.stringify(report)).not.toContain('sk-test');
    expect(validateSchema('hadara.provider.call.v1', report).ok).toBe(true);
  });

  it('redacts secret-like provider error messages in call reports', () => {
    const report = createProviderCallReport({
      provider: 'openai-compatible-local',
      request: {
        messages: [{ role: 'user', content: 'hello' }]
      },
      error: {
        provider: 'openai-compatible-local',
        code: 'PROVIDER_AUTH',
        message: 'authorization: bearer sk-testtesttesttesttest',
        retriable: false
      }
    });

    expect(report.ok).toBe(false);
    expect(report.issues[0]).toMatchObject({
      severity: 'error',
      code: 'PROVIDER_AUTH',
      message: 'authorization: bearer [REDACTED]',
      retriable: false
    });
    expect(validateSchema('hadara.provider.call.v1', report).ok).toBe(true);
  });

  it('exposes explicit schema assertion helpers for provider config and call reports', () => {
    expect(() =>
      assertProviderConfigSchema({
        schemaVersion: 'hadara.provider.config.v1',
        providers: [
          {
            id: 'bad provider',
            kind: 'openai-compatible',
            enabled: false,
            model: 'model',
            capabilities: {
              streaming: false,
              toolCalling: false,
              reasoning: false,
              vision: false
            },
            localOnly: true,
            costProfile: 'unknown'
          }
        ],
        defaultProvider: null
      } as any)
    ).toThrow(ProviderConfigError);

    expect(() =>
      assertProviderCallSchema({
        schemaVersion: 'hadara.provider.call.v1',
        provider: 'bad provider',
        ok: true,
        input: {
          messages: 1,
          approxTokens: 1
        },
        issues: []
      } as any)
    ).toThrow(ProviderCallReportError);
  });
});
