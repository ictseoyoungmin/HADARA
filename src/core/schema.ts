import schemaIndexJson from '../schemas/schema-index.json';
import activeRunProjectionSchemaJson from '../schemas/active-run-projection.schema.json';
import activeRunResumeSchemaJson from '../schemas/active-run-resume.schema.json';
import cleanCheckoutSmokeSchemaJson from '../schemas/clean-checkout-smoke.schema.json';
import contextExportSchemaJson from '../schemas/context-export.schema.json';
import evidenceLintSchemaJson from '../schemas/evidence-lint.schema.json';
import evidenceListSchemaJson from '../schemas/evidence-list.schema.json';
import eventSchemaJson from '../schemas/event.schema.json';
import featureSmokeSchemaJson from '../schemas/feature-smoke.schema.json';
import installPlanSchemaJson from '../schemas/install-plan.schema.json';
import packageSmokeSchemaJson from '../schemas/package-smoke.schema.json';
import privateEvidenceSchemaJson from '../schemas/private-evidence.schema.json';
import protocolConsistencySchemaJson from '../schemas/protocol-consistency.schema.json';
import protocolRemediationSchemaJson from '../schemas/protocol-remediation.schema.json';
import providerCallSchemaJson from '../schemas/provider-call.schema.json';
import providerConfigSchemaJson from '../schemas/provider-config.schema.json';
import releaseArtifactManifestSchemaJson from '../schemas/release-artifact-manifest.schema.json';
import releaseArtifactSchemaJson from '../schemas/release-artifact.schema.json';
import releaseDryRunSchemaJson from '../schemas/release-dry-run.schema.json';
import releaseGateSchemaJson from '../schemas/release-gate.schema.json';
import releasePublishSchemaJson from '../schemas/release-publish.schema.json';
import runtimeVersionSchemaJson from '../schemas/runtime-version.schema.json';
import smokeEvidenceSummarySchemaJson from '../schemas/smoke-evidence-summary.schema.json';
import taskAuditCloseSchemaJson from '../schemas/task-audit-close.schema.json';
import taskCloseSchemaJson from '../schemas/task-close.schema.json';
import taskFinishSchemaJson from '../schemas/task-finish.schema.json';
import taskReadySchemaJson from '../schemas/task-ready.schema.json';
import taskUpgradeScaffoldSchemaJson from '../schemas/task-upgrade-scaffold.schema.json';
import taskWorkbenchSchemaJson from '../schemas/task-workbench.schema.json';
import toolsListSchemaJson from '../schemas/tools-list.schema.json';
import writePreflightSchemaJson from '../schemas/write-preflight.schema.json';

export interface SchemaValidationIssue {
  path: string;
  code: string;
  message: string;
}

export interface SchemaValidationResult {
  ok: boolean;
  schemaId: string;
  issues: SchemaValidationIssue[];
}

export class SchemaValidationError extends Error {
  constructor(
    public readonly schemaId: string,
    public readonly issues: SchemaValidationIssue[]
  ) {
    const firstIssue = issues[0];
    super(`Schema validation failed for ${schemaId}: ${firstIssue.path} ${firstIssue.message}`);
    this.name = 'SchemaValidationError';
  }
}

type JsonObject = Record<string, unknown>;

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

const schemaIndex = schemaIndexJson as SchemaIndex;

const registeredSchemas: Record<string, JsonObject> = {
  'hadara.active_run.projection.v1': activeRunProjectionSchemaJson as JsonObject,
  'hadara.active_run.resume.v1': activeRunResumeSchemaJson as JsonObject,
  'hadara.cleanCheckoutSmoke.v1': cleanCheckoutSmokeSchemaJson as JsonObject,
  'hadara.context.export.v1': contextExportSchemaJson as JsonObject,
  'hadara.evidence.lint.v1': evidenceLintSchemaJson as JsonObject,
  'hadara.evidence.list.v1': evidenceListSchemaJson as JsonObject,
  'hadara.event.v1': eventSchemaJson as JsonObject,
  'hadara.featureSmoke.v1': featureSmokeSchemaJson as JsonObject,
  'hadara.install.plan.v1': installPlanSchemaJson as JsonObject,
  'hadara.packageSmoke.v1': packageSmokeSchemaJson as JsonObject,
  'hadara.privateEvidence.v1': privateEvidenceSchemaJson as JsonObject,
  'hadara.protocol.consistency.v1': protocolConsistencySchemaJson as JsonObject,
  'hadara.protocol.remediation.v1': protocolRemediationSchemaJson as JsonObject,
  'hadara.provider.call.v1': providerCallSchemaJson as JsonObject,
  'hadara.provider.config.v1': providerConfigSchemaJson as JsonObject,
  'hadara.releaseArtifact.manifest.v1': releaseArtifactManifestSchemaJson as JsonObject,
  'hadara.releaseArtifact.v1': releaseArtifactSchemaJson as JsonObject,
  'hadara.releaseDryRun.v1': releaseDryRunSchemaJson as JsonObject,
  'hadara.releaseGate.v1': releaseGateSchemaJson as JsonObject,
  'hadara.releasePublish.v1': releasePublishSchemaJson as JsonObject,
  'hadara.runtime.version.v1': runtimeVersionSchemaJson as JsonObject,
  'hadara.smokeEvidenceSummary.v1': smokeEvidenceSummarySchemaJson as JsonObject,
  'hadara.task.audit_close.v1': taskAuditCloseSchemaJson as JsonObject,
  'hadara.task.close.v1': taskCloseSchemaJson as JsonObject,
  'hadara.task.finish.v1': taskFinishSchemaJson as JsonObject,
  'hadara.task.ready.v1': taskReadySchemaJson as JsonObject,
  'hadara.task.upgrade_scaffold.v1': taskUpgradeScaffoldSchemaJson as JsonObject,
  'hadara.task.workbench.v1': taskWorkbenchSchemaJson as JsonObject,
  'hadara.tools.list.v1': toolsListSchemaJson as JsonObject,
  'hadara.write.preflight.v1': writePreflightSchemaJson as JsonObject
};

export function loadSchema(schemaId: string): JsonObject {
  const indexEntry = schemaIndex.schemas.find((entry) => entry.id === schemaId);
  const schema = registeredSchemas[schemaId];
  if (!indexEntry || !schema) {
    throw new Error(`Unknown HADARA schema: ${schemaId}`);
  }
  return schema;
}

export function validateSchema(schemaId: string, value: unknown): SchemaValidationResult {
  const schema = loadSchema(schemaId);
  const issues: SchemaValidationIssue[] = [];
  validateValue(value, schema, schema, '$', issues);
  return {
    ok: issues.length === 0,
    schemaId,
    issues
  };
}

export function assertSchema(schemaId: string, value: unknown): void {
  const result = validateSchema(schemaId, value);
  if (!result.ok) {
    throw new SchemaValidationError(schemaId, result.issues);
  }
}

function validateValue(value: unknown, schema: JsonObject, rootSchema: JsonObject, valuePath: string, issues: SchemaValidationIssue[]): void {
  const ref = stringProperty(schema, '$ref');
  if (ref) {
    validateValue(value, resolveLocalRef(rootSchema, ref), rootSchema, valuePath, issues);
    return;
  }

  const oneOf = arrayProperty(schema, 'oneOf');
  if (oneOf) {
    const matchCount = oneOf.filter((candidate) => validateCandidate(value, candidate, rootSchema)).length;
    if (matchCount !== 1) {
      issues.push({
        path: valuePath,
        code: 'SCHEMA_ONE_OF_MISMATCH',
        message: `must match exactly one schema option, matched ${matchCount}`
      });
    }
    return;
  }

  const constValue = schema.const;
  if (Object.prototype.hasOwnProperty.call(schema, 'const') && value !== constValue) {
    issues.push({
      path: valuePath,
      code: 'SCHEMA_CONST_MISMATCH',
      message: `must equal ${JSON.stringify(constValue)}`
    });
  }

  const enumValues = arrayProperty(schema, 'enum');
  if (enumValues && !enumValues.includes(value)) {
    issues.push({
      path: valuePath,
      code: 'SCHEMA_ENUM_MISMATCH',
      message: `must be one of ${enumValues.map((item) => JSON.stringify(item)).join(', ')}`
    });
  }

  const schemaType = schema.type;
  if (schemaType && !matchesType(value, schemaType)) {
    issues.push({
      path: valuePath,
      code: 'SCHEMA_TYPE_MISMATCH',
      message: `must be ${formatType(schemaType)}`
    });
    return;
  }

  if (typeof value === 'string') {
    const minLength = numberProperty(schema, 'minLength');
    if (minLength !== undefined && value.length < minLength) {
      issues.push({
        path: valuePath,
        code: 'SCHEMA_MIN_LENGTH',
        message: `must be at least ${minLength} character(s)`
      });
    }
    const pattern = stringProperty(schema, 'pattern');
    if (pattern && !new RegExp(pattern).test(value)) {
      issues.push({
        path: valuePath,
        code: 'SCHEMA_PATTERN_MISMATCH',
        message: `must match pattern ${pattern}`
      });
    }
  }

  if (isPlainObject(value)) {
    validateObject(value, schema, rootSchema, valuePath, issues);
  }

  if (Array.isArray(value)) {
    validateArray(value, schema, rootSchema, valuePath, issues);
  }
}

function validateObject(value: JsonObject, schema: JsonObject, rootSchema: JsonObject, valuePath: string, issues: SchemaValidationIssue[]): void {
  const required = arrayProperty(schema, 'required')?.filter((item): item is string => typeof item === 'string') ?? [];
  for (const key of required) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      issues.push({
        path: `${valuePath}.${key}`,
        code: 'SCHEMA_REQUIRED_MISSING',
        message: 'is required'
      });
    }
  }

  const properties = objectProperty(schema, 'properties');
  if (!properties) return;
  for (const [key, propertySchema] of Object.entries(properties)) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
    if (!isPlainObject(propertySchema)) continue;
    validateValue(value[key], propertySchema, rootSchema, `${valuePath}.${key}`, issues);
  }
}

function validateArray(value: unknown[], schema: JsonObject, rootSchema: JsonObject, valuePath: string, issues: SchemaValidationIssue[]): void {
  const items = objectProperty(schema, 'items');
  if (!items) return;
  value.forEach((item, index) => validateValue(item, items, rootSchema, `${valuePath}[${index}]`, issues));
}

function validateCandidate(value: unknown, schema: unknown, rootSchema: JsonObject): boolean {
  if (!isPlainObject(schema)) return false;
  const issues: SchemaValidationIssue[] = [];
  validateValue(value, schema, rootSchema, '$', issues);
  return issues.length === 0;
}

function resolveLocalRef(rootSchema: JsonObject, ref: string): JsonObject {
  if (!ref.startsWith('#/')) {
    throw new Error(`Unsupported schema ref: ${ref}`);
  }
  let current: unknown = rootSchema;
  for (const part of ref.slice(2).split('/')) {
    if (!isPlainObject(current)) {
      throw new Error(`Invalid schema ref: ${ref}`);
    }
    current = current[part];
  }
  if (!isPlainObject(current)) {
    throw new Error(`Invalid schema ref: ${ref}`);
  }
  return current;
}

function matchesType(value: unknown, schemaType: unknown): boolean {
  if (Array.isArray(schemaType)) {
    return schemaType.some((item) => matchesType(value, item));
  }
  switch (schemaType) {
    case 'array':
      return Array.isArray(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'integer':
      return Number.isInteger(value);
    case 'null':
      return value === null;
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'object':
      return isPlainObject(value);
    case 'string':
      return typeof value === 'string';
    default:
      return true;
  }
}

function formatType(schemaType: unknown): string {
  return Array.isArray(schemaType) ? schemaType.map(String).join(' or ') : String(schemaType);
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function objectProperty(value: JsonObject, key: string): JsonObject | undefined {
  const property = value[key];
  return isPlainObject(property) ? property : undefined;
}

function arrayProperty(value: JsonObject, key: string): unknown[] | undefined {
  const property = value[key];
  return Array.isArray(property) ? property : undefined;
}

function stringProperty(value: JsonObject, key: string): string | undefined {
  const property = value[key];
  return typeof property === 'string' ? property : undefined;
}

function numberProperty(value: JsonObject, key: string): number | undefined {
  const property = value[key];
  return typeof property === 'number' ? property : undefined;
}
